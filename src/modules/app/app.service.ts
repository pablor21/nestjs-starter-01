import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {

  }
  async getHello(flush?: string): Promise<string> {
    return 'Hello world!'
  }
}
