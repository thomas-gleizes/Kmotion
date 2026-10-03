import {
  pgTable,
  varchar,
  integer,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';
import { userTable } from 'src/user/infrastructure/persistance/schemas/user.schema';

export const musicTable = pgTable('musics', {
  id: varchar({ length: 36 }).primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  artist: varchar({ length: 255 }).notNull(),
  converterId: integer('converter_id').notNull(),
  mediaId: varchar('media_id', { length: 255 }).notNull(),
  mediaSource: varchar('media_source', { length: 255 }).notNull(),
  downloaderId: varchar('downloader_id', { length: 36 }).references(
    () => userTable.id,
    {
      onDelete: 'set null',
      onUpdate: 'cascade',
    },
  ),
  duration: integer().notNull(),
  // Legacy converter paths (`/static/...`). Media is now fetched from the
  // converter by `converterId`; new rows store an empty string.
  thumbnail: varchar({ length: 255 }).notNull(),
  audio: varchar({ length: 255 }).notNull(),
  // pending | processing | ready | failed — see ConversionStatus.
  conversionStatus: varchar('conversion_status', { length: 16 })
    .notNull()
    .default('pending'),
  // Why the last conversion failed, as reported by the converter.
  conversionError: text('conversion_error'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
