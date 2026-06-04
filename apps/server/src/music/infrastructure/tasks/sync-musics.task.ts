import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron } from '@nestjs/schedule';
import { SyncMusicCommand } from 'src/music/application/commands/sync-music/sync-music.command';
import { ca } from 'zod/locales';

@Injectable()
export class SyncMusicsTask implements OnApplicationBootstrap {
  private readonly logger = new Logger(SyncMusicsTask.name);
  private isRunning: boolean = false;

  constructor(private readonly commandBus: CommandBus) {}

  @Cron('0 5 * * *')
  async onApplicationBootstrap() {
    try {
      await this.sync();
    } catch (error) {
      this.logger.error('Failed to sync musics', error);
    }
  }

  private async sync() {
    if (this.isRunning) return;

    this.logger.log('Syncing musics...');

    this.isRunning = true;
    const added = await this.commandBus.execute(
      new SyncMusicCommand(undefined),
    );
    this.isRunning = false;

    this.logger.log(`Synced ${added} musics`);
  }
}
