import { ISeeder } from "@/lib/datasources/database";
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';

export type SeederOptions = {
    path: string,
    fileType: string,
    logger: any
}

const defaultOptions: SeederOptions = {
    path: 'database/seeds',
    fileType: 'js',
    logger: null
}

class NullStorage {

    async logMigration(migrationName) {
        // This function logs a migration as executed.
        // It will get called once a migration was
        // executed successfully.
    }

    async unlogMigration(migrationName) {
        // This function removes a previously logged migration.
        // It will get called once a migration has been reverted.
    }

    async executed() {
        // This function lists the names of the logged
        // migrations. It will be used to calculate
        // pending migrations. The result has to be an
        // array with the names of the migration files.
        return [];
    }
}

export class SequelizeSeeder implements ISeeder {
    public umzug: Umzug<any>;
    public options: SeederOptions = defaultOptions;

    constructor(public readonly sequelize: Sequelize, options?: SeederOptions) {
        Object.assign(this.options, options);
        this.umzug = new Umzug({
            migrations: { glob: `${this.options.path}/*.${this.options.fileType}` },
            context: sequelize.getQueryInterface(),
            storage: new SequelizeStorage({ sequelize, tableName: 'system_seeders' }),
            logger: this.options.logger,

        });
    }


    async createSeed(...options: any): Promise<any> {
        const name = options.name || 'seeder';
        await this.umzug.create({
            folder: this.options.path,
            name: name + `.${this.options.fileType}`,
            prefix: "TIMESTAMP",
        });

    }
    async revert(...options: any): Promise<any> {
        return this.umzug.down();
    }
    async seed(...options: any): Promise<any> {
        return this.umzug.up()
    }
    async listPending(...options: any): Promise<any> {
        return this.umzug.pending();
    }
    async listExecuted(...options: any): Promise<any> {
        return this.umzug.executed();
    }

}