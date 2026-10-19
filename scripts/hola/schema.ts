/**
 * `pnpm -s hola:schema`: the logical model (src/db/model.ts) as JSON, verified against
 * information_schema.COLUMNS of the live database. Missing tables/columns → stderr + exit 1 (contracts §9).
 */
import type { RowDataPacket } from 'mysql2'

import { getPool } from '../../src/db/client'
import { MODEL, requiredColumns, SUPPORT_TABLES } from '../../src/db/model'
import { log, main, out } from './_cli'

await main(async () => {
  const [rows] = await getPool().query<RowDataPacket[]>(
    'SELECT TABLE_NAME AS t, COLUMN_NAME AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()',
  )
  const have = new Set(rows.map((r) => `${r.t}.${r.c}`))
  const missing: string[] = []
  const all = [...Object.values(MODEL.collections), ...Object.values(MODEL.globals)]
  for (const e of all) for (const [t, c] of requiredColumns(e)) if (!have.has(`${t}.${c}`)) missing.push(`${t}.${c}`)
  for (const [t, cols] of Object.entries(SUPPORT_TABLES)) for (const c of cols) if (!have.has(`${t}.${c}`)) missing.push(`${t}.${c}`)
  const names = (o: Record<string, { fields: Record<string, unknown> }>) =>
    Object.fromEntries(Object.entries(o).map(([k, e]) => [k, Object.keys(e.fields)]))
  out({ collections: names(MODEL.collections), globals: names(MODEL.globals), locales: ['es', 'en'], defaultLocale: 'es' })
  if (missing.length) {
    log(`missing in the database: ${[...new Set(missing)].join(', ')}`)
    throw Object.assign(new Error('schema mismatch'), { code: 'SCHEMA' })
  }
})
