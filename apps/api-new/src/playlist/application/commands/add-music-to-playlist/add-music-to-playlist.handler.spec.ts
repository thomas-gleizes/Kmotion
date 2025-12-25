import { AddMusicToPlaylistHandler } from './add-music-to-playlist.handler';
import { AddMusicToPlaylistCommand } from './add-music-to-playlist.command';
import { PlaylistWriteRepositoryPort } from 'src/playlist/domain/port/playlist-write-repository.port';
import { PlaylistEntity } from 'src/playlist/domain/playlist.entity';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

describe('AddMusicToPlaylistHandler', () => {
  let handler: AddMusicToPlaylistHandler;
  let repository: jest.Mocked<PlaylistWriteRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    } as any;
    handler = new AddMusicToPlaylistHandler(repository);
  });

  it('should add music to playlist', async () => {
    const playlist = PlaylistEntity.create('Title', 'Desc', 'user-1');
    repository.findById.mockResolvedValue(playlist);

    const command = new AddMusicToPlaylistCommand(
      playlist.getId(),
      'user-1',
      'music-1',
      0,
    );

    await handler.execute(command);

    expect(playlist.getPlaylistEntries().getEntries()).toHaveLength(1);
    expect(playlist.getPlaylistEntries().getEntries()[0].musicId).toBe(
      'music-1',
    );
    expect(repository.save).toHaveBeenCalledWith(playlist);
  });

  it('should throw DomainException if user is not owner', async () => {
    const playlist = PlaylistEntity.create('Title', 'Desc', 'user-1');
    repository.findById.mockResolvedValue(playlist);

    const command = new AddMusicToPlaylistCommand(
      playlist.getId(),
      'other-user',
      'music-1',
      0,
    );

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
