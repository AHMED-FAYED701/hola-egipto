import { getPayloadClient } from './payload'

export interface SharedSettings {
  whatsapp_number: string
  whatsapp_message_es: string
  whatsapp_message_en: string
}

/** Minimal settings read used outside the localized front end (coming-soon page). */
export async function getSharedSettings(): Promise<SharedSettings | null> {
  const payload = await getPayloadClient()
  // site-settings is added in S3; until then this throws and callers fall back.
  const es = (await payload.findGlobal({ slug: 'site-settings' as never, locale: 'es', depth: 0 })) as Record<string, unknown>
  const en = (await payload.findGlobal({ slug: 'site-settings' as never, locale: 'en', depth: 0 })) as Record<string, unknown>
  return {
    whatsapp_number: String(es.whatsapp_number || ''),
    whatsapp_message_es: String(es.whatsapp_message_default || ''),
    whatsapp_message_en: String(en.whatsapp_message_default || ''),
  }
}
