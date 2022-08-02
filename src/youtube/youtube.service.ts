import * as fs from 'node:fs/promises';
import * as ytdl from 'ytdl-core';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmetadata from 'ffmetadata';

export default class YoutubeService {
  private static YOUTUBE_URL = 'https://www.youtube.com/watch?v=';
  static MUSIC_PATH = `${process.cwd()}/resources/musics/`;

  private _youtubeId: string;
  private _info: ytdl.videoInfo;
  private _path: string;
  private _url: string;

  private _title: string;

  constructor(youtubeId: string) {
    this._youtubeId = youtubeId;
    this._url = YoutubeService.YOUTUBE_URL + youtubeId;
    this._path = YoutubeService.MUSIC_PATH + youtubeId;
    this._info = null;
  }

  public async getVideoDetails() {
    await this.fetchInfo();
    return this._info.videoDetails;
  }

  public async download(): Promise<void> {
    await this.fetchInfo();
    await Promise.all([this.downloadCover(), this.downloadMusic()]);
    return this.mergeCoverAndMusic();
  }

  private async fetchInfo() {
    if (!this._info) {
      this._info = await ytdl.getInfo(this._url);
      this._title = this._info.videoDetails.title.replace(/\([lL]yrics\)/, '');
    }
  }

  private createDirectory() {
    return fs.mkdir(this._path, { recursive: true });
  }

  private mergeCoverAndMusic(): Promise<void> {
    const metadata = {
      artist:
        this._info.videoDetails.media.artist ||
        this._info.videoDetails.author.name,
      title: this._info.videoDetails.media.song || this._title,
      date: new Date().getFullYear(),
    };

    return new Promise<void>((resolve, reject) => {
      ffmetadata.write(
        `${this._path}/${this._title}.mp3`,
        { ...metadata },
        { attachments: [`${this._path}/cover.jpg`] },
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    }).then(() => fs.unlink(`${this._path}/cover.jpg`));
  }

  private async downloadMusic() {
    await this.createDirectory();

    return new Promise((resolve, reject) =>
      ffmpeg(
        ytdl.downloadFromInfo(this._info, {
          quality: 'highestaudio',
          filter: 'audioonly',
        })
      )
        .audioBitrate(this._info.formats[0].audioBitrate)
        .withAudioCodec('libmp3lame')
        .toFormat('mp3')
        .saveToFile(`${this._path}/${this._title}.mp3`)
        .on('progress', ({ timemark }) => {
          const [hours, minutes, seconds] = timemark.split(':').map(Number);
          const duration = hours * 3600 + minutes * 60 + seconds;
          console.log(
            `Progress: (${timemark}) ${Math.round(
              (duration / +this._info.videoDetails.lengthSeconds) * 100
            )}%`
          );
        })
        .on('error', reject)
        .on('end', resolve)
    ).then(() => console.log(`FINFISHED DOWNLOADING :  ${this._title}`));
  }

  private async downloadCover() {
    const coverUrl =
      this._info.videoDetails.thumbnails[
        this._info.videoDetails.thumbnails.length - 1
      ].url;

    const buffer = await fetch(coverUrl).then((response) =>
      response.arrayBuffer()
    );

    await fs.writeFile(`${this._path}/cover.webp`, Buffer.from(buffer));

    return new Promise((resolve, reject) =>
      ffmpeg({ source: `${this._path}/cover.webp` })
        .output(`${this._path}/cover.jpg`)
        .on('end', resolve)
        .on('error', reject)
        .run()
    ).finally(() => fs.unlink(`${this._path}/cover.webp`));
  }

  get title(): string {
    return this._title;
  }
}
