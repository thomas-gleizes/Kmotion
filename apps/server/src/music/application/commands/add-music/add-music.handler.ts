import { AddMusicCommand } from 'src/music/application/commands/add-music/add-music.command';
import {
  MUSIC_WRITE_REPOSITORY_PORT,
  type MusicWriteRepositoryPort,
} from 'src/music/domain/port/music-write-repository.port';
import {
  MUSIC_READ_REPOSITORY_PORT,
  type MusicReadRepositoryPort,
} from 'src/music/application/port/music-read-repository.port';
import { Inject } from '@nestjs/common';
import {
  CONVERTER_SERVICE_PORT,
  type ConverterServicePort,
} from 'src/music/domain/port/converter-service.port';
import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { Music } from 'src/music/domain/music.entity';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Starts the conversion of a media and registers the music right away, as
 * `pending`. RefreshConversions marks it ready once the converter is done.
 */
@CommandHandler(AddMusicCommand)
export class AddMusicHandler implements ICommandHandler<AddMusicCommand> {
  constructor(
    @Inject(MUSIC_WRITE_REPOSITORY_PORT)
    private readonly musicRepository: MusicWriteRepositoryPort,
    @Inject(MUSIC_READ_REPOSITORY_PORT)
    private readonly musicReadRepository: MusicReadRepositoryPort,
    @Inject(CONVERTER_SERVICE_PORT)
    private readonly converterService: ConverterServicePort,
  ) {}

  async execute({ payload }: AddMusicCommand): Promise<string> {
    const conversion = await this.converterService.requestConversion(
      payload.mediaId,
      payload.mediaSource,
    );

    // The converter deduplicates: an equivalent request returns its track.
    // Messages are matched by the browser extension, keep them stable.
    if (await this.musicReadRepository.exist(conversion.converterId)) {
      throw new DomainException(
        conversion.status === ConversionStatus.ready
          ? 'Media is already downloaded'
          : 'Track is downloading',
      );
    }

    const music = Music.create(
      conversion.title,
      conversion.artist,
      conversion.converterId,
      conversion.mediaId,
      payload.mediaSource,
      payload.userId,
      conversion.duration,
      '',
      '',
      new Date(),
      conversion.status,
    );

    await this.musicRepository.save(music);

    return music.id;
  }
}
