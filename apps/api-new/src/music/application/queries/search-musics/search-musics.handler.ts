import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchMusicsQuery } from 'src/music/application/queries/search-musics/search-musics.query';
import {
  MUSIC_READ_REPOSITORY_PORT,
  MusicRead,
  type MusicReadRepositoryPort,
} from 'src/music/application/port/music-read-repository.port';
import { Inject } from '@nestjs/common';

@QueryHandler(SearchMusicsQuery)
export class SearchMusicsHandler
  implements IQueryHandler<SearchMusicsQuery, MusicRead[]>
{
  constructor(
    @Inject(MUSIC_READ_REPOSITORY_PORT)
    private readonly musicReadRepository: MusicReadRepositoryPort,
  ) {}

  execute(query: SearchMusicsQuery): Promise<MusicRead[]> {
    return this.musicReadRepository.search(query.query);
  }
}
