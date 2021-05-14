import { AsyncLocalStorage } from "async_hooks";
import { DEFAULT_CONTEXT_NAME } from "./constants";
import { IContext } from "./context.interface";

const contexts = {};

export class ContextRegistry {
    private static ensureStorage<T>(name: string) {
        if (!contexts[name]) {
            contexts[name] = new AsyncLocalStorage<T>();
        }
        return contexts[name];
    }

    /**
     * Run the callback inside the async local storage
     * @param callback 
     * @param context 
     */
    static async runContext<T extends IContext = IContext>(callback: (...args: any) => void, context: T) {
        const asl = ContextRegistry.getStorage(context.getName());
        asl.run(context, callback);
    }

    /**
     * Start a context instance and enter with it
     * @param constructor 
     * @param alias 
     */
    static startContext<T extends IContext = IContext>(constructor: new () => T, name: string = DEFAULT_CONTEXT_NAME): T {
        const asl = ContextRegistry.getStorage(name || constructor.name);
        asl.enterWith(new constructor());
        return ContextRegistry.getContext<T>(name || constructor.name);
    }

    /**
     * Get a store context
     * @param name 
     */
    public static getContext<T = IContext>(name: string = DEFAULT_CONTEXT_NAME): T {
        const asl = ContextRegistry.getStorage<T>(name);
        return asl.getStore() as unknown as T;
    }

    public static getContexts() {
        return contexts;
    }

    public static getStorage<T = IContext>(name: string = DEFAULT_CONTEXT_NAME): AsyncLocalStorage<T> {
        return ContextRegistry.ensureStorage<T>(name);
    }
}