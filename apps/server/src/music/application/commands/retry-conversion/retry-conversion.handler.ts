import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { RetryConversionCommand } from 'src/music/application/commands/retry-conversion/retry-conversion.command';
import {
  MUSIC_WRITE_REPOSITORY_PORT,
  type MusicWriteRepositoryPort,
} from 'src/music/domain/port/music-write-repository.port';
import {
  CONVERTER_SERVICE_PORT,
  type ConverterServicePort,
} from 'src/music/domain/port/converter-service.port';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

/**
 * Queues a failed conversion again on the converter, which keeps its clip.
 * RefreshConversions then follows it like a new one.
 */
@CommandHandler(RetryConversionCommand)
export class RetryConversionHandler implements ICommandHandler<RetryConversionCommand> {
  constructor(
    @Inject(MUSIC_WRITE_REPOSITORY_PORT)
    private readonly musicWriteRepository: MusicWriteRepositoryPort,
    @Inject(CONVERTER_SERVICE_PORT)
    private readonly converterService: ConverterServicePort,
  ) {}

  async execute({ payload }: RetryConversionCommand): Promise<void> {
    const music = await this.musicWriteRepository.findById(payload.musicId);

    if (!music) throw new RessourceNotFoundException('Music');
    if (music.conversionStatus !== ConversionStatus.failed) {
      throw new DomainException('Only failed conversions can be retried');
    }

    const conversion = await this.converterService.retryConversion(
      music.converterId,
    );

    music.conversionStatus = conversion.status;
    music.conversionError = conversion.error;
    await this.musicWriteRepository.save(music);
  }
}
