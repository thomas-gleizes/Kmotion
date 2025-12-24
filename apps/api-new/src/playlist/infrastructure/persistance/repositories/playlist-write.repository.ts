import { PlaylistEntity } from 'src/playlist/domain/playlist.entity';
import { PlaylistWriteRepositoryPort } from 'src/playlist/domain/port/playlist-write-repository.port';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import type { DrizzleDB } from 'src/core/database/database';
import { playlistTable } from 'src/playlist/infrastructure/persistance/schemas/playlist.schema';
import { playlistEntryTable } from 'src/playlist/infrastructure/persistance/schemas/playlist-entry.schema';
import { eq } from 'drizzle-orm';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';
import { PlaylistEntries } from 'src/playlist/domain/values-object/playlist-entries.value-object';

export class PlaylistWriteRepository implements PlaylistWriteRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

  async save(playlist: PlaylistEntity): Promise<void> {
    await this.database.transaction(async (transaction) => {
      await transaction
        .insert(playlistTable)
        .values({
          id: playlist.getId(),
          title: playlist.getTitle(),
          description: playlist.getDescription(),
          visibility: playlist.getVisibility(),
          userId: playlist.getUserId(),
        })
        .onConflictDoUpdate({
          target: playlistTable.id,
          set: {
            title: playlist.getTitle(),
            description: playlist.getDescription(),
            visibility: playlist.getVisibility(),
          },
        });

      for (const entry of playlist.getPlaylistEntries().getEntries()) {
        await transaction
          .insert(playlistEntryTable)
          .values({
            playlistId: playlist.getId(),
            musicId: entry.musicId,
            position: entry.position,
          })
          .onConflictDoUpdate({
            target: [playlistEntryTable.playlistId, playlistEntryTable.musicId],
            set: {
              position: entry.position,
            },
          });
      }
    });
  }

  async delete(playlistId: string): Promise<void> {
    await this.database.transaction(async (transaction) => {
      await transaction
        .delete(playlistEntryTable)
        .where(eq(playlistEntryTable.playlistId, playlistId));

      await transaction
        .delete(playlistTable)
        .where(eq(playlistTable.id, playlistId));
    });
  }

  async findById(playlistId: string): Promise<PlaylistEntity> {
    const [playlist] = await this.database
      .select()
      .from(playlistTable)
      .where(eq(playlistTable.id, playlistId));

    const entries = await this.database
      .select()
      .from(playlistEntryTable)
      .where(eq(playlistEntryTable.playlistId, playlistId));

    return new PlaylistEntity(
      playlist.id,
      playlist.title,
      playlist.description,
      playlist.userId,
      playlist.visibility as Visibility,
      new PlaylistEntries(
        entries.map((entry) => ({
          musicId: entry.musicId,
          position: entry.position,
        })),
      ),
    );
  }
}
