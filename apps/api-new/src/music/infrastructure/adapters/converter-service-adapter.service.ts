import { ConverterHttpService } from 'src/core/converter/converter-http.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  MUSIC_READ_REPOSITORY_PORT,
  type MusicReadRepositoryPort,
} from 'src/music/application/port/music-read-repository.port';
import { Music } from 'src/music/domain/music.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ConverterServiceAdapter {
  constructor(
    @Inject(MUSIC_READ_REPOSITORY_PORT)
    private readonly musicReadRepository: MusicReadRepositoryPort,
    private readonly converterHttpService: ConverterHttpService,
  ) {}

  async getUnregisterMusics() {
    const tracks = await this.converterHttpService.fetchTracks();

    const musics: Music[] = [];

    for (const track of tracks) {
      const isExist = await this.musicReadRepository.exist(track.id, 'youtube');

      if (isExist) continue;

      musics.push(
        new Music(
          randomUUID(),
          track.title,
          track.artist,
          track.id,
          'youtube',
          null,
          track.duration,
          track.thumbnail,
        ),
      );
    }

    return musics;
  }
}
