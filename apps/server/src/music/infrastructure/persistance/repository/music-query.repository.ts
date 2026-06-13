import { Inject, Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, InferSelectModel, or } from 'drizzle-orm';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import type { DrizzleDB } from 'src/core/database/database';
import { musicTable } from 'src/music/infrastructure/persistance/schemas/music.schema';
import {
  MusicFilters,
  MusicOrderBy,
  MusicRead,
  MusicReadRepositoryPort,
} from 'src/music/application/port/music-read-repository.port';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import {
  PaginateParameter,
  PaginateResult,
} from 'src/core/paginations/paginations.type';

type MusicRecord = InferSelectModel<typeof musicTable>;

@Injectable()
export class MusicReadRepository implements MusicReadRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

  private mapToRead(record: MusicRecord): MusicRead {
    return {
      id: record.id,
      mediaId: record.mediaId,
      mediaSource: record.mediaSource as MediaSource,
      title: record.title,
      artist: record.artist,
      audio: record.audio,
      thumbnail: record.thumbnail,
      channel: record.artist,
      duration: record.duration ?? 0,
      converted: record.audio !== '',
      createdAt: record.createdAt,
    };
  }

  async exist(converterId: number): Promise<boolean> {
    const [{ total }] = await this.database
      .select({ total: count(musicTable.id) })
      .from(musicTable)
      .where(eq(musicTable.converterId, converterId));

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

  private buildWhere(filters: MusicFilters = {}) {
    if (!filters.search) return undefined;

    return or(
      ilike(musicTable.title, `%${filters.search}%`),
      ilike(musicTable.artist, `%${filters.search}%`),
    );
  }

  async total(filters: MusicFilters = {}): Promise<number> {
    const [result] = await this.database
      .select({ total: count(musicTable.id) })
      .from(musicTable)
      .where(this.buildWhere(filters));

    return result.total ?? 0;
  }

  private buildOrderBy(orderBy: MusicOrderBy = {}) {
    const columns = {
      title: musicTable.title,
      artist: musicTable.artist,
      duration: musicTable.duration,
      createdAt: musicTable.createdAt,
    };
    const column = columns[orderBy.field ?? 'title'];

    return orderBy.direction === 'desc' ? desc(column) : asc(column);
  }

  async findAll({
    pagination,
    filters,
    orderBy,
  }: PaginateParameter<MusicFilters, MusicOrderBy>): Promise<
    PaginateResult<MusicRead>
  > {
    const limit = Math.min(pagination?.size ?? 10, 100);
    const offset = (pagination?.page ?? 0) * limit;

    const records = await this.database
      .select()
      .from(musicTable)
      .where(this.buildWhere(filters))
      .orderBy(this.buildOrderBy(orderBy))
      .offset(offset)
      .limit(limit);

    const total = await this.total(filters);

    return {
      records: records.map((record) => this.mapToRead(record)),
      total: total,
    };
  }

  async findByMediaId(
    mediaId: string,
    mediaSource: MediaSource,
  ): Promise<MusicRead | null> {
    const [record] = await this.database
      .select()
      .from(musicTable)
      .where(
        and(
          eq(musicTable.mediaId, mediaId),
          eq(musicTable.mediaSource, mediaSource.toString()),
        ),
      );

    if (!record) return null;

    return this.mapToRead(record);
  }
}
