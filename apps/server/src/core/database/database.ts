// db/database.ts
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas';
import { environment } from '../config/environment';

export type DrizzleDB = NodePgDatabase<typeof schema>;

export const createDrizzle = (): DrizzleDB =>
  drizzle(
    new Pool({
      host: environment.DB_HOST,
      port: environment.DB_PORT,
      database: environment.DB_NAME,
      user: environment.DB_USER,
      password: environment.DB_PASSWORD,
    }),
    { schema },
  );
