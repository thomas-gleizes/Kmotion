import { ManyPlaylistRead } from 'src/playlist/application/port/playlist-query-repository.port';
import { Query } from 'src/core/cqrs';
import { PaginateParameter } from 'src/core/paginations/paginations.type';

export type FindManyPlaylistsQueryPayload = PaginateParameter<{}, {}> & {
  currentUserId: string;
};

export class FindManyPlaylistsQuery extends Query<ManyPlaylistRead[]> {
  constructor(public readonly payload: FindManyPlaylistsQueryPayload) {
    super();
  }
}
