import { DeletePlaylistHandler } from './delete-playlist.handler';
import { DeletePlaylistCommand } from './delete-playlist.command';
import { PlaylistWriteRepositoryPort } from 'src/playlist/domain/port/playlist-write-repository.port';
import { PlaylistEntity } from 'src/playlist/domain/playlist.entity';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

describe('DeletePlaylistHandler', () => {
  let handler: DeletePlaylistHandler;
  let repository: jest.Mocked<PlaylistWriteRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    } as any;
    handler = new DeletePlaylistHandler(repository);
  });

  it('should delete a playlist', async () => {
    const playlist = PlaylistEntity.create('Title', 'Desc', 'user-1');
    repository.findById.mockResolvedValue(playlist);

    const command = new DeletePlaylistCommand({
      id: playlist.getId(),
      userId: 'user-1',
    });

    await handler.execute(command);

    expect(repository.delete).toHaveBeenCalledWith(playlist.getId());
  });

  it('should throw DomainException if user is not owner', async () => {
    const playlist = PlaylistEntity.create('Title', 'Desc', 'user-1');
    repository.findById.mockResolvedValue(playlist);

    const command = new DeletePlaylistCommand({
      id: playlist.getId(),
      userId: 'other-user',
    });

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
