import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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
}
