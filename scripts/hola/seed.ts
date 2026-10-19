/**
 * `pnpm -s hola:seed`: idempotent launch data (terms, pages, site-settings, navigation), image-library rows
 * for public/images/samples/, then `hola:samples create` (contracts §9).
 */
import { main, out, revalidateSite } from './_cli'
import { countSamples, createSamples, seedImages, seedNavigation, seedPages, seedSettings, seedTerms } from './_seed'

await main(async () => {
  await seedTerms()
  const media = await seedImages()
  await seedSettings(media)
  await seedPages(media)
  await createSamples(media)
  await seedNavigation()
  await revalidateSite()
  out({ ok: true, samples: await countSamples() })
})
