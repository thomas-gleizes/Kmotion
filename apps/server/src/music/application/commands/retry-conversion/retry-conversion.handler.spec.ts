import { RetryConversionHandler } from './retry-conversion.handler';
import { RetryConversionCommand } from './retry-conversion.command';
import type { MusicWriteRepositoryPort } from 'src/music/domain/port/music-write-repository.port';
import type { ConverterServicePort } from 'src/music/domain/port/converter-service.port';
import { Music } from 'src/music/domain/music.entity';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

const music = (status: ConversionStatus) =>
  new Music(
    'music-1',
    'Song',
    'Artist',
    7,
    'media',
    MediaSource.youtube,
    null,
    0,
    '',
    '',
    new Date(),
    status,
    status === ConversionStatus.failed ? 'Video unavailable' : null,
  );

describe('RetryConversionHandler', () => {
  let repository: jest.Mocked<
    Pick<MusicWriteRepositoryPort, 'findById' | 'save'>
  >;
  let converter: jest.Mocked<Pick<ConverterServicePort, 'retryConversion'>>;
  let handler: RetryConversionHandler;

  beforeEach(() => {
    repository = { findById: jest.fn(), save: jest.fn() };
    converter = { retryConversion: jest.fn() };
    handler = new RetryConversionHandler(
      repository as unknown as MusicWriteRepositoryPort,
      converter as unknown as ConverterServicePort,
    );
  });

  it('queues a failed conversion again and clears its error', async () => {
    const failed = music(ConversionStatus.failed);
    repository.findById.mockResolvedValue(failed);
    converter.retryConversion.mockResolvedValue({
      converterId: 7,
      mediaId: 'media',
      title: 'Song',
      artist: 'Artist',
      duration: 0,
      status: ConversionStatus.pending,
      error: null,
    });

    await handler.execute(new RetryConversionCommand({ musicId: 'music-1' }));

    expect(converter.retryConversion).toHaveBeenCalledWith(7);
    expect(failed).toMatchObject({
      conversionStatus: ConversionStatus.pending,
      conversionError: null,
    });
    expect(repository.save).toHaveBeenCalledWith(failed);
  });

  it('refuses conversions that did not fail', async () => {
    repository.findById.mockResolvedValue(music(ConversionStatus.processing));

    await expect(
      handler.execute(new RetryConversionCommand({ musicId: 'music-1' })),
    ).rejects.toThrow(DomainException);
    expect(converter.retryConversion).not.toHaveBeenCalled();
  });

  it('throws when the music does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      handler.execute(new RetryConversionCommand({ musicId: 'unknown' })),
    ).rejects.toThrow(RessourceNotFoundException);
  });
});
