import {
  ManyPlaylistRead,
  PlaylistQueryRepositoryPort,
  PlaylistRead,
} from 'src/playlist/application/port/playlist-query-repository.port';
import { PaginateParameter } from 'src/core/paginations/paginations.type';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import type { DrizzleDB } from 'src/core/database/database';
import { playlistTable } from 'src/playlist/infrastructure/persistance/schemas/playlist.schema';
import { and, asc, count, eq, or } from 'drizzle-orm';
import { userTable } from 'src/user/infrastructure/persistance/schemas/user.schema';
import { playlistEntryTable } from 'src/playlist/infrastructure/persistance/schemas/playlist-entry.schema';
import { musicTable } from 'src/music/infrastructure/persistance/schemas/music.schema';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';

export class PlaylistReadRepository implements PlaylistQueryRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

  async findById(id: string): Promise<PlaylistRead | null> {
    const [record] = await this.database
      .select({
        id: playlistTable.id,
        title: playlistTable.title,
        description: playlistTable.description,
        visibility: playlistTable.visibility,
        user: {
          id: userTable.id,
          name: userTable.name,
          slug: userTable.slug,
        },
      })
      .from(playlistTable)
      .innerJoin(userTable, eq(userTable.id, playlistTable.userId))
      .where(eq(playlistTable.id, id));

    if (!record) return null;

    const entries = await this.database
      .select({
        id: musicTable.id,
        title: musicTable.title,
        duration: musicTable.duration,
        artist: musicTable.artist,
        channel: musicTable.artist,
        thumbnail: musicTable.thumbnail,
        audio: musicTable.audio,
        mediaSource: musicTable.mediaSource,
        mediaId: musicTable.mediaId,
        position: playlistEntryTable.position,
      })
      .from(musicTable)
      .innerJoin(
        playlistEntryTable,
        and(
          eq(playlistEntryTable.musicId, musicTable.id),
          eq(playlistEntryTable.playlistId, id),
        ),
      )
      .orderBy(playlistEntryTable.position);

    return {
      id: record.id,
      description: record.description,
      visibility: record.visibility as Visibility,
      title: record.title,
      user: record.user,
      entries: entries,
    };
  }

  async findByUserId(userId: string, currentUserId: string): Promise<ManyPlaylistRead[]> {
    const visibilityFilter =
      userId === currentUserId
        ? eq(playlistTable.userId, userId)
        : and(
            eq(playlistTable.userId, userId),
            eq(playlistTable.visibility, Visibility.public),
          );

    const records = await this.database
      .select({
        id: playlistTable.id,
        title: playlistTable.title,
        description: playlistTable.description,
        visibility: playlistTable.visibility,
        user: {
          id: userTable.id,
          name: userTable.name,
          slug: userTable.slug,
        },
        entriesTotal: count(playlistEntryTable.musicId),
      })
      .from(playlistTable)
      .innerJoin(userTable, eq(userTable.id, playlistTable.userId))
      .leftJoin(
        playlistEntryTable,
        eq(playlistEntryTable.playlistId, playlistTable.id),
      )
      .groupBy(playlistTable.id, userTable.id, userTable.name, userTable.slug)
      .where(visibilityFilter);

    const results: ManyPlaylistRead[] = [];
    for (const record of records) {
      results.push({
        ...record,
        visibility: record.visibility as Visibility,
        firstsMusicsIds: await this.fetchFirstMusicsId(record.id),
      });
    }

    return results;
  }

  async findMany(
    parameter: PaginateParameter<{}, {}>,
    currentUserId: string,
  ): Promise<ManyPlaylistRead[]> {
    const page = parameter.pagination?.page ?? 0;
    const size = parameter.pagination?.size ?? 20;

    const records = await this.database
      .select({
        id: playlistTable.id,
        title: playlistTable.title,
        description: playlistTable.description,
        visibility: playlistTable.visibility,
        user: {
          id: userTable.id,
          name: userTable.name,
          slug: userTable.slug,
        },
        entriesTotal: count(playlistEntryTable.musicId),
      })
      .from(playlistTable)
      .innerJoin(userTable, eq(userTable.id, playlistTable.userId))
      .leftJoin(
        playlistEntryTable,
        eq(playlistEntryTable.playlistId, playlistTable.id),
      )
      .groupBy(playlistTable.id, userTable.id, userTable.name, userTable.slug)
      .where(
        or(
          eq(playlistTable.visibility, Visibility.public),
          eq(playlistTable.userId, currentUserId),
        ),
      )
      .limit(size)
      .offset(page * size);

    const results: ManyPlaylistRead[] = [];
    for (const record of records) {
      results.push({
        ...record,
        visibility: record.visibility as Visibility,
        firstsMusicsIds: await this.fetchFirstMusicsId(record.id),
      });
    }

    return results;
  }

  private async fetchFirstMusicsId(playlistId: string): Promise<string[]> {
    return this.database
      .select({ id: playlistEntryTable.musicId })
      .from(playlistEntryTable)
      .where(eq(playlistEntryTable.playlistId, playlistId))
      .orderBy(asc(playlistEntryTable.position))
      .limit(4)
      .then((result) => result.map(({ id }) => id));
  }
}
