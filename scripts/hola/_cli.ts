/** Shared helpers for the `pnpm hola:*` scripts (contracts §9). Logs go to stderr; stdout is the result only. */
import { closeDb } from '../../src/db/client'

/** Arguments after the script path (the runner already removed --env=…). */
export function args(): string[] {
  return process.argv.slice(2).map(String)
}

/** Print one line of JSON (or a plain string) to stdout. */
export function out(value: unknown): void {
  process.stdout.write((typeof value === 'string' ? value : JSON.stringify(value)) + '\n')
}

export function log(...parts: unknown[]): void {
  process.stderr.write(parts.map(String).join(' ') + '\n')
}

/** SITE_URL without trailing slash. */
export const siteUrl = () => (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')

/** Ask the running server to revalidate everything (contracts §9, §16); silent when it is down. */
export async function revalidateSite(): Promise<void> {
  try {
    await fetch(siteUrl() + '/api/hola/revalidate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-hola-revalidate': process.env.HOLA_PREVIEW_KEY || '' },
      body: JSON.stringify({ all: true }),
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    // server not running: nothing to revalidate
  }
}

/** Database error → a short, secret-free description. */
export function dbError(e: unknown): string {
  const err = e as { code?: string; message?: string; cause?: { code?: string; message?: string } }
  return [err.code || err.cause?.code, (err.cause?.message || err.message || '').replace(/mysql:\/\/[^\s'"]+/g, 'mysql://…').slice(0, 200)]
    .filter(Boolean)
    .join(' ')
}

/** Close the pool and exit. */
export async function done(code = 0): Promise<never> {
  try {
    await closeDb()
  } catch {
    // already closed
  }
  process.exit(code)
}

/** Run a script body; on failure print a short error to stderr and exit 1. */
export async function main(fn: () => Promise<void>): Promise<never> {
  try {
    await fn()
  } catch (e) {
    log(`failed: ${dbError(e)}`)
    return done(1)
  }
  return done(0)
}
