// db/database.ts
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas';

export type DrizzleDB = NodePgDatabase<typeof schema>;

export const createDrizzle = (): DrizzleDB =>
  drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), { schema });
