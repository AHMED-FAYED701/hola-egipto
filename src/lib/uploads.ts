import 'server-only'

import { randomBytes } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { imageSize } from '@/admin/scan'
import { slugify } from '@/lib/slug'

/**
 * Admin image uploads. Files live OUTSIDE the deployed app so they survive redeploys:
 * Hostinger runs each deploy from a fresh `…/hbuilds/versions/<id>/nodejs` folder.
 *
 * Folder: HOLA_UPLOAD_DIR when set; else, on Hostinger, `<domain folder>/hola-uploads`
 * (next to `hbuilds/`); else `./.uploads` (local dev, gitignored).
 * Public URL: /uploads/YYYY/MM/<name>-<random>.<ext>, served by src/app/(frontend)/uploads/[...path]/route.ts.
 */
export const UPLOAD_URL_PREFIX = '/uploads/'
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export const UPLOAD_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
}

export function uploadRoot(): string {
  const env = (process.env.HOLA_UPLOAD_DIR || '').trim()
  if (env) return path.resolve(/*turbopackIgnore: true*/ env)
  const cwd = process.cwd()
  const m = /^(.*?)[\\/]hbuilds[\\/]versions[\\/]/.exec(cwd)
  if (m) return path.join(/*turbopackIgnore: true*/ m[1], 'hola-uploads')
  return path.join(/*turbopackIgnore: true*/ cwd, '.uploads')
}

/** The real type from the first bytes (the browser's name/type are not trusted). SVG is never accepted. */
export function sniffImage(buf: Buffer): '.webp' | '.jpg' | '.png' | '.gif' | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return '.jpg'
  if (buf.toString('hex', 0, 8) === '89504e470d0a1a0a') return '.png'
  if (buf.toString('ascii', 0, 6) === 'GIF87a' || buf.toString('ascii', 0, 6) === 'GIF89a') return '.gif'
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return '.webp'
  return null
}

/** Absolute file for a public /uploads/… path, or null when the path is not a safe upload path. */
export function uploadFileFor(publicPath: string): string | null {
  if (!publicPath.startsWith(UPLOAD_URL_PREFIX)) return null
  const segs = publicPath.slice(UPLOAD_URL_PREFIX.length).split('/')
  if (!segs.length || segs.some((s) => !/^[a-z0-9][a-z0-9._-]*$/i.test(s) || s.includes('..'))) return null
  if (!UPLOAD_TYPES[path.extname(segs[segs.length - 1]).toLowerCase()]) return null
  const root = uploadRoot()
  const file = path.join(/*turbopackIgnore: true*/ root, ...segs)
  return file.startsWith(root + path.sep) ? file : null
}

export type UploadError = 'empty' | 'too_big' | 'type' | 'size'

/** Validate and store one image; returns its public path and pixel size. */
export async function storeUpload(name: string, buf: Buffer): Promise<{ path: string; width: number; height: number } | { error: UploadError }> {
  if (!buf.length) return { error: 'empty' }
  if (buf.length > MAX_UPLOAD_BYTES) return { error: 'too_big' }
  const ext = sniffImage(buf)
  if (!ext) return { error: 'type' }
  const size = imageSize(buf, ext)
  if (!size || !size.width || !size.height) return { error: 'size' }

  const now = new Date()
  const dir = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`
  const base = (slugify(path.basename(name, path.extname(name))) || 'image').slice(0, 80)
  const file = `${base}-${randomBytes(4).toString('hex')}${ext}`
  const publicPath = `${UPLOAD_URL_PREFIX}${dir}/${file}`
  const abs = uploadFileFor(publicPath)
  if (!abs) return { error: 'type' }

  await fs.mkdir(path.dirname(abs), { recursive: true })
  const tmp = `${abs}.${process.pid}.tmp`
  await fs.writeFile(tmp, buf)
  await fs.rename(tmp, abs)
  return { path: publicPath, ...size }
}

/** Remove the file behind an /uploads/… path (no-op for /images/… and missing files). */
export async function removeUpload(publicPath: string): Promise<void> {
  const abs = uploadFileFor(publicPath)
  if (!abs) return
  await fs.rm(abs, { force: true })
}
