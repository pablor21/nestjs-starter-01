import { NotImplementedException } from "@nestjs/common";
import { Filter } from "./filter";
import { IOffsetPagination, ICursorPagination } from "./pagination";
import { TIncludeQuery, IQuery } from "./query.interface";
import { IQueryParser } from "./queryparser.interface";
import { SortField } from "./sort";

export class Query<T = any> implements IQuery<T>{
    protected _filter?: Filter<T> = {};
    protected _sort?: SortField<T>[] = [];
    protected _fields?: (keyof T)[] | "*" = "*";
    protected _paging?: IOffsetPagination | ICursorPagination;
    protected _include?: TIncludeQuery<T>;
    public parser: IQueryParser;
    public paginate: IOffsetPagination | ICursorPagination;

    constructor(properties?: Partial<Query<T>>) {
        Object.assign(this, properties);
    }

    public get filter(): Filter<T> {
        if (!this._filter) {
            this._filter = {};
        }
        return this._filter;
    }

    public set filter(value: Filter<T>) {
        this._filter = value;
    }

    public get sort(): SortField<T>[] {
        if (!this._sort) {
            this._sort = [];
        }
        return this._sort;
    }

    public set sort(value: SortField<T>[]) {
        this._sort = value;
    }

    public get include(): TIncludeQuery<T> {
        if (!this._include) {
            this._include = {};
        }
        return this._include;
    }

    public set include(value: TIncludeQuery<T>) {
        this._include = value;
    }

    public get fields(): (keyof T)[] | "*" {
        if (!this._fields) {
            this._fields = '*';
        }
        return this._fields;
    }

    public set fields(value: (keyof T)[] | "*") {
        this._fields = value;
    }

    public where(...filter: Filter<T>[]): Query<T> {
        this.filter.and = this.filter.and || [];
        filter.map(f => this.filter.and.push(f));
        return this;
    }

    public orWhere(...filter: Filter<T>[]): Query<T> {
        this.filter.or = this.filter.or || [];
        filter.map(f => this.filter.or.push(f));
        return this;
    }

    public async parse() {
        return this.parser.parse(this);
    }

    public addSort(...sorts: SortField<T>[]): Query<T> {
        sorts.map(s => this.sort.push(s));
        return this;
    }

    public addFields(...fields: (keyof T)[]): Query<T> {
        if (Array.isArray(this.fields)) {
            fields.map(s => (this.fields as (keyof T)[]).push(s));
        } else {
            this.fields = fields;
        }
        return this;
    }

    public async get<RType = T>(options?: any): Promise<RType[]> {
        throw new NotImplementedException(`This is just a placeholder method. Please use the vendor query instance!`);
    }

    public async getOne<RType = T>(options?: any): Promise<RType> {
        throw new NotImplementedException(`This is just a placeholder method. Please use the vendor query instance!`);
    }

    public async count(options?: any): Promise<number> {
        throw new NotImplementedException(`This is just a placeholder method. Please use the vendor query instance!`);
    }

}