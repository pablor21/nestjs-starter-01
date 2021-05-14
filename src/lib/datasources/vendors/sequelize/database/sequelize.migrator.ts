import { IMigrator } from "@/lib/datasources/database";
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';

export type MigratorOptions = {
    path: string,
    fileType: string,
    logger: any
}

const defaultOptions: MigratorOptions = {
    path: 'database/migrations',
    fileType: 'js',
    logger: null
}

export class SequelizeMigrator implements IMigrator {
    public umzug: Umzug<any>;
    public options: MigratorOptions = defaultOptions;

    constructor(public readonly sequelize: Sequelize, options?: MigratorOptions) {
        Object.assign(this.options, options);
        this.umzug = new Umzug({
            migrations: { glob: `${this.options.path}/*.${this.options.fileType}` },
            context: sequelize.getQueryInterface(),
            storage: new SequelizeStorage({ sequelize, tableName: 'system_migrations' }),
            logger: this.options.logger,

        });
    }

    async createMigration(...options: any): Promise<any> {
        const name = options.name || 'migration';
        await this.umzug.create({
            folder: this.options.path,
            name: name + `.${this.options.fileType}`,
            prefix: "TIMESTAMP",
        });

    }
    async revert(...options: any): Promise<any> {
        return this.umzug.down();
    }
    async migrate(...options: any): Promise<any> {
        return this.umzug.up()
    }
    async listPending(...options: any): Promise<any> {
        return this.umzug.pending();
    }
    async listExecuted(...options: any): Promise<any> {
        return this.umzug.executed();
    }

}