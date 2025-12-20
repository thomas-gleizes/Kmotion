import { MusicWriteRepositoryPort } from 'src/music/domain/port/music-write-repository.port';
import { MediaSource, Music } from 'src/music/domain/music.entity';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import type { DrizzleDB } from 'src/core/database/database';
import { musicTable } from 'src/music/infrastructure/persistance/schemas/music.schema';
import { eq, InferSelectModel } from 'drizzle-orm';

type MusicRecord = InferSelectModel<typeof musicTable>;

export class MusicWriteRepository implements MusicWriteRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

  private mapToDomain(record: MusicRecord): Music {
    return new Music(
      record.id,
      record.title,
      record.artist,
      record.mediaId,
      record.mediaSource as MediaSource,
      record.downloaderId,
      record.duration,
      record.thumbnail,
    );
  }

  async findById(id: string) {
    const [record] = await this.database
      .select()
      .from(musicTable)
      .where(eq(musicTable.id, id));

    if (!record) return null;

    return this.mapToDomain(record);
  }

  async save(music: Music) {
    await this.database
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
}
