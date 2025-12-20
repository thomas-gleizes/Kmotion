import { randomUUID } from 'crypto';

export type MediaSource = 'youtube';

export class Music {
  constructor(
    public readonly id: string,
    public title: string,
    public artist: string,
    public readonly mediaId: string,
    public readonly mediaSource: MediaSource,
    public readonly downloaderId: string | null,
    public duration: number,
    public thumbnail: string,
  ) {}

  static create(
    title: string,
    artist: string,
    mediaId: string,
    mediaSource: MediaSource,
    downloaderId: string,
    duration: number,
    thumbnail: string,
  ) {
    return new Music(
      randomUUID(),
      title,
      artist,
      mediaId,
      mediaSource,
      downloaderId,
      duration,
      thumbnail,
    );
  }
}
