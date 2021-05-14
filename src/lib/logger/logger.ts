import { configure, connectLogger, getLogger, Logger as Log4jLogger } from "log4js";
import { Config } from "../config";
configure(Config.get('logger'));

export class Logger {
    static getLogger(category?: string): Log4jLogger {
        return getLogger(category);
    }

    static connectLogger(logger, options): Log4jLogger {
        return connectLogger(logger, options);
    }
}