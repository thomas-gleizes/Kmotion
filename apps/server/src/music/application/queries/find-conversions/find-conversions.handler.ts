import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from 'src/core/cqrs';
import { FindConversionsQuery } from 'src/music/application/queries/find-conversions/find-conversions.query';
import {
  MUSIC_READ_REPOSITORY_PORT,
  MusicRead,
  type MusicReadRepositoryPort,
} from 'src/music/application/port/music-read-repository.port';

/** Conversions not ready yet (queued, running or failed), for the admin. */
@QueryHandler(FindConversionsQuery)
export class FindConversionsHandler implements IQueryHandler<FindConversionsQuery> {
  constructor(
    @Inject(MUSIC_READ_REPOSITORY_PORT)
    private readonly musicReadRepository: MusicReadRepositoryPort,
  ) {}

  execute(): Promise<MusicRead[]> {
    return this.musicReadRepository.findUnfinished();
  }
}
