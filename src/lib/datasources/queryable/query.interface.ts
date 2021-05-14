import { Filter } from "./filter";
import { ICursorPagination, IOffsetPagination } from "./pagination";
import { IQueryParser } from "./queryparser.interface";
import { SortField } from "./sort";

export interface IIncludeQuery<T> extends IQuery<T> {
    alias?: string;
}

export type TIncludeQuery<T = any> = {
    [K in keyof T]?: IIncludeQuery<T[K]>;
}

export interface IQuery<T> {
    /**
     * The conditions of the query
     */
    filter?: Filter<T>;
    /**
     * Sort conditions
     */
    sort?: SortField<T>[];

    include?: TIncludeQuery<T>;

    /**
     * Fields to select (list of fields or *[all fields])
     */
    fields?: (keyof T)[] | "*";
    /**
     * Pagination options
     */
    paginate?: IOffsetPagination | ICursorPagination;
    /**
     * The query parser
     */
    parser: IQueryParser;
    /**
     * Options passed to the parser
     */
    parserOptions?: any;
    /**
     * Add an AND conditions
     * @param filter the filter to apply
     */
    where(...filter: Filter<T>[]): IQuery<T>;
    /**
     * Add an OR conditions
     * @param filter the filter to appy
     */
    orWhere(...filter: Filter<T>[]): IQuery<T>;
    /**
     * Add a sort condition
     * @param sorts the sort conditions
     */
    addSort(...sorts: SortField<T>[]): IQuery<T>;
    /**
     * Add a field or fields to the query
     * @param fields fields to select
     */
    addFields(...fields: (keyof T)[]): IQuery<T>;

    get<RType = T>(options?: any): Promise<RType[]>;
    getOne<RType = T>(options?: any): Promise<RType>;
    count(options?: any): Promise<number>;
}