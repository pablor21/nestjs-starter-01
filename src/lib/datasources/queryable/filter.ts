import { FilterFieldComparison } from "./comparators";

export type FilterComparisons<T> = {
    [K in keyof T]?: FilterFieldComparison<T[K]>;
};

export type FilterGrouping<T> = {
    and?: Filter<T>[];
    or?: Filter<T>[];
};

export type Filter<T> = FilterGrouping<T> & FilterComparisons<T>;