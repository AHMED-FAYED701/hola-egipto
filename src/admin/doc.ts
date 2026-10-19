import 'server-only'

import { z } from 'zod'

import { refOptions, slugTaken, tripOptions } from '@/lib/content/admin'
import { listImages } from '@/lib/content/images'
import { type Ent, isTaxonomy, isTrip } from '@/lib/content/tables'
import type { Editable } from '@/lib/content/write'
import { SLUG_RE } from '@/lib/slug'

import type { Dict } from './i18n'
import type { Field, FormSpec } from './spec'
import type { FormDoc, FormOptions, Rec } from './form/types'

const LOCALES = ['es', 'en'] as const

// ------------------------------------------------------------ conversions
/** Editable (physical rows) → the form document; timestamps and ids dropped. */
export function toFormDoc(e: Editable | null, spec: FormSpec): FormDoc {
  const pick = (row: Rec | undefined, fields: Field[]) => Object.fromEntries(fields.map((f) => [f.name, normalize(f, row?.[f.name])]))
  const mainFields = spec.shared.filter((f) => !f.join)
  const joinFields = spec.shared.filter((f) => f.join)
  return {
    main: pick(e?.main, mainFields),
    joins: Object.fromEntries(joinFields.map((f) => [f.name, normalize(f, (e?.joins as Rec | undefined)?.[f.name])])),
    i18n: { es: pick(e?.i18n.es, spec.localized), en: pick(e?.i18n.en, spec.localized) },
  }
}

function normalize(f: Field, v: unknown): unknown {
  switch (f.kind) {
    case 'bool':
      return Boolean(v)
    case 'strings':
    case 'images':
    case 'refs':
    case 'trips':
    case 'multiselect':
    case 'blocks':
      return Array.isArray(v) ? v : []
    case 'list':
      return Array.isArray(v) ? v.map((r) => Object.fromEntries(f.fields.map((sf) => [sf.name, normalize(sf, (r as Rec)?.[sf.name])]))) : []
    case 'group': {
      const g = (v && typeof v === 'object' ? v : {}) as Rec
      return Object.fromEntries(f.fields.map((sf) => [sf.name, normalize(sf, g[sf.name])]))
    }
    case 'number':
    case 'ref':
    case 'image':
      return typeof v === 'number' ? v : v === null || v === undefined || v === '' ? null : Number(v)
    case 'trip':
      return v && typeof v === 'object' ? v : null
    default:
      return v === null || v === undefined ? '' : v instanceof Date ? v.toISOString().slice(0, 10) : String(v)
  }
}

// ------------------------------------------------------------- validation
type Issues = Record<string, string>

