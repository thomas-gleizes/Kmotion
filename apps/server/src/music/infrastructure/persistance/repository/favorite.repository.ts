import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import type { DrizzleDB } from 'src/core/database/database';
import { favoriteTable } from 'src/music/infrastructure/persistance/schemas/favorite.schema';
import { FavoriteRepositoryPort } from 'src/music/domain/port/favorite-repository.port';

@Injectable()
export class FavoriteRepository implements FavoriteRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

  async isFavorite(userId: string, musicId: string): Promise<boolean> {
    const [record] = await this.database
      .select({ musicId: favoriteTable.musicId })
      .from(favoriteTable)
      .where(
        and(
          eq(favoriteTable.userId, userId),
          eq(favoriteTable.musicId, musicId),
        ),
      );

    return record !== undefined;
  }

  async add(userId: string, musicId: string): Promise<void> {
    await this.database
      .insert(favoriteTable)
      .values({ userId, musicId })
      .onConflictDoNothing();
  }

  async remove(userId: string, musicId: string): Promise<void> {
    await this.database
      .delete(favoriteTable)
      .where(
        and(
          eq(favoriteTable.userId, userId),
          eq(favoriteTable.musicId, musicId),
        ),
      );
  }
}
