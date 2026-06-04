import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

export type YtTrack = {
  id: number;
  title: string;
  artist: string;
  channel: string;
  duration: number;
  audio: string;
  thumbnail: string;
  isReady: boolean;
  createdAt: Date;
  youtubeId: string;
};

@Injectable()
export class YtConverterHttpService {
  constructor(private readonly httpService: HttpService) {}

  async fetchTracks() {
    return firstValueFrom(
      this.httpService.get<{ tracks: YtTrack[] }>('/tracks'),
    ).then(({ data }) => data.tracks);
  }

  async fetchTrack(trackId: string) {
    return firstValueFrom(
      this.httpService.get<{ track: YtTrack }>(`/${trackId}`),
    ).then(({ data }) => data.track);
  }

  async fetchInfo(mediaId: string, mediaSource: MediaSource) {
    return firstValueFrom(
      this.httpService.get<{ track: YtTrack | null; info: any }>(
        `/${mediaSource}/${mediaId}/info`,
      ),
    ).then(({ data }) => data.track ?? null);
  }

  async deleteTrack(trackId: string) {
    return firstValueFrom(this.httpService.delete(`/${trackId}`));
  }

  async download(mediaId: string, mediaSource: MediaSource) {
    return firstValueFrom(
      this.httpService.post<{ track: YtTrack }>(
        `/${mediaSource}/${mediaId}/download`,
      ),
    ).then(({ data }) => data.track);
  }

  async fetchMedia(target: string) {
    return firstValueFrom(
      this.httpService.get(target, {
        responseType: 'stream',
      }),
    );
  }
}
