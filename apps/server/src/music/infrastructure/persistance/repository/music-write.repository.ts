import { MusicWriteRepositoryPort } from 'src/music/domain/port/music-write-repository.port';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import type { DrizzleDB } from 'src/core/database/database';
import { musicTable } from 'src/music/infrastructure/persistance/schemas/music.schema';
import { eq, InferSelectModel } from 'drizzle-orm';
import { Music } from 'src/music/domain/music.entity';

type MusicRecord = InferSelectModel<typeof musicTable>;

export class MusicWriteRepository implements MusicWriteRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

  private mapToDomain(record: MusicRecord): Music {
    return new Music(
      record.id,
      record.title,
      record.artist,
      record.converterId,
      record.mediaId,
      record.mediaSource as MediaSource,
      record.downloaderId,
      record.duration,
      record.thumbnail,
      record.audio,
      record.createdAt,
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

  async delete(id: string) {
    await this.database.delete(musicTable).where(eq(musicTable.id, id));
  }

  async save(music: Music) {
    await this.database
      .insert(musicTable)
      .values({
        id: music.id,
        title: music.title,
        artist: music.artist,
        converterId: music.converterId,
        mediaId: music.mediaId,
        mediaSource: music.mediaSource,
        downloaderId: music.downloaderId,
        duration: music.duration,
        thumbnail: music.thumbnail,
        audio: music.audio,
        createdAt: music.createdAt,
      })
      .onConflictDoUpdate({
        target: musicTable.id,
        set: {
          title: music.title,
          artist: music.artist,
          converterId: music.converterId,
          mediaId: music.mediaId,
          mediaSource: music.mediaSource,
          downloaderId: music.downloaderId,
          duration: music.duration,
          thumbnail: music.thumbnail,
          audio: music.audio,
        },
      });
  }
}
