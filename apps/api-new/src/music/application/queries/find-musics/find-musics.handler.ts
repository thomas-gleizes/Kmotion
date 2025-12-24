import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindMusicsQuery } from 'src/music/application/queries/find-musics/find-musics.query';
import { Inject } from '@nestjs/common';
import {
  MUSIC_READ_REPOSITORY_PORT,
  MusicRead,
  type MusicReadRepositoryPort,
} from 'src/music/application/port/music-read-repository.port';
import { PaginateResult } from 'src/core/paginations/paginations.type';

@QueryHandler(FindMusicsQuery)
export class FindMusicsHandler implements IQueryHandler<FindMusicsQuery> {
  constructor(
    @Inject(MUSIC_READ_REPOSITORY_PORT)
    private readonly musicReadRepository: MusicReadRepositoryPort,
  ) {}

  async execute(query: FindMusicsQuery): Promise<PaginateResult<MusicRead>> {
    return this.musicReadRepository.findAll(query);
  }
}
