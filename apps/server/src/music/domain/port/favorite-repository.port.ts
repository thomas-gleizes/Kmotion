export const FAVORITE_REPOSITORY_PORT = Symbol('FAVORITE_REPOSITORY_PORT');

export interface FavoriteRepositoryPort {
  isFavorite(userId: string, musicId: string): Promise<boolean>;

  add(userId: string, musicId: string): Promise<void>;

  remove(userId: string, musicId: string): Promise<void>;
}
