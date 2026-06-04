import {
  MusicFilters,
  MusicOrderBy,
  MusicRead,
} from 'src/music/application/port/music-read-repository.port';
import {
  PaginateResult,
  PaginationOption,
} from 'src/core/paginations/paginations.type';
import { Query } from 'src/core/cqrs';

export type FindMusicsQueryPayload = {
  pagination: PaginationOption;
  filters: MusicFilters;
  orderBy: MusicOrderBy;
};
export type FindMusicsQueryResult = PaginateResult<MusicRead>;

export class FindMusicsQuery extends Query<FindMusicsQueryResult> {
  constructor(public readonly payload: FindMusicsQueryPayload) {
    super();
  }
}
