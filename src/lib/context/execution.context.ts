import { DEFAULT_CONTEXT_NAME, ORIGINAL_CONTEXT_KEY, USER_CONTEXT_KEY } from "./constants";
import { IContext } from "./context.interface";
import * as _ from 'lodash';
import { uniqueId } from "../functions";
import { ContextRegistry } from "./contextregistry";
import { AbstractContext } from "./abstract.context";
import { HttpArgumentsHost, RpcArgumentsHost, WsArgumentsHost } from "@nestjs/common/interfaces";

export class ExecutionContext extends AbstractContext implements IContext {
    public values: any = {};
    protected _id = uniqueId();
    protected _type = 'http';

    protected switchCache = {};


    constructor(protected name = DEFAULT_CONTEXT_NAME) {
        super();
    }

    protected getUser(): any {
        return this.get(USER_CONTEXT_KEY);
    }

    

    swithcToWs(): WsArgumentsHost & ExecutionContext {
        if (!this.switchCache['rpc']) {
            const originalContext = this.get(ORIGINAL_CONTEXT_KEY).switchToWs();
            this.switchCache['ws'] = {
                ...this,
                getData: originalContext.getData,
                getClient: originalContext.getClient
            }
        }

        return this.switchCache['ws'];
    }


    switchToRpc(): RpcArgumentsHost & ExecutionContext {
        if (!this.switchCache['rpc']) {
            const originalContext = this.get(ORIGINAL_CONTEXT_KEY).switchToRpc();
            this.switchCache['rpc'] = {
                ...this,
                getData: originalContext.getData,
                getContext: originalContext.getContext
            }
        }
        return this.switchCache['rpc'];

    }

    switchToHttp(): HttpArgumentsHost & ExecutionContext {
        if (!this.switchCache['http']) {
            const originalContext = this.get(ORIGINAL_CONTEXT_KEY).switchToHttp();
            this.switchCache['http'] = {
                ...this,
                getRequest: originalContext.getRequest,
                getResponse: originalContext.getResponse,
                getNext: originalContext.getNext
            }
        }
        return this.switchCache['http'];
    }

    /**
     * Get the current instance of the ExecutionContext
     */
    static current(): ExecutionContext {
        return ContextRegistry.getContext<ExecutionContext>(DEFAULT_CONTEXT_NAME);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static init(...args: any): ExecutionContext {
        args = args || [];
        ContextRegistry.startContext<ExecutionContext>(ExecutionContext, DEFAULT_CONTEXT_NAME);
        const instance = ContextRegistry.getContext<ExecutionContext>();
        instance.set('startTime', new Date());
        return instance;
    }

    async run(callback): Promise<void> {
        return await ContextRegistry.runContext(callback, this);
    }


}