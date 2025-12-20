import { ICommand } from '@nestjs/cqrs';
import { MediaSource } from 'src/music/domain/music.entity';

export class AddMusicCommand implements ICommand {
  constructor(
    public readonly mediaId: string,
    public readonly mediaSource: MediaSource,
    public readonly userId: string,
  ) {}
}
