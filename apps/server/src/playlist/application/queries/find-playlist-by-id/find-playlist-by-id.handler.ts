import { IQueryHandler, QueryHandler } from 'src/core/cqrs';
import { Inject } from '@nestjs/common';
import {
  PLAYLIST_READ_REPOSITORY_PORT,
  type PlaylistQueryRepositoryPort,
  PlaylistRead,
} from 'src/playlist/application/port/playlist-query-repository.port';
import { FindPlaylistByIdQuery } from './find-playlist-by-id.query';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';

@QueryHandler(FindPlaylistByIdQuery)
export class FindPlaylistByIdHandler implements IQueryHandler<FindPlaylistByIdQuery> {
  constructor(
    @Inject(PLAYLIST_READ_REPOSITORY_PORT)
    private readonly playlistRepository: PlaylistQueryRepositoryPort,
  ) {}

  async execute(query: FindPlaylistByIdQuery): Promise<PlaylistRead> {
    const playlist = await this.playlistRepository.findById(query.payload.id);

    if (!playlist) {
      throw new RessourceNotFoundException('playlist');
    }

    const isOwner = playlist.user.id === query.payload.currentUserId;
    if (playlist.visibility === Visibility.private && !isOwner) {
      throw new RessourceNotFoundException('playlist');
    }

    return playlist;
  }
}
