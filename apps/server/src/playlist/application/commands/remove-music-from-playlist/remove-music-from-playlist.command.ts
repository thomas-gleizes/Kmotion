import { Command } from 'src/core/cqrs';

export type RemoveMusicFromPlaylistCommandPayload = {
  playlistId: string;
  userId: string;
  musicId: string;
};

export class RemoveMusicFromPlaylistCommand extends Command<void> {
  constructor(public readonly payload: RemoveMusicFromPlaylistCommandPayload) {
    super();
  }
}
