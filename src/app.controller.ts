import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello(): Promise<string> {
    const attendees = await this.appService.getAttendees();
    if (attendees.length > 0) {
      return `Welcome to CodeCon API! We have ${attendees.length} attendees. First attendee: ${attendees[0].name}`;
    } else {
      return 'Welcome to CodeCon API! No attendees registered yet.';
    }
  }
}
