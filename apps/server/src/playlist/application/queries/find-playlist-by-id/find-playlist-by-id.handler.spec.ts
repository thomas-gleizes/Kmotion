import { FindPlaylistByIdHandler } from './find-playlist-by-id.handler';
import { FindPlaylistByIdQuery } from './find-playlist-by-id.query';
import {
  PlaylistQueryRepositoryPort,
  PlaylistRead,
} from 'src/playlist/application/port/playlist-query-repository.port';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';

describe('FindPlaylistByIdHandler', () => {
  let handler: FindPlaylistByIdHandler;
  let repository: jest.Mocked<PlaylistQueryRepositoryPort>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findMany: jest.fn(),
    };
    handler = new FindPlaylistByIdHandler(repository);
  });

  it('should return a playlist', async () => {
    const playlistRead: PlaylistRead = {
      id: 'playlist-1',
      title: 'Title',
      description: 'Desc',
      visibility: Visibility.public,
      user: { id: 'user-1', name: 'User', slug: 'user' },
      entries: [],
    };
    repository.findById.mockResolvedValue(playlistRead);

    const query = new FindPlaylistByIdQuery({ id: 'playlist-1' });
    const result = await handler.execute(query);

    expect(result).toEqual(playlistRead);
    expect(repository.findById).toHaveBeenCalledWith('playlist-1');
  });

  it('should throw RessourceNotFoundException if playlist not found', async () => {
    repository.findById.mockResolvedValue(null);

    const query = new FindPlaylistByIdQuery({ id: 'unknown' });

    await expect(handler.execute(query)).rejects.toThrow(
      RessourceNotFoundException,
    );
  });
});
