import { Command } from 'src/core/cqrs';

export type AddMusicToPlaylistCommandPayload = {
  playlistId: string;
  userId: string;
  musicId: string;
  position: number;
};

export class AddMusicToPlaylistCommand extends Command<void> {
  constructor(public readonly payload: AddMusicToPlaylistCommandPayload) {
    super();
  }
}
