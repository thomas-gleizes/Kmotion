import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { RefreshConversionsCommand } from 'src/music/application/commands/refresh-conversions/refresh-conversions.command';
import {
  MUSIC_WRITE_REPOSITORY_PORT,
  type MusicWriteRepositoryPort,
} from 'src/music/domain/port/music-write-repository.port';
import {
  CONVERTER_SERVICE_PORT,
  type ConverterServicePort,
} from 'src/music/domain/port/converter-service.port';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';

@CommandHandler(RefreshConversionsCommand)
export class RefreshConversionsHandler implements ICommandHandler<RefreshConversionsCommand> {
  private readonly logger = new Logger('RefreshConversions');

  constructor(
    @Inject(MUSIC_WRITE_REPOSITORY_PORT)
    private readonly musicWriteRepository: MusicWriteRepositoryPort,
    @Inject(CONVERTER_SERVICE_PORT)
    private readonly converterService: ConverterServicePort,
  ) {}

  async execute(): Promise<number> {
    const pending = await this.musicWriteRepository.findByConversionStatus(
      ConversionStatus.pending,
    );
    let changed = 0;

    for (const music of pending) {
      try {
        const conversion = await this.converterService.getConversion(
          music.converterId,
        );
        // Deleted on the converter side: it will never complete.
        const status = conversion?.status ?? ConversionStatus.failed;

        if (status === music.conversionStatus) continue;

        music.conversionStatus = status;
        if (conversion) music.duration = conversion.duration;
        await this.musicWriteRepository.save(music);
        changed++;
      } catch (error) {
        // One unreachable conversion must not block the others.
        this.logger.warn(
          `Could not refresh music ${music.id}: ${(error as Error).message}`,
        );
      }
    }

    return changed;
  }
}