/** zod schema for one field (shape + per-field rules). */
function zodFor(f: Field, t: Dict): z.ZodType {
  const opt = (s: z.ZodType) => s
  switch (f.kind) {
    case 'text':
    case 'textarea':
    case 'markdown':
    case 'slug':
    case 'readonly': {
      let s = z.string().trim()
      if ('max' in f && f.max) s = s.max(f.max, `${t.errors} (≤ ${f.max})`)
      if ('required' in f && f.required) s = s.min(1, t.required)
      return opt(f.kind === 'readonly' ? z.any() : s)
    }
    case 'url':
      return z
        .string()
        .trim()
        .max('max' in f && f.max ? f.max : 500)
        .refine((v) => !v || /^https?:\/\/\S+$/.test(v), 'http(s)://…')
    case 'email':
      return z
        .string()
        .trim()
        .max(255)
        .refine((v) => !v || z.string().email().safeParse(v).success, t.email)
    case 'date':
      return z
        .string()
        .trim()
        .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), 'YYYY-MM-DD')
        .refine((v) => !('required' in f && f.required) || v.length > 0, t.required)
    case 'time':
      return z
        .string()
        .trim()
        .refine((v) => !v || /^\d{2}:\d{2}$/.test(v), 'HH:MM')
        .refine((v) => !('required' in f && f.required) || v.length > 0, t.required)
    case 'number': {
      let s = z.number({ error: t.required })
      if (f.min !== undefined) s = s.min(f.min)
      if (f.max !== undefined) s = s.max(f.max)
      if (!f.step) s = s.int()
      return f.required ? s : s.nullable()
    }
    case 'bool':
      return z.boolean()
    case 'select': {
      const vals = f.options.map((o) => o.value)
      const s = z.string().refine((v) => vals.includes(v))
      return f.required ? s : s.nullable().or(z.literal(''))
    }
    case 'multiselect': {
      const vals = f.options.map((o) => o.value)
      return z.array(z.string().refine((v) => vals.includes(v)))
    }
    case 'image':
    case 'ref':
      return z.number().int().positive().nullable()
    case 'images':
    case 'refs':
      return z
        .array(z.number().int().positive())
        .max('max' in f && f.max ? f.max : 1000, `≤ ${'max' in f ? f.max : ''}`)
    case 'trips':
      return z.array(z.object({ type: z.enum(['tour', 'cruise', 'excursion']), id: z.number().int().positive() })).max(f.max ?? 1000, `≤ ${f.max}`)
    case 'trip':
      return z.object({ relationTo: z.enum(['tours', 'cruises', 'excursions']), value: z.number().int().positive() }).nullable()
    case 'strings':
      return z.array(z.string().trim().max(500)).transform((a) => a.filter(Boolean))
    case 'list':
      return z.array(z.object(Object.fromEntries(f.fields.map((sf) => [sf.name, zodFor(sf, t)])))).max(f.max ?? 1000, `≤ ${f.max}`)
    case 'group':
      return z.object(Object.fromEntries(f.fields.map((sf) => [sf.name, zodFor(sf, t)])))
    case 'blocks':
      return z.array(
        z.object({ blockType: z.enum(Object.keys(f.blocks) as [string, ...string[]]) }).passthrough().transform((b, ctx) => {
          const def = f.blocks[b.blockType]
          const r = z.object(Object.fromEntries(def.fields.map((sf) => [sf.name, zodFor(sf, t)]))).safeParse(b)
          if (!r.success) {
            for (const i of r.error.issues) ctx.addIssue({ code: 'custom', message: i.message, path: i.path })
            return z.NEVER
          }
          return { blockType: b.blockType, ...r.data }
        }),
      )
  }
}

function collect(prefix: string, err: z.ZodError, issues: Issues) {
  for (const i of err.issues) {
    const key = [prefix, ...i.path.map(String)].join('.')
    if (!issues[key]) issues[key] = i.message
  }
}

/** Parse and validate a posted form document against its spec; returns clean values or field errors. */
export function validateDoc(raw: unknown, spec: FormSpec, t: Dict): { doc?: FormDoc; issues: Issues } {
  const issues: Issues = {}
  const d = (raw && typeof raw === 'object' ? raw : {}) as Partial<FormDoc>
  const out: FormDoc = { main: {}, joins: {}, i18n: { es: {}, en: {} } }
  const run = (bucket: 'main' | 'joins', fields: Field[], src: Rec | undefined) => {
    for (const f of fields) {
      const r = zodFor(f, t).safeParse(normalize(f, src?.[f.name]))
      if (r.success) out[bucket][f.name] = r.data
      else collect(`${bucket}.${f.name}`, r.error, issues)
    }
  }
  run(
    'main',
    spec.shared.filter((f) => !f.join),
    d.main,
  )
  run(
    'joins',
    spec.shared.filter((f) => f.join),
    d.joins,
  )
  for (const l of LOCALES) {
    for (const f of spec.localized) {
      const r = zodFor(f, t).safeParse(normalize(f, d.i18n?.[l]?.[f.name]))
      if (r.success) out.i18n[l][f.name] = r.data
      else collect(`${l}.${f.name}`, r.error, issues)
    }
  }
  return { doc: Object.keys(issues).length ? undefined : out, issues }
}

