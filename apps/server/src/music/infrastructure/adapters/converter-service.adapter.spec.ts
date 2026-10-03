import { AxiosError, AxiosHeaders } from 'axios';
import type {
  YtConverterHttpService,
  YtErrorBody,
  YtTrack,
} from 'src/core/converter/yt-converter-http.service';
import type { MusicReadRepositoryPort } from 'src/music/application/port/music-read-repository.port';
import { ConverterServiceAdapter } from 'src/music/infrastructure/adapters/converter-service.adapter';
import { toConversionStatus } from 'src/music/infrastructure/adapters/converter-mapping';
import { MusicsFactory } from 'src/music/infrastructure/factories/musics.factory';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

const track = (overrides: Partial<YtTrack> = {}): YtTrack => ({
  id: 7,
  provider: 'youtube',
  externalId: 'dQw4w9WgXcQ',
  title: 'Song',
  artist: 'Artist',
  channel: 'Channel',
  duration: 182.4,
  status: 'pending',
  error: null,
  audioUrl: null,
  thumbnailUrl: null,
  createdAt: '2026-09-25T00:00:00.000Z',
  ...overrides,
});

const converterError = (status: number, data: YtErrorBody) =>
  new AxiosError('Request failed', String(status), undefined, undefined, {
    status,
    data,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('ConverterServiceAdapter', () => {
  let http: jest.Mocked<
    Pick<
      YtConverterHttpService,
      | 'fetchTracks'
      | 'fetchTrack'
      | 'requestTrack'
      | 'previewSource'
      | 'retryTrack'
    >
  >;
  let readRepository: jest.Mocked<Pick<MusicReadRepositoryPort, 'exist'>>;
  let adapter: ConverterServiceAdapter;

  beforeEach(() => {
    http = {
      fetchTracks: jest.fn(),
      fetchTrack: jest.fn(),
      requestTrack: jest.fn(),
      previewSource: jest.fn(),
      retryTrack: jest.fn(),
    };
    readRepository = { exist: jest.fn() };
    adapter = new ConverterServiceAdapter(
      readRepository as unknown as MusicReadRepositoryPort,
      http as unknown as YtConverterHttpService,
      new MusicsFactory(),
    );
  });

  it('maps converter statuses', () => {
    expect(toConversionStatus('pending')).toBe(ConversionStatus.pending);
    expect(toConversionStatus('processing')).toBe(ConversionStatus.processing);
    expect(toConversionStatus('ready')).toBe(ConversionStatus.ready);
    expect(toConversionStatus('failed')).toBe(ConversionStatus.failed);
  });

  it('maps a requested conversion', async () => {
    http.requestTrack.mockResolvedValue({ track: track(), created: true });

    await expect(
      adapter.requestConversion('dQw4w9WgXcQ', MediaSource.youtube),
    ).resolves.toEqual({
      converterId: 7,
      mediaId: 'dQw4w9WgXcQ',
      title: 'Song',
      artist: 'Artist',
      duration: 182,
      status: ConversionStatus.pending,
      error: null,
    });
  });

  it('wraps converter failures in a DomainException', async () => {
    http.requestTrack.mockRejectedValue(new Error('502'));

    await expect(
      adapter.requestConversion('x', MediaSource.youtube),
    ).rejects.toBeInstanceOf(DomainException);
  });

  it('forwards the clip to the converter', async () => {
    http.requestTrack.mockResolvedValue({ track: track(), created: true });

    await adapter.requestConversion('x', MediaSource.youtube, { end: 120 });

    expect(http.requestTrack).toHaveBeenCalledWith('x', { end: 120 });
  });

  it.each([
    [
      converterError(400, { _tag: 'InvalidClip', reason: 'end is too far' }),
      'Invalid clip: end is too far',
    ],
    [
      converterError(422, { _tag: 'DurationLimitExceeded', limit: 1800 }),
      'Media is longer than the allowed 30 minutes',
    ],
    [converterError(500, {}), 'Error while downloading track'],
  ])('explains rejected conversions (%#)', async (error, message) => {
    http.requestTrack.mockRejectedValue(error);

    await expect(
      adapter.requestConversion('x', MediaSource.youtube),
    ).rejects.toThrow(message);
  });

  it('maps a media preview', async () => {
    http.previewSource.mockResolvedValue({
      info: {
        ref: { provider: 'youtube', externalId: 'dQw4w9WgXcQ' },
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Song',
        channel: 'Channel',
        duration: 212,
        thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hq.jpg',
      },
      maxDuration: 1800,
      clip: { start: 0, end: 200, duration: 200, isFull: false },
      exceedsLimit: false,
    });

    await expect(
      adapter.previewMedia('dQw4w9WgXcQ', MediaSource.youtube, { end: 200 }),
    ).resolves.toEqual({
      title: 'Song',
      channel: 'Channel',
      duration: 212,
      thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hq.jpg',
      maxDuration: 1800,
      clip: { start: 0, end: 200, duration: 200 },
      exceedsLimit: false,
    });
    expect(http.previewSource).toHaveBeenCalledWith('dQw4w9WgXcQ', {
      end: 200,
    });
  });

  it('wraps preview failures in a DomainException', async () => {
    http.previewSource.mockRejectedValue(
      converterError(502, { _tag: 'SourceUnavailable', reason: 'private' }),
    );

    await expect(
      adapter.previewMedia('x', MediaSource.youtube),
    ).rejects.toThrow(new DomainException('Media is unavailable'));
  });

  it('retries a failed conversion', async () => {
    http.retryTrack.mockResolvedValue(track());

    await expect(adapter.retryConversion(7)).resolves.toMatchObject({
      converterId: 7,
      status: ConversionStatus.pending,
      error: null,
    });
    expect(http.retryTrack).toHaveBeenCalledWith(7);
  });

  it('explains a retry of a conversion the converter no longer has', async () => {
    http.retryTrack.mockRejectedValue(converterError(404, {}));

    await expect(adapter.retryConversion(7)).rejects.toThrow(
      new DomainException(
        'Conversion no longer exists on the converter, delete it and convert again',
      ),
    );
  });

  it('returns null for a conversion the converter no longer has', async () => {
    http.fetchTrack.mockResolvedValue(null);
    await expect(adapter.getConversion(7)).resolves.toBeNull();
  });

  it('only registers unknown tracks from supported sources', async () => {
    http.fetchTracks.mockResolvedValue([
      track({ id: 1, status: 'ready' }),
      track({ id: 2 }),
      track({ id: 3, provider: 'soundcloud' }),
    ]);
    readRepository.exist.mockImplementation((id) => Promise.resolve(id === 2));

    const musics = await adapter.getUnregisterMusics();

    expect(musics).toHaveLength(1);
    expect(musics[0]).toMatchObject({
      converterId: 1,
      mediaId: 'dQw4w9WgXcQ',
      mediaSource: MediaSource.youtube,
      conversionStatus: ConversionStatus.ready,
      audio: '',
    });
  });
});
