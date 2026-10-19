'use client'

import { useActionState } from 'react'

import type { UserState } from '../people-actions'
import type { Dict } from '../i18n'
import type { FormState } from './types'

type Action = (p: UserState, d: FormData) => Promise<UserState>

function Shown({ state }: { state: UserState }) {
  if (!state.password) return null
  return (
    <p className="adm-flash" role="status">
      {state.email}: {state.message} <code>{state.password}</code>
    </p>
  )
}

export function AddUserForm({ action, t }: { action: Action; t: Dict }) {
  const [state, formAction, pending] = useActionState(action, {} as UserState)
  return (
    <form action={formAction} className="adm-row">
      <label htmlFor="new-email">{t.email}</label>
      <input id="new-email" type="email" name="email" required aria-invalid={Boolean(state.errors?.email) || undefined} />
      <select name="role" defaultValue="editor" aria-label={t.role}>
        <option value="editor">{t.role_editor}</option>
        <option value="admin">{t.role_admin}</option>
      </select>
      <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
        {t.addUser}
      </button>
      {state.errors?.email ? <p className="adm-error">{state.errors.email}</p> : null}
      <Shown state={state} />
    </form>
  )
}

export function ResetPasswordForm({ action, t }: { action: Action; t: Dict }) {
  const [state, formAction, pending] = useActionState(action, {} as UserState)
  return (
    <form action={formAction}>
      <button type="submit" className="adm-btn adm-btn--small" disabled={pending}>
        {t.resetPassword}
      </button>
      <Shown state={state} />
    </form>
  )
}

export function OwnPasswordForm({ action, t }: { action: (p: FormState, d: FormData) => Promise<FormState>; t: Dict }) {
  const [state, formAction, pending] = useActionState(action, {} as FormState)
  const err = (k: string) => (state.errors?.[k] ? <p className="adm-error">{state.errors[k]}</p> : null)
  return (
    <form action={formAction} className="adm-list" style={{ maxWidth: '26rem' }}>
      <label>
        {t.currentPassword}
        <input type="password" name="current" autoComplete="current-password" required />
      </label>
      {err('current')}
      <label>
        {t.passwordNew} <span className="adm-muted">({t.passwordRule})</span>
        <input type="password" name="password" autoComplete="new-password" minLength={10} required />
      </label>
      {err('password')}
      <label>
        {t.passwordRepeat}
        <input type="password" name="repeat" autoComplete="new-password" minLength={10} required />
      </label>
      {err('repeat')}
      <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
        {t.changePassword}
      </button>
    </form>
  )
}
