import { Query } from 'src/core/cqrs';
import { ManyPlaylistRead } from 'src/playlist/application/port/playlist-query-repository.port';

export type FindByUserIdQueryPayload = { userId: string };

export class FindByUserIdQuery extends Query<ManyPlaylistRead[]> {
  constructor(public readonly payload: FindByUserIdQueryPayload) {
    super();
  }
}
