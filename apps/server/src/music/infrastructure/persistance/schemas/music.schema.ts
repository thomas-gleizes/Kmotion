import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
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
  thumbnail: varchar({ length: 255 }).notNull(),
  audio: varchar({ length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
