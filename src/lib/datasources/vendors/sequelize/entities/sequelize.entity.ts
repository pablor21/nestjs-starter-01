import { IEntity } from "../../../entities";
import { Column, CreatedAt, DataType, DeletedAt, Model, PrimaryKey, UpdatedAt } from "sequelize-typescript";
import { uniqueId } from "lodash";

export class SequelizeEntity<T> extends Model<Partial<T>> implements IEntity<T, string>{
    @PrimaryKey
    @Column({
        defaultValue: () => uniqueId
    })
    public id: string;

    @CreatedAt
    @Column({
        type: DataType.DATE
    })
    public createdAt: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE
    })
    public updatedAt: Date;

    @DeletedAt
    @Column({
        type: DataType.DATE
    })
    public deletedAt: Date;

    constructor(fields?: Partial<T>) {
        super(fields);
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
        return super.toJSON();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async unserialize(input: Partial<T>, options?: any): Promise<T> {
        Object.assign(this, input);
        return this as unknown as T;
    }

}