import { pgTable, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: varchar({ length: 36 }).primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  isAdmin: boolean('is_admin').notNull().default(false),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }),
});
