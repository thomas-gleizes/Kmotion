import { YtTrack } from 'src/core/converter/yt-converter-http.service';
import { Injectable } from '@nestjs/common';
import { Music } from 'src/music/domain/music.entity';
import { randomUUID } from 'crypto';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

@Injectable()
export class MusicsFactory {
  fromTrack(track: YtTrack, downloaderId: string | null = null): Music {
    return new Music(
      randomUUID(),
      track.title,
      track.artist,
      track.id,
      track.youtubeId,
      MediaSource.youtube,
      downloaderId,
      track.duration,
      track.thumbnail,
      track.audio,
      track.createdAt ? new Date(track.createdAt) : new Date(),
    );
  }
}
