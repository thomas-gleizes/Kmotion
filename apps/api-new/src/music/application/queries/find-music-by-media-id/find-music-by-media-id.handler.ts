import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindMusicByMediaIdQuery } from 'src/music/application/queries/find-music-by-media-id/find-music-by-media-id.query';
import {
  MUSIC_READ_REPOSITORY_PORT,
  MusicRead,
  type MusicReadRepositoryPort,
} from 'src/music/application/port/music-read-repository.port';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import { Inject } from '@nestjs/common';

@QueryHandler(FindMusicByMediaIdQuery)
export class FindMusicByMediaIdHandler
  implements IQueryHandler<FindMusicByMediaIdQuery>
{
  constructor(
    @Inject(MUSIC_READ_REPOSITORY_PORT)
    private readonly musicReadRepository: MusicReadRepositoryPort,
  ) {}

  async execute(query: FindMusicByMediaIdQuery): Promise<MusicRead> {
    const music = await this.musicReadRepository.findByMediaId(
      query.mediaId,
      query.mediaSource,
    );

    if (!music) throw new RessourceNotFoundException('Music');

    return music;
  }
}
