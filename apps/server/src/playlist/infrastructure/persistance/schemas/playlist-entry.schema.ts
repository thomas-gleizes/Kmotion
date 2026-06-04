import { pgTable, primaryKey, smallint, varchar } from 'drizzle-orm/pg-core';
import { musicTable } from 'src/music/infrastructure/persistance/schemas/music.schema';
import { playlistTable } from 'src/playlist/infrastructure/persistance/schemas/playlist.schema';

export const playlistEntryTable = pgTable(
  'playlist_entries',
  {
    playlistId: varchar({ length: 36 })
      .notNull()
      .references(() => playlistTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    musicId: varchar({ length: 36 })
      .notNull()
      .references(() => musicTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    position: smallint().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.playlistId, t.musicId] }),
  }),
);
