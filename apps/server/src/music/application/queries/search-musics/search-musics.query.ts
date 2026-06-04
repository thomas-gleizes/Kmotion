import { Query } from 'src/core/cqrs';
import { MusicRead } from 'src/music/application/port/music-read-repository.port';

export type SearchMusicsQueryPayload = { query: string };
export type SearchMusicsQueryResult = MusicRead[];

export class SearchMusicsQuery extends Query<SearchMusicsQueryResult> {
  constructor(public readonly payload: SearchMusicsQueryPayload) {
    super();
  }
}
