'use client'

import { uploadImageAction, type UploadResult } from '../global-actions'

const MAX_SIDE = 2400

/**
 * Shrink big photos in the browser before upload (max 2400 px, WebP — JPEG where the browser cannot
 * encode WebP). GIFs and small files are sent as they are; anything the browser cannot decode is sent
 * unchanged and the server decides.
 */
export async function prepareImage(file: File): Promise<File> {
  if (file.type === 'image/gif') return file
  let bmp: ImageBitmap
  try {
    bmp = await createImageBitmap(file)
  } catch {
    return file
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height))
  if (scale === 1 && file.size <= 1_500_000 && /^image\/(webp|jpeg|png)$/.test(file.type)) {
    bmp.close()
    return file
  }
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  const g = canvas.getContext('2d')
  if (!g) return file
  g.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  bmp.close()
  const toBlob = (type: string) => new Promise<Blob | null>((res) => canvas.toBlob(res, type, 0.85))
  let blob = await toBlob('image/webp')
  if (!blob || blob.type !== 'image/webp') blob = await toBlob('image/jpeg')
  if (!blob) return file
  const ext = blob.type === 'image/webp' ? '.webp' : '.jpg'
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + ext, { type: blob.type })
}

export async function uploadOne(file: File, alt?: { es?: string; en?: string }): Promise<UploadResult> {
  const fd = new FormData()
  fd.set('file', await prepareImage(file))
  if (alt?.es) fd.set('alt_es', alt.es)
  if (alt?.en) fd.set('alt_en', alt.en)
  try {
    return await uploadImageAction(fd)
  } catch (e) {
    return { ok: false, message: `${file.name}: ${e instanceof Error ? e.message : String(e)}` }
  }
}
