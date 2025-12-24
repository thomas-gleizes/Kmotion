import { IQuery } from '@nestjs/cqrs';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

export class FindMusicByMediaIdQuery implements IQuery {
  constructor(
    public readonly mediaId: string,
    public readonly mediaSource: MediaSource,
  ) {}
}
