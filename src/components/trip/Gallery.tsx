'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { Img } from '@/lib/media'

import s from './trip.module.css'

/** Mosaic (1 + 4) that opens a <dialog> lightbox with a CSS scroll-snap track. No carousel library. */
export function Gallery({ images, labels }: { images: Img[]; labels: { gallery: string; open: string; close: string; prev: string; next: string } }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const go = (i: number) => {
    const n = (i + images.length) % images.length
    setIndex(n)
    track.current?.children[n]?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }
  const open = (i: number) => {
    dialog.current?.showModal()
    requestAnimationFrame(() => go(i))
  }
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1)
      if (e.key === 'ArrowLeft') go(index - 1)
    }
    d.addEventListener('keydown', onKey)
    return () => d.removeEventListener('keydown', onKey)
  })
  if (!images.length) return null
  return (
    <section className={s.gallery} aria-label={labels.gallery}>
      <div className={s.mosaic}>
        {images.slice(0, 5).map((im, i) => (
          <button key={im.src} type="button" className={i === 0 ? s.mosaicMain : s.mosaicItem} onClick={() => open(i)} aria-label={labels.open.replace('{n}', String(i + 1)).replace('{total}', String(images.length))}>
            <Image src={im.src} alt={im.alt} width={im.width} height={im.height} sizes={i === 0 ? '(min-width: 1024px) 600px, 100vw' : '(min-width: 1024px) 300px, 50vw'} loading={i === 0 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>
      <dialog ref={dialog} className={s.lightbox} aria-label={labels.gallery}>
        <div className={s.lightboxBar}>
          <span aria-live="polite">
            {index + 1} / {images.length}
          </span>
          <button type="button" onClick={() => dialog.current?.close()} aria-label={labels.close} autoFocus>
            <X aria-hidden="true" />
          </button>
        </div>
        <div className={s.track} ref={track}>
          {images.map((im) => (
            <figure key={im.src}>
              <Image src={im.src} alt={im.alt} width={im.width} height={im.height} sizes="100vw" loading="lazy" />
              <figcaption>{im.alt}</figcaption>
            </figure>
          ))}
        </div>
        <div className={s.lightboxNav}>
          <button type="button" onClick={() => go(index - 1)} aria-label={labels.prev}>
            <ChevronLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label={labels.next}>
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </dialog>
    </section>
  )
}
