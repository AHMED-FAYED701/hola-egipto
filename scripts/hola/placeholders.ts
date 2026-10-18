import { args, done, out, revalidateSite } from './_lib'
import { ensurePlaceholders } from './_placeholders'

const ids = await ensurePlaceholders(args().includes('--force'))
await revalidateSite()
out({ placeholders: Object.keys(ids).length })
done()
