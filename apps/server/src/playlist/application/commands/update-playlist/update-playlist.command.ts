import { Command } from 'src/core/cqrs';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';
import { PlaylistEntry } from 'src/playlist/domain/values-object/playlist-entries.value-object';

export type UpdatePlaylistCommandPayload = {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  visibility?: Visibility;
  entries?: PlaylistEntry[];
};

export class UpdatePlaylistCommand extends Command<void> {
  constructor(public readonly payload: UpdatePlaylistCommandPayload) {
    super();
  }
}
