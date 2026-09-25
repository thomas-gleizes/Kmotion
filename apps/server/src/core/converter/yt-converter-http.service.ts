import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

/** Lifecycle of a track in yt-converter v4. */
export type YtTrackStatus = 'pending' | 'processing' | 'ready' | 'failed';

/** A track as returned by yt-converter v4 (`TrackView`). */
export type YtTrack = {
  id: number;
  provider: string;
  externalId: string;
  title: string;
  artist: string;
  channel: string;
  /** Seconds, after clipping. */
  duration: number;
  status: YtTrackStatus;
  error: string | null;
  /** Signed, expiring URLs (relative to the converter), `null` until ready. */
  audioUrl: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
};

export type MediaKind = 'audio' | 'thumbnail';

/** The requested media is not (yet) available on the converter. */
export class ConverterMediaUnavailableError extends Error {
  constructor(converterId: number, kind: MediaKind) {
    super(`No ${kind} available for converter track ${converterId}`);
  }
}

const isNotFound = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 404;

/**
 * HTTP client for yt-converter v4. Conversions are asynchronous: requesting
 * one returns a `pending` track, whose status is then polled.
 */
@Injectable()
export class YtConverterHttpService {
  constructor(private readonly httpService: HttpService) {}

  async fetchTracks(): Promise<YtTrack[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<YtTrack[]>('/tracks'),
    );
    return data;
  }

  async fetchTrack(converterId: number): Promise<YtTrack | null> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<YtTrack>(`/tracks/${converterId}`),
      );
      return data;
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  /**
   * Queues a conversion. `url` may be a bare YouTube id. When an equivalent
   * track already exists it is returned with `created: false`.
   */
  async requestTrack(
    url: string,
  ): Promise<{ track: YtTrack; created: boolean }> {
    const { data } = await firstValueFrom(
      this.httpService.post<{ track: YtTrack; created: boolean }>('/tracks', {
        url,
      }),
    );
    return data;
  }

  async deleteTrack(converterId: number): Promise<void> {
    await firstValueFrom(this.httpService.delete(`/tracks/${converterId}`));
  }

  /**
   * Streams a stored file. File URLs are signed and expire, so they are asked
   * for on every call instead of being stored.
   */
  async fetchMedia(converterId: number, kind: MediaKind) {
    const track = await this.fetchTrack(converterId);
    const url = kind === 'audio' ? track?.audioUrl : track?.thumbnailUrl;

    if (!url) throw new ConverterMediaUnavailableError(converterId, kind);

    return firstValueFrom(
      this.httpService.get(url, { responseType: 'stream' }),
    );
  }
}
