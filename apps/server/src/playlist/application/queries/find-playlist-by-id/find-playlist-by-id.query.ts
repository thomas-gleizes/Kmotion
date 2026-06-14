import { Query } from 'src/core/cqrs';
import { PlaylistRead } from 'src/playlist/application/port/playlist-query-repository.port';

export type FindPlaylistByIdQueryPayload = {
  id: string;
  currentUserId: string;
};

export class FindPlaylistByIdQuery extends Query<PlaylistRead> {
  constructor(public readonly payload: FindPlaylistByIdQueryPayload) {
    super();
  }
}
