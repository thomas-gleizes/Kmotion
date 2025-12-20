import { Track } from 'src/core/converter/converter-http.service';
import { Injectable } from '@nestjs/common';
import { Music } from 'src/music/domain/music.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class MusicsFactory {
  fromTrack(track: Track, downloaderId: string | null = null): Music {
    return new Music(
      randomUUID(),
      track.title,
      track.artist,
      track.id,
      'youtube',
      downloaderId,
      track.duration,
      track.thumbnail,
    );
  }
}
