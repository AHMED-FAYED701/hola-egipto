'use client'

import { useActionState } from 'react'

import { type AuthState, loginAction, setupAction } from './actions'
import type { Dict } from './i18n'

export function LoginForm({ next, t }: { next: string; t: Dict }) {
  const [state, action, pending] = useActionState(loginAction, {} as AuthState)
  return (
    <form action={action}>
      <input type="hidden" name="next" value={next} />
      {state.error ? (
        <p className="adm-flash adm-flash--error" role="alert">
          {state.error}
        </p>
      ) : null}
      <label>
        {t.email}
        <input type="email" name="email" autoComplete="username" required />
      </label>
      <label>
        {t.password}
        <input type="password" name="password" autoComplete="current-password" required />
      </label>
      <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
        {t.login}
      </button>
    </form>
  )
}

export function SetupForm({ setupKey, t }: { setupKey: string; t: Dict }) {
  const [state, action, pending] = useActionState(setupAction, {} as AuthState)
  return (
    <form action={action}>
      <input type="hidden" name="key" value={setupKey} />
      {state.error ? (
        <p className="adm-flash adm-flash--error" role="alert">
          {state.error}
        </p>
      ) : null}
      <label>
        {t.email}
        <input type="email" name="email" autoComplete="username" required />
      </label>
      <label>
        {t.password} <span className="adm-muted">({t.passwordRule})</span>
        <input type="password" name="password" autoComplete="new-password" minLength={10} required />
      </label>
      <label>
        {t.passwordRepeat}
        <input type="password" name="repeat" autoComplete="new-password" minLength={10} required />
      </label>
      <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
        {t.create}
      </button>
    </form>
  )
}
