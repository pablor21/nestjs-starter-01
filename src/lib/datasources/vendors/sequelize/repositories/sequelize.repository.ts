import { GenericRepository, IRepository, IRepositoryContext, IRepositoryStatement } from "../../../repositories";
import { Model } from "sequelize-typescript";
import { ModelType, PKType } from "./types";
import { IQuery } from "@/lib/datasources/queryable";
import { Filter } from "@/lib/datasources/queryable/filter";
import { SequelizeQuery } from "../queryable";
import { Identifier } from "sequelize/types";


export class SequelizeRepository<T extends Model<T, T>, Pk = PKType> extends GenericRepository<T, Pk> implements IRepository<T, Pk>{

    constructor(public readonly model: ModelType<T>) {
        super(model);
    }

    public async create(entity: T, ctx?: IRepositoryContext): Promise<T> {
        const result = this.getModel().create(entity, {
            include: {
                all: true,
                nested: true,
            },
            ...this.convertContextToDriverOptions('create', ctx)
        });
        return result;
    }

    public async createMany(entities: T[], ctx?: IRepositoryContext): Promise<T[]> {
        return this.getModel().bulkCreate(entities, {
            include: {
                all: true,
                nested: true,
            },
            ...this.convertContextToDriverOptions('createMany', ctx)
        })
    }

    public async update(id: Pk, entity: T, ctx?: IRepositoryContext): Promise<T> {
        const saved = await this.getById(id, ctx);
        saved.update(entity, this.convertContextToDriverOptions('update', ctx));
        return saved;
    }

    public async updateMany(input: any, filter?: Filter<T>, ctx?: IRepositoryContext): Promise<T[]> {
        const result = await this.getModel().update(input, { where: filter, ...this.convertContextToDriverOptions('updateMany', ctx) });
        return result ? result[1] : [];
    }


    public async replace(id: Pk, entity: T, ctx?: IRepositoryContext): Promise<T> {
        return this.update(id, entity, ctx);
    }

    public async remove(id: Pk, ctx?: IRepositoryContext): Promise<any> {
        return this.removeMany(({ id: id } as Filter<T>), ctx);
    }

    public async removeMany(filter?: Filter<T>, ctx?: IRepositoryContext): Promise<any> {
        return this.getModel().destroy({ where: filter, ...this.convertContextToDriverOptions('removeMany', ctx) })
    }

    public async getQuery(): Promise<IQuery<T>> {
        return new SequelizeQuery<T>();
    }

    public async findById(id: Pk, ctx?: IRepositoryContext): Promise<T> {
        return this.getModel().findByPk((id as unknown as Identifier), this.convertContextToDriverOptions('findById', ctx));
    }

    public async findRaw<RType = T[]>(stmt: IRepositoryStatement, ctx?: IRepositoryContext): Promise<RType> {
        const results = await this.getModel().sequelize.query({
            query: stmt.query,
            values: stmt.params
        }, this.convertContextToDriverOptions('findRaw', ctx));
        if (Array.isArray(results)) {
            return results[0];
        }
        return null;
    }

    public async executeRaw<RType = T>(stmt: IRepositoryStatement, ctx?: IRepositoryContext): Promise<RType> {
        const results = await this.getModel().sequelize.query({
            query: stmt.query,
            values: stmt.params
        }, this.convertContextToDriverOptions('executeRaw', ctx));
        if (Array.isArray(results)) {
            return results[0];
        }
        return null;
    }


    protected getModel(): ModelType<T> {
        return this.model;
    }

    protected convertContextToDriverOptions(method: string, ctx?: IRepositoryContext): any {
        return super.convertContextToDriverOptions(method, ctx);
    }

    protected getModelName() {
        return this.model.name;
    }
}