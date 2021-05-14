import { IAuth } from "../auth/auth.interface";
import { ExecutionContext } from "../context";
import { Context, User } from "../context/decorators";
import { Logger } from "../logger";
import { IService } from "./service.interface";

export abstract class GenericService implements IService {

    @Context()
    protected context: ExecutionContext;

    @User()
    protected user: any;


    getContext(): ExecutionContext {
        return this.context;
    }

    getUser<T = any>(): T | undefined {
        return this.user as T;
    }

    getLogger(category?: string): Logger {
        return Logger.getLogger(category);
    }

}