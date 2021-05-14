
export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC"
}

export type SortField<T> = {
    [K in keyof T]?: SortDirection;
};