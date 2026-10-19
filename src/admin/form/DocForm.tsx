'use client'

import { useActionState, useId, useMemo, useRef, useState } from 'react'

import { slugify } from '@/lib/slug'

import type { Dict } from '../i18n'
import type { Field, FormSpec, L } from '../spec'
import type { FormDoc, FormOptions, FormState, ImageOpt, Rec, RefOpt, TripOpt } from './types'

type Lang = 'es' | 'en'
interface Ctx {
  ui: Lang
  t: Dict
  options: FormOptions
  errors: Record<string, string>
  preview: (md: string) => Promise<string>
}

const lab = (l: L, ui: Lang) => l[ui]
const asArr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])
const move = <T,>(arr: T[], i: number, d: number): T[] => {
  const j = i + d
  if (j < 0 || j >= arr.length) return arr
  const out = arr.slice()
  ;[out[i], out[j]] = [out[j], out[i]]
  return out
}

/** Empty value for a new list row of `fields`. */
function emptyRow(fields: Field[]): Rec {
  const r: Rec = {}
  for (const f of fields) r[f.name] = f.kind === 'bool' ? false : ['strings', 'list', 'refs', 'images', 'multiselect', 'blocks', 'trips'].includes(f.kind) ? [] : f.kind === 'group' ? emptyRow(f.fields) : f.kind === 'number' || f.kind === 'ref' || f.kind === 'image' ? null : ''
  return r
}

function Err({ path, ctx }: { path: string; ctx: Ctx }) {
  const e = ctx.errors[path]
  return e ? (
    <p className="adm-error" role="alert">
      {e}
    </p>
  ) : null
}

function Thumb({ img }: { img: ImageOpt | undefined }) {
  if (!img) return <span className="adm-thumb adm-thumb--empty" aria-hidden="true" />
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="adm-thumb" src={img.path} alt={img.alt} width={96} height={Math.round((96 * img.height) / img.width)} loading="lazy" />
}

