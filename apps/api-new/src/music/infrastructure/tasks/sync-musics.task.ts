import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron } from '@nestjs/schedule';
import { SyncMusicCommand } from 'src/music/application/commands/sync-music/sync-music.command';

@Injectable()
export class SyncMusicsTask implements OnApplicationBootstrap {
  private readonly logger = new Logger(SyncMusicsTask.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Cron('* * * * *')
  async onApplicationBootstrap() {
    this.logger.log('Syncing musics...');

    const added = await this.commandBus.execute(new SyncMusicCommand());

    this.logger.log(`Synced ${added} musics`);
  }
}
