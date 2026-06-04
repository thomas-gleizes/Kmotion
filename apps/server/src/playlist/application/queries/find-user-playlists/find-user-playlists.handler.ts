import { IQueryHandler, QueryHandler } from 'src/core/cqrs';
import { Inject } from '@nestjs/common';
import {
  PLAYLIST_READ_REPOSITORY_PORT,
  type PlaylistQueryRepositoryPort,
  ManyPlaylistRead,
} from 'src/playlist/application/port/playlist-query-repository.port';
import { FindUserPlaylistsQuery } from './find-user-playlists.query';

@QueryHandler(FindUserPlaylistsQuery)
export class FindUserPlaylistsHandler
  implements IQueryHandler<FindUserPlaylistsQuery>
{
  constructor(
    @Inject(PLAYLIST_READ_REPOSITORY_PORT)
    private readonly playlistRepository: PlaylistQueryRepositoryPort,
  ) {}

  async execute(query: FindUserPlaylistsQuery): Promise<ManyPlaylistRead[]> {
    return this.playlistRepository.findByUserId(query.payload.userId);
  }
}
