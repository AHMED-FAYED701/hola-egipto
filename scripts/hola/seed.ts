import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { slugify } from '../../src/fields/common'
import { done, log, out, revalidateSite } from './_lib'
import { toLexical } from './_rich'
import { PAGES, type PageBlock } from './data/pages'
import { NAVIGATION, SETTINGS } from './data/site'
import { TERMS } from './data/terms'
import type { L } from './data/types'
import { ensurePlaceholders } from './_placeholders'
import { countSamples, createSamples, termIds, TRIPS, upsert } from './_samples'

/** Idempotent launch data: terms, placeholders, settings, samples, fixed pages, navigation (contracts §9). */
const ctx = { disableRevalidate: true }

async function seedTerms(payload: Payload) {
  for (const [taxonomy, terms] of Object.entries(TERMS)) {
    for (const t of terms) {
      const slug: L = t.slug ?? { es: slugify(t.name.es), en: slugify(t.name.en) }
      const found = await payload.find({ collection: taxonomy as 'regions', locale: 'es', where: { slug: { equals: slug.es } }, limit: 1, depth: 0, overrideAccess: true })
      const shared: Record<string, unknown> = { sort: t.sort }
      if (t.min_days !== undefined) Object.assign(shared, { min_days: t.min_days, max_days: t.max_days })
      const loc = (l: 'es' | 'en') => ({
        name: t.name[l],
        slug: slug[l],
        ...(t.landing ? { h1: t.landing.h1[l], intro: t.landing.intro[l], seo_text: t.landing.seo_text[l], faq: t.landing.faq[l] } : {}),
      })
      let id = found.docs[0]?.id
      if (id) await payload.update({ collection: taxonomy as 'regions', id, locale: 'es', data: { ...shared, ...loc('es') }, overrideAccess: true, context: ctx })
      else id = (await payload.create({ collection: taxonomy as 'regions', locale: 'es', data: { ...shared, ...loc('es') } as never, overrideAccess: true, context: ctx })).id
      await payload.update({ collection: taxonomy as 'regions', id, locale: 'en', data: loc('en'), overrideAccess: true, context: ctx })
    }
    log(`terms ${taxonomy}: ${terms.length}`)
  }
}

async function seedSettings(payload: Payload) {
  const s = SETTINGS
  const intros = s.archive_intros.es
  // The en archive intros are written with the same structure from the faq helper output.
  const shared = {
    cancellation_policies: s.cancellation_policies.map((p) => ({ key: p.key, name: p.name.es, text: p.text.es })),
  }
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'es',
    data: {
      ...shared,
      whatsapp_message_default: s.whatsapp_message_default.es,
      reply_hours: s.reply_hours.es,
      booking_band: s.booking_band.es,
      stats: s.stats.es,
      trust_items: s.trust_items.es as never,
      archive_intros: Object.fromEntries(Object.entries(intros).map(([k, v]) => [k, { h1: v.h1, intro: v.intro, seo_text: v.seo_text, faq: v.faq.es }])),
    },
    overrideAccess: true,
    context: ctx,
  })
  const saved = await payload.findGlobal({ slug: 'site-settings', locale: 'es', depth: 0, overrideAccess: true })
  const rows = saved.cancellation_policies || []
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      cancellation_policies: s.cancellation_policies.map((p, i) => ({ id: rows[i]?.id, key: p.key, name: p.name.en, text: p.text.en })),
      whatsapp_message_default: s.whatsapp_message_default.en,
      reply_hours: s.reply_hours.en,
      booking_band: s.booking_band.en,
      stats: s.stats.en,
      trust_items: s.trust_items.en as never,
      archive_intros: Object.fromEntries(Object.entries(EN_INTROS).map(([k, v]) => [k, v])),
    },
    overrideAccess: true,
    context: ctx,
  })
  log('site-settings')
}

