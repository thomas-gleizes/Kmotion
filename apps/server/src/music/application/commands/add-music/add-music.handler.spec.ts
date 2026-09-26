import { AddMusicHandler } from './add-music.handler';
import { AddMusicCommand } from './add-music.command';
import type { MusicWriteRepositoryPort } from 'src/music/domain/port/music-write-repository.port';
import type { MusicReadRepositoryPort } from 'src/music/application/port/music-read-repository.port';
import type {
  Conversion,
  ConverterServicePort,
} from 'src/music/domain/port/converter-service.port';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

const conversion = (overrides: Partial<Conversion> = {}): Conversion => ({
  converterId: 7,
  mediaId: 'dQw4w9WgXcQ',
  title: 'Song',
  artist: 'Artist',
  duration: 212,
  status: ConversionStatus.pending,
  ...overrides,
});

const command = () =>
  new AddMusicCommand({
    mediaId: 'dQw4w9WgXcQ',
    mediaSource: MediaSource.youtube,
    userId: 'user-1',
  });

describe('AddMusicHandler', () => {
  let writeRepository: jest.Mocked<Pick<MusicWriteRepositoryPort, 'save'>>;
  let readRepository: jest.Mocked<
    Pick<MusicReadRepositoryPort, 'exist' | 'findByMediaId'>
  >;
  let converter: jest.Mocked<Pick<ConverterServicePort, 'requestConversion'>>;
  let handler: AddMusicHandler;

  beforeEach(() => {
    writeRepository = { save: jest.fn() };
    readRepository = {
      exist: jest.fn().mockResolvedValue(false),
      findByMediaId: jest.fn().mockResolvedValue(null),
    };
    converter = { requestConversion: jest.fn() };
    handler = new AddMusicHandler(
      writeRepository as unknown as MusicWriteRepositoryPort,
      readRepository as unknown as MusicReadRepositoryPort,
      converter as unknown as ConverterServicePort,
    );
  });

  it('registers the music as pending without waiting for the conversion', async () => {
    converter.requestConversion.mockResolvedValue(conversion());

    const id = await handler.execute(command());

    const saved = writeRepository.save.mock.calls[0][0];
    expect(saved).toMatchObject({
      id,
      converterId: 7,
      mediaId: 'dQw4w9WgXcQ',
      downloaderId: 'user-1',
      conversionStatus: ConversionStatus.pending,
      audio: '',
    });
    expect(converter.requestConversion).toHaveBeenCalledWith(
      'dQw4w9WgXcQ',
      MediaSource.youtube,
      undefined,
    );
  });

  it('requests only the clipped portion of the media', async () => {
    converter.requestConversion.mockResolvedValue(conversion());

    await handler.execute(
      new AddMusicCommand({
        mediaId: 'dQw4w9WgXcQ',
        mediaSource: MediaSource.youtube,
        userId: 'user-1',
        clip: { start: 5, end: 180 },
      }),
    );

    expect(converter.requestConversion).toHaveBeenCalledWith(
      'dQw4w9WgXcQ',
      MediaSource.youtube,
      { start: 5, end: 180 },
    );
  });

  it('refuses a media already in the library before asking the converter', async () => {
    readRepository.findByMediaId.mockResolvedValue({
      conversionStatus: ConversionStatus.ready,
    } as Awaited<ReturnType<MusicReadRepositoryPort['findByMediaId']>>);

    await expect(handler.execute(command())).rejects.toThrow(
      'Media is already downloaded',
    );
    expect(converter.requestConversion).not.toHaveBeenCalled();
  });

  it('registers an already converted media as ready', async () => {
    converter.requestConversion.mockResolvedValue(
      conversion({ status: ConversionStatus.ready }),
    );

    await handler.execute(command());

    expect(writeRepository.save.mock.calls[0][0]).toMatchObject({
      conversionStatus: ConversionStatus.ready,
    });
  });

  it.each([
    [ConversionStatus.ready, 'Media is already downloaded'],
    [ConversionStatus.pending, 'Track is downloading'],
  ])('refuses a media already in the library (%s)', async (status, message) => {
    converter.requestConversion.mockResolvedValue(conversion({ status }));
    readRepository.exist.mockResolvedValue(true);

    await expect(handler.execute(command())).rejects.toThrow(message);
    expect(writeRepository.save).not.toHaveBeenCalled();
  });
});
