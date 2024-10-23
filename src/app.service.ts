import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendee } from './entities/attendee.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>,
  ) { }

  async getAttendees(): Promise<Attendee[]> {
    return this.attendeeRepository.find();
  }
}
