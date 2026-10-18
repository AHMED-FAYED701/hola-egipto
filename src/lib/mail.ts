import fs from 'node:fs/promises'
import path from 'node:path'

import { flag } from './secrets'

export interface MailInput {
  to: string | string[]
  subject: string
  text: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
}

export interface MailResult {
  sent: boolean
  to: string
}

const list = (v?: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []).map((s) => s.trim()).filter(Boolean)
const clean = (s: string) => s.replace(/[\t\r\n]+/g, ' ')

/**
 * The only way the site sends mail (contracts §7).
 * - While HOLA_DEV_MODE=1 the recipient becomes ADMIN_EMAIL, the subject gets "[DEV → <original>]", Cc/Bcc are dropped.
 * - Nothing is sent when ADMIN_EMAIL (dev) or SMTP_HOST is empty.
 * - Every call appends `<ISO time>\tto=<final or (not-sent)>\torig=<original>\tsubject=<subject>` to HOLA_MAIL_LOG.
 */
export async function sendMail(input: MailInput): Promise<MailResult> {
  const original = list(input.to)
  const dev = flag('HOLA_DEV_MODE')
  const admin = (process.env.ADMIN_EMAIL || '').trim()
  const smtp = (process.env.SMTP_HOST || '').trim()
  let to = original
  let subject = input.subject
  let cc = list(input.cc)
  let bcc = list(input.bcc)
  if (dev) {
    to = admin ? [admin] : []
    subject = `[DEV → ${original.join(', ')}] ${input.subject}`
    cc = []
    bcc = []
  }
  let sent = false
  if (to.length && smtp) {
    try {
      const nodemailer = await import('nodemailer')
      const transport = nodemailer.createTransport({
        host: smtp,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' } : undefined,
      })
      await transport.sendMail({
        from: process.env.SMTP_FROM || admin || undefined,
        to,
        cc: cc.length ? cc : undefined,
        bcc: bcc.length ? bcc : undefined,
        replyTo: input.replyTo,
        subject,
        text: input.text,
      })
      sent = true
    } catch (e) {
      console.warn(`[mail] not sent: ${(e as Error).message}`)
    }
  }
  const finalTo = sent ? to.join(', ') : '(not-sent)'
  const line = `${new Date().toISOString()}\tto=${clean(finalTo)}\torig=${clean(original.join(', '))}\tsubject=${clean(subject)}\n`
  try {
    const file = path.resolve(process.cwd(), process.env.HOLA_MAIL_LOG || 'kit/logs/mail.log')
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.appendFile(file, line, 'utf8')
  } catch (e) {
    console.warn(`[mail] log not written: ${(e as Error).message}`)
  }
  return { sent, to: finalTo }
}
