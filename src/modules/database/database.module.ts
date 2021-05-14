import { Config, parseConnectionString } from '@/lib';
import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExecutorCommand } from './commands/executor.command';
import { MigratorCommand } from './commands/migrator.command';
import { SeederCommand } from './commands/seeder.command';

const config = Config.get("databases.default.client");
const options = parseConnectionString(config.uri);

@Global()
@Module({
    imports: [
        SequelizeModule.forRoot({ ...options, logging: config.debug }),
    ],
    providers: [MigratorCommand, SeederCommand, ExecutorCommand],
    exports: [SequelizeModule]
})
export class DatabaseModule {
}
