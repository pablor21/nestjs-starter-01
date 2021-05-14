import { Filter } from "@/lib/datasources/queryable/filter";
import { Query } from "@/lib/datasources/queryable/query";
import { IService } from "../service.interface";

export interface ICrudOptions {
    tx: any;
}

export interface ICrudService<EntityType = any, PkType = string, FilterType = Filter<EntityType>, CreateDtoType = EntityType, UpdateDtoType = CreateDtoType> extends IService {
    create(input: CreateDtoType, options?: ICrudOptions): Promise<EntityType>;
    createMany(input: CreateDtoType[], options?: ICrudOptions): Promise<EntityType[]>;
    update(pk: PkType, input: Partial<UpdateDtoType>, options?: ICrudOptions): Promise<EntityType>;
    updateMany(filter: FilterType, input: Partial<UpdateDtoType>, options?: ICrudOptions): Promise<EntityType>;
    delete(pk: PkType, options?: ICrudOptions): Promise<number>;
    deleteMany(filter: FilterType, options?: ICrudOptions): Promise<EntityType | number>;
    findByPk(pk: PkType, options?: ICrudOptions): Promise<EntityType | undefined>;
    getByPk(pk: PkType, options?: ICrudOptions): Promise<EntityType>;
    findOne<FType = FilterType, EType = EntityType>(filter?: FType, options?: ICrudOptions): Promise<EType | undefined>;
    getOne<FType = FilterType, EType = EntityType>(filter?: FType, options?: ICrudOptions): Promise<EType>;
    find<FType = FilterType, EType = EntityType>(filter?: FType, options?: ICrudOptions): Promise<EType[]>;
    findAndCount<FType = FilterType, EType = EntityType>(filter?: FType, options?: ICrudOptions): Promise<{ rows: EType[], count: number }>;
    count<FType = FilterType, EType = EntityType>(filter?: FType, options?: ICrudOptions): Promise<number>;
    getQuery<FType = FilterType, EType = EntityType>(filter?: FType, options?: ICrudOptions): Promise<Query<EType>>;
}