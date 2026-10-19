import { defineConfig } from 'drizzle-kit'

/** `pnpm db:generate` writes SQL migrations to drizzle/ (committed). Generation needs no database. */
export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: { url: process.env.DATABASE_URL || 'mysql://x:x@127.0.0.1:3306/x' },
  migrations: { table: '__drizzle_migrations' },
})
