import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';
import { PlaylistEntry } from 'src/playlist/domain/values-object/playlist-entries.value-object';
import { Command } from 'src/core/cqrs';

export type CreatePlaylistCommandPayload = {
  title: string;
  userId: string;
  description: string;
  visibility?: Visibility;
  entries?: PlaylistEntry[];
};

export class CreatePlaylistCommand extends Command<string> {
  constructor(public readonly payload: CreatePlaylistCommandPayload) {
    super();
  }
}
