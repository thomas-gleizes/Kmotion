import { RefreshConversionsHandler } from './refresh-conversions.handler';
import type { MusicWriteRepositoryPort } from 'src/music/domain/port/music-write-repository.port';
import type {
  Conversion,
  ConverterServicePort,
} from 'src/music/domain/port/converter-service.port';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { Music } from 'src/music/domain/music.entity';

const pendingMusic = (id: string, converterId: number) =>
  new Music(
    id,
    'Song',
    'Artist',
    converterId,
    'media',
    MediaSource.youtube,
    null,
    0,
    '',
    '',
    new Date(),
    ConversionStatus.pending,
  );

const conversion = (status: ConversionStatus): Conversion => ({
  converterId: 1,
  mediaId: 'media',
  title: 'Song',
  artist: 'Artist',
  duration: 182,
  status,
});

describe('RefreshConversionsHandler', () => {
  let writeRepository: jest.Mocked<
    Pick<MusicWriteRepositoryPort, 'save' | 'findByConversionStatus'>
  >;
  let converter: jest.Mocked<Pick<ConverterServicePort, 'getConversion'>>;
  let handler: RefreshConversionsHandler;

  beforeEach(() => {
    writeRepository = { save: jest.fn(), findByConversionStatus: jest.fn() };
    converter = { getConversion: jest.fn() };
    handler = new RefreshConversionsHandler(
      writeRepository as unknown as MusicWriteRepositoryPort,
      converter as unknown as ConverterServicePort,
    );
  });

  it('updates finished conversions and leaves running ones alone', async () => {
    const ready = pendingMusic('ready', 1);
    const running = pendingMusic('running', 2);
    const failed = pendingMusic('failed', 3);
    writeRepository.findByConversionStatus.mockResolvedValue([
      ready,
      running,
      failed,
    ]);
    converter.getConversion.mockImplementation((id) =>
      Promise.resolve(
        conversion(
          id === 1
            ? ConversionStatus.ready
            : id === 2
              ? ConversionStatus.pending
              : ConversionStatus.failed,
        ),
      ),
    );

    await expect(handler.execute()).resolves.toBe(2);

    expect(writeRepository.findByConversionStatus).toHaveBeenCalledWith(
      ConversionStatus.pending,
    );
    expect(ready).toMatchObject({ conversionStatus: 'ready', duration: 182 });
    expect(failed.conversionStatus).toBe(ConversionStatus.failed);
    expect(writeRepository.save).toHaveBeenCalledTimes(2);
    expect(writeRepository.save).not.toHaveBeenCalledWith(running);
  });

  it('marks conversions the converter no longer knows as failed', async () => {
    const music = pendingMusic('gone', 1);
    writeRepository.findByConversionStatus.mockResolvedValue([music]);
    converter.getConversion.mockResolvedValue(null);

    await handler.execute();

    expect(music.conversionStatus).toBe(ConversionStatus.failed);
  });

  it('keeps going when one conversion cannot be checked', async () => {
    const broken = pendingMusic('broken', 1);
    const ready = pendingMusic('ready', 2);
    writeRepository.findByConversionStatus.mockResolvedValue([broken, ready]);
    converter.getConversion
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce(conversion(ConversionStatus.ready));

    await expect(handler.execute()).resolves.toBe(1);
    expect(broken.conversionStatus).toBe(ConversionStatus.pending);
    expect(ready.conversionStatus).toBe(ConversionStatus.ready);
  });
});
