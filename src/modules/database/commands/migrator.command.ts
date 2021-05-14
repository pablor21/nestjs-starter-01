import { Config, IMigrator, Logger } from "@/lib";
import { SequelizeMigrator } from "@/lib/datasources/vendors";
import { Injectable } from "@nestjs/common";
import { Command, Option } from "nestjs-command";
import { Sequelize } from "sequelize";

@Injectable({})
export class MigratorCommand implements IMigrator {
    public logger = Logger.getLogger("db:migrator");

    constructor(public readonly sequelize: Sequelize) {
    }

    async getMigratorInstance(): Promise<IMigrator> {
        return new SequelizeMigrator(this.sequelize, Config.get("databases.default.migrator"));
    }

    @Command({
        command: 'db:migration:create',
        describe: 'Create a new migration',
        autoExit: true // defaults to `true`, but you can use `false` if you need more control
    })
    async createMigration(
        @Option({
            name: 'filename',
            describe: 'migration filename',
            type: 'string',
            alias: 'f',
            required: false
        })
        filename: string,
        @Option({
            name: 'initial',
            alias: 'i',
            describe: 'is this the initial migration?',
            type: 'boolean',
            required: false,
            default: false,
        })
        initial: boolean
    ): Promise<any> {
        const migrator = await this.getMigratorInstance();
        const result = await migrator.createMigration(filename, initial);
        console.info(`Migration crated!`)
    }


    @Command({
        command: 'db:migration:revert',
        describe: 'Revert migrations',
        autoExit: true // defaults to `true`, but you can use `false` if you need more control
    })
    async revert(
        @Option({
            name: 'from',
            describe: 'migrate from',
            type: 'string',
            alias: 'f',
            required: false
        })
        from: string,
        @Option({
            name: 'to',
            alias: 't',
            describe: 'migrate to',
            type: 'string',
            required: false
        })
        to: string
    ): Promise<any> {
        const migrator = await this.getMigratorInstance();
        const result = await migrator.revert(from, to);
        console.info(`Migrations reverted!`)
        console.table(result)
    }

    @Command({
        command: 'db:migration:migrate',
        describe: 'Migrate the datbase',
        autoExit: true // defaults to `true`, but you can use `false` if you need more control
    })
    async migrate(
        @Option({
            name: 'from',
            describe: 'migrate from',
            type: 'string',
            alias: 'f',
            required: false
        })
        from: string,
        @Option({
            name: 'to',
            alias: 't',
            describe: 'migrate to',
            type: 'string',
            required: false
        })
        to: string
    ): Promise<any> {
        const migrator = await this.getMigratorInstance();
        const result = await migrator.migrate(from, to);
        console.info('Executed migrations');
        console.table(result)
    }

    @Command({
        command: 'db:migration:pending',
        describe: 'List migrations pending to apply to database',
        autoExit: true // defaults to `true`, but you can use `false` if you need more control
    })
    async listPending(): Promise<any> {
        const migrator = await this.getMigratorInstance();
        const result = await migrator.listPending();
        console.info('Pending migrations');
        console.table(result)
    }

    @Command({
        command: 'db:migration:list',
        describe: 'List migrations applied to database',
        autoExit: true // defaults to `true`, but you can use `false` if you need more control
    })
    async listExecuted(): Promise<any> {
        const migrator = await this.getMigratorInstance();
        const result = await migrator.listExecuted();
        console.info('Executed migrations');
        console.table(result)
    }

}