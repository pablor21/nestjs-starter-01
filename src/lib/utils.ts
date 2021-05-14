import { ulid } from "ulid";
import * as uuid from "uuid";

export class Utils {
    static config = {
        'uniqueGenerator': () => Utils.ulid()
    };


    public static ulid(seedTime?: number): string {
        return ulid(seedTime);
    }

    public static uuid(v: "v1" | "v2" | "v3" | "v4" | "v5" = 'v4', ...args: any): string {
        return uuid[v](...args);
    }

    public static uniqueId(): string {
        return Utils.config.uniqueGenerator().toString();
    }

    public static isNull(obj: any): boolean {
        return undefined === obj || null === obj;
    }

    public static isNullOrEmpty(obj: string | Record<string, unknown>): boolean {
        if (obj instanceof String) {
            return Utils.isNull(obj) || obj.trim().length === 0;
        } else {
            return Utils.objectIsNullOrEmtpy(obj);
        }
    }

    public static isEmptyObject(obj: any): boolean {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    public static objectIsNullOrEmtpy(obj: any): boolean {
        return Utils.isNull(obj) || Utils.isEmptyObject(obj);
    }

    public static getValue<T>(target?: any, key?: string, defaultValue?: T): T {
        if (!target) {
            return defaultValue;
        }

        if (!key) {
            return target;
        }

        return key.split(".").reduce((o, x) => { return (o && o[x] != null && o[x] != undefined) ? o[x] : defaultValue }, target);

    }

    public static cast(value: any, type = 'string') {
        if (typeof (value) === type) {
            return value
        }
        switch (type) {
            case 'string':
                return String(value);
            case 'number':
                return Number(value);
            case 'bool':
            case 'boolean':

                switch (value.toLowerCase()) {
                    case "false":
                    case "no":
                    case "0":
                    case "":
                        return false;
                    default: return true;
                }
            default:
                return value;
        }
    }

    public static randomString(length) {
        let result = '';
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public static randomNumbers(length) {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public static uniqueArrayValues(arr: any[]) {
        return arr.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    }

    public static getRealClass(target: Record<string, unknown>): any {
        if (target instanceof Function) {
            return target;
        }
        return target?.constructor || target;
    }

    public static getClassChain(target: any, includeSelf = true): any[] {
        if (!target) {
            return [];
        }
        const chain = [];
        let currentObj = includeSelf ? Utils.getRealClass(target) : Object.getPrototypeOf(Utils.getRealClass(target));
        do {
            if (currentObj.prototype !== undefined && currentObj.name) {
                chain.push(currentObj)
            }
            currentObj = Object.getPrototypeOf(currentObj);
        } while (currentObj)
        return chain;
    }

    public static convertToBase64(obj: any): string {
        return Buffer.from(obj).toString('base64');
    }

    public static convertFromBase64(obj: string): string {
        return Buffer.from(obj, 'base64').toString('utf8');
    }

    public static tryParseJSON(jsonString: string): Record<string, unknown> | undefined {
        try {
            const o = JSON.parse(jsonString);
            if (o && typeof o === "object") {
                return o;
            }
        }
        catch (e) { }

        return undefined;
    };
}