import { ICommand } from '@nestjs/cqrs';

export class RemoveMusicFromPlaylistCommand implements ICommand {
  constructor(
    public readonly playlistId: string,
    public readonly userId: string,
    public readonly musicId: string,
  ) {}
}
