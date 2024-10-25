import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello(): Promise<string> {
    const users = await this.appService.getUsers();
    if (users.length > 0) {
      const userList = users.map(user => user.name || user.email).join(', ');
      return `Welcome to CodeCon API! We have ${users.length} users. Users: ${userList}`;
    } else {
      return 'Welcome to CodeCon API! No users registered yet.';
    }
  }
}
