import { analytics } from '@repo/analytics/posthog/server';
import { env } from '@repo/env';
import type { AttendeeType, WebhookEvent } from '@repo/events/server';
import { sanitizeAttendee } from '@repo/events/server';
import { log } from '@repo/observability/log';
import { headers } from 'next/headers';

const handleNewEventAttendee = (attendee: AttendeeType) => {
  const attendeeSanitized = sanitizeAttendee(attendee);

  analytics.capture({
    event: 'User Created',
    distinctId: `${attendeeSanitized.platformId}`,
  });

  return new Response('User created', { status: 201 });
};


export const POST = async (request: Request): Promise<Response> => {
  const headerPayload = await headers();
  const even3Token = headerPayload.get('x-token-even3');

  if (!even3Token || even3Token != env.EVEN3_WEBHOOK_SECRET) {
    return new Response('Error occured -- Unauthorized', {
      status: 401,
    });
  }

  const payload = (await request.json()) as WebhookEvent;
  const { id, data: { pessoa } } = payload;

  log.info('Webhook', { id, eventType: 'new.attendee', payload });

  let response: Response = new Response('', { status: 201 });

  response = handleNewEventAttendee(pessoa);

  await analytics.shutdown();

  return response;
};
