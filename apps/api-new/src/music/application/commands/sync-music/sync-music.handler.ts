import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SyncMusicCommand } from 'src/music/application/commands/sync-music/sync-music.command';

@CommandHandler(SyncMusicCommand)
export class SyncMusicHandler implements ICommandHandler<SyncMusicCommand> {
  async execute(command: SyncMusicCommand): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
