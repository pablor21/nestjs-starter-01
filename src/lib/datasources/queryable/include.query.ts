import { Query } from "./query";
import { IIncludeQuery } from "./query.interface";

export class IncludeQuery<T = any> extends Query<T> implements IIncludeQuery<T>{
    public alias?: string;

    constructor(properties?: Partial<IncludeQuery<T>>) {
        super(properties);
        Object.assign(this, properties);
    }
}