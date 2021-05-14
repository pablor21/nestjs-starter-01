import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Query() q): Promise<string> {
    return this.appService.getHello(q.flush);
  }
}
