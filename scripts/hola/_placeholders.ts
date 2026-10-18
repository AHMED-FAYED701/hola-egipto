import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import config from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

import { log } from './_lib'
import { PLACEHOLDERS, type Placeholder } from './data/media'

/**
 * Branded placeholder JPEGs (content rules §4): the deep/teal pattern tile at 2× tiled, with a centred
 * papyrus label "FOTO DE MUESTRA · SAMPLE PHOTO" + subject. Stored in `media` with holaSample: true.
 * Idempotent: an existing file is kept unless --force (then its file is replaced in place).
 */
export const SIZES: Record<Placeholder['size'], [number, number]> = {
  hero: [2400, 1350],
  card: [1600, 1200],
  tile: [1200, 1600],
  gallery: [2000, 1333],
}

const PATTERN_DIR = path.resolve(process.cwd(), 'kit/brand/03-pattern')
const tileCache = new Map<string, Buffer>()

async function tile(bg: Placeholder['bg']): Promise<Buffer> {
  const cached = tileCache.get(bg)
  if (cached) return cached
  const svg = await fs.readFile(path.join(PATTERN_DIR, `hola-egipto-pattern-${bg}-tile.svg`))
  const png = await sharp(svg, { density: 144 }).resize(320, 320).png().toBuffer()
  tileCache.set(bg, png)
  return png
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function renderPlaceholder(ph: Placeholder): Promise<Buffer> {
  const [w, h] = SIZES[ph.size]
  const unit = Math.min(w, h)
  const small = Math.round(unit * 0.032)
  const big = Math.round(unit * 0.05)
  const boxW = Math.round(Math.min(w * 0.82, Math.max(ph.subject.length * big * 0.56, 29 * small * 0.75) + unit * 0.12))
  const boxH = Math.round(small + big + unit * 0.14)
  const x = Math.round((w - boxW) / 2)
  const y = Math.round((h - boxH) / 2)
  const label = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="${Math.round(unit * 0.018)}" fill="#F7F1E6"/>
  <rect x="${x + 8}" y="${y + 8}" width="${boxW - 16}" height="${boxH - 16}" rx="${Math.round(unit * 0.012)}" fill="none" stroke="#E0B57C" stroke-width="3"/>
  <text x="${w / 2}" y="${y + boxH * 0.4}" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="${small}" letter-spacing="${Math.round(small * 0.12)}" fill="#A84F25">FOTO DE MUESTRA · SAMPLE PHOTO</text>
  <text x="${w / 2}" y="${y + boxH * 0.76}" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="${big}" fill="#133232">${esc(ph.subject)}</text>
</svg>`
  const base = sharp({ create: { width: w, height: h, channels: 3, background: ph.bg === 'teal' ? '#145B6B' : '#133232' } })
  return base
    .composite([{ input: await tile(ph.bg), tile: true, gravity: 'northwest' }, { input: Buffer.from(label) }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
}

export const fileNameFor = (key: string) => `hola-sample-${key}.jpg`

/** Ensure every placeholder exists in `media`; returns key → media id. */
export async function ensurePlaceholders(force = false): Promise<Record<string, number>> {
  const payload = await getPayload({ config })
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'hola-ph-'))
  const ids: Record<string, number> = {}
  let created = 0
  let replaced = 0
  try {
    for (const ph of PLACEHOLDERS) {
      const filename = fileNameFor(ph.key)
      const found = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, depth: 0, overrideAccess: true })
      const existing = found.docs[0]
      if (existing && !force) {
        ids[ph.key] = existing.id
        continue
      }
      const filePath = path.join(tmp, filename)
      await fs.writeFile(filePath, await renderPlaceholder(ph))
      let id: number
      if (existing) {
        const doc = await payload.update({
          collection: 'media',
          id: existing.id,
          filePath,
          overwriteExistingFiles: true,
          data: { alt: ph.alt.es, holaSample: true },
          locale: 'es',
          overrideAccess: true,
          context: { disableRevalidate: true },
        })
        id = doc.id
        replaced++
      } else {
        const doc = await payload.create({
          collection: 'media',
          filePath,
          data: { alt: ph.alt.es, holaSample: true },
          locale: 'es',
          overrideAccess: true,
          context: { disableRevalidate: true },
        })
        id = doc.id
        created++
      }
      await payload.update({ collection: 'media', id, data: { alt: ph.alt.en }, locale: 'en', overrideAccess: true, context: { disableRevalidate: true } })
      ids[ph.key] = id
      log(`placeholder ${filename}`)
    }
  } finally {
    await fs.rm(tmp, { recursive: true, force: true })
  }
  log(`placeholders: ${created} created, ${replaced} replaced, ${PLACEHOLDERS.length} total`)
  return ids
}
