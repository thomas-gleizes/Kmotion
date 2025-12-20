export interface PaginateResponseDto<T> {
  records: T[];

  nextPage: string | null;
}
