export interface PaginateResponseDto<T> {
  records: T[];

  total: number;
}
