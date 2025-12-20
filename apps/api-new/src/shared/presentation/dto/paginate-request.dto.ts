export interface PaginateRequestDto<T = unknown, R = unknown> {
  filters?: T[];

  orderBy?: R[];

  pageSize?: number;

  pageToken?: string;
}
