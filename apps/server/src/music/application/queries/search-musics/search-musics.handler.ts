import { IQueryHandler, QueryHandler } from 'src/core/cqrs';
import {
  SearchMusicsQuery,
  SearchMusicsQueryResult,
} from 'src/music/application/queries/search-musics/search-musics.query';
import {
  MUSIC_READ_REPOSITORY_PORT,
  MusicRead,
  type MusicReadRepositoryPort,
} from 'src/music/application/port/music-read-repository.port';
import { Inject } from '@nestjs/common';

@QueryHandler(SearchMusicsQuery)
export class SearchMusicsHandler implements IQueryHandler<SearchMusicsQuery> {
  constructor(
    @Inject(MUSIC_READ_REPOSITORY_PORT)
    private readonly musicReadRepository: MusicReadRepositoryPort,
  ) {}

  execute({ payload }: SearchMusicsQuery): Promise<SearchMusicsQueryResult> {
    return this.musicReadRepository.search(payload.query);
  }
}
