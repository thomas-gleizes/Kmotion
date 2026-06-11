import { DeleteMusicHandler } from './delete-music.handler';
import { DeleteMusicCommand } from './delete-music.command';
import { MusicWriteRepositoryPort } from 'src/music/domain/port/music-write-repository.port';
import { Music } from 'src/music/domain/music.entity';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

describe('DeleteMusicHandler', () => {
  let handler: DeleteMusicHandler;
  let repository: jest.Mocked<MusicWriteRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    } as any;
    handler = new DeleteMusicHandler(repository);
  });

  it('should delete an existing music', async () => {
    repository.findById.mockResolvedValue(
      new Music(
        'music-1',
        'Title',
        'Artist',
        1,
        'media-1',
        MediaSource.youtube,
        'user-1',
        200,
        'thumb',
        'audio',
      ),
    );

    await handler.execute(new DeleteMusicCommand({ musicId: 'music-1' }));

    expect(repository.delete).toHaveBeenCalledWith('music-1');
  });

  it('should throw when the music does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      handler.execute(new DeleteMusicCommand({ musicId: 'unknown' })),
    ).rejects.toThrow(RessourceNotFoundException);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
