import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from '@modules/app/app.module';
import { Logger } from './lib';

(async () => {
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: Logger.getLogger("cli")
    });
    app
        .select(CommandModule)
        .get(CommandService)
        .exec();
})();