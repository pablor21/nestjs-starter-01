module.exports = {
    "appenders": {
        "access": {
            "type": "dateFile",
            "filename": "storage/logs/access.log",
            "pattern": "yyyy-MM-dd",
            "category": "http",
            "keepFileExt": true
        },
        "app": {
            "type": "file",
            "filename": "storage/logs/app.log",
            "maxLogSize": 10485760,
            "numBackups": 3,
            "keepFileExt": true
        },
        "console": {
            "type": "stdout",
            "layout": { type: "coloured" }
        },
        "errorFile": {
            "type": "file",
            "filename": "storage/logs/errors.log",
            "maxLogSize": 10485760,
            "numBackups": 3,
            "keepFileExt": true
        },
        "errors": {
            "type": "logLevelFilter",
            "level": "ERROR",
            "appender": "errorFile"
        },
    },
    "categories": {
        "cli": { "appenders": ["console"], "level": "ERROR" },
        "app": { "appenders": ["console", "app", "errors"], "level": env("LOG_LEVEL", "DEBUG") },
        "default": { "appenders": [/*"app",*/ "errors", "console"], "level": env("LOG_LEVEL", "DEBUG") },
        "http": { "appenders": ["access"], "level": env("LOG_LEVEL", "DEBUG") },
        "context": { "appenders": ["console"], "level": env("LOG_LEVEL", "DEBUG") },
        "database": { "appenders": ["console"], "level": env("LOG_LEVEL", "DEBUG") }
    }
}