import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MediaSource } from 'src/music/domain/music.entity';

export type Track = {
  id: string;
  title: string;
  artist: string;
  channel: string;
  duration: number;
  audio: string;
  thumbnail: string;
  isReady: boolean;
  createdAt: Date;
};

@Injectable()
export class ConverterHttpService {
  constructor(private readonly httpService: HttpService) {}

  async fetchTracks() {
    return firstValueFrom(
      this.httpService.get<{ tracks: Track[] }>('/tracks'),
    ).then(({ data }) => data.tracks);
  }

  async fetchTrack(trackId: string) {
    return firstValueFrom(
      this.httpService.get<{ track: Track }>(`/${trackId}`),
    ).then(({ data }) => data.track);
  }

  async fetchInfo(mediaId: string, mediaSource: MediaSource) {
    return firstValueFrom(
      this.httpService.get<{ track: Track | null; info: any }>(
        `/${mediaSource}/${mediaId}/info`,
      ),
    ).then(({ data }) => data.track ?? null);
  }

  async deleteTrack(trackId: string) {
    return firstValueFrom(this.httpService.delete(`/${trackId}`));
  }

  async download(mediaId: string, mediaSource: MediaSource) {
    return firstValueFrom(
      this.httpService.post<{ track: Track }>(
        `/${mediaSource}/${mediaId}/download`,
      ),
    ).then(({ data }) => data.track);
  }

  async fetchThumbnail(trackId: string) {
    return firstValueFrom(
      this.httpService.get(`/static/${trackId}/thumbnail`, {
        responseType: 'stream',
      }),
    );
  }

  async fetchAudio(trackId: string) {
    return firstValueFrom(
      this.httpService.get(`/static/${trackId}/audio`, {
        responseType: 'stream',
      }),
    );
  }
}
