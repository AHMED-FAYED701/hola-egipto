import { getPayloadClient } from './payload'

export interface SharedSettings {
  whatsapp_number: string
  whatsapp_message_es: string
  whatsapp_message_en: string
}

/** Minimal settings read used outside the localized front end (coming-soon page). */
export async function getSharedSettings(): Promise<SharedSettings | null> {
  const payload = await getPayloadClient()
  const es = await payload.findGlobal({ slug: 'site-settings', locale: 'es', depth: 0 })
  const en = await payload.findGlobal({ slug: 'site-settings', locale: 'en', depth: 0 })
  return {
    whatsapp_number: es.whatsapp_number || '',
    whatsapp_message_es: es.whatsapp_message_default || '',
    whatsapp_message_en: en.whatsapp_message_default || '',
  }
}
