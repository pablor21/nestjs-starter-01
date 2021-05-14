import { IExecutor } from "@/lib/datasources/database";
import { Sequelize } from "sequelize";

export class SequelizeExecutor implements IExecutor {

    constructor(public readonly sequelize: Sequelize) {

    }

    async execute(command: string, ...options: any): Promise<any> {
        return (await this.sequelize.query(command, options))[0];
    }

}