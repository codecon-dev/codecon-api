import 'server-only';

import { AttendeeType, AttendeeSanitizedType, State, Gender } from './even3/types'

export const sanitizeAttendee = (
    attendee: AttendeeType
): AttendeeSanitizedType => {
    const fullName = attendee.nome;
    const fullNameSplit = fullName.split(' ');

    const firstName: string = fullNameSplit[0];
    const lastName: string = fullNameSplit[fullNameSplit.length - 1];

    return {
        platformId: attendee.id,
        firstName,
        lastName,
        displayName: attendee.nome_para_cracha,
        gender: attendee.genero as Gender,
        email: attendee.email,
        city: attendee.endereco_cidade,
        state: attendee.endereco_estado as State
    }
};

export * from './even3/types';
