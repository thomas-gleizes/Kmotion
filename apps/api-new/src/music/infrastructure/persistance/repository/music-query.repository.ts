import { Inject, Injectable } from '@nestjs/common';
import { and, count, eq, ilike, InferSelectModel, like, or } from 'drizzle-orm';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import type { DrizzleDB } from 'src/core/database/database';
import { musicTable } from 'src/music/infrastructure/persistance/schemas/music.schema';
import {
  MusicRead,
  MusicReadRepositoryPort,
} from 'src/music/application/port/music-read-repository.port';
import { MediaSource } from 'src/music/domain/music.entity';

type MusicRecord = InferSelectModel<typeof musicTable>;

@Injectable()
export class MusicReadRepository implements MusicReadRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

  private mapToRead(record: MusicRecord): MusicRead {
    return {
      id: record.id,
      title: record.title,
      artist: record.artist,
      audio: `/static/${record.id}/audio`,
      thumbnail: `/static/${record.id}/thumbnail`,
      channel: record.artist,
      duration: record.duration ?? 0,
    };
  }

  async exist(mediaId: string, mediaSource: MediaSource) {
    const [{ total }] = await this.database
      .select({ total: count(musicTable.id) })
      .from(musicTable)
      .where(
        and(
          eq(musicTable.mediaId, mediaId),
          eq(musicTable.mediaSource, mediaSource.toString()),
        ),
      );

    return total > 0;
  }

  async findById(id: string): Promise<MusicRead | null> {
    const [record] = await this.database
      .select()
      .from(musicTable)
      .where(eq(musicTable.id, id));

    if (!record) return null;

    return this.mapToRead(record);
  }

  async findAll(): Promise<MusicRead[]> {
    const records = await this.database.select().from(musicTable);

    return records.map(this.mapToRead);
  }

  async search(query: string): Promise<MusicRead[]> {
    const records = await this.database
      .select()
      .from(musicTable)
      .where(
        or(
          ilike(musicTable.title, `%${query}%`),
          ilike(musicTable.artist, `%${query}%`),
        ),
      );

    return records.map(this.mapToRead);
  }
}
