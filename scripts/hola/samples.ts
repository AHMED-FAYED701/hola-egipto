/** `pnpm -s hola:samples create | delete [--dry-run] | count` (contracts §9, content rules §2). */
import { args, log, main, out, revalidateSite } from './_cli'
import { countSamples, createSamples, deleteSamples, seedImages } from './_seed'

const [cmd, ...rest] = args()
await main(async () => {
  if (cmd === 'create') {
    await createSamples(await seedImages())
    await revalidateSite()
    out({ ok: true, samples: await countSamples() })
  } else if (cmd === 'delete') {
    const dry = rest.includes('--dry-run')
    const counts = await deleteSamples(dry)
    if (dry) out({ would_delete: counts })
    else {
      await revalidateSite()
      out({ deleted: counts })
    }
  } else if (cmd === 'count') {
    out(await countSamples())
  } else {
    log('usage: hola:samples create | delete [--dry-run] | count')
    throw Object.assign(new Error('usage'), { code: 'USAGE' })
  }
})
