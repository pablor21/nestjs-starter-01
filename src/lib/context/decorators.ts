import { DEFAULT_CONTEXT_NAME, USER_CONTEXT_KEY } from "./constants";
import { IContext } from "./context.interface";
import { ContextRegistry } from "./contextregistry";

export function Context(name: string = DEFAULT_CONTEXT_NAME): any {
    return function (target: any, property: string, descriptor: PropertyDescriptor) {
        target[property] = undefined;
        Object.defineProperty(target, property, {
            get: function (): IContext {
                return ContextRegistry.getContext(name);
            }
        })
    }
}

export function ContextValue(key: string, contextName: string = DEFAULT_CONTEXT_NAME): any {
    return function (target: any, property: string, descriptor: PropertyDescriptor) {
        target[property] = undefined;
        Object.defineProperty(target, property, {
            get: function () {
                return ContextRegistry.getContext(contextName)?.get(key);
            },
            configurable: false,
        })
    }
}

export function User(contextName: string = DEFAULT_CONTEXT_NAME): any {
    return function (target: any, property: string, descriptor: PropertyDescriptor) {
        target[property] = undefined;
        Object.defineProperty(target, property, {
            get: function () {
                return ContextRegistry.getContext(contextName)?.get(USER_CONTEXT_KEY);
            },
            configurable: false,
        })
    }
}