import { YtTrack } from 'src/core/converter/yt-converter-http.service';
import { Injectable } from '@nestjs/common';
import { Music } from 'src/music/domain/music.entity';
import { randomUUID } from 'crypto';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { toConversionStatus } from 'src/music/infrastructure/adapters/converter-mapping';

@Injectable()
export class MusicsFactory {
  fromTrack(track: YtTrack, downloaderId: string | null = null): Music {
    return new Music(
      randomUUID(),
      track.title,
      track.artist,
      track.id,
      track.externalId,
      track.provider as MediaSource,
      downloaderId,
      Math.round(track.duration),
      // Media is fetched from the converter by id: no path to store.
      '',
      '',
      track.createdAt ? new Date(track.createdAt) : new Date(),
      toConversionStatus(track.status),
    );
  }
}
