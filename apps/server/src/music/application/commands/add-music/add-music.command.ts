import { Command } from 'src/core/cqrs';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import type { Clip } from 'src/music/domain/values-object/clip.value-object';

export type AddMusicCommandPayload = {
  mediaId: string;
  mediaSource: MediaSource;
  userId: string;
  /** Keep only this portion of the media; the whole media when omitted. */
  clip?: Clip;
};

export class AddMusicCommand extends Command<string> {
  constructor(public readonly payload: AddMusicCommandPayload) {
    super();
  }
}
