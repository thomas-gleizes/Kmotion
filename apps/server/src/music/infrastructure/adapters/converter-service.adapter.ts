import { YtConverterHttpService } from 'src/core/converter/yt-converter-http.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  MUSIC_READ_REPOSITORY_PORT,
  type MusicReadRepositoryPort,
} from 'src/music/application/port/music-read-repository.port';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { ConverterServicePort } from 'src/music/domain/port/converter-service.port';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { MusicsFactory } from 'src/music/infrastructure/factories/musics.factory';
import { Music } from 'src/music/domain/music.entity';

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
        const isExist = await this.musicReadRepository.exist(track.id);

        if (isExist) continue;

        musics.push(this.musicFactory.fromTrack(track));
      }

      return musics;
    } catch (error) {
      this.logger.error('Failed to fetch tracks', error.message);
      throw new DomainException('Error while fetching tracks');
    }
  }

  async downloadMusic(
    mediaId: string,
    mediaSource: MediaSource,
    downloaderId: string,
  ): Promise<Music> {
    this.logger.debug(`Downloading music ${mediaId} from ${mediaSource}`);
    const track = await this.converterHttpService.fetchInfo(
      mediaId,
      mediaSource,
    );

    if (track) {
      if (track.isReady) {
        throw new DomainException('Media is already downloaded');
      }

      throw new DomainException('Track is downloading');
    }

    try {
      const downloadedTrack = await this.converterHttpService.download(
        mediaId,
        mediaSource,
      );

      this.logger.debug(`Downloaded track: ${JSON.stringify(downloadedTrack)}`);
      return this.musicFactory.fromTrack(downloadedTrack, downloaderId);
    } catch (error) {
      this.logger.error('Failed to download media', error);
      throw new DomainException('Error while downloading track');
    }
  }
}
