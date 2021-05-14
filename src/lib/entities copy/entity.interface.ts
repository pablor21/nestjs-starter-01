import { IRepository } from "@/lib/datasources";

export interface IModel<T> {
  _oldValues: any;
  _values: any;
  _definition: any;
  //@ts-ignore
  _repository?: IRepository<T>;

  [x: string]: any;

  toDatabase(): Promise<any>;
  fromDatabase(record: any): IModel<T>;
  pk(): any;
  $get(property: string): any | Promise<any>;
  $set(property: string, value: any): IModel<T>;
}
