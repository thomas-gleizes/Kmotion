import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { MusicRead } from 'src/music/application/port/music-read-repository.port';
import { Query } from 'src/core/cqrs';

export type FindMusicByMediaIdQueryPayload = {
  mediaId: string;
  mediaSource: MediaSource;
};
export type FindMusicByMediaIdQueryResult = MusicRead;

export class FindMusicByMediaIdQuery extends Query<FindMusicByMediaIdQueryResult> {
  constructor(public readonly payload: FindMusicByMediaIdQueryPayload) {
    super();
  }
}
