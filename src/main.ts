declare const module: any;
declare const global: any;

//require the env first
import { env } from './lib/env';
global.env = env;

//require the config
import { Config } from './lib/config/config.container';
global.config = Config;

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@modules/app/app.module';
import { NestExecutionContextInterceptor } from '@/lib/nestjs';
import { Logger } from '@/lib';


// register the storage providers
import { FileStorage } from '@bigbangjs/file-storage';
import { FilesystemProvider } from '@bigbangjs/file-storage-filesystem';
FileStorage.registerProviderType('fs', FilesystemProvider);

const logger = Logger.getLogger('app');

// bootstrap the app
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: Config.get("app.frontend_url")
    },
    abortOnError: false,
    logger: logger
  });
  //app.useLogger(logger);
  app.useGlobalInterceptors(new NestExecutionContextInterceptor());
  app.use(Logger.connectLogger(Logger.getLogger('http'), { level: 'info' }));
  // remove express powered by
  app.use(function (req, res, next) {
    res.removeHeader("X-Powered-By");
    next();
  });
  await app.listen(Config.get('app.port'));
  logger.info(`🚀 "${Config.get('app.name')}" running on port ${Config.get('app.port')}`)

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
