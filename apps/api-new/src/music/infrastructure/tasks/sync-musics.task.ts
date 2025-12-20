import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron } from '@nestjs/schedule';
import { SyncMusicCommand } from 'src/music/application/commands/sync-music/sync-music.command';

@Injectable()
export class SyncMusicsTask {
  private readonly logger = new Logger(SyncMusicsTask.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Cron('* * * * *')
  async execute() {
    this.logger.debug('Syncing musics...');

    await this.commandBus.execute(new SyncMusicCommand());
  }
}
