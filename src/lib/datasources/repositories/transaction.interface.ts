export interface IRepositoryTransaction {
    begin(...args: any): Promise<any>;
    commit(...args: any): Promise<any>;
    rollback(...args: any): Promise<any>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    run<T = any>(cb: (tx: IRepositoryTransaction, ...args: any) => Promise<T>, ...args: any): Promise<T>;
}