import { Query } from 'src/core/cqrs';
import { ManyPlaylistRead } from 'src/playlist/application/port/playlist-query-repository.port';

export type FindUserPlaylistsQueryPayload = { userId: string; currentUserId: string };

export class FindUserPlaylistsQuery extends Query<ManyPlaylistRead[]> {
  constructor(public readonly payload: FindUserPlaylistsQueryPayload) {
    super();
  }
}
