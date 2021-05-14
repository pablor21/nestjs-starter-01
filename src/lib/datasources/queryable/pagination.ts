export interface IOffsetPagination {
    take?: number;
    skip?: number;
}

export interface ICursorPagination {
    first?: number;
    last?: number;
    after?: string;
    before?: string;
}