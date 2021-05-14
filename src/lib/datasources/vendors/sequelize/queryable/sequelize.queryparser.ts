import { IQuery } from "@/lib/datasources/queryable/query.interface";
import { IQueryParser } from "@/lib/datasources/queryable/queryparser.interface";

export class SequelizeQueryParser implements IQueryParser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async parse(query: IQuery<any>, options?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

}