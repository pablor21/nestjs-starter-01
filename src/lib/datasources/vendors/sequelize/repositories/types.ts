import { NonAbstract } from "@/lib/types";
import { Model } from 'sequelize-typescript';

export type ModelType<T> = (new () => T) & NonAbstract<typeof Model>;
export type PKType = string | number | Buffer;