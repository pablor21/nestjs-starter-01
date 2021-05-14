export interface IAuth {
    login<T = any>(user: T): Promise<T>;
    getUser<T = any>(): T;
    logout(): Promise<void>;
}