/** `pnpm -s hola:preview-url`: `<SITE_URL>/?hola_preview=<HOLA_PREVIEW_KEY>` (contracts §9). */
import { out, siteUrl } from './_cli'

out(`${siteUrl()}/?hola_preview=${encodeURIComponent(process.env.HOLA_PREVIEW_KEY || '')}`)
