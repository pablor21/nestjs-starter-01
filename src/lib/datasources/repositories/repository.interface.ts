import { Filter } from "../queryable/filter";
import { IQuery } from "../queryable/query.interface";
import { IRepositoryTransaction } from "./transaction.interface";


/**
 * Represents a repository execution context
 */
export interface IRepositoryContext {
    /**
     * The repository transaction
     */
    transaction?: IRepositoryTransaction,
    /**
     * Options to pass
     */
    options?: any
}

/**
 * Representas a repository statement (to be passed to findRaw, executeRaw)
 */
export interface IRepositoryStatement {
    /**
     * The query to execute
     */
    query?: string,
    /**
     * Params to pass
     */
    params?: any
}

/**
 * The repository
 */
export interface IRepository<EntityType = any, PkType = string> {
    /**
     * Creates an entity
     * @param entity the object to save
     * @param ctx the execution context
     */
    create(entity: EntityType, ctx?: IRepositoryContext): Promise<EntityType>;
    /**
     * Creates many entities
     * @param entities the objects to save
     * @param ctx the execution context
     */
    createMany(entities: EntityType[], ctx?: IRepositoryContext): Promise<EntityType[]>;
    /**
     * Updates an entity
     * @param id the entity id
     * @param entity the entity object
     * @param ctx the execution context
     */
    update(id: PkType, entity: EntityType, ctx?: IRepositoryContext): Promise<EntityType>;
    /**
     * Replaces an entity
     * @param id the entity id
     * @param entity the entity object
     * @param ctx the execution context
     */
    replace(id: PkType, entity: EntityType, ctx?: IRepositoryContext): Promise<EntityType>;
    /**
     * Replaces many entities
     * @param input the values to replace
     * @param filter the filter to apply
     * @param ctx the execution context
     */
    updateMany(input: any, filter?: Filter<EntityType>, ctx?: IRepositoryContext): Promise<EntityType[]>;
    /**
     * Removes an entity by id
     * @param id the entity id
     * @param ctx The execution context
     */
    remove(id: PkType, ctx?: IRepositoryContext): Promise<any>;
    /**
    * Removes entities by filter
    * @param filter the criteria filter
    * @param ctx The execution context
    */
    removeMany(filter?: Filter<EntityType>, ctx?: IRepositoryContext): Promise<any>;
    /**
     * Find one elemet by id
     * @param id the object id
     * @param ctx The execution context
     */
    findById(id: PkType, ctx?: IRepositoryContext): Promise<EntityType>;
    /**
     * Same as `findById(id, ctx)` but throws an exception if not found
     * @param id 
     * @param ctx 
     */
    getById(id: PkType, ctx?: IRepositoryContext): Promise<EntityType>;
    /**
     * Find one record
     * @param query the query object
     * @param ctx the execution context
     */
    findOne(query?: IQuery<EntityType>, ctx?: IRepositoryContext): Promise<EntityType>;
    /**
     * Same as `findOne(query, ctx)` but throws an exception if not found
     * @param query  the query object
     * @param ctx the execution context
     */
    findOneOrFail(query?: IQuery<EntityType>, ctx?: IRepositoryContext): Promise<EntityType>;
    /**
     * Find many entities by filter query
     * @param query the query object
     * @param ctx the execution context
     */
    find(query?: IQuery<EntityType>, ctx?: IRepositoryContext): Promise<EntityType[]>;
    /**
     * Find many entities by filter query and count the total (same as find + count)
     * @param query the query object
     * @param ctx the execution context
     */
    findAndCount(query?: IQuery<EntityType>, ctx?: IRepositoryContext): Promise<{ rows: EntityType[], count: number }>;
    /**
     * Counts the entities
     * @param query the query object
     * @param ctx the execution context
     */
    count(query?: IQuery<EntityType>, ctx?: IRepositoryContext): Promise<number>;
    /**
     * Executes a read statement
     * @param stmt the statement to execute
     * @param ctx the execution context
     */
    findRaw<RType = EntityType[]>(stmt: IRepositoryStatement, ctx?: IRepositoryContext): Promise<RType>;
    /**
     * Executes a write statement
     * @param stmt the statement to execute
     * @param ctx the execution context
     */
    executeRaw<RType = EntityType>(stmt: IRepositoryStatement, ctx?: IRepositoryContext): Promise<RType>;

    /**
     * Obtains a query instance
     */
    getQuery(): Promise<IQuery<EntityType>>;

}
