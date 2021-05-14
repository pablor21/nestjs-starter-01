import { ExecutionContext } from "../context";
import { Logger } from "../logger";

export interface IService {
    getContext(): ExecutionContext;
    getUser<T = any>(): T | undefined;
    getLogger(category?: string): Logger;
}