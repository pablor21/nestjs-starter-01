export interface IMigrator {
    createMigration(...options: any): Promise<any>;
    revert(...options: any): Promise<any>;
    migrate(...options: any): Promise<any>;
    listPending(...options: any): Promise<any>;
    listExecuted(...options: any): Promise<any>;
}