// English archive intros: same keys as the Spanish ones in data/site.ts.
const EN_INTROS = {
  tours: { h1: 'Egypt tours', intro: 'Routes through Cairo, the Nile and the Red Sea, organised by a team that lives in Egypt. Every one can be adjusted.', seo_text: 'Our Egypt tours combine the Giza pyramids, the temples of Luxor and Aswan, a Nile cruise and, if you like, a few days on the Red Sea. Choose by length or style and message us to fit it to your dates.', faq: SETTINGS.archive_intros.es.tours.faq.en },
  cruises: { h1: 'Nile cruises', intro: 'Cruise ships and dahabiyas between Luxor and Aswan, with guided visits at every stop.', seo_text: 'A Nile cruise is the easiest way to see the temples of Upper Egypt: the boat is your hotel and visits start by the quay. Compare routes, length and boat type.', faq: SETTINGS.archive_intros.es.cruises.faq.en },
  excursions: { h1: 'Egypt excursions', intro: 'Day trips from Hurghada, Marsa Alam and Cairo, with hotel pickup.', seo_text: 'Snorkelling on Red Sea reefs, Luxor in a day or the Giza pyramids: pick your departure city and we will tell you what each excursion includes.', faq: SETTINGS.archive_intros.es.excursions.faq.en },
  destinations: { h1: 'Egypt destinations', intro: 'From the Nile delta to the southern reefs: what is worth seeing in each place and how many days to allow.', seo_text: 'Destination guides with the essentials, the best season and how to get there, plus the trips that visit each place.', faq: SETTINGS.archive_intros.es.destinations.faq.en },
  guides: { h1: 'Egypt travel guide', intro: 'Practical advice written in Egypt: when to go, what to see and how to get around.', seo_text: 'Articles updated in 2026 on planning, destinations, culture and the Red Sea. Facts that change often are marked so you can check them before you travel.', faq: SETTINGS.archive_intros.es.guides.faq.en },
}

async function seedPages(payload: Payload, media: Record<string, number>) {
  const departures = await termIds(payload, 'departures')
  const block = (b: PageBlock): Record<string, unknown> => {
    const out: Record<string, unknown> = { ...b }
    if (typeof b.image === 'string') out.image = media[b.image] ?? null
    if (Array.isArray(b.cities)) out.cities = (b.cities as string[]).map((c) => departures[c]).filter(Boolean)
    if (Array.isArray(b.body)) out.body = toLexical(b.body as never)
    return out
  }
  for (const pg of PAGES) {
    const loc = (l: 'es' | 'en') => ({
      title: pg.title[l],
      slug: pg.slug[l],
      available: true,
      excerpt: pg.excerpt[l],
      seo: { meta_description: pg.excerpt[l] },
      last_updated: new Date().toISOString().slice(0, 10),
      ...(pg.content ? { content: toLexical(pg.content[l]) } : {}),
      ...(pg.layout ? { layout: pg.layout[l].map(block) } : {}),
      ...(pg.faq_groups ? { faq_groups: pg.faq_groups[l] } : {}),
    })
    await upsert(payload, 'pages', pg.slug.es, { template: pg.template, holaSample: false }, { es: loc('es'), en: loc('en') })
  }
  log(`pages: ${PAGES.length}`)
}

async function seedNavigation(payload: Payload) {
  const tripIds: Record<string, { relationTo: string; value: number }> = {}
  for (const t of TRIPS) {
    const res = await payload.find({ collection: t.collection, locale: 'es', where: { slug: { equals: t.slug.es } }, limit: 1, depth: 0, overrideAccess: true })
    if (res.docs[0]) tripIds[t.key] = { relationTo: t.collection, value: res.docs[0].id }
  }
  for (const l of ['es', 'en'] as const) {
    const n = NAVIGATION[l]
    await payload.updateGlobal({
      slug: 'navigation',
      locale: l,
      data: {
        header: n.header.map((h) => ({ ...h, featured: h.featured ? tripIds[h.featured] ?? null : null })) as never,
        footer_columns: n.footer_columns,
        footer_description: n.footer_description,
        legal_links: n.legal_links,
      },
      overrideAccess: true,
      context: ctx,
    })
  }
  log('navigation')
}

const payload = await getPayload({ config })
await seedTerms(payload)
const media = await ensurePlaceholders(false)
await seedSettings(payload)
await createSamples(payload)
await seedPages(payload, media)
await seedNavigation(payload)
await revalidateSite()
out({ ok: true, samples: await countSamples(payload) })
done()
