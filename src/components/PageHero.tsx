import Image from 'next/image'
import type { ReactNode } from 'react'

import type { Img } from '@/lib/media'

import s from './pagehero.module.css'

/** Archive / landing hero: image with a deep-oasis overlay, H1 and intro. */
export function PageHero({ title, intro, image, eyebrow, children }: { title: string; intro?: string | null; image?: Img | null; eyebrow?: string | null; children?: ReactNode }) {
  return (
    <section className={`${s.hero} ${image ? s.withImage : ''} he-dark`}>
      {image ? <Image className={s.bg} src={image.src} alt={image.alt} fill sizes="100vw" fetchPriority="high" loading="eager" /> : null}
      <div className={`container ${s.inner}`}>
        {eyebrow ? <span className="he-eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {intro ? <p className={s.intro}>{intro}</p> : null}
        {children}
      </div>
    </section>
  )
}
