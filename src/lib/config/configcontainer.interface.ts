export interface IConfigContainer {
    load(dir?: string): IConfigContainer;
    get(key: string, defaultValue?: any): any;
    set(key: string, value: any): IConfigContainer;
    delete(key: string): IConfigContainer;
}