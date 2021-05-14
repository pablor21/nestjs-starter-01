import { Injectable, NestInterceptor, ExecutionContext as NestExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExecutionContext, HTTP_NEXT_FUNCTION_CONTEXT_KEY, HTTP_REQUEST_CONTEXT_KEY, HTTP_RESPONSE_CONTEXT_KEY, ORIGINAL_CONTEXT_KEY } from '@/lib/context';
import { catchError, tap } from 'rxjs/operators';
import { Logger } from '@/lib/logger';

const logger = Logger.getLogger("context");

@Injectable()
export class NestExecutionContextInterceptor implements NestInterceptor {

    protected flushContext(ctx) {
        logger.debug(`Context flushed [${ctx.getType()}] [id: ${ctx.getId()}]`);
        ExecutionContext.current().flush();
    }

    intercept(context: NestExecutionContext, next: CallHandler): Observable<any> {
        const ctx = ExecutionContext.init(context);


        logger.debug(`Context initialized [${context.getType()}] [id: ${ctx.getId()}]`);

        ctx.setType(context.getType());
        ctx.set(ORIGINAL_CONTEXT_KEY, context);

        if (context.getType() === 'http') {

            const request = ctx.switchToHttp().getRequest();
            const response = ctx.switchToHttp().getRequest();
            const next = ctx.switchToHttp().getNext();
            request['id'] = ctx.getId();
            response['id'] = ctx.getId();


            ctx.set(HTTP_REQUEST_CONTEXT_KEY, request);
            ctx.set(HTTP_RESPONSE_CONTEXT_KEY, response);
            ctx.set(HTTP_NEXT_FUNCTION_CONTEXT_KEY, next);
        }

        if (context.getType() === 'ws') {

        }

        if (context.getType() === 'rpc') {

        }

        //flush the context when the request finish
        return next.handle().pipe(tap(() => {
            this.flushContext(ctx)
        }), catchError(err => {
            this.flushContext(ctx);
            throw err;
        }))
    }
}