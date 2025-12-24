import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  PLAYLIST_READ_REPOSITORY_PORT,
  type PlaylistQueryRepositoryPort,
  ManyPlaylistRead,
} from 'src/playlist/application/port/playlist-query-repository.port';
import { FindManyPlaylistsQuery } from './find-many-playlists.query';

@QueryHandler(FindManyPlaylistsQuery)
export class FindManyPlaylistsHandler
  implements IQueryHandler<FindManyPlaylistsQuery, ManyPlaylistRead[]>
{
  constructor(
    @Inject(PLAYLIST_READ_REPOSITORY_PORT)
    private readonly playlistRepository: PlaylistQueryRepositoryPort,
  ) {}

  async execute(query: FindManyPlaylistsQuery): Promise<ManyPlaylistRead[]> {
    return this.playlistRepository.findMany(query.params);
  }
}
