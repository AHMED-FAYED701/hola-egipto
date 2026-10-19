import 'server-only'

import fs from 'node:fs/promises'
import path from 'node:path'

/** Width/height from the file header (PNG, JPEG, GIF, WebP, SVG); pure JS, no native modules (§19). */
export function imageSize(buf: Buffer, ext: string): { width: number; height: number } | null {
  if (ext === '.png' && buf.length > 24 && buf.toString('ascii', 12, 16) === 'IHDR') return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
  if (ext === '.gif' && buf.length > 10) return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) }
  if (ext === '.webp' && buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF') {
    const kind = buf.toString('ascii', 12, 16)
    if (kind === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) }
    if (kind === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff }
    if (kind === 'VP8L') {
      const b = buf.readUInt32LE(21)
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 }
    }
  }
  if ((ext === '.jpg' || ext === '.jpeg') && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return null
      const marker = buf[i + 1]
      const len = buf.readUInt16BE(i + 2)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }
      i += 2 + len
    }
  }
  if (ext === '.svg') {
    const s = buf.toString('utf8', 0, 2000)
    const w = /\swidth="(\d+(?:\.\d+)?)"/.exec(s)
    const h = /\sheight="(\d+(?:\.\d+)?)"/.exec(s)
    const vb = /viewBox="[\d.\s-]*?\s([\d.]+)\s([\d.]+)"/.exec(s)
    if (w && h) return { width: Math.round(Number(w[1])), height: Math.round(Number(h[1])) }
    if (vb) return { width: Math.round(Number(vb[1])), height: Math.round(Number(vb[2])) }
  }
  return null
}

const EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.avif'])

/** Every image under public/images/ with its size and a provisional alt from the file name. */
export async function scanPublicImages(): Promise<{ path: string; width: number; height: number; alt_es: string; alt_en: string }[]> {
  const root = path.join(process.cwd(), 'public', 'images')
  const out: { path: string; width: number; height: number; alt_es: string; alt_en: string }[] = []
  async function walk(dir: string) {
    let entries: import('node:fs').Dirent[] = []
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) await walk(full)
      else if (EXTS.has(path.extname(e.name).toLowerCase())) {
        const rel = '/images/' + path.relative(root, full).split(path.sep).join('/')
        if (rel.length > 191) continue
        const fh = await fs.open(full, 'r')
        const buf = Buffer.alloc(65536)
        const { bytesRead } = await fh.read(buf, 0, buf.length, 0)
        await fh.close()
        const size = imageSize(buf.subarray(0, bytesRead), path.extname(e.name).toLowerCase())
        if (!size || !size.width || !size.height) continue
        const name = path.basename(e.name, path.extname(e.name)).replace(/[-_]+/g, ' ')
        out.push({ path: rel, ...size, alt_es: `[pendiente] ${name}`, alt_en: `[pending] ${name}` })
      }
    }
  }
  await walk(root)
  return out
}
