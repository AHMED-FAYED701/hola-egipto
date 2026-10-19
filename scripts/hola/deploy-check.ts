/**
 * `pnpm -s hola:deploy-check [--env=hostinger]` (contracts §9, §19): required env names, database answers,
 * every migration applied, site-settings exists, every table's collation starts with utf8mb4.
 * Prints {"ok":true} or {"ok":false,"problems":[…]} — names only, never values.
 */
import fs from 'node:fs'
import path from 'node:path'

import type { RowDataPacket } from 'mysql2'

import { getPool } from '../../src/db/client'
import { MIGRATIONS_TABLE, migrationsFolder } from '../../src/db/migrate'
import { dbError, done, out } from './_cli'

const problems: string[] = []
for (const k of ['DATABASE_URL', 'APP_SECRET', 'SITE_URL', 'HOLA_PREVIEW_KEY']) if (!process.env[k]?.trim()) problems.push(`env ${k} empty`)
for (const k of ['HOLA_COMING_SOON', 'HOLA_DEV_MODE', 'HOLA_AUTO_MIGRATE']) if (process.env[k] === undefined) problems.push(`env ${k} missing`)
if (process.env.SITE_URL && !/^https?:\/\/[^/]+$/.test(process.env.SITE_URL.replace(/\/+$/, ''))) problems.push('env SITE_URL is not an absolute base URL')

if (process.env.DATABASE_URL) {
  try {
    const pool = getPool()
    await pool.query('SELECT 1')
    const journal = JSON.parse(fs.readFileSync(path.join(migrationsFolder(), 'meta/_journal.json'), 'utf8')) as { entries: unknown[] }
    const [[t]] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS n FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?',
      [MIGRATIONS_TABLE],
    )
    const applied = Number(t.n) ? Number((await pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM \`${MIGRATIONS_TABLE}\``))[0][0].n) : 0
    if (applied < journal.entries.length) problems.push(`migrations pending (${journal.entries.length - applied}): run pnpm -s migrate`)
    if (applied) {
      const [[ss]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM site_settings')
      if (!Number(ss.n)) problems.push('site-settings row missing: run pnpm -s hola:seed')
    }
    const [cols] = await pool.query<RowDataPacket[]>(
      'SELECT TABLE_NAME AS t, TABLE_COLLATION AS c FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()',
    )
    for (const r of cols) if (!String(r.c || '').startsWith('utf8mb4')) problems.push(`table ${r.t} collation is not utf8mb4`)
  } catch (e) {
    problems.push(`database: ${dbError(e)}`)
  }
}
out(problems.length ? { ok: false, problems } : { ok: true })
await done(problems.length ? 1 : 0)
