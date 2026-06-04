import { Command } from 'src/core/cqrs';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

export type AddMusicCommandPayload = {
  mediaId: string;
  mediaSource: MediaSource;
  userId: string;
};

export class AddMusicCommand extends Command<string> {
  constructor(public readonly payload: AddMusicCommandPayload) {
    super();
  }
}
