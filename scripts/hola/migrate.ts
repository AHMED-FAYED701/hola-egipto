/** `pnpm -s migrate [--env=hostinger]`: apply pending drizzle/ migrations (contracts §9, §19). Prints {"applied":n}. */
import { runMigrations } from '../../src/db/migrate'

try {
  const result = await runMigrations()
  process.stdout.write(JSON.stringify({ applied: result.applied }) + '\n')
  if (result.skipped) process.stderr.write('migration lock busy: nothing applied\n')
} catch (e) {
  const err = e as { code?: string; message?: string; cause?: { code?: string; message?: string } }
  process.stderr.write(`migrate failed: ${err.code || err.cause?.code || ''} ${(err.cause?.message || err.message || '').slice(0, 300)}\n`)
  process.exit(1)
}
