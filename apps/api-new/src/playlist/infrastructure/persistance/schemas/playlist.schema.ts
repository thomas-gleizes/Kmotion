import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { userTable } from 'src/user/infrastructure/persistance/schemas/user.schema';

export const playlistTable = pgTable('playlists', {
  id: varchar({ length: 36 }).primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  visibility: varchar({ length: 255 }).notNull(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});
