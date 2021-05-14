import * as path from "path";
import * as fs from "fs";
import * as _ from 'lodash';
import { IConfigContainer } from "./configcontainer.interface";
import { dynamicRequire } from "../functions";



export class ConfigContainer implements IConfigContainer {
    public values: any;

    constructor() {
        this.values = {};

    }

    public load(dir?: string): ConfigContainer {
        dir = dir || path.join(process.cwd(), '/config');
        if (!fs.existsSync(dir)) {
            console.error(`The path ${dir} does not exist! `)
            return;
        }
        this.values = {};
        fs.readdirSync(dir).forEach(file => {
            if (file.includes("config.js")) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const q = dynamicRequire(path.join(dir, file));
                let keyValues = file.split('.').slice(0, -1);
                if (keyValues.indexOf('config') === keyValues.length - 1) {
                    keyValues = keyValues.slice(0, -1);
                }
                this.values[keyValues.join('.')] = q;
            }
        });
        return this;
    }

    public get(key: string, defaultValue: any = null): any {
        return _.get(this.values, key, defaultValue);
    }

    public set(key: string, value: any): ConfigContainer {
        _.set(this.values, key, value);
        return this;
    }

    public delete(key): ConfigContainer {
        _.unset(this.values, key);
        return this;
    }
}
const _instance = new ConfigContainer();
_instance.load();
export const Config = _instance;