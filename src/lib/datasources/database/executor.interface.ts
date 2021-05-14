export interface IExecutor {
    execute(command: string, ...options: any): Promise<any>;
}