import { MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { CommandModule } from 'nestjs-command';
import { AppService } from './app.service';
import { FileController, ImageController } from '@/lib/nestjs/web';
import { Storage } from '@/lib/storage';

@Module({
  imports: [
    CommandModule,
    DatabaseModule,
  ],
  controllers: [AppController, ImageController, FileController],
  providers: [AppService],
})
export class AppModule implements NestModule, OnModuleInit, OnApplicationBootstrap {
  async onApplicationBootstrap() {
    // initialize storage
    await Storage.init();
  }
  async onModuleInit() {

  }

  configure(consumer: MiddlewareConsumer) {

  }
}
