import { ICommand } from '@nestjs/cqrs';

export class AddMusicToPlaylistCommand implements ICommand {
  constructor(
    public readonly playlistId: string,
    public readonly userId: string,
    public readonly musicId: string,
    public readonly position: number,
  ) {}
}
