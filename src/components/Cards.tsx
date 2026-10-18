import Image from 'next/image'
import { Clock } from 'lucide-react'

import type { Img } from '@/lib/media'
import type { TripCardData } from '@/lib/trips'

import s from './cards.module.css'

const SIZES_3COL = '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw'

export function TripCard({ trip, fromLabel, headingLevel = 3 }: { trip: TripCardData; fromLabel: string; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <article className={s.card}>
      <div className={s.media}>
        {trip.image ? <Image src={trip.image.src} alt={trip.image.alt} width={trip.image.width} height={trip.image.height} sizes={SIZES_3COL} loading="lazy" /> : null}
        <span className={s.chip}>
          <Clock aria-hidden="true" strokeWidth={1.75} />
          {trip.duration}
        </span>
      </div>
      <div className={s.body}>
        <H className={s.title}>
          <a href={trip.href}>{trip.title}</a>
        </H>
        {trip.destinations ? <p className={s.dests}>{trip.destinations}</p> : null}
        {trip.price ? (
          <p className={s.price}>
            <span>{fromLabel}</span> <strong>{trip.price}</strong> <span>{trip.basis}</span>
          </p>
        ) : null}
      </div>
    </article>
  )
}

export function DestinationTile({ href, title, tagline, image }: { href: string; title: string; tagline?: string | null; image: Img | null }) {
  return (
    <a className={s.tile} href={href}>
      {image ? <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw" loading="lazy" /> : null}
      <span className={s.tileText}>
        <h3>{title}</h3>
        {tagline ? <p>{tagline}</p> : null}
      </span>
    </a>
  )
}

export function GuideCard({ href, title, excerpt, image, meta }: { href: string; title: string; excerpt?: string | null; image: Img | null; meta?: string | null }) {
  return (
    <article className={s.card}>
      <div className={s.media}>
        {image ? <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={SIZES_3COL} loading="lazy" /> : null}
      </div>
      <div className={s.body}>
        {meta ? <p className={s.meta}>{meta}</p> : null}
        <h3 className={s.title}>
          <a href={href}>{title}</a>
        </h3>
        {excerpt ? <p className={s.excerpt}>{excerpt}</p> : null}
      </div>
    </article>
  )
}

export function MiniTripCard({ href, title, image, sub }: { href: string; title: string; image: Img | null; sub?: string | null }) {
  return (
    <a className={s.mini} href={href}>
      {image ? <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="96px" loading="lazy" /> : <span />}
      <span>
        <strong>{title}</strong>
        {sub ? <span>{sub}</span> : null}
      </span>
    </a>
  )
}
