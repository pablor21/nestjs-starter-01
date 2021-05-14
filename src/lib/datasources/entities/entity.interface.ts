export interface IEntity<T = any, PKType = any> {
    id: PKType;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    toDatasource(options?: any): Promise<T>;
    fromDatasource(input: Partial<T>, options?: any): Promise<T>;
    toJSON(options?: any): Promise<any>;
    serialize(options?: any): Promise<any>;
    unserialize(input: Partial<T>, options?: any): Promise<T>;
}