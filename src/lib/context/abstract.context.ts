import { EventEmitter } from "events";
import { DEFAULT_CONTEXT_NAME, HTTP_NEXT_FUNCTION_CONTEXT_KEY, HTTP_REQUEST_CONTEXT_KEY, HTTP_RESPONSE_CONTEXT_KEY } from "./constants";
import { IContext } from "./context.interface";
import * as _ from 'lodash';
import { uniqueId } from "../functions";
import { ContextRegistry } from "./contextregistry";

export class AbstractContext<T extends IContext = IContext> extends EventEmitter implements IContext {
    public values: any = {};
    protected _id = uniqueId();
    protected _type = 'http';


    constructor(protected name?: string) {
        super();
    }

    public getId(): string {
        if (!this._id) {
            this._id = uniqueId();
        }
        return this._id;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return this._type;
    }

    public setType(type: string): void {
        this._type = type;
    }

    public set(key: string, value?: any): T {
        if (undefined === value || null === value) {
            return this.remove(key);
        }
        _.set(this.values, key, value)
        return this as unknown as T;
    }


    get<T = any>(key: string, defaultValue?: T): T {
        return _.get(this.values, key, defaultValue) as T;
    }

    remove(key: string): T {
        _.unset(this.values, key);
        return this as unknown as T;
    }

    flush(): T {
        this.emit('flush');
        delete this.values;
        return this as unknown as T;
    }

    /**
     * Get the current instance of the AbstractContext
     */
    static current(): AbstractContext {
        return ContextRegistry.getContext<AbstractContext>(DEFAULT_CONTEXT_NAME);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static init(...args: any): AbstractContext{
        args = args || [];
        ContextRegistry.startContext<AbstractContext>(AbstractContext, DEFAULT_CONTEXT_NAME);
        const instance = ContextRegistry.getContext<AbstractContext>();
        instance.set('startTime', new Date());
        return instance;
    }

    async run(callback): Promise<void> {
        return await ContextRegistry.runContext(callback, this);
    }


}