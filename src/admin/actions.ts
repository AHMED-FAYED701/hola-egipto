'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { clearAttempts, countUsers, createUser, failedAttempts, getUserByEmail, MAX_FAILED, MIN_PASSWORD, recordFailedAttempt, checkPassword, touchLogin } from '@/lib/content/users'
import { endSession, requestIpHash, requireUser, safeNext, startSession } from '@/lib/auth'
import { renderMarkdown } from '@/lib/markdown'
import { safeEqual } from '@/lib/secrets'
import { siteUrl } from '@/lib/site'

import { ADMIN_LANG_COOKIE, DICTS, isAdminLang } from './i18n'
import { adminLang } from './server'

export interface AuthState {
  error?: string
}

const loginSchema = z.object({ email: z.string().trim().toLowerCase().email().max(191), password: z.string().min(1).max(200) })

/** Login (contracts §18): generic error; 5 failures per ip_hash or email in 15 minutes lock it until the window passes. */
export async function loginAction(_prev: AuthState, data: FormData): Promise<AuthState> {
  const t = DICTS[await adminLang()]
  const parsed = loginSchema.safeParse({ email: data.get('email'), password: data.get('password') })
  const email = parsed.success ? parsed.data.email : String(data.get('email') || '').trim().toLowerCase().slice(0, 191)
  const ip = await requestIpHash()
  if ((await failedAttempts(ip, email)) >= MAX_FAILED) return { error: t.loginFailed }
  const user = parsed.success ? await getUserByEmail(parsed.data.email) : null
  const ok = user && parsed.success ? await checkPassword(parsed.data.password, user.password_hash) : false
  if (!user || !ok) {
    await recordFailedAttempt(ip, email || '-')
    return { error: t.loginFailed }
  }
  await clearAttempts(ip, email)
  await touchLogin(user.id)
  await startSession(user.id, user.session_version)
  redirect(safeNext(data.get('next')))
}

export async function logoutAction(): Promise<void> {
  await endSession()
  redirect('/admin/login')
}

const setupSchema = z
  .object({ key: z.string(), email: z.string().trim().toLowerCase().email().max(191), password: z.string().min(MIN_PASSWORD).max(200), repeat: z.string() })
  .refine((v) => v.password === v.repeat, { path: ['repeat'] })

/** First admin (contracts §18): only while there are 0 users and with the setup key. */
export async function setupAction(_prev: AuthState, data: FormData): Promise<AuthState> {
  const t = DICTS[await adminLang()]
  const key = String(data.get('key') || '')
  const expected = process.env.HOLA_PREVIEW_KEY || ''
  if (!expected || !safeEqual(key, expected) || (await countUsers()) > 0) redirect('/admin/login')
  const parsed = setupSchema.safeParse(Object.fromEntries(['key', 'email', 'password', 'repeat'].map((k) => [k, String(data.get(k) || '')])))
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const field = String(issue?.path[0] || '')
    return { error: field === 'repeat' ? t.passwordsDiffer : field === 'password' ? t.passwordRule : `${t.email}: ${t.required}` }
  }
  const id = await createUser(parsed.data.email, parsed.data.password, 'admin')
  await startSession(id, 1)
  redirect('/admin')
}

/** UI language toggle (cookie `hola_admin_lang`). */
export async function setAdminLangAction(data: FormData): Promise<void> {
  const lang = String(data.get('lang'))
  if (isAdminLang(lang)) {
    ;(await cookies()).set(ADMIN_LANG_COOKIE, lang, { path: '/', sameSite: 'lax', httpOnly: true, maxAge: 365 * 24 * 3600, secure: siteUrl().startsWith('https') })
  }
  redirect(safeNext(data.get('back')))
}

/** Markdown preview for the editors: the same server renderer as the site. */
export async function previewMarkdownAction(md: string): Promise<string> {
  await requireUser()
  return renderMarkdown(String(md || '').slice(0, 200_000))
}
