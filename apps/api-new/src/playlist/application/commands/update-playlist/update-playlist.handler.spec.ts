import { UpdatePlaylistHandler } from './update-playlist.handler';
import { UpdatePlaylistCommand } from './update-playlist.command';
import { PlaylistWriteRepositoryPort } from 'src/playlist/domain/port/playlist-write-repository.port';
import { PlaylistEntity } from 'src/playlist/domain/playlist.entity';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

describe('UpdatePlaylistHandler', () => {
  let handler: UpdatePlaylistHandler;
  let repository: jest.Mocked<PlaylistWriteRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    } as any;
    handler = new UpdatePlaylistHandler(repository);
  });

  it('should update a playlist', async () => {
    const playlist = PlaylistEntity.create('Old Title', 'Old Desc', 'user-1');
    repository.findById.mockResolvedValue(playlist);

    const command = new UpdatePlaylistCommand(
      playlist.getId(),
      'user-1',
      'New Title',
      'New Desc',
      Visibility.public,
    );

    await handler.execute(command);

    expect(playlist.getTitle()).toBe('New Title');
    expect(playlist.getDescription()).toBe('New Desc');
    expect(playlist.getVisibility()).toBe(Visibility.public);
    expect(repository.save).toHaveBeenCalledWith(playlist);
  });

  it('should throw DomainException if user is not owner', async () => {
    const playlist = PlaylistEntity.create('Title', 'Desc', 'user-1');
    repository.findById.mockResolvedValue(playlist);

    const command = new UpdatePlaylistCommand(
      playlist.getId(),
      'other-user',
      'New Title',
    );

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
