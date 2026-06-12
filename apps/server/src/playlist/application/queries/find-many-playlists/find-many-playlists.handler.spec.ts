import { FindManyPlaylistsHandler } from './find-many-playlists.handler';
import { FindManyPlaylistsQuery } from './find-many-playlists.query';
import {
  PlaylistQueryRepositoryPort,
  ManyPlaylistRead,
} from 'src/playlist/application/port/playlist-query-repository.port';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';

describe('FindManyPlaylistsHandler', () => {
  let handler: FindManyPlaylistsHandler;
  let repository: jest.Mocked<PlaylistQueryRepositoryPort>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findMany: jest.fn(),
    };
    handler = new FindManyPlaylistsHandler(repository);
  });

  it('should return many playlists', async () => {
    const playlistsRead: ManyPlaylistRead[] = [
      {
        id: 'playlist-1',
        title: 'Title',
        description: 'Desc',
        visibility: Visibility.public,
        user: { id: 'user-1', name: 'User', slug: 'user' },
        entriesTotal: 5,
      },
    ];
    repository.findMany.mockResolvedValue(playlistsRead);

    const query = new FindManyPlaylistsQuery({
      pagination: { page: 0, size: 20 },
      currentUserId: 'user-1',
    });
    const result = await handler.execute(query);

    expect(result).toEqual(playlistsRead);
    expect(repository.findMany).toHaveBeenCalledWith(
      { pagination: { page: 0, size: 20 } },
      'user-1',
    );
  });
});
