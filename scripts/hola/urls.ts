/** `pnpm -s hola:urls`: TSV `group lang path expect index`, one row per URL to test (contracts §9). */
import { publicUrls } from '../../src/lib/content/routes'
import type { Locale } from '../../src/i18n/routing'
import { FIXED_PAGES, pageUrl } from '../../src/lib/urls'
import { main, out } from './_cli'

await main(async () => {
  const rows: string[][] = []
  const row = (group: string, lang: Locale, path: string, expect: number, index: 0 | 1) => rows.push([group, lang, path, String(expect), String(index)])
  const all = await publicUrls()
  const each = (group: string, list: { urls: Partial<Record<Locale, string>> }[]) => {
    for (const l of ['es', 'en'] as const) for (const p of list) if (p.urls[l]) row(group, l, p.urls[l] as string, 200, 1)
  }
  each('home', all.home)
  each('archive', all.archive)
  each('single', all.single)
  each('term', all.term)
  for (const p of Object.values(FIXED_PAGES)) for (const l of ['es', 'en'] as const) row('page', l, pageUrl(p[l], l), 200, p.index ? 1 : 0)
  row('search', 'es', '/buscar/?q=luxor', 200, 0)
  row('search', 'en', '/en/search/?q=luxor', 200, 0)
  row('404', 'es', '/viajes-a-egipto/no-existe-hola-404/', 404, 0)
  row('404', 'en', '/en/egypt-tours/no-existe-hola-404/', 404, 0)
  out(rows.map((r) => r.join('\t')).join('\n'))
})
