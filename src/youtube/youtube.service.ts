import { Injectable } from '@nestjs/common';
import * as ytdl from 'ytdl-core';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class YoutubeService {
  private static YOUTUBE_BASE_URL = 'https://www.youtube.com/watch?v=';
  private static MUSIC_PATH = process.cwd() + '/resources/musics';

  private _youtubeId: string;
  private _url: string;
  private _info: ytdl.videoInfo;
  private _musicPath: string;

  constructor() {
    this._youtubeId = null;
    this._url = null;
    this._info = null;
    this._musicPath = null;
  }

  public setYoutubeId(youtubeId: string) {
    this._youtubeId = youtubeId;
    this._url = YoutubeService.YOUTUBE_BASE_URL + youtubeId;
    this._musicPath = `${YoutubeService.MUSIC_PATH}/${youtubeId}.mp3`;
  }

  async fetchInfo() {
    console.log('This._youtubeId', this._youtubeId);

    if (!this._youtubeId) throw new Error('youtubeId is not set');
    this._info = await ytdl.getInfo(this._url);
  }

  async download() {
    if (!this._info) await this.fetchInfo();

    return new Promise((resolve, reject) =>
      ffmpeg(
        ytdl.downloadFromInfo(this._info, {
          quality: 'highestaudio',
        }),
      )
        .audioBitrate(this._info.formats[0].audioBitrate)
        .withAudioCodec('libmp3lame')
        .toFormat('mp3')
        .saveToFile(this._musicPath)
        .on('progress', ({ timemark }) => {
          const [hours, minutes, seconds] = timemark.split(':').map(Number);
          const currentTime = hours * 3600 + minutes * 60 + seconds;
          console.log(
            `Progress: ${Math.round(
              (currentTime / +this._info.videoDetails.lengthSeconds) * 100,
            )}%`,
          );
        })
        .on('error', reject)
        .on('end', resolve),
    );
  }
}
