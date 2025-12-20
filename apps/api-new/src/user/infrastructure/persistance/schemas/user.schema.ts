import { pgTable, varchar, boolean } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: varchar({ length: 52 }).primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  isAdmin: boolean('is_admin').default(false),
  isActive: boolean('is_active').default(true),
});
