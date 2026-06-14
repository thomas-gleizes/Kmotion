import { pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core';
import { musicTable } from 'src/music/infrastructure/persistance/schemas/music.schema';
import { userTable } from 'src/user/infrastructure/persistance/schemas/user.schema';

export const favoriteTable = pgTable(
  'favorites',
  {
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    musicId: varchar('music_id', { length: 36 })
      .notNull()
      .references(() => musicTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.musicId] }),
  }),
);
