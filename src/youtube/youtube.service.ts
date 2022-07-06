import { Injectable } from '@nestjs/common';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class YoutubeService {
  private static YOUTUBE_BASE_URL = 'https://www.youtube.com/watch?v=';
  private static MUSIC_PATH = process.cwd() + '/resources/musics';

  private _youtubeId: string;
  private _url: string;
  private _info: ytdl.videoInfo;
  private _musicPath: string;

  constructor(youtube_id: string) {
    this._youtubeId = youtube_id;
    this._url = YoutubeService.YOUTUBE_BASE_URL + youtube_id;
    this._musicPath = YoutubeService.MUSIC_PATH + '/' + youtube_id + '.mp3';
    this._info = null;
  }

  async fetchInfo() {
    this._info = await ytdl.getInfo(this._youtubeId);
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
        .on('progress', ({ timemark }) => console.log('progress : ', timemark))
        .on('error', reject)
        .on('end', resolve),
    );
  }
}
