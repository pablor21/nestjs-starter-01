import { IQuery, Filter } from "../queryable";
import { ClassType } from "../../types";
import { EntityNotFoundException } from "./exceptions";
import { IRepository, IRepositoryContext, IRepositoryStatement } from "./repository.interface";

export abstract class GenericRepository<T, PK = any> implements IRepository<T, PK>{

    constructor(public readonly entityClass: ClassType<T>) {

    }

    async prepareQuery(method: string, query?: IQuery<T>): Promise<IQuery<T>> {
        return query || this.getQuery();
    }


    async getById(id: PK, ctx?: IRepositoryContext): Promise<T> {
        const found = await this.findById(id, ctx);
        if (!found) {
            throw new EntityNotFoundException();
        }
        return found;
    }

    async findOne(query?: IQuery<T>, ctx?: IRepositoryContext): Promise<T> {
        query = await this.prepareQuery('findOne', query);
        return query.getOne(this.convertContextToDriverOptions('findOne', ctx));
    }


    async findOneOrFail(query?: IQuery<T>, ctx?: IRepositoryContext): Promise<T> {
        const entity = await this.findOne(query, ctx);
        if (!entity) {
            throw new EntityNotFoundException();
        }
        return entity;
    }

    async find(query?: IQuery<T>, ctx?: IRepositoryContext): Promise<T[]> {
        query = await this.prepareQuery('find', query);
        return query.get(this.convertContextToDriverOptions('find', ctx));
    }

    async findAndCount(query?: IQuery<T>, ctx?: IRepositoryContext): Promise<{ rows: T[]; count: number; }> {
        const ret = {
            count: 0,
            rows: []
        };
        ret.count = await this.count(query, ctx);
        if (ret.count > 0) {
            ret.rows = await this.find(query, ctx);
        }
        return ret;
    }

    async count(query?: IQuery<T>, ctx?: IRepositoryContext): Promise<number> {
        query = await this.prepareQuery('count', query);
        return query.count(this.convertContextToDriverOptions('count', ctx));
    }

    abstract findById(id: PK, ctx?: IRepositoryContext): Promise<T>;
    abstract create(entity: T, ctx?: IRepositoryContext): Promise<T>;
    abstract createMany(entities: T[], ctx?: IRepositoryContext): Promise<T[]>;
    abstract update(id: PK, entity: T, ctx?: IRepositoryContext): Promise<T>;
    abstract replace(id: PK, entity: T, ctx?: IRepositoryContext): Promise<T>;
    abstract updateMany(input: any, filter?: Filter<T>, ctx?: IRepositoryContext): Promise<T[]>;
    abstract remove(id: PK, ctx?: IRepositoryContext): Promise<any>;
    abstract removeMany(filter?: Filter<T>, ctx?: IRepositoryContext): Promise<any>;
    abstract findRaw<RType = T[]>(stmt: IRepositoryStatement, ctx?: IRepositoryContext): Promise<RType>;
    abstract executeRaw<RType = T>(stmt: IRepositoryStatement, ctx?: IRepositoryContext): Promise<RType>;
    abstract getQuery(): Promise<IQuery<T>>;


    //protected methods
    protected convertContextToDriverOptions(method: string, ctx?: IRepositoryContext) {
        return ctx;
    }

}