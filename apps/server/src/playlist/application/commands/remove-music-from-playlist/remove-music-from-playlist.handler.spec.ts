import { RemoveMusicFromPlaylistHandler } from './remove-music-from-playlist.handler';
import { RemoveMusicFromPlaylistCommand } from './remove-music-from-playlist.command';
import { PlaylistWriteRepositoryPort } from 'src/playlist/domain/port/playlist-write-repository.port';
import { PlaylistEntity } from 'src/playlist/domain/playlist.entity';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

describe('RemoveMusicFromPlaylistHandler', () => {
  let handler: RemoveMusicFromPlaylistHandler;
  let repository: jest.Mocked<PlaylistWriteRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    } as any;
    handler = new RemoveMusicFromPlaylistHandler(repository);
  });

  it('should remove music from playlist', async () => {
    const playlist = PlaylistEntity.create(
      'Title',
      'Desc',
      'user-1',
      undefined,
      [{ musicId: 'music-1', position: 0 }],
    );
    repository.findById.mockResolvedValue(playlist);

    const command = new RemoveMusicFromPlaylistCommand(
      playlist.getId(),
      'user-1',
      'music-1',
    );

    await handler.execute(command);

    expect(playlist.getPlaylistEntries().getEntries()).toHaveLength(0);
    expect(repository.save).toHaveBeenCalledWith(playlist);
  });

  it('should throw DomainException if user is not owner', async () => {
    const playlist = PlaylistEntity.create('Title', 'Desc', 'user-1');
    repository.findById.mockResolvedValue(playlist);

    const command = new RemoveMusicFromPlaylistCommand(
      playlist.getId(),
      'other-user',
      'music-1',
    );

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