/** Spec rules that need more than one field or the database (contracts §4, §18). */
export async function entityRules(ent: Ent, doc: FormDoc, id: number | undefined, t: Dict, ui: 'es' | 'en'): Promise<Issues> {
  const issues: Issues = {}
  const titleKey = isTaxonomy(ent) ? 'name' : 'title'
  const msg = (es: string, en: string) => (ui === 'es' ? es : en)
  for (const l of LOCALES) {
    const row = doc.i18n[l]
    const slug = String(row.slug || '')
    if (slug && !SLUG_RE.test(slug)) issues[`${l}.slug`] = msg('Solo minúsculas, números y guiones, sin acentos.', 'Lowercase letters, digits and hyphens only, no accents.')
    else if (slug && (await slugTaken(ent, l, slug, id))) issues[`${l}.slug`] = msg('Este slug ya existe en este idioma.', 'This slug already exists in this language.')
    const available = isTaxonomy(ent) ? true : Boolean(row.available)
    if (!String(row[titleKey] || '').trim() && (available || l === 'es')) issues[`${l}.${titleKey}`] = t.required
    if (available && !slug && String(row[titleKey] || '').trim()) issues[`${l}.slug`] = t.required
    if (isTrip(ent) && row.available) {
      const h = (row.highlights as string[]) || []
      if (h.length < 3 || h.length > 8) issues[`${l}.highlights`] = msg('Entre 3 y 8 puntos.', 'Between 3 and 8 highlights.')
    }
  }
  if (isTrip(ent) && (doc.i18n.es.available || doc.i18n.en.available)) {
    if (doc.main.price_from_eur === null || doc.main.price_from_eur === undefined) issues['main.price_from_eur'] = msg('Obligatorio mientras el viaje esté publicado.', 'Required while the trip is published.')
    if (doc.main.price_from_usd === null || doc.main.price_from_usd === undefined) issues['main.price_from_usd'] = msg('Obligatorio mientras el viaje esté publicado.', 'Required while the trip is published.')
  }
  if (ent === 'pages' && doc.main.template === 'home' && id === undefined) issues['main.template'] = msg('Ya existe la página de inicio.', 'The home page already exists.')
  return issues
}

/** Form document → physical rows + joins for saveDoc(). */
export function toEditable(doc: FormDoc, spec: FormSpec, id?: number): Editable {
  const main: Rec = {}
  for (const f of spec.shared.filter((x) => !x.join && x.kind !== 'readonly')) main[f.name] = blankToNull(f, doc.main[f.name])
  const joins: Rec = {}
  for (const f of spec.shared.filter((x) => x.join)) joins[f.name] = doc.joins[f.name]
  const i18n: Editable['i18n'] = {}
  for (const l of LOCALES) {
    const row: Rec = {}
    for (const f of spec.localized) row[f.name] = blankToNull(f, doc.i18n[l][f.name])
    i18n[l] = row
  }
  return { id, main, i18n, joins: joins as Editable['joins'] }
}

const blankToNull = (f: Field, v: unknown) => (['date', 'url', 'email', 'select', 'time'].includes(f.kind) && v === '' ? null : v)

// ---------------------------------------------------------------- options
/** Option lists the form needs: images, relationship targets used by the spec, trips. */
export async function formOptions(spec: FormSpec): Promise<FormOptions> {
  const targets = new Set<Ent>()
  let trips = false
  const walk = (fields: Field[]) => {
    for (const f of fields) {
      if (f.kind === 'ref' || f.kind === 'refs') targets.add(f.target)
      if (f.kind === 'trips' || f.kind === 'trip') trips = true
      if (f.kind === 'list' || f.kind === 'group') walk(f.fields)
      if (f.kind === 'blocks') Object.values(f.blocks).forEach((b) => walk(b.fields))
    }
  }
  walk([...spec.shared, ...spec.localized])
  const [images, refs, tripList] = await Promise.all([
    listImages(),
    Promise.all([...targets].map(async (e) => [e, await refOptions(e)] as const)),
    trips ? tripOptions() : Promise.resolve([]),
  ])
  return {
    images: images.map((i) => ({ id: i.id, path: i.path, alt: i.alt_es, width: i.width, height: i.height })),
    refs: Object.fromEntries(refs),
    trips: tripList,
  }
}
