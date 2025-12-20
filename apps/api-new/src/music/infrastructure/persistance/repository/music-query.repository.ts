import { Inject, Injectable } from '@nestjs/common';
import { and, count, eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import type { DrizzleDB } from 'src/core/database/database';
import { musicTable } from 'src/music/infrastructure/persistance/schemas/music.schema';
import { MusicReadRepositoryPort } from 'src/music/application/port/music-read-repository.port';
import { MediaSource } from 'src/music/domain/music.entity';

@Injectable()
export class MusicReadRepository implements MusicReadRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

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
}
