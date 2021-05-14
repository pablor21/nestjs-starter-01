import { Config, ISeeder, Logger } from "@/lib";
import { SequelizeSeeder } from "@/lib/datasources/vendors";
import { Injectable } from "@nestjs/common";
import { Command, Option } from "nestjs-command";
import { Sequelize } from "sequelize-typescript";

@Injectable({})
export class SeederCommand implements ISeeder {
    public logger = Logger.getLogger("db:seeder");

    constructor(public readonly sequelize: Sequelize) {
    }

    async getSeederInstance(): Promise<ISeeder> {
        return new SequelizeSeeder(this.sequelize, Config.get("databases.default.seeder"));
    }


    @Command({
        command: 'db:seed:create',
        describe: 'Create a new migration',
        autoExit: true // defaults to `true`, but you can use `false` if you need more control
    })
    async createSeed(
        @Option({
            name: 'filename',
            describe: 'migration filename',
            type: 'string',
            alias: 'f',
            required: false
        })
        filename: string,
    ): Promise<any> {
        const migrator = await this.getSeederInstance();
        const result = await migrator.createSeed(filename);
        console.info(`Seeder crated!`)
    }


    @Command({
        command: 'db:seed:revert',
        describe: 'Revert seeders',
        autoExit: true // defaults to `true`, but you can use `false` if you need more control
    })
    async revert(
        @Option({
            name: 'from',
            describe: 'seed from',
            type: 'string',
            alias: 'f',
            required: false
        })
        from: string,
        @Option({
            name: 'to',
            alias: 't',
            describe: 'seed to',
            type: 'string',
            required: false
        })
        to: string
    ): Promise<any> {
        const migrator = await this.getSeederInstance();
        const result = await migrator.revert(from, to);
        console.info(`seeders reverted!`)
        console.table(result)
    }

    @Command({
        command: 'db:seed:seed',
        describe: 'Seed the datbase',
        autoExit: true // defaults to `true`, but you can use `false` if you need more control
    })
    async seed(
        @Option({
            name: 'from',
            describe: 'seed from',
            type: 'string',
            alias: 'f',
            required: false
        })
        from: string,
        @Option({
            name: 'to',
            alias: 't',
            describe: 'seed to',
            type: 'string',
            required: false
        })
        to: string
    ): Promise<any> {
        const migrator = await this.getSeederInstance();
        const result = await migrator.seed(from, to);
        console.info('Executed seeders');
        console.table(result)
    }

    @Command({
        command: 'db:seed:pending',
        describe: 'List seeders pending to apply to database',
        autoExit: true // defaults to `true`, but you can use `false` if you need more control
    })
    async listPending(): Promise<any> {
        const migrator = await this.getSeederInstance();
        const result = await migrator.listPending();
        console.info('Pending seeders');
        console.table(result)
    }

    @Command({
        command: 'db:seed:list',
        describe: 'List seeders applied to database',
        autoExit: true // defaults to `true`, but you can use `false` if you need more control
    })
    async listExecuted(): Promise<any> {
        const migrator = await this.getSeederInstance();
        const result = await migrator.listExecuted();
        console.info('Executed seeders');
        console.table(result)
    }

}