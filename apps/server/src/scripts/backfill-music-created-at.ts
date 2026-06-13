import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import { environment } from 'src/core/config/environment';
import * as schema from 'src/core/database/schemas';
import { YtConverterHttpService } from 'src/core/converter/yt-converter-http.service';
import { musicTable } from 'src/music/infrastructure/persistance/schemas/music.schema';

/**
 * Backfill the `created_at` column of the musics table with the import date
 * coming from the converter API. Only `created_at` is touched, every other
 * column is left untouched.
 *
 * Run with: pnpm backfill:created-at
 *
 * Services are instantiated manually (no Nest DI) so the script can run under
 * `tsx`, which does not emit decorator metadata.
 */
async function bootstrap() {
  const logger = new Logger('BackfillCreatedAt');

  const converter = new YtConverterHttpService(
    new HttpService(
      axios.create({
        baseURL: environment.CONVERTER_URL,
        headers: {
          'Content-Type': 'application/json',
          API_KEY: environment.CONVERTER_KEY,
        },
      }),
    ),
  );
  const pool = new Pool({
    host: environment.DB_HOST,
    port: environment.DB_PORT,
    database: environment.DB_NAME,
    user: environment.DB_USER,
    password: environment.DB_PASSWORD,
  });
  const database = drizzle(pool, { schema });

  try {
    const tracks = await converter.fetchTracks();
    logger.log(`Fetched ${tracks.length} tracks from the converter`);

    let updated = 0;
    let skipped = 0;

    for (const track of tracks) {
      const createdAt = track.createdAt ? new Date(track.createdAt) : null;

      if (!createdAt || Number.isNaN(createdAt.getTime())) {
        logger.warn(`Track ${track.id} has no valid createdAt, skipping`);
        skipped++;
        continue;
      }

      const result = await database
        .update(musicTable)
        .set({ createdAt })
        .where(eq(musicTable.converterId, track.id));

      const affected = result.rowCount ?? 0;
      if (affected > 0) updated += affected;
      else skipped++;
    }

    logger.log(`Done. Updated ${updated} musics, skipped ${skipped} tracks.`);
  } catch (error) {
    logger.error('Backfill failed', error instanceof Error ? error.stack : error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void bootstrap();
