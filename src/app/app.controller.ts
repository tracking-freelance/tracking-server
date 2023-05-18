import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  Get() {
    return 'Service is running';
  }
}
