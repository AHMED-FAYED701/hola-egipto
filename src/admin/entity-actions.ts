'use server'

import { redirect } from 'next/navigation'

import { requireUser } from '@/lib/auth'
import type { Ent } from '@/lib/content/tables'
import { deleteDoc, duplicateDoc, saveDoc } from '@/lib/content/write'
import { revalidateSite } from '@/lib/revalidate'

import { entityRules, toEditable, validateDoc } from './doc'
import type { FormState } from './form/types'
import { DICTS } from './i18n'
import { adminLang } from './server'
import { ENTITY_SPECS } from './spec'

const isEnt = (e: string): e is Ent => e in ENTITY_SPECS

/** Create/update from the generic form (zod validation, spec rules, i18n upserts, revalidation). */
export async function saveEntityAction(ent: string, id: number | null, _prev: FormState, data: FormData): Promise<FormState> {
  await requireUser(`/admin/${ent}`)
  if (!isEnt(ent)) return { message: 'unknown entity' }
  const ui = await adminLang()
  const t = DICTS[ui]
  let raw: unknown
  try {
    raw = JSON.parse(String(data.get('doc') || '{}'))
  } catch {
    return { message: t.errors }
  }
  const spec = ENTITY_SPECS[ent]
  const { doc, issues } = validateDoc(raw, spec, t)
  const more = doc ? await entityRules(ent, doc, id ?? undefined, t, ui) : {}
  const errors = { ...issues, ...more }
  if (!doc || Object.keys(errors).length) return { message: t.errors, errors }
  let newId: number
  try {
    newId = await saveDoc(ent, toEditable(doc, spec, id ?? undefined))
  } catch (e) {
    const code = (e as { code?: string; cause?: { code?: string } }).cause?.code || (e as { code?: string }).code || 'DB'
    console.warn(`[admin] save ${ent} failed: ${code}`)
    return { message: `${t.errors} (${code})` }
  }
  revalidateSite()
  redirect(`/admin/${ent}/${newId}?saved=1`)
}

export async function deleteEntityAction(ent: string, id: number): Promise<void> {
  await requireUser(`/admin/${ent}`)
  if (!isEnt(ent)) return
  await deleteDoc(ent, id)
  revalidateSite()
  redirect(`/admin/${ent}?deleted=1`)
}

export async function duplicateEntityAction(ent: string, id: number): Promise<void> {
  await requireUser(`/admin/${ent}`)
  if (!isEnt(ent)) return
  const copy = await duplicateDoc(ent, id)
  revalidateSite()
  redirect(copy ? `/admin/${ent}/${copy}?saved=1` : `/admin/${ent}`)
}
