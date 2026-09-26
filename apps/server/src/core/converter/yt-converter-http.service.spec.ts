import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import {
  ConverterMediaUnavailableError,
  YtConverterHttpService,
  type YtTrack,
} from 'src/core/converter/yt-converter-http.service';

const track = (overrides: Partial<YtTrack> = {}): YtTrack => ({
  id: 7,
  provider: 'youtube',
  externalId: 'dQw4w9WgXcQ',
  title: 'Song',
  artist: 'Artist',
  channel: 'Channel',
  duration: 212,
  status: 'ready',
  error: null,
  audioUrl: '/files/1?expires=1&signature=a',
  thumbnailUrl: '/files/2?expires=1&signature=b',
  createdAt: '2026-09-25T00:00:00.000Z',
  ...overrides,
});

const response = <T>(data: T) => of({ data } as AxiosResponse<T>);

const notFound = () =>
  throwError(
    () =>
      new AxiosError('Not Found', '404', undefined, undefined, {
        status: 404,
        data: {},
        statusText: 'Not Found',
        headers: {},
        config: { headers: new AxiosHeaders() },
      }),
  );

describe('YtConverterHttpService', () => {
  let http: jest.Mocked<Pick<HttpService, 'get' | 'post' | 'delete'>>;
  let service: YtConverterHttpService;

  beforeEach(() => {
    http = { get: jest.fn(), post: jest.fn(), delete: jest.fn() };
    service = new YtConverterHttpService(http as unknown as HttpService);
  });

  it('requests a conversion with the media id as url', async () => {
    http.post.mockReturnValue(
      response({ track: track({ status: 'pending' }), created: true }),
    );

    const result = await service.requestTrack('dQw4w9WgXcQ');

    expect(http.post).toHaveBeenCalledWith('/tracks', { url: 'dQw4w9WgXcQ' });
    expect(result).toMatchObject({ created: true, track: { id: 7 } });
  });

  it('sends the clip along with the conversion request', async () => {
    http.post.mockReturnValue(
      response({ track: track({ status: 'pending' }), created: true }),
    );

    await service.requestTrack('dQw4w9WgXcQ', { start: 12, end: 200 });

    expect(http.post).toHaveBeenCalledWith('/tracks', {
      url: 'dQw4w9WgXcQ',
      clip: { start: 12, end: 200 },
    });
  });

  it('previews a source with the clip bounds as query parameters', async () => {
    const preview = { maxDuration: 1800 };
    http.get.mockReturnValue(response(preview));

    await expect(
      service.previewSource('dQw4w9WgXcQ', { end: 200 }),
    ).resolves.toBe(preview);
    expect(http.get).toHaveBeenCalledWith('/sources/preview', {
      params: { url: 'dQw4w9WgXcQ', start: undefined, end: 200 },
    });
  });

  it('returns null for an unknown track and rethrows other errors', async () => {
    http.get.mockReturnValueOnce(notFound());
    await expect(service.fetchTrack(7)).resolves.toBeNull();

    http.get.mockReturnValueOnce(throwError(() => new Error('boom')));
    await expect(service.fetchTrack(7)).rejects.toThrow('boom');
  });

  it('streams media from the freshly signed url', async () => {
    http.get
      .mockReturnValueOnce(response(track()))
      .mockReturnValueOnce(response('stream'));

    const media = await service.fetchMedia(7, 'thumbnail');

    expect(http.get).toHaveBeenNthCalledWith(1, '/tracks/7');
    expect(http.get).toHaveBeenNthCalledWith(
      2,
      '/files/2?expires=1&signature=b',
      { responseType: 'stream' },
    );
    expect(media.data).toBe('stream');
  });

  it('refuses media that is not converted yet', async () => {
    http.get.mockReturnValue(
      response(track({ status: 'processing', audioUrl: null })),
    );

    await expect(service.fetchMedia(7, 'audio')).rejects.toBeInstanceOf(
      ConverterMediaUnavailableError,
    );
  });
});
