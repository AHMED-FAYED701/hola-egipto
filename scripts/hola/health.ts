/** `pnpm -s hola:health`: {"db":true,"version":"<SELECT VERSION()>","tables":n} (contracts §9). */
import type { RowDataPacket } from 'mysql2'

import { getPool } from '../../src/db/client'
import { dbError, done, out } from './_cli'

try {
  const pool = getPool()
  const [[v]] = await pool.query<RowDataPacket[]>('SELECT VERSION() AS v')
  const [[t]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()')
  out({ db: true, version: String(v.v), tables: Number(t.n) })
  await done(0)
} catch (e) {
  out({ db: false, error: dbError(e) })
  await done(1)
}
