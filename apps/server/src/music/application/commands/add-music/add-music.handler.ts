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
    // One music per media: the converter keys tracks on the clip too, so a
    // different clip of a known media would otherwise become a second music.
    const existing = await this.musicReadRepository.findByMediaId(
      payload.mediaId,
      payload.mediaSource,
    );
    if (existing) throw this.alreadyInLibrary(existing.conversionStatus);

    const conversion = await this.converterService.requestConversion(
      payload.mediaId,
      payload.mediaSource,
      payload.clip,
    );

    // The converter deduplicates: an equivalent request returns its track.
    if (await this.musicReadRepository.exist(conversion.converterId)) {
      throw this.alreadyInLibrary(conversion.status);
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

  // Messages are matched by the browser extension, keep them stable.
  private alreadyInLibrary(status: ConversionStatus) {
    return new DomainException(
      status === ConversionStatus.ready
        ? 'Media is already downloaded'
        : 'Track is downloading',
    );
  }
}
