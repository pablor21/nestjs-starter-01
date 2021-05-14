//databases config file
module.exports = {
    // "default": {
    //     "uri": env("DATABASE_URL", "mongodb://localhost/app_db_dev"),
    //     //"replicaSet": env("DATABASE_REPLICA_SET", "rs"),
    //     "useNewUrlParser": true,
    //     "debug": env("DATABASE_LOG_ENABLED", process.env.NODE_ENV==='development', 'boolean')

    // }
    "default": {
        // "client": {
        //     dialect: env("DATABASE_TYPE", "mysql"),
        //     host: env("DATABASE_HOST", "localhost"),
        //     port: env("DATABASE_PORT", 3306),
        //     username: env("DATABASE_USER", 'root'),
        //     password: env("DATABASE_PASSWORD", 'secret'),
        //     database: env("DATABASE_NAME", 'test_db'),
        // },
        "client": {
            "uri": (env("DATABASE_URL", "mysql://root:secret@localhost/test_db")),
            "debug": env("DATABASE_LOG_ENABLED", process.env.NODE_ENV === 'development', 'boolean')
        },
        "migrations": {
            "path": "database/migrations",
            "fileType": "js",
        },
        "seeders": {
            "path": "database/seeds",
            "fileType": "js",
        }
    }
}