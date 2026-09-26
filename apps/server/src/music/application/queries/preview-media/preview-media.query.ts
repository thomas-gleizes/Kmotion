import { Query } from 'src/core/cqrs';
import type { MediaPreview } from 'src/music/domain/port/converter-service.port';
import type { Clip } from 'src/music/domain/values-object/clip.value-object';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

export type PreviewMediaQueryPayload = {
  mediaId: string;
  mediaSource: MediaSource;
  clip?: Clip;
};

export class PreviewMediaQuery extends Query<MediaPreview> {
  constructor(public readonly payload: PreviewMediaQueryPayload) {
    super();
  }
}
