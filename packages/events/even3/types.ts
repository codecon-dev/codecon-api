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

type State = 
  'Acre' | 
  'Alagoas' | 
  'Amapá' | 
  'Amazonas' | 
  'Bahia' | 
  'Ceará' | 
  'Distrito Federal' | 
  'Espírito Santo' | 
  'Goiás' | 
  'Maranhão' | 
  'Mato Grosso' | 
  'Mato Grosso do Sul' | 
  'Minas Gerais' | 
  'Pará' | 
  'Paraíba' | 
  'Paraná' | 
  'Pernambuco' | 
  'Piauí' | 
  'Rio de Janeiro' | 
  'Rio Grande do Norte' | 
  'Rio Grande do Sul' | 
  'Rondônia' | 
  'Roraima' | 
  'Santa Catarina' | 
  'São Paulo' | 
  'Sergipe' | 
  'Tocantins';

type Gender = 'M' | 'F' | 'O';


type AttendeeSanitizedType = {
  platformId: Number;
  firstName: String;
  lastName: String;
  displayName: String;
  gender: Gender;
  email: String;
  mobilePhone?: String;
  birthDate?: Date;
  city: String;
  state: State;
  linkedin?: String;
  github?: String;
  company?: String;
}

export type { AttendeeType, RegistrationType, EventType, WebhookEvent, AttendeeSanitizedType, State, Gender }