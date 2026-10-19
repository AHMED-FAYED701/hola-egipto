/** `pnpm -s hola:retention [--dry-run]`: delete inquiries older than 24 months unless won (contracts §7). */
import { retention } from '../../src/lib/content/inquiries'
import { args, main, out } from './_cli'

await main(async () => {
  const dry = args().includes('--dry-run')
  const n = await retention(dry)
  out(dry ? { deleted: 0, would_delete: n, dry_run: true } : { deleted: n })
})
