import { URL } from "url";
import path from "path";
import { Utils } from "./utils";

export function dynamicRequire(path) {
    if (!path) {
        return;
    }
    path = path.split('\\').join('/'); // Normalize windows slashes
    return eval(`require('${path}');`); // Ensure Webpack does not analyze the require statement
}

export function ulid(seedTime?: number): string {
    return Utils.ulid(seedTime);
}

export function uuid(v: "v1" | "v2" | "v3" | "v4" | "v5" = 'v4', ...args: any): string {
    return Utils.uuid(v, ...args);
}

export function uniqueId(): string {
    return Utils.uniqueId();
}

export function getValue<T = any>(target?: any, key?: string, defaultValue?: T): T {
    return Utils.getValue<T>(target, key, defaultValue);
}

export function isNull(obj: any): boolean {
    return Utils.isNull(obj);
}

export function isEmptyObject(obj: any): boolean {
    return Utils.isEmptyObject(obj);
}

export function isNullOrEmpty(obj: any): boolean {
    return Utils.isNullOrEmpty(obj);
}

export function cast(value: any, type = 'string') {
    return Utils.cast(value, type);
}

export function getClassChain(target: any, includeSelf = true): any[] {
    return Utils.getClassChain(target, includeSelf);
}

export function getRealClass(target: any) {
    return Utils.getRealClass(target);
}

export function convertToBase64(obj: any): string {
    return Utils.convertToBase64(obj);
}

export function convertFromBase64(obj: string): string {
    return Utils.convertFromBase64(obj);
}

export function tryParseJSON(jsonString: string): Record<string, unknown> | undefined {
    return Utils.tryParseJSON(jsonString);
}


export function parseConnectionString(connectionString: string): any {
    const config: any = {};
    const options: any = {}

    const urlParts = new URL(connectionString);

    options.dialect = urlParts.protocol.replace(/:$/, '');
    options.host = urlParts.hostname;


    if (options.dialect === 'sqlite' && urlParts.pathname && urlParts.pathname.indexOf('/:memory') !== 0) {
        const p = path.join(options.host, urlParts.pathname);
        options.storage = options.storage || p;
    }

    if (urlParts.pathname) {
        config.database = urlParts.pathname.replace(/^\//, '');
    }

    if (urlParts.port) {
        options.port = urlParts.port;
    }

    if (urlParts.username) {
        config.username = urlParts.username;
    }

    if (urlParts.password) {
        config.password = urlParts.password;
    }

    const result = Object.assign({}, config, options);

    return result;
}