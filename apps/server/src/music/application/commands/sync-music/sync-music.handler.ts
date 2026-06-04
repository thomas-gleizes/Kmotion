import { SyncMusicCommand } from 'src/music/application/commands/sync-music/sync-music.command';
import { Inject, Logger } from '@nestjs/common';
import { ConverterServiceAdapter } from 'src/music/infrastructure/adapters/converter-service.adapter';
import {
  MUSIC_WRITE_REPOSITORY_PORT,
  type MusicWriteRepositoryPort,
} from 'src/music/domain/port/music-write-repository.port';
import { CommandHandler, ICommandHandler } from 'src/core/cqrs';

@CommandHandler(SyncMusicCommand)
export class SyncMusicHandler implements ICommandHandler<SyncMusicCommand> {
  private readonly logger = new Logger('SyncMusic');

  constructor(
    private readonly converter: ConverterServiceAdapter,
    @Inject(MUSIC_WRITE_REPOSITORY_PORT)
    private readonly musicWriteRepository: MusicWriteRepositoryPort,
  ) {}

  async execute(): Promise<number> {
    this.logger.debug(`Syncing musics...`);

    const musics = await this.converter.getUnregisterMusics();

    for (const music of musics) {
      await this.musicWriteRepository.save(music);
    }

    return musics.length;
  }
}
