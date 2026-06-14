import { ToggleFavoriteHandler } from './toggle-favorite.handler';
import { ToggleFavoriteCommand } from './toggle-favorite.command';
import { FavoriteRepositoryPort } from 'src/music/domain/port/favorite-repository.port';

describe('ToggleFavoriteHandler', () => {
  let handler: ToggleFavoriteHandler;
  let repository: jest.Mocked<FavoriteRepositoryPort>;

  beforeEach(() => {
    repository = {
      isFavorite: jest.fn(),
      add: jest.fn(),
      remove: jest.fn(),
    } as any;
    handler = new ToggleFavoriteHandler(repository);
  });

  it('should add the music to favorites when it is not yet favorited', async () => {
    repository.isFavorite.mockResolvedValue(false);

    const result = await handler.execute(
      new ToggleFavoriteCommand({ userId: 'user-1', musicId: 'music-1' }),
    );

    expect(repository.add).toHaveBeenCalledWith('user-1', 'music-1');
    expect(repository.remove).not.toHaveBeenCalled();
    expect(result).toEqual({ isFavorite: true });
  });

  it('should remove the music from favorites when it is already favorited', async () => {
    repository.isFavorite.mockResolvedValue(true);

    const result = await handler.execute(
      new ToggleFavoriteCommand({ userId: 'user-1', musicId: 'music-1' }),
    );

    expect(repository.remove).toHaveBeenCalledWith('user-1', 'music-1');
    expect(repository.add).not.toHaveBeenCalled();
    expect(result).toEqual({ isFavorite: false });
  });
});
