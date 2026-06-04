import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from 'src/core/cqrs';
import { FindMusicByIdQuery } from 'src/music/application/queries/find-music-by-id/find-music-by-id.query';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import {
  MusicRead,
  type MusicReadRepositoryPort,
  MUSIC_READ_REPOSITORY_PORT,
} from 'src/music/application/port/music-read-repository.port';

@QueryHandler(FindMusicByIdQuery)
export class FindMusicByIdHandler implements IQueryHandler<FindMusicByIdQuery> {
  constructor(
    @Inject(MUSIC_READ_REPOSITORY_PORT)
    private readonly musicReadRepository: MusicReadRepositoryPort,
  ) {}

  async execute({ payload }: FindMusicByIdQuery): Promise<MusicRead> {
    const music = await this.musicReadRepository.findById(payload.musicId);

    if (!music) throw new RessourceNotFoundException('Music');

    return music;
  }
}
