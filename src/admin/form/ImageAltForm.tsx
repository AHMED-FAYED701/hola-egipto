'use client'

import { useActionState } from 'react'

import type { Dict } from '../i18n'
import type { FormState } from './types'

export function ImageAltForm({ action, altEs, altEn, t }: { action: (p: FormState, d: FormData) => Promise<FormState>; altEs: string; altEn: string; t: Dict }) {
  const [state, formAction, pending] = useActionState(action, {} as FormState)
  return (
    <form action={formAction} className="adm-list">
      <label>
        {t.altEs}
        <input type="text" name="alt_es" defaultValue={altEs} required maxLength={500} aria-invalid={Boolean(state.errors?.alt_es) || undefined} />
      </label>
      {state.errors?.alt_es ? <p className="adm-error">{state.errors.alt_es}</p> : null}
      <label>
        {t.altEn}
        <input type="text" name="alt_en" defaultValue={altEn} required maxLength={500} aria-invalid={Boolean(state.errors?.alt_en) || undefined} />
      </label>
      {state.errors?.alt_en ? <p className="adm-error">{state.errors.alt_en}</p> : null}
      <button type="submit" className="adm-btn adm-btn--small" disabled={pending}>
        {t.save}
      </button>
      {state.ok ? (
        <p className="adm-muted" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  )
}
