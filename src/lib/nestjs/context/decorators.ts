import { createParamDecorator } from '@nestjs/common';
import { ContextRegistry, IContext, DEFAULT_CONTEXT_NAME } from '@/lib/context';

export const ContextParam = createParamDecorator(
    <T extends IContext = IContext>(contextName: string = DEFAULT_CONTEXT_NAME): T => {
        return ContextRegistry.getContext(contextName);
    },
);

export const ContextValueParam = createParamDecorator(
    <T = any>(data: string | {
        key: string,
        contextName: string
    }): T => {

        const contextName = data['contextName'] || DEFAULT_CONTEXT_NAME;
        const context = ContextRegistry.getContext(contextName);
        const key = data['key'] || data;
        return context?.get<T>(key);
    },
);