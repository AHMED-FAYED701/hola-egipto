import { done, out } from './_lib'

// The only command that prints the preview key (contracts §9).
const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
out(`${base}/?hola_preview=${encodeURIComponent(process.env.HOLA_PREVIEW_KEY || '')}`)
done()
