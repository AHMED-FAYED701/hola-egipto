/**
 * Migration procedure shared by `pnpm migrate` and the startup migration (contracts §19):
 * one dedicated connection, GET_LOCK('hola_migrate', 30), count __drizzle_migrations before/after,
 * drizzle migrate(), RELEASE_LOCK, end the connection.
 */
import path from 'node:path'

import { drizzle } from 'drizzle-orm/mysql2'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import mysql, { type Connection, type RowDataPacket } from 'mysql2/promise'

export const MIGRATIONS_TABLE = '__drizzle_migrations'

export const migrationsFolder = () => path.join(process.cwd(), 'drizzle')

async function countApplied(conn: Connection): Promise<number> {
  const [t] = await conn.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS n FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?',
    [MIGRATIONS_TABLE],
  )
  if (!Number(t[0]?.n)) return 0
  const [r] = await conn.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM \`${MIGRATIONS_TABLE}\``)
  return Number(r[0]?.n) || 0
}

export interface MigrateResult {
  applied: number
  skipped?: 'locked'
}

export async function runMigrations(url = process.env.DATABASE_URL || ''): Promise<MigrateResult> {
  if (!url) throw new Error('DATABASE_URL is not set')
  const conn = await mysql.createConnection({ uri: url, charset: 'utf8mb4', timezone: 'Z', multipleStatements: false })
  try {
    const [lock] = await conn.query<RowDataPacket[]>("SELECT GET_LOCK('hola_migrate', 30) AS l")
    if (Number(lock[0]?.l) !== 1) {
      console.warn('[migrate] another migration holds the lock; skipped')
      return { applied: 0, skipped: 'locked' }
    }
    try {
      const before = await countApplied(conn)
      await migrate(drizzle(conn), { migrationsFolder: migrationsFolder(), migrationsTable: MIGRATIONS_TABLE })
      const after = await countApplied(conn)
      return { applied: after - before }
    } finally {
      await conn.query("SELECT RELEASE_LOCK('hola_migrate')")
    }
  } finally {
    await conn.end()
  }
}
