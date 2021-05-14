// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
module.exports = {
    'default': {
        sortSchema: true,
        debug: env(
            'GRAPHQL_DEBUG',
            env('NODE_ENV', 'production') === 'development' ? 'true' : 'false',
        ) === 'true',
        playground: env(
            'GRAPHQL_PLAYGROUND',
            env('NODE_ENV', 'production') === 'development' ? 'true' : 'false',
            'boolean'),
        installSubscriptionHandlers: true,
        //begin: schema-first
        definitions: {
            path: path.resolve(
                env('STORAGE_ROOT', './storage'),
                'graphql',
                'graphql.public.ts',
            ),
        },
        typePaths: ['./**/*.public.gql', './**/*.common.gql'],
        //end: schema-first
        // begin: code-first 
        // autoSchemaFile: path.resolve(
        //     env('STORAGE_ROOT', './storage'),
        //     'schema.public.gql',
        // ),
        // end: code-first
        resolverValidationOptions: {
            allowResolversNotInSchema: true,
        },
        path: '/graphql',
        directivesResolver: [],
        cors: false,
        subscriptionEngine: env('GRAPHQL_SUBSCRIPTIONS_ENGINE', 'memory'),
        subscriptionEngines: {
            'memory': {
                options: {}
            },
            'redis': {
                options: {
                    connection: {
                        host: env('GRAPHQL_SUBSCRIPTIONS_REDIS_HOST', env('REDIS_HOST', 'localhost')),
                        port: env('GRAPHQL_SUBSCRIPTIONS_REDIS_PORT', env('REDIS_PORT', '6379')),
                        retryStrategy: times => {
                            // reconnect after
                            return Math.min(times * 50, 2000);
                        }
                    }
                }
            }
        }
    },
    'admin': {
        sortSchema: true,
        debug: env(
            'GRAPHQL_DEBUG',
            env('NODE_ENV', 'production') === 'development' ? 'true' : 'false',
        ) === 'true',
        playground: env(
            'GRAPHQL_PLAYGROUND',
            env('NODE_ENV', 'production') === 'development' ? 'true' : 'false',
            'boolean'),
        resolverValidationOptions: {
            allowResolversNotInSchema: true,
        },
        //begin: schema-first
        definitions: {
            path: path.resolve(
                env('STORAGE_ROOT', './storage'),
                'graphql',
                'graphql.admin.ts',
            ),
        },
        typePaths: ['./**/*.admin.gql', './**/*.common.gql'],
        //end: schema-first
        // begin: code-first
        // autoSchemaFile: path.resolve(
        //     env('STORAGE_ROOT', './storage'),
        //     'schema.admin.gql',
        // ),
        // end: code-first
        installSubscriptionHandlers: true,
        path: '/admin/graphql',
        directivesResolver: [],
        cors: false,
        subscriptionEngine: env('GRAPHQL_SUBSCRIPTIONS_ENGINE', 'memory'),
        subscriptionEngines: {
            'memory': {
                options: {}
            },
            'redis': {
                options: {
                    connection: {
                        host: env('GRAPHQL_SUBSCRIPTIONS_REDIS_HOST', env('REDIS_HOST', 'localhost')),
                        port: env('GRAPHQL_SUBSCRIPTIONS_REDIS_PORT', env('REDIS_PORT', '6379')),
                        retryStrategy: times => {
                            // reconnect after
                            return Math.min(times * 50, 2000);
                        }
                    }
                }
            }
        }
    }
}