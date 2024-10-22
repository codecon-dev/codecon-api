import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello(): Promise<string> {
    const samples = await this.appService.getSamples();
    if (samples.length > 0) {
      return `Welcome to CodeCon API! We have ${samples.length} samples. First sample: ${samples[0].name}`;
    } else {
      return 'Welcome to CodeCon API! No samples available yet.';
    }
  }
}
