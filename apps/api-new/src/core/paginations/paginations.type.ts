export type PaginateParameter<Filters, OrderBy> = {
  filters?: Filters;
  orderBy?: OrderBy;
  pagination?: PaginationOption;
};

export type PaginationOption = { page?: number; size?: number };

export type PaginateResult<T> = {
  records: T[];
  total: number;
};
