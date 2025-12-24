import { IQuery } from '@nestjs/cqrs';
import {
  MusicFilters,
  MusicOrderBy,
} from 'src/music/application/port/music-read-repository.port';
import { PaginationOption } from 'src/core/paginations/paginations.type';

export class FindMusicsQuery implements IQuery {
  constructor(
    public readonly pagination: PaginationOption,
    public readonly filters: MusicFilters,
    public readonly orderBy: MusicOrderBy,
  ) {}
}
