/**
 * Startup migration (contracts §19): only in the Node.js runtime, never during `next build`,
 * and only when HOLA_AUTO_MIGRATE=1. Logs the result and never crashes the server.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.NEXT_PHASE === 'phase-production-build') return
  if (process.env.HOLA_AUTO_MIGRATE !== '1') return
  try {
    const { runMigrations } = await import('./db/migrate')
    const result = await runMigrations()
    console.log(`[migrate] startup: ${JSON.stringify(result)}`)
  } catch (e) {
    console.warn(`[migrate] startup migration failed: ${(e as { code?: string; message?: string }).code || (e as Error).message}`)
  }
}
