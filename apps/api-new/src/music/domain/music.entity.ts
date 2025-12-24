import { randomUUID } from 'crypto';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

export class Music {
  constructor(
    public readonly id: string,
    public title: string,
    public artist: string,
    public readonly converterId: number,
    public readonly mediaId: string,
    public readonly mediaSource: MediaSource,
    public readonly downloaderId: string | null,
    public duration: number,
    public thumbnail: string,
    public audio: string,
  ) {}

  static create(
    title: string,
    artist: string,
    converterId: number,
    mediaId: string,
    mediaSource: MediaSource,
    downloaderId: string,
    duration: number,
    thumbnail: string,
    audio: string,
  ) {
    return new Music(
      randomUUID(),
      title,
      artist,
      converterId,
      mediaId,
      mediaSource,
      downloaderId,
      duration,
      thumbnail,
      audio,
    );
  }
}
