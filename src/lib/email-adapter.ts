import type { EmailAdapter } from 'payload'

import { sendMail } from './mail'

/** Payload's own mail (password reset, verification) also goes through sendMail() and its dev redirect. */
export const holaEmailAdapter: EmailAdapter = () => ({
  name: 'hola-sendmail',
  defaultFromAddress: process.env.SMTP_FROM || 'noreply@hola-egipto.com',
  defaultFromName: 'Hola Egipto',
  sendEmail: async (message) => {
    const to = Array.isArray(message.to) ? message.to.map(String) : [String(message.to)]
    const text = typeof message.text === 'string' ? message.text : String(message.html || '').replace(/<[^>]+>/g, ' ')
    return sendMail({ to, subject: String(message.subject || ''), text })
  },
})
