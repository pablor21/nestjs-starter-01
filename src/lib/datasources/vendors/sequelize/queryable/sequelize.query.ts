import { Query, IQuery } from "../../../queryable";

export class SequelizeQuery<T> extends Query<T> implements IQuery<T>{
    get<RType = T>(options?: any): Promise<RType[]> {
        throw new Error("Method not implemented.");
    }
    getOne<RType = T>(options?: any): Promise<RType> {
        throw new Error("Method not implemented.");
    }
    count(options?: any): Promise<number> {
        throw new Error("Method not implemented.");
    }

}