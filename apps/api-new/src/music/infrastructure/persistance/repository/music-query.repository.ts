import { Inject } from '@nestjs/common';
import { eq, InferSelectModel } from 'drizzle-orm';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import type { DrizzleDB } from 'src/core/database/database';
import { Music } from 'src/music/domain/music.entity';
import { musicTable } from 'src/music/infrastructure/persistance/schemas/music.schema';

type MusicRecord = InferSelectModel<typeof musicTable>;


export class MusicCommandRepository {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

  private mapToDomain(record: MusicRecord): Music {
    return new Music(
      record.id,
      record.title,
      record.artist,
      record.mediaId,
      record.mediaSource,
      record.downloaderId,
      record.duration,
      record.thumbnail,
    );
  }

  findById(id: string) {
    const record = this.database
      .select()
      .from(musicTable)
      .where(eq(musicTable.id, id));
  }

  save(music: Music) {
    return this.database
      .insert(musicTable)
      .values({
        id: music.id,
        title: music.title,
        artist: music.artist,
        mediaId: music.mediaId,
        mediaSource: music.mediaSource,
        downloaderId: music.downloaderId,
        duration: music.duration,
        thumbnail: music.thumbnail,
      })
      .onConflictDoUpdate({
        target: musicTable.id,
        set: {
          title: music.title,
          artist: music.artist,
          mediaId: music.mediaId,
          mediaSource: music.mediaSource,
          downloaderId: music.downloaderId,
          duration: music.duration,
          thumbnail: music.thumbnail,
        },
      });
}
