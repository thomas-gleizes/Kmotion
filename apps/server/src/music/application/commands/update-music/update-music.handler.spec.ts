import { UpdateMusicHandler } from './update-music.handler';
import { UpdateMusicCommand } from './update-music.command';
import { MusicWriteRepositoryPort } from 'src/music/domain/port/music-write-repository.port';
import { Music } from 'src/music/domain/music.entity';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

const buildMusic = () =>
  new Music(
    'music-1',
    'Old Title',
    'Old Artist',
    1,
    'media-1',
    MediaSource.youtube,
    'user-1',
    200,
    'thumb',
    'audio',
  );

describe('UpdateMusicHandler', () => {
  let handler: UpdateMusicHandler;
  let repository: jest.Mocked<MusicWriteRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
    } as any;
    handler = new UpdateMusicHandler(repository);
  });

  it('should update title and artist', async () => {
    const music = buildMusic();
    repository.findById.mockResolvedValue(music);

    await handler.execute(
      new UpdateMusicCommand({
        musicId: 'music-1',
        title: 'New Title',
        artist: 'New Artist',
      }),
    );

    expect(music.title).toBe('New Title');
    expect(music.artist).toBe('New Artist');
    expect(repository.save).toHaveBeenCalledWith(music);
  });

  it('should only update the provided fields', async () => {
    const music = buildMusic();
    repository.findById.mockResolvedValue(music);

    await handler.execute(
      new UpdateMusicCommand({ musicId: 'music-1', title: 'New Title' }),
    );

    expect(music.title).toBe('New Title');
    expect(music.artist).toBe('Old Artist');
  });

  it('should throw RessourceNotFoundException when the music does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      handler.execute(
        new UpdateMusicCommand({ musicId: 'unknown', title: 'X' }),
      ),
    ).rejects.toThrow(RessourceNotFoundException);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
