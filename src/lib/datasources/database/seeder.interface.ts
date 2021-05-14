export interface ISeeder {
    createSeed(...options: any): Promise<any>;
    revert(...options: any): Promise<any>;
    seed(...options: any): Promise<any>;
    listPending(...options: any): Promise<any>;
    listExecuted(...options: any): Promise<any>;
}