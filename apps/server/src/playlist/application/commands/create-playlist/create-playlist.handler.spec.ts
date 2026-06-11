import { CreatePlaylistHandler } from './create-playlist.handler';
import { CreatePlaylistCommand } from './create-playlist.command';
import { PlaylistWriteRepositoryPort } from 'src/playlist/domain/port/playlist-write-repository.port';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';
import { PlaylistEntity } from 'src/playlist/domain/playlist.entity';

describe('CreatePlaylistHandler', () => {
  let handler: CreatePlaylistHandler;
  let repository: jest.Mocked<PlaylistWriteRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    } as any;
    handler = new CreatePlaylistHandler(repository);
  });

  it('should create and save a playlist', async () => {
    const command = new CreatePlaylistCommand({
      title: 'New Playlist',
      userId: 'user-1',
      description: 'A nice description',
      visibility: Visibility.public,
      entries: [],
    });

    const result = await handler.execute(command);

    expect(result).toBeDefined();
    expect(repository.save).toHaveBeenCalledTimes(1);
    const savedPlaylist = repository.save.mock.calls[0][0];
    expect(savedPlaylist).toBeInstanceOf(PlaylistEntity);
    expect(savedPlaylist.getTitle()).toBe('New Playlist');
    expect(savedPlaylist.getUserId()).toBe('user-1');
  });
});
