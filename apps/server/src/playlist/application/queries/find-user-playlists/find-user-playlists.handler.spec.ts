import { FindUserPlaylistsHandler } from './find-user-playlists.handler';
import { FindUserPlaylistsQuery } from './find-user-playlists.query';
import {
  PlaylistQueryRepositoryPort,
  ManyPlaylistRead,
} from 'src/playlist/application/port/playlist-query-repository.port';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';

describe('FindUserPlaylistsHandler', () => {
  let handler: FindUserPlaylistsHandler;
  let repository: jest.Mocked<PlaylistQueryRepositoryPort>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findMany: jest.fn(),
    };
    handler = new FindUserPlaylistsHandler(repository);
  });

  it('should return playlists of a user', async () => {
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
    repository.findByUserId.mockResolvedValue(playlistsRead);

    const query = new FindUserPlaylistsQuery('user-1');
    const result = await handler.execute(query);

    expect(result).toEqual(playlistsRead);
    expect(repository.findByUserId).toHaveBeenCalledWith('user-1');
  });
});
