import fs from 'node:fs/promises'
import path from 'node:path'

import { getSharedSettings } from '@/lib/content/read'
import { whatsappUrl } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

let logoCache: string | null = null

async function logo(): Promise<string> {
  if (logoCache === null) {
    try {
      logoCache = await fs.readFile(
        path.join(process.cwd(), 'public/brand/hola-egipto-logo-stacked-color.svg'),
        'utf8',
      )
    } catch {
      logoCache = ''
    }
  }
  return logoCache
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

/** Coming-soon page served (via rewrite from src/proxy.ts) to visitors while HOLA_COMING_SOON=1. */
async function render(): Promise<Response> {
  const settings = await getSharedSettings().catch(() => null)
  const wa = settings?.whatsapp_number
    ? whatsappUrl({ number: settings.whatsapp_number, message: settings.whatsapp_message_es || 'Hola, quiero planificar un viaje a Egipto' })
    : null
  // The page has one <title>: drop the SVG's own title (aria-label stays).
  const svg = (await logo()).replace('<svg ', '<svg class="logo" ').replace(/<title>[^<]*<\/title>/, '')
  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hola Egipto · Muy pronto</title>
<meta name="robots" content="noindex,nofollow">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<style>
@font-face{font-family:'Fraunces';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/fraunces-latin-600-normal.woff2') format('woff2')}
@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/plus-jakarta-sans-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/plus-jakarta-sans-latin-600-normal.woff2') format('woff2')}
:root{--he-deep-oasis:#133232;--he-nile-teal:#145B6B;--he-papyrus:#F7F1E6;--he-stone:#5B6664;--he-terracotta-ink:#A84F25;--he-whatsapp:#25D366}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem;
background:var(--he-papyrus) url('/brand/pattern/hola-egipto-pattern-papyrus-tile.svg') repeat;background-size:160px;
color:var(--he-deep-oasis);font:400 1.0625rem/1.65 'Plus Jakarta Sans',system-ui,sans-serif;text-align:center}
main{max-width:36rem;background:var(--he-papyrus);padding:2.5rem 1.5rem;border-radius:18px}
.logo{width:min(260px,70vw);height:auto}
h1{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:clamp(2rem,1.5rem + 2vw,3rem);line-height:1.12;margin:1.5rem 0 1rem;letter-spacing:-0.01em}
p{margin:.5rem 0;color:var(--he-deep-oasis)}
p[lang=en]{color:var(--he-stone)}
.wa{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.5rem;min-height:44px;padding:.75rem 1.25rem;border-radius:4px;background:var(--he-whatsapp);color:var(--he-deep-oasis);font-weight:600;text-decoration:none}
.wa:focus-visible{outline:2px solid var(--he-nile-teal);outline-offset:2px}
</style>
</head>
<body>
<main>
${svg}
<h1>Muy pronto · Coming soon</h1>
<p>Estamos preparando nuestros viajes por Egipto, cruceros por el Nilo y excursiones en el Mar Rojo.</p>
<p lang="en">We are getting our Egypt tours, Nile cruises and Red Sea excursions ready.</p>
${wa ? `<a class="wa" href="${esc(wa)}" data-he-event="whatsapp_click" data-he-location="coming_soon">WhatsApp</a>` : ''}
</main>
</body>
</html>`
  return new Response(html, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '86400',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  })
}

export const GET = render
export const HEAD = render