/** Image library picker in a <dialog> (no uploads, contracts §13). */
function ImagePicker({ ctx, onPick, label }: { ctx: Ctx; onPick: (id: number) => void; label: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [q, setQ] = useState('')
  const list = ctx.options.images.filter((i) => !q || (i.path + ' ' + i.alt).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <button type="button" className="adm-btn adm-btn--small" onClick={() => ref.current?.showModal()}>
        {label}
      </button>
      <dialog ref={ref} className="adm-dialog">
        <div className="adm-dialog__head">
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={ctx.t.searchPlaceholder} aria-label={ctx.t.search} />
          <button type="button" className="adm-btn adm-btn--small" onClick={() => ref.current?.close()}>
            {ctx.t.cancel}
          </button>
        </div>
        <div className="adm-grid">
          {list.map((img) => (
            <button
              type="button"
              key={img.id}
              className="adm-grid__item"
              onClick={() => {
                onPick(img.id)
                ref.current?.close()
              }}
            >
              <Thumb img={img} />
              <span>{img.path.split('/').pop()}</span>
            </button>
          ))}
          {!list.length ? <p>{ctx.t.noResults}</p> : null}
        </div>
      </dialog>
    </>
  )
}

/** Searchable select for relationships: chips for the chosen items (ordered), a filter, and matches to add. */
function Picker<T extends { label: string }>({
  ctx,
  all,
  chosen,
  keyOf,
  onChange,
  max,
  id,
}: {
  ctx: Ctx
  all: T[]
  chosen: T[]
  keyOf: (o: T) => string
  onChange: (next: T[]) => void
  max?: number
  id: string
}) {
  const [q, setQ] = useState('')
  const chosenKeys = new Set(chosen.map(keyOf))
  const matches = all.filter((o) => !chosenKeys.has(keyOf(o)) && (!q || o.label.toLowerCase().includes(q.toLowerCase()))).slice(0, 8)
  const full = max !== undefined && chosen.length >= max
  return (
    <div className="adm-picker">
      {chosen.length ? (
        <ol className="adm-chips">
          {chosen.map((o, i) => (
            <li key={keyOf(o)}>
              <span>{o.label}</span>
              {chosen.length > 1 ? (
                <>
                  <button type="button" onClick={() => onChange(move(chosen, i, -1))} aria-label={ctx.t.moveUp} disabled={i === 0}>
                    ↑
                  </button>
                  <button type="button" onClick={() => onChange(move(chosen, i, 1))} aria-label={ctx.t.moveDown} disabled={i === chosen.length - 1}>
                    ↓
                  </button>
                </>
              ) : null}
              <button type="button" onClick={() => onChange(chosen.filter((_, j) => j !== i))} aria-label={ctx.t.remove}>
                ×
              </button>
            </li>
          ))}
        </ol>
      ) : null}
      {max === 1 && full ? null : (
        <>
          <input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={ctx.t.searchPlaceholder} disabled={full && max !== 1} />
          {q || !chosen.length ? (
            <ul className="adm-matches">
              {matches.map((o) => (
                <li key={keyOf(o)}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(max === 1 ? [o] : [...chosen, o])
                      setQ('')
                    }}
                    disabled={full}
                  >
                    + {o.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </div>
  )
}

function Markdown({ value, onChange, ctx, id }: { value: string; onChange: (v: string) => void; ctx: Ctx; id: string }) {
  const [html, setHtml] = useState<string | null>(null)
  return (
    <div className="adm-md">
      <div className="adm-md__bar">
        <button type="button" className="adm-btn adm-btn--small" aria-pressed={html === null} onClick={() => setHtml(null)}>
          {ctx.t.edit_md}
        </button>
        <button type="button" className="adm-btn adm-btn--small" aria-pressed={html !== null} onClick={async () => setHtml(await ctx.preview(value))}>
          {ctx.t.preview}
        </button>
      </div>
      {html === null ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={Math.min(30, Math.max(8, value.split('\n').length + 2))} />
      ) : (
        <div className="adm-md__preview prose" dangerouslySetInnerHTML={{ __html: html }} />
      )}
      <p className="adm-help">{ctx.t.markdownHelp}</p>
    </div>
  )
}

/** One field (recursive for lists, groups and blocks). `path` is the error key, e.g. "es.title". */
function FieldView({ f, value, onChange, path, ctx, sibling }: { f: Field; value: unknown; onChange: (v: unknown) => void; path: string; ctx: Ctx; sibling: Rec }) {
  const id = useId()
  const label = lab(f.label, ctx.ui)
  const invalid = Boolean(ctx.errors[path])
  const common = { id, 'aria-invalid': invalid || undefined }
  const str = value === null || value === undefined ? '' : String(value)
  let control: React.ReactNode
  switch (f.kind) {
    case 'text':
    case 'url':
    case 'email':
    case 'date':
    case 'time':
      control = <input {...common} type={f.kind === 'text' ? 'text' : f.kind} value={str} maxLength={'max' in f ? f.max : undefined} onChange={(e) => onChange(e.target.value)} />
      break
    case 'textarea':
      control = <textarea {...common} value={str} rows={3} onChange={(e) => onChange(e.target.value)} />
      break
    case 'slug':
      control = (
        <div className="adm-row">
          <input {...common} type="text" value={str} onChange={(e) => onChange(e.target.value)} pattern="[a-z0-9]+(-[a-z0-9]+)*" />
          <button type="button" className="adm-btn adm-btn--small" onClick={() => onChange(slugify(String(sibling[f.from] || '')))}>
            ← {ctx.ui === 'es' ? 'del título' : 'from title'}
          </button>
        </div>
      )
      break
    case 'markdown':
      control = <Markdown id={id} value={str} onChange={onChange} ctx={ctx} />
      break
    case 'number':
      control = (
        <input
          {...common}
          type="number"
          value={str}
          min={f.min}
          max={f.max}
          step={f.step ?? 1}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        />
      )
      break
    case 'bool':
      return (
        <div className="adm-field adm-field--check">
          <label htmlFor={id}>
            <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} /> {label}
          </label>
          <Err path={path} ctx={ctx} />
        </div>
      )
    case 'select':
      control = (
        <select {...common} value={str} onChange={(e) => onChange(e.target.value || null)}>
          {!f.required ? <option value="">—</option> : null}
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {lab(o.label, ctx.ui)}
            </option>
          ))}
        </select>
      )
      break
    case 'multiselect': {
      const sel = new Set(asArr<string>(value))
      control = (
        <div className="adm-checks" role="group" aria-labelledby={id}>
          {f.options.map((o) => (
            <label key={o.value}>
              <input
                type="checkbox"
                checked={sel.has(o.value)}
                onChange={(e) => onChange(f.options.map((x) => x.value).filter((v) => (v === o.value ? e.target.checked : sel.has(v))))}
              />{' '}
              {lab(o.label, ctx.ui)}
            </label>
          ))}
        </div>
      )
      return (
        <fieldset className="adm-field">
          <legend id={id}>{label}</legend>
          {control}
          <Err path={path} ctx={ctx} />
        </fieldset>
      )
    }
    case 'image': {
      const img = ctx.options.images.find((i) => i.id === value)
      control = (
        <div className="adm-row">
          <Thumb img={img} />
          <span className="adm-muted">{img ? img.path : ctx.t.noImage}</span>
          <ImagePicker ctx={ctx} onPick={onChange} label={ctx.t.chooseImage} />
          {img ? (
            <button type="button" className="adm-btn adm-btn--small" onClick={() => onChange(null)}>
              {ctx.t.remove}
            </button>
          ) : null}
        </div>
      )
      break
    }
    case 'images': {
      const ids = asArr<number>(value)
      control = (
        <div>
          <ol className="adm-gallery">
            {ids.map((iid, i) => (
              <li key={`${iid}-${i}`}>
                <Thumb img={ctx.options.images.find((x) => x.id === iid)} />
                <div className="adm-row">
                  <button type="button" onClick={() => onChange(move(ids, i, -1))} aria-label={ctx.t.moveUp}>
                    ↑
                  </button>
                  <button type="button" onClick={() => onChange(move(ids, i, 1))} aria-label={ctx.t.moveDown}>
                    ↓
                  </button>
                  <button type="button" onClick={() => onChange(ids.filter((_, j) => j !== i))} aria-label={ctx.t.remove}>
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ol>
          {f.max === undefined || ids.length < f.max ? <ImagePicker ctx={ctx} onPick={(nid) => onChange([...ids, nid])} label={`+ ${ctx.t.chooseImage}`} /> : null}
        </div>
      )
      break
    }
    case 'ref':
    case 'refs': {
      const all = ctx.options.refs[f.target] || []
      const ids = f.kind === 'ref' ? (typeof value === 'number' ? [value] : []) : asArr<number>(value)
      const chosen = ids.map((i) => all.find((o) => o.id === i) || { id: i, label: `#${i}` })
      control = (
        <Picker<RefOpt>
          id={id}
          ctx={ctx}
          all={all}
          chosen={chosen}
          keyOf={(o) => String(o.id)}
          max={f.kind === 'ref' ? 1 : f.max}
          onChange={(next) => onChange(f.kind === 'ref' ? (next[0]?.id ?? null) : next.map((o) => o.id))}
        />
      )
      break
    }
    case 'trips':
    case 'trip': {
      const all = ctx.options.trips
      const key = (o: { type: string; id: number }) => `${o.type}:${o.id}`
      const refs =
        f.kind === 'trips'
          ? asArr<{ type: TripOpt['type']; id: number }>(value)
          : value && typeof value === 'object'
            ? [{ type: ({ tours: 'tour', cruises: 'cruise', excursions: 'excursion' } as const)[(value as { relationTo: 'tours' }).relationTo], id: (value as { value: number }).value }]
            : []
      const chosen = refs.map((r) => all.find((o) => key(o) === key(r)) || { ...r, label: key(r) })
      control = (
        <Picker<TripOpt>
          id={id}
          ctx={ctx}
          all={all}
          chosen={chosen}
          keyOf={key}
          max={f.kind === 'trip' ? 1 : f.max}
          onChange={(next) =>
            onChange(
              f.kind === 'trips'
                ? next.map((o) => ({ type: o.type, id: o.id }))
                : next[0]
                  ? { relationTo: ({ tour: 'tours', cruise: 'cruises', excursion: 'excursions' } as const)[next[0].type], value: next[0].id }
                  : null,
            )
          }
        />
      )
      break
    }
    case 'strings': {
      const items = asArr<string>(value)
      control = (
        <div className="adm-list">
          {items.map((s, i) => (
            <div className="adm-row" key={i}>
              <input type="text" value={s} aria-label={`${label} ${i + 1}`} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
              <button type="button" onClick={() => onChange(move(items, i, -1))} aria-label={ctx.t.moveUp}>
                ↑
              </button>
              <button type="button" onClick={() => onChange(move(items, i, 1))} aria-label={ctx.t.moveDown}>
                ↓
              </button>
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={ctx.t.remove}>
                ×
              </button>
            </div>
          ))}
          <button type="button" className="adm-btn adm-btn--small" onClick={() => onChange([...items, ''])} disabled={f.max !== undefined && items.length >= f.max}>
            + {ctx.t.addRow}
          </button>
        </div>
      )
      break
    }
    case 'list':
    case 'blocks': {
      const rows = asArr<Rec>(value)
      const fieldsOf = (r: Rec) => (f.kind === 'list' ? f.fields : (f.blocks[String(r.blockType)]?.fields ?? []))
      control = (
        <div className="adm-list">
          {rows.map((r, i) => (
            <fieldset className="adm-item" key={i}>
              <legend>
                {f.kind === 'blocks' ? lab(f.blocks[String(r.blockType)]?.label ?? { es: String(r.blockType), en: String(r.blockType) }, ctx.ui) : `${label} · ${i + 1}`}
              </legend>
              <div className="adm-item__tools">
                <button type="button" onClick={() => onChange(move(rows, i, -1))} aria-label={ctx.t.moveUp}>
                  ↑
                </button>
                <button type="button" onClick={() => onChange(move(rows, i, 1))} aria-label={ctx.t.moveDown}>
                  ↓
                </button>
                <button type="button" onClick={() => onChange(rows.filter((_, j) => j !== i))} aria-label={ctx.t.remove}>
                  × {ctx.t.remove}
                </button>
              </div>
              {fieldsOf(r).map((sf) => (
                <FieldView
                  key={sf.name}
                  f={sf}
                  value={r[sf.name]}
                  sibling={r}
                  path={`${path}.${i}.${sf.name}`}
                  ctx={ctx}
                  onChange={(v) => onChange(rows.map((x, j) => (j === i ? { ...x, [sf.name]: v } : x)))}
                />
              ))}
            </fieldset>
          ))}
          {f.kind === 'list' ? (
            <button type="button" className="adm-btn adm-btn--small" onClick={() => onChange([...rows, emptyRow(f.fields)])} disabled={f.max !== undefined && rows.length >= f.max}>
              + {ctx.t.addRow}
            </button>
          ) : (
            <div className="adm-row">
              {Object.entries(f.blocks).map(([type, b]) => (
                <button type="button" key={type} className="adm-btn adm-btn--small" onClick={() => onChange([...rows, { blockType: type, ...emptyRow(b.fields) }])}>
                  + {lab(b.label, ctx.ui)}
                </button>
              ))}
            </div>
          )}
        </div>
      )
      return (
        <fieldset className="adm-field adm-field--wide">
          <legend>{label}</legend>
          {control}
          <Err path={path} ctx={ctx} />
        </fieldset>
      )
    }
    case 'group': {
      const g = (value && typeof value === 'object' ? value : {}) as Rec
      return (
        <fieldset className="adm-field adm-field--wide adm-group">
          <legend>{label}</legend>
          {f.fields.map((sf) => (
            <FieldView key={sf.name} f={sf} value={g[sf.name]} sibling={g} path={`${path}.${sf.name}`} ctx={ctx} onChange={(v) => onChange({ ...g, [sf.name]: v })} />
          ))}
        </fieldset>
      )
    }
    case 'readonly':
      control = <output id={id}>{ctx.options.readonly?.[f.name] || '—'}</output>
      break
  }
  return (
    <div className={`adm-field${f.kind === 'markdown' || f.kind === 'strings' || f.kind === 'images' ? ' adm-field--wide' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {control}
      {'help' in f && f.help ? <p className="adm-help">{lab(f.help, ctx.ui)}</p> : null}
      <Err path={path} ctx={ctx} />
    </div>
  )
}

/**
 * The generic editor (contracts §18): shared fields, then ES / EN tabs for localized fields. The whole
 * document is posted as JSON in one hidden field; the server action validates it with zod and saves.
 */
export function DocForm({
  spec,
  initial,
  options,
  action,
  preview,
  t,
  ui,
  submitLabel,
}: {
  spec: FormSpec
  initial: FormDoc
  options: FormOptions
  action: (prev: FormState, data: FormData) => Promise<FormState>
  preview: (md: string) => Promise<string>
  t: Dict
  ui: Lang
  submitLabel?: string
}) {
  const [doc, setDoc] = useState<FormDoc>(initial)
  const [tab, setTab] = useState<Lang>('es')
  const [state, formAction, pending] = useActionState(action, {} as FormState)
  const errors = useMemo(() => state.errors || {}, [state.errors])
  const ctx: Ctx = { ui, t, options, errors, preview }
  const errIn = (prefix: string) => Object.keys(errors).some((k) => k.startsWith(prefix + '.'))

  return (
    <form action={formAction} className="adm-form" noValidate>
      <input type="hidden" name="doc" value={JSON.stringify(doc)} />
      {state.message ? (
        <p className={state.ok ? 'adm-flash' : 'adm-flash adm-flash--error'} role={state.ok ? 'status' : 'alert'}>
          {state.message}
        </p>
      ) : null}
      {spec.shared.length ? (
        <section className="adm-panel" aria-labelledby="shared-h">
          <h2 id="shared-h">{t.shared}</h2>
          <div className="adm-fields">
            {spec.shared.map((f) => {
              const bucket = f.join ? 'joins' : 'main'
              const src = doc[bucket] as Rec
              return (
                <FieldView
                  key={f.name}
                  f={f}
                  value={src[f.name]}
                  sibling={src}
                  path={`${bucket}.${f.name}`}
                  ctx={ctx}
                  onChange={(v) => setDoc((d) => ({ ...d, [bucket]: { ...(d[bucket] as Rec), [f.name]: v } }))}
                />
              )
            })}
          </div>
        </section>
      ) : null}
      {spec.localized.length ? (
        <section className="adm-panel">
          <div className="adm-tabs" role="tablist" aria-label={t.language}>
            {(['es', 'en'] as const).map((l) => (
              <button key={l} type="button" role="tab" aria-selected={tab === l} className={errIn(l) ? 'has-error' : undefined} onClick={() => setTab(l)}>
                {l === 'es' ? t.spanish : t.english} ({l.toUpperCase()})
              </button>
            ))}
          </div>
          {(['es', 'en'] as const).map((l) => (
            <div key={l} role="tabpanel" hidden={tab !== l} className="adm-fields" lang={l}>
              {spec.localized.map((f) => (
                <FieldView
                  key={f.name}
                  f={f}
                  value={doc.i18n[l][f.name]}
                  sibling={doc.i18n[l]}
                  path={`${l}.${f.name}`}
                  ctx={ctx}
                  onChange={(v) => setDoc((d) => ({ ...d, i18n: { ...d.i18n, [l]: { ...d.i18n[l], [f.name]: v } } }))}
                />
              ))}
            </div>
          ))}
        </section>
      ) : null}
      <div className="adm-actions">
        <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
          {submitLabel || t.save}
        </button>
      </div>
    </form>
  )
}
