import { EventEmitter } from "events";

export interface IContext extends EventEmitter {
    getName(): string;
    getId(): string;
    getType(): string;
    setType(type: string): void;
    set(key: string, value?: any): IContext;
    get<T = any>(key: string, defaultValue?: T): T;
    remove(key: string): IContext;
    flush(): IContext;
}