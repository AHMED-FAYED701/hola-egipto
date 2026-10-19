/** `pnpm -s hola:setup-url`: the one-time admin setup link while there are 0 users, else {"users":n} (§9, §18). */
import { countUsers } from '../../src/lib/content/users'
import { main, out, siteUrl } from './_cli'

await main(async () => {
  const n = await countUsers()
  if (n === 0) out(`${siteUrl()}/admin/setup?key=${encodeURIComponent(process.env.HOLA_PREVIEW_KEY || '')}`)
  else out({ users: n })
})
