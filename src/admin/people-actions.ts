'use server'

import { randomBytes } from 'node:crypto'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { endSession, requireAdmin, requireUser } from '@/lib/auth'
import { deleteInquiries, INQUIRY_STATUSES, type InquiryStatus, setInquiryStatus } from '@/lib/content/inquiries'
import { checkPassword, createUser, deleteUser, getUser, getUserByEmail, MIN_PASSWORD, type Role, setPassword, setRole } from '@/lib/content/users'

import type { FormState } from './form/types'
import { DICTS } from './i18n'
import { adminLang } from './server'

export async function setInquiryStatusAction(id: number, data: FormData): Promise<void> {
  await requireUser(`/admin/inquiries/${id}`)
  const status = String(data.get('status'))
  if ((INQUIRY_STATUSES as readonly string[]).includes(status)) await setInquiryStatus(id, status as InquiryStatus)
  redirect(`/admin/inquiries/${id}?saved=1`)
}

export async function deleteInquiryAction(id: number): Promise<void> {
  await requireUser('/admin/inquiries')
  await deleteInquiries([id])
  redirect('/admin/inquiries?deleted=1')
}

/** A readable random password (shown once). */
const newPassword = () => randomBytes(12).toString('base64url')

export interface UserState extends FormState {
  password?: string
  email?: string
}

const addSchema = z.object({ email: z.string().trim().toLowerCase().email().max(191), role: z.enum(['admin', 'editor']) })

/** Add a user with a generated password, shown once (contracts §18; admins only). */
export async function addUserAction(_prev: UserState, data: FormData): Promise<UserState> {
  await requireAdmin('/admin/users')
  const t = DICTS[await adminLang()]
  const parsed = addSchema.safeParse({ email: data.get('email'), role: data.get('role') })
  if (!parsed.success) return { message: t.errors, errors: { email: t.email } }
  if (await getUserByEmail(parsed.data.email)) return { message: t.errors, errors: { email: '✗' } }
  const password = newPassword()
  await createUser(parsed.data.email, password, parsed.data.role as Role)
  return { ok: true, message: t.passwordShownOnce, password, email: parsed.data.email }
}

export async function resetPasswordAction(id: number, _prev: UserState, _data: FormData): Promise<UserState> {
  const me = await requireAdmin('/admin/users')
  const t = DICTS[await adminLang()]
  const user = await getUser(id)
  if (!user || user.id === me.id) return { message: t.errors }
  const password = newPassword()
  await setPassword(id, password)
  return { ok: true, message: t.passwordShownOnce, password, email: user.email }
}

export async function setRoleAction(id: number, data: FormData): Promise<void> {
  const me = await requireAdmin('/admin/users')
  const role = String(data.get('role'))
  if (id !== me.id && (role === 'admin' || role === 'editor')) await setRole(id, role)
  redirect('/admin/users?saved=1')
}

export async function deleteUserAction(id: number): Promise<void> {
  const me = await requireAdmin('/admin/users')
  if (id !== me.id) await deleteUser(id)
  redirect('/admin/users?deleted=1')
}

/** Change own password: current password, new one twice; ends every session (session_version bump). */
export async function changeOwnPasswordAction(_prev: FormState, data: FormData): Promise<FormState> {
  const me = await requireUser('/admin/account')
  const t = DICTS[await adminLang()]
  const current = String(data.get('current') || '')
  const next = String(data.get('password') || '')
  const repeat = String(data.get('repeat') || '')
  const user = await getUser(me.id)
  if (!user || !(await checkPassword(current, user.password_hash))) return { message: t.errors, errors: { current: t.wrongPassword } }
  if (next.length < MIN_PASSWORD) return { message: t.errors, errors: { password: t.passwordRule } }
  if (next !== repeat) return { message: t.errors, errors: { repeat: t.passwordsDiffer } }
  await setPassword(me.id, next)
  await endSession()
  redirect('/admin/login?changed=1')
}
