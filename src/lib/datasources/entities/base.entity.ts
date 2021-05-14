import { IEntity } from "./entity.interface";

export class BaseEntity<T, PKType = any> implements IEntity<T, PKType>{
    public id: PKType;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date;

    constructor(fields?: Partial<T>) {
        Object.assign(this, fields);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async toDatasource(options?: any): Promise<T> {
        return this as unknown as T;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async fromDatasource(input: Partial<T>, options?: any): Promise<T> {
        Object.assign(this, input);
        return this as unknown as T;
    }

    async toJSON(options?: any): Promise<any> {
        return this.serialize(options);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async serialize(options?: any): Promise<any> {
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async unserialize(input: Partial<T>, options?: any): Promise<T> {
        Object.assign(this, input);
        return this as unknown as T;
    }
}