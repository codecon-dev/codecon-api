import { analytics } from '@repo/analytics/posthog/server';
import { env } from '@repo/env';
import { log } from '@repo/observability/log';
import { headers } from 'next/headers';

type AttendeeType = {
  id: Number;
  nome: String;
  email: String;
  nacionalidade: String;
  cpf: String;
  passaporte: String;
  nome_para_cracha: String;
  celular: String;
  telefone_fixo: String;
  formacao_academica: String;
  area_conhecimento: String;
  subarea_conhecimento: String;
  genero: String;
  instituicao: String;
  foto: String;
  data_nascimento: String;
  cargo_instituicao: String;
  endereco_rua: String;
  endereco_numero: String;
  endereco_bairro: String;
  endereco_cep: String;
  endereco_cidade: String;
  endereco_estado: String;
  endereco_pais: String;
  cultura: String;
  personalizado: any[];
}

type RegistrationType = {
  id: String;
  codigo: String;
  titulo: String;
  data_inscricao: Date;
}

type EventType = {
  id: String;
  url: String;
  titulo: String;
  data: Date;
}

type WebhookEvent = {
  id: String;
  created: Number;
  type: {
      id: Number;
      name: String;
  }
  data: {
    pessoa: AttendeeType;
    inscricao: RegistrationType;
    evento: EventType;
  }
}

const handleNewEventAttendee = (attendee: AttendeeType, registration: RegistrationType, event: EventType) => {
  const fullName = attendee.nome;
  const fullNameSplit = fullName.split(' ');

  const firstName: string = fullNameSplit[0];
  const lastName: string = fullNameSplit[fullNameSplit.length - 1];

  analytics.identify({
    distinctId: `${attendee.id}`,
    properties: {
      email: attendee.email,
      firstName,
      lastName,
      createdAt: new Date(registration.data_inscricao),
      phoneNumber: attendee.celular,
    },
  });

  analytics.capture({
    event: 'User Created',
    distinctId: `${attendee.id}`,
  });

  return new Response('User created', { status: 201 });
};


export const POST = async (request: Request): Promise<Response> => {
  // Get the headers
  const headerPayload = await headers();
  const even3Token = headerPayload.get('x-token-even3');

  // If there are no headers, error out
  if (!even3Token || even3Token != env.EVEN3_WEBHOOK_SECRET) {
    return new Response('Error occured -- Unauthorized', {
      status: 401,
    });
  }

  // Get the body
  const payload = (await request.json()) as WebhookEvent;
  const { id } = payload;

  log.info('Webhook', { id, eventType: 'new.attendee', payload });

  let response: Response = new Response('', { status: 201 });

  response = handleNewEventAttendee(payload.data.pessoa, payload.data.inscricao, payload.data.evento);

  await analytics.shutdown();

  return response;
};
