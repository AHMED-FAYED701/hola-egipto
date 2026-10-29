'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import type { Dict } from '../i18n'
import { uploadOne } from './upload-client'

/** Images page: pick one or more files; each is shrunk, uploaded and added to the library. */
export function ImageUpload({ t }: { t: Dict }) {
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState('')
  const [done, setDone] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  async function onFiles(files: FileList | null) {
    if (!files?.length) return
    const list = Array.from(files)
    const errs: string[] = []
    let ok = 0
    setErrors([])
    setDone(0)
    for (const [i, f] of list.entries()) {
      setBusy(`${t.uploading} ${i + 1}/${list.length} · ${f.name}`)
      const r = await uploadOne(f)
      if (r.ok) ok++
      else errs.push(r.message)
    }
    setBusy('')
    setDone(ok)
    setErrors(errs)
    if (input.current) input.current.value = ''
    if (ok) router.refresh()
  }

  return (
    <div className="adm-upload">
      <label className="adm-btn adm-btn--primary">
        {t.upload}
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden disabled={Boolean(busy)} onChange={(e) => onFiles(e.target.files)} />
      </label>
      <p className="adm-help">{t.uploadHelp}</p>
      {busy ? (
        <p className="adm-muted" role="status">
          {busy}
        </p>
      ) : null}
      {done ? (
        <p className="adm-flash" role="status">
          {t.uploaded} {done}
        </p>
      ) : null}
      {errors.length ? (
        <div className="adm-flash adm-flash--error" role="alert">
          <p>{t.upload_failed}</p>
          <ul>
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
