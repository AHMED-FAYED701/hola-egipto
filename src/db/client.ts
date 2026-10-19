/**
 * One mysql2 pool from DATABASE_URL (contracts §1, §4), reused across hot reloads, with Drizzle on top.
 * Created lazily on first use: importing this module never opens a connection (no database at build, §16).
 */
import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2'
import mysql, { type Pool } from 'mysql2/promise'

import * as schema from './schema'

export type DB = MySql2Database<typeof schema>

type Cache = { pool?: Pool; db?: DB }
const g = globalThis as unknown as { __holaDb?: Cache }
const cache: Cache = (g.__holaDb ??= {})

export function poolOptions(url: string) {
  return {
    uri: url,
    connectionLimit: 5,
    charset: 'utf8mb4',
    // Store and read DATETIME values as UTC (contracts §4).
    timezone: 'Z',
    dateStrings: ['DATE'] as ['DATE'],
    supportBigNumbers: true,
    enableKeepAlive: true,
  }
}

export function getPool(): Pool {
  if (!cache.pool) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL is not set')
    cache.pool = mysql.createPool(poolOptions(url))
  }
  return cache.pool
}

export function getDb(): DB {
  if (!cache.db) cache.db = drizzle(getPool(), { schema, mode: 'default' })
  return cache.db
}

/** Close the pool (scripts call this before exiting). */
export async function closeDb(): Promise<void> {
  const pool = cache.pool
  cache.pool = undefined
  cache.db = undefined
  if (pool) await pool.end()
}
