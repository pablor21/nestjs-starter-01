import { IQuery } from "./query.interface";

export interface IQueryParser {
    parse(query: IQuery<any>, options?: any): Promise<any>;
    
}