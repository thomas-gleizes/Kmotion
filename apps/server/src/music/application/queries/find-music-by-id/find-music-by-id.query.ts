import { Query } from 'src/core/cqrs';
import { MusicRead } from 'src/music/application/port/music-read-repository.port';

export type FindMusicByIdQueryPayload = { musicId: string };
export type FindMusicByIdQueryResult = MusicRead;

export class FindMusicByIdQuery extends Query<FindMusicByIdQueryResult> {
  constructor(public readonly payload: FindMusicByIdQueryPayload) {
    super();
  }
}
