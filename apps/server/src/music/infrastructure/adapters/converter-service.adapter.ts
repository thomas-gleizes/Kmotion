import { YtConverterHttpService } from 'src/core/converter/yt-converter-http.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  MUSIC_READ_REPOSITORY_PORT,
  type MusicReadRepositoryPort,
} from 'src/music/application/port/music-read-repository.port';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import {
  type Conversion,
  ConverterServicePort,
  type MediaPreview,
} from 'src/music/domain/port/converter-service.port';
import type { Clip } from 'src/music/domain/values-object/clip.value-object';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { MusicsFactory } from 'src/music/infrastructure/factories/musics.factory';
import { Music } from 'src/music/domain/music.entity';
import {
  describeConverterError,
  toConversion,
  toMediaPreview,
} from 'src/music/infrastructure/adapters/converter-mapping';

const isSupportedSource = (provider: string) =>
  (Object.values(MediaSource) as string[]).includes(provider);

@Injectable()
export class ConverterServiceAdapter implements ConverterServicePort {
  private readonly logger = new Logger('ConverterService');

  constructor(
    @Inject(MUSIC_READ_REPOSITORY_PORT)
    private readonly musicReadRepository: MusicReadRepositoryPort,
    private readonly converterHttpService: YtConverterHttpService,
    private readonly musicFactory: MusicsFactory,
  ) {}

  async getUnregisterMusics() {
    try {
      const tracks = await this.converterHttpService.fetchTracks();

      const musics: Music[] = [];

      for (const track of tracks) {
        if (!isSupportedSource(track.provider)) continue;

        const isExist = await this.musicReadRepository.exist(track.id);

        if (isExist) continue;

        musics.push(this.musicFactory.fromTrack(track));
      }

      return musics;
    } catch (error) {
      this.logger.error('Failed to fetch tracks', (error as Error).message);
      throw new DomainException('Error while fetching tracks');
    }
  }

  async requestConversion(
    mediaId: string,
    mediaSource: MediaSource,
    clip?: Clip,
  ): Promise<Conversion> {
    this.logger.debug(
      `Requesting conversion of ${mediaId} from ${mediaSource}`,
    );

    try {
      const { track } = await this.converterHttpService.requestTrack(
        mediaId,
        clip,
      );
      return toConversion(track);
    } catch (error) {
      this.logger.error('Failed to request conversion', error);
      throw new DomainException(
        describeConverterError(error) ?? 'Error while downloading track',
      );
    }
  }

  async previewMedia(
    mediaId: string,
    mediaSource: MediaSource,
    clip?: Clip,
  ): Promise<MediaPreview> {
    try {
      const preview = await this.converterHttpService.previewSource(
        mediaId,
        clip,
      );
      return toMediaPreview(preview);
    } catch (error) {
      this.logger.error(
        `Failed to preview ${mediaId} from ${mediaSource}`,
        error,
      );
      throw new DomainException(
        describeConverterError(error) ?? 'Error while fetching media details',
      );
    }
  }

  async getConversion(converterId: number): Promise<Conversion | null> {
    const track = await this.converterHttpService.fetchTrack(converterId);
    return track ? toConversion(track) : null;
  }
}
