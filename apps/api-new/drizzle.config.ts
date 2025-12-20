import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { environment } from 'src/core/config/environment';

export default defineConfig({
  out: './drizzle',
  schema: 'src/core/database/schemas.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: environment.DATABASE_URL,
  },
});
