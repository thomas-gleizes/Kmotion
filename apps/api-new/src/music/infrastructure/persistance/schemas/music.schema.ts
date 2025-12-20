import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { usersTable } from 'src/user/infrastructure/persistance/schemas/user.schema';

export const musicTable = pgTable('musics', {
  id: varchar({ length: 52 }).primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  artist: varchar({ length: 255 }).notNull(),
  mediaId: varchar('media_id', { length: 255 }).notNull(),
  mediaSource: varchar('media_source', { length: 255 }).notNull(),
  downloaderId: varchar('downloader_id', { length: 52 }).references(
    () => usersTable.id,
    {
      onDelete: 'set null',
      onUpdate: 'cascade',
    },
  ),
  duration: integer().notNull(),
  thumbnail: varchar({ length: 255 }).notNull(),
});
