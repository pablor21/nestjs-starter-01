import { IRepositoryTransaction } from "../../../repositories/transaction.interface";
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

export class SequelizeTransaction implements IRepositoryTransaction {
    protected active: boolean;
    protected tx: Transaction;

    constructor(public readonly sequelize: Sequelize) {

    }

    async begin(...args: any): Promise<any> {
        this.tx = await this.sequelize.transaction({
            transaction: args?.parent?.tx,
            ...args
        });
        return this;
    }
    async commit(...args: any): Promise<void> {
        if (this.tx) {
            await this.tx.commit();
        }
    }

    async rollback(...args: any): Promise<void> {
        if (this.tx) {
            await this.tx.rollback();
        }
    }

    async run<T = any>(cb: (tx: IRepositoryTransaction, ...args: any) => Promise<T>, ...args: any): Promise<T> {
        try {
            await this.begin(args);
            const result = await cb(this, ...args);
            await this.commit();
            return result;
        } catch (ex) {
            try {
                this.rollback();
            } catch { }
            throw ex;
        } finally {
        }
    }

}