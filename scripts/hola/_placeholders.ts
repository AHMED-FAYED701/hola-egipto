/**
 * Branded placeholder images (content rules §4): the deep/teal pattern tile at 2× scale, tiled, with a
 * centred papyrus label "FOTO DE MUESTRA · SAMPLE PHOTO" + subject. WebP (quality 75) in
 * public/images/samples/. Dev-time only (sharp is a devDependency, never imported by the app).
 */
import fs from 'node:fs/promises'
import path from 'node:path'

import type { Placeholder } from './data/media'

export const SIZES: Record<Placeholder['size'], [number, number]> = {
  hero: [1920, 1080],
  card: [1200, 900],
  tile: [900, 1200],
  gallery: [1600, 1067],
}

export const SAMPLES_DIR = path.resolve(process.cwd(), 'public/images/samples')
export const fileNameFor = (key: string) => `${key}.webp`
export const imagePath = (key: string) => `/images/samples/${fileNameFor(key)}`

const PATTERN_DIR = path.resolve(process.cwd(), 'kit/brand/03-pattern')
const tileCache = new Map<string, Buffer>()
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function sharpLib() {
  return (await import('sharp')).default
}

/** The brand pattern tile rendered at 2× its native size. */
async function tile(bg: Placeholder['bg']): Promise<Buffer> {
  const cached = tileCache.get(bg)
  if (cached) return cached
  const sharp = await sharpLib()
  const svg = await fs.readFile(path.join(PATTERN_DIR, `hola-egipto-pattern-${bg}-tile.svg`))
  const meta = await sharp(svg).metadata()
  const size = Math.round((meta.width || 160) * 2)
  const png = await sharp(svg, { density: 144 }).resize(size, size).png().toBuffer()
  tileCache.set(bg, png)
  return png
}

export async function renderPlaceholder(ph: Placeholder): Promise<Buffer> {
  const sharp = await sharpLib()
  const [w, h] = SIZES[ph.size]
  const unit = Math.min(w, h)
  const small = Math.round(unit * 0.032)
  const big = Math.round(unit * 0.05)
  const boxW = Math.round(Math.min(w * 0.86, Math.max(ph.subject.length * big * 0.56, 29 * small * 0.75) + unit * 0.12))
  const boxH = Math.round(small + big + unit * 0.14)
  const x = Math.round((w - boxW) / 2)
  const y = Math.round((h - boxH) / 2)
  const label = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="${Math.round(unit * 0.018)}" fill="#F7F1E6"/>
  <rect x="${x + 8}" y="${y + 8}" width="${boxW - 16}" height="${boxH - 16}" rx="${Math.round(unit * 0.012)}" fill="none" stroke="#E0B57C" stroke-width="3"/>
  <text x="${w / 2}" y="${y + boxH * 0.4}" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="${small}" letter-spacing="${Math.round(small * 0.12)}" fill="#A84F25">FOTO DE MUESTRA · SAMPLE PHOTO</text>
  <text x="${w / 2}" y="${y + boxH * 0.76}" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="${big}" fill="#133232">${esc(ph.subject)}</text>
</svg>`
  return sharp({ create: { width: w, height: h, channels: 3, background: ph.bg === 'teal' ? '#145B6B' : '#133232' } })
    .composite([{ input: await tile(ph.bg), tile: true, gravity: 'northwest' }, { input: Buffer.from(label) }])
    .webp({ quality: 75 })
    .toBuffer()
}
