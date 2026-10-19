import { Check, Clock, Languages, MapPin, Minus, Users, Utensils, Bed } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import type { Cruise, Departure, Destination, Excursion, Guide, Tour, TripStyle } from '@/lib/content/types'
import type { Locale } from '@/i18n/routing'
import { getSettings, listAvailable } from '@/lib/content/read'
import { formatMonthYear, formatPrice, currencyFor } from '@/lib/format'
import { img, type Img } from '@/lib/media'
import { pushScript } from '@/lib/tracking'
import { durationLabel, polyTrip, tripCard, type TripDoc } from '@/lib/trips'
import { absolute, archiveUrl, docUrl, fixedPageUrl, homeUrl, termUrl, TRIP_TYPE, type TripCollection } from '@/lib/urls'
import { tripMessage } from '@/lib/whatsapp'

import { Breadcrumbs } from '../Breadcrumbs'
import { GuideCard, TripCard } from '../Cards'
import { EgyptMap } from '../EgyptMap'
import { FaqSection } from '../Faq'
import { JsonLd } from '../JsonLd'
import { WithPending } from '../Pending'
import { RichText } from '../RichText'
import { CtaBand } from '../Sections'
import { WhatsAppLink } from '../WhatsAppLink'
import { Gallery } from './Gallery'
import s from './trip.module.css'

const isObj = <T,>(v: unknown): v is T => Boolean(v && typeof v === 'object')

export async function TripPage({ collection, doc, locale }: { collection: TripCollection; doc: TripDoc; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'trip' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const settings = await getSettings(locale)
  const type = TRIP_TYPE[collection]
  const url = docUrl(collection, doc.slug || '', locale)
  const price = formatPrice(locale, doc.price_from_eur, doc.price_from_usd)
  const basis = t(`basis_${doc.price_basis || 'per_person'}`)
  const duration = durationLabel(collection, doc, t)
  const planHref = `${fixedPageUrl('plan-my-trip', locale)}?trip=${type}-${doc.id}`
  const waMessage = tripMessage(locale, doc.title, absolute(url))
  const dests = (doc.destinations || []).filter(isObj<Destination>)
  const gallery = (doc.gallery || []).map((g) => img(g, 'gallery')).filter((x): x is Img => Boolean(x))
  const styles = 'trip_style' in doc ? ((doc as Tour | Cruise).trip_style || []).filter(isObj<TripStyle>) : []
  const departures = collection === 'excursions' ? ((doc as Excursion).departure || []).filter(isObj<Departure>) : []

  // Related trips: chosen ones, else other trips sharing a destination
  let related = (doc.related_trips || []).map(polyTrip).filter((x): x is [TripCollection, TripDoc] => Boolean(x))
  if (!related.length && dests.length) {
    const res = await listAvailable(collection, locale, { where: { and: [{ id: { not_equals: doc.id } }, { destinations: { in: dests.map((d) => d.id) } }] }, limit: 3 })
    related = res.docs.map((d) => [collection, d as TripDoc])
  }
  // Guides: tours pick them; otherwise guides about the same destinations
  let guides: Guide[] = collection === 'tours' ? ((doc as Tour).guides || []).filter(isObj<Guide>) : []
  if (!guides.length && dests.length) {
    guides = (await listAvailable('guides', locale, { where: { related_destinations: { in: dests.map((d) => d.id) } }, limit: 3 })).docs
  }
  const moreFrom =
    collection === 'excursions' && departures[0]
      ? (await listAvailable('excursions', locale, { where: { and: [{ id: { not_equals: doc.id } }, { departure: { in: [departures[0].id] } }] }, limit: 3 })).docs
      : []

  const policy = (settings.cancellation_policies || []).find((p) => p.key === doc.cancellation_policy)
  const cancellation = doc.cancellation_override || policy?.text || null

  const chips: string[] = [duration]
  styles.forEach((st) => chips.push(st.name))
  if (doc.group_type) chips.push(t(`group_${doc.group_type}`))
  if (doc.guide_languages?.length) chips.push(t('languages', { langs: doc.guide_languages.map((l) => t(`lang_${l}`)).join(' · ') }))
  const updated = formatMonthYear(locale, doc.last_reviewed)
  if (updated) chips.push(`${tc('updated')} ${updated}`)

  const crumbs = [
    { label: tc('home'), href: homeUrl(locale) },
    { label: settings.archive_intros?.[collection]?.h1 || t('related'), href: archiveUrl(collection, locale) },
    { label: doc.title, href: url },
  ]

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: doc.title,
    description: doc.excerpt || doc.subtitle || '',
    url: absolute(url),
    image: gallery.length ? gallery.map((g) => absolute(g.src)) : undefined,
    touristType: doc.group_type || undefined,
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: dests.length,
      itemListElement: dests.map((d, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'Place', name: d.title, ...(d.lat && d.lng ? { geo: { '@type': 'GeoCoordinates', latitude: d.lat, longitude: d.lng } } : {}) },
      })),
    },
    offers: {
      '@type': 'Offer',
      price: locale === 'es' ? doc.price_from_eur : doc.price_from_usd,
      priceCurrency: currencyFor(locale),
      url: absolute(url),
      availability: 'https://schema.org/InStock',
    },
    provider: { '@type': 'TravelAgency', name: 'Hola Egipto', url: absolute(homeUrl(locale)) },
  }

  const view = {
    event: 'view_item',
    trip_id: String(doc.id),
    trip_name: doc.title,
    trip_type: type,
    price_from: locale === 'es' ? doc.price_from_eur : doc.price_from_usd,
    currency: currencyFor(locale),
    language: locale,
  }

  const priceBox = (
    <div className={s.priceBox}>
      <p className={s.from}>{t('priceFrom')}</p>
      {price ? <p className={s.amount}>{price}</p> : null}
      <p className={s.basis}>{basis}</p>
      <p className={s.basis}>
        <Clock aria-hidden="true" size={16} strokeWidth={1.75} /> {duration}
      </p>
      {doc.booking_mode === 'external' && doc.booking_url ? (
        <a className="btn btn--outline btn--block" href={doc.booking_url} rel="noopener" target="_blank">
          {t('bookExternal')}
        </a>
      ) : null}
      <a className="btn btn--primary btn--block" href={planHref}>
        {tc('planThisTrip')}
      </a>
      <WhatsAppLink number={settings.whatsapp_number} message={waMessage} location="sidebar" tripId={doc.id} label={tc('whatsappLabel')} className="btn btn--whatsapp btn--block">
        {tc('whatsapp')}
      </WhatsAppLink>
    </div>
  )

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: pushScript(view) }} />
      <Breadcrumbs items={crumbs} label={tc('breadcrumb')} />
      <div className="container">
        <header className={s.titleBlock}>
          <h1>{doc.title}</h1>
          {doc.subtitle ? <p className={s.subtitle}>{doc.subtitle}</p> : null}
          <ul className="chips">
            {chips.map((c) => (
              <li key={c} className="chip">
                {c}
              </li>
            ))}
          </ul>
        </header>
        <Gallery images={gallery} labels={{ gallery: t('gallery'), open: t('openImage', { n: '{n}', total: '{total}' }), close: t('closeGallery'), prev: t('prevImage'), next: t('nextImage') }} />
        <div className={s.layout}>
          <div className={s.main}>
            <section aria-labelledby="overview">
              <h2 id="overview">{t('overview')}</h2>
              <RichText data={doc.overview} />
              {doc.highlights?.length ? (
                <>
                  <h3>{t('highlights')}</h3>
                  <ul className={s.highlights}>
                    {doc.highlights.map((h) => (
                      <li key={h.id}>
                        <Check aria-hidden="true" size={20} strokeWidth={1.75} />
                        {h.text}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>

            {doc.itinerary?.length ? (
              <section aria-labelledby="itinerary">
                <h2 id="itinerary">{collection === 'excursions' ? t('timeline') : t('itinerary')}</h2>
                <div className="accordion">
                  {doc.itinerary.map((it, i) => (
                    <details key={it.id} open={i === 0}>
                      <summary>
                        <span className={s.summaryText}>
                          <span className={s.dayLabel}>{it.label}</span>
                          <span>{it.title}</span>
                        </span>
                      </summary>
                      <div className="accordion-body">
                        {it.description ? <p>{it.description}</p> : null}
                        <div className={s.dayMeta}>
                          {(it.places || []).filter(isObj<Destination>).length ? (
                            <span>
                              <MapPin aria-hidden="true" size={16} strokeWidth={1.75} />
                              {(it.places || []).filter(isObj<Destination>).map((p) => p.title).join(' · ')}
                            </span>
                          ) : null}
                          {it.meals?.length ? (
                            <span>
                              <Utensils aria-hidden="true" size={16} strokeWidth={1.75} />
                              {it.meals.map((m) => t(`meal_${m}`)).join(' · ')}
                            </span>
                          ) : null}
                          {it.overnight ? (
                            <span>
                              <Bed aria-hidden="true" size={16} strokeWidth={1.75} />
                              <WithPending text={it.overnight} />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            <section aria-labelledby="inex">
              <h2 id="inex" className="visually-hidden">
                {t('includes')} / {t('excludes')}
              </h2>
              <div className={s.inex}>
                <div className={s.yes}>
                  <h3>{t('includes')}</h3>
                  <ul>
                    {(doc.includes || []).map((x) => (
                      <li key={x.id}>
                        <Check aria-hidden="true" size={20} strokeWidth={1.75} />
                        {x.text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={s.no}>
                  <h3>{t('excludes')}</h3>
                  <ul>
                    {(doc.excludes || []).map((x) => (
                      <li key={x.id}>
                        <Minus aria-hidden="true" size={20} strokeWidth={1.75} />
                        {x.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {collection === 'cruises' ? <CruiseSection doc={doc as Cruise} locale={locale} t={t} /> : null}

            <section aria-labelledby="prices">
              <h2 id="prices">{t('prices')}</h2>
              <dl className={s.facts}>
                <div>
                  <dt>{collection === 'excursions' ? t('adultPrice') : t('priceFrom')}</dt>
                  <dd>
                    {price} · {basis}
                  </dd>
                </div>
                {collection === 'excursions' && formatPrice(locale, (doc as Excursion).child_price_eur, (doc as Excursion).child_price_usd) ? (
                  <div>
                    <dt>{t('childPrice')}</dt>
                    <dd>{formatPrice(locale, (doc as Excursion).child_price_eur, (doc as Excursion).child_price_usd)}</dd>
                  </div>
                ) : null}
              </dl>
              {doc.price_note ? (
                <p className="muted" style={{ marginTop: 'var(--he-space-4)' }}>
                  <WithPending text={doc.price_note} />
                </p>
              ) : null}
            </section>

            <section aria-labelledby="practical">
              <h2 id="practical">{t('practical')}</h2>
              <dl className={s.facts}>
                <div>
                  <dt>{t('duration')}</dt>
                  <dd>{duration}</dd>
                </div>
                {doc.group_type ? (
                  <div>
                    <dt>{t('group')}</dt>
                    <dd>
                      <Users aria-hidden="true" size={16} strokeWidth={1.75} /> {t(`group_${doc.group_type}`)}
                      {doc.group_min && doc.group_max ? ` · ${t('groupSize', { min: doc.group_min, max: doc.group_max })}` : ''}
                    </dd>
                  </div>
                ) : null}
                {doc.guide_languages?.length ? (
                  <div>
                    <dt>
                      <Languages aria-hidden="true" size={16} strokeWidth={1.75} /> {t('languages', { langs: '' }).trim()}
                    </dt>
                    <dd>{doc.guide_languages.map((l) => t(`lang_${l}`)).join(' · ')}</dd>
                  </div>
                ) : null}
                {doc.availability_days?.length ? (
                  <div>
                    <dt>{t('availability')}</dt>
                    <dd>{doc.availability_days.map((d) => t(`day_${d}`)).join(', ')}</dd>
                  </div>
                ) : null}
                {doc.season_note ? (
                  <div>
                    <dt>{t('season')}</dt>
                    <dd>
                      <WithPending text={doc.season_note} />
                    </dd>
                  </div>
                ) : null}
                {collection === 'excursions' ? <ExcursionFacts doc={doc as Excursion} t={t} /> : null}
              </dl>
              {doc.what_to_bring?.length ? (
                <>
                  <h3 style={{ marginTop: 'var(--he-space-6)' }}>{t('whatToBring')}</h3>
                  <ul>
                    {doc.what_to_bring.map((x) => (
                      <li key={x.id}>{x.text}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>

            {cancellation ? (
              <section aria-labelledby="cancellation">
                <h2 id="cancellation">{t('cancellation')}</h2>
                <p>
                  <WithPending text={cancellation} />
                </p>
              </section>
            ) : null}

            <FaqSection title={t('faq')} items={(doc.faq || []).map((f) => ({ q: f.q, a: f.a }))} />
          </div>

          <aside className={s.aside} aria-label={t('priceFrom')}>
            {priceBox}
            {dests.length ? (
              <div className={s.map}>
                <h2 className="he-eyebrow">{t('route')}</h2>
                <ol className={s.routeList}>
                  {dests.map((d) => (
                    <li key={d.id}>
                      <a href={docUrl('destinations', d.slug || '', locale)}>{d.title}</a>
                    </li>
                  ))}
                </ol>
                <EgyptMap title={t('staticMap')} route={dests.filter((d) => d.lat && d.lng).map((d) => ({ label: d.title, lat: d.lat as number, lng: d.lng as number }))} />
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      {collection === 'excursions' && moreFrom.length && departures[0] ? (
        <section className="section section--linen" aria-labelledby="more-from">
          <div className="container">
            <div className="section-head section-head--row">
              <h2 id="more-from">{t('moreFrom', { city: departures[0].name })}</h2>
              {departures[0].slug ? (
                <a className="text-link" href={termUrl('departures', departures[0].slug, locale)}>
                  {tc('seeAll')}
                </a>
              ) : null}
            </div>
            <div className="grid grid--3">
              {moreFrom.map((d) => (
                <TripCard key={d.id} trip={tripCard(d as TripDoc, 'excursions', locale, t)} fromLabel={tc('from')} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="section" aria-labelledby="related">
          <div className="container">
            <h2 id="related">{t('related')}</h2>
            <div className="grid grid--3">
              {related.map(([c, d]) => (
                <TripCard key={`${c}-${d.id}`} trip={tripCard(d, c, locale, t)} fromLabel={tc('from')} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {guides.length ? (
        <section className="section section--linen" aria-labelledby="trip-guides">
          <div className="container">
            <h2 id="trip-guides">{t('guides')}</h2>
            <div className="grid grid--3">
              {guides.map((g) => (
                <GuideCard key={g.id} href={docUrl('guides', g.slug || '', locale)} title={g.title} excerpt={g.excerpt} image={img(g.featured_image, 'card')} meta={formatMonthYear(locale, g.last_updated)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand locale={locale} />
      <JsonLd data={ld} />
    </>
  )
}

type T = (key: string, values?: Record<string, string | number>) => string

function ExcursionFacts({ doc, t }: { doc: Excursion; t: T }) {
  return (
    <>
      {doc.start_times?.length ? (
        <div>
          <dt>{t('startTimes')}</dt>
          <dd>{doc.start_times.map((x) => [x.time, x.label].filter(Boolean).join(' · ')).join(' / ')}</dd>
        </div>
      ) : null}
      {doc.pickup_areas?.length ? (
        <div>
          <dt>{t('pickup')}</dt>
          <dd>{doc.pickup_areas.map((x) => x.text).join(', ')}</dd>
        </div>
      ) : null}
      {doc.min_age !== null && doc.min_age !== undefined ? (
        <div>
          <dt>{t('minAge', { n: doc.min_age })}</dt>
          <dd>{doc.activity_level ? `${t('activity')}: ${t(`activity_${doc.activity_level}`)}` : null}</dd>
        </div>
      ) : null}
    </>
  )
}

function CruiseSection({ doc, locale, t }: { doc: Cruise; locale: Locale; t: T }) {
  const deck = img(doc.deck_plan, 'card')
  const emb = isObj<Destination>(doc.embark) ? doc.embark.title : null
  const dis = isObj<Destination>(doc.disembark) ? doc.disembark.title : null
  const CAT: Record<string, string> = { '4star': '4★', '5star': '5★', deluxe: 'Deluxe', dahabiya: 'Dahabiya' }
  return (
    <section aria-labelledby="ship">
      <h2 id="ship">{t('ship')}</h2>
      <dl className={s.facts}>
        {doc.ship_name ? (
          <div>
            <dt>{t('ship')}</dt>
            <dd>
              <WithPending text={doc.ship_name} />
            </dd>
          </div>
        ) : null}
        {doc.ship_category ? (
          <div>
            <dt>{t('shipCategory')}</dt>
            <dd>{CAT[doc.ship_category]}</dd>
          </div>
        ) : null}
        {doc.ship_facilities?.length ? (
          <div>
            <dt>{t('facilities')}</dt>
            <dd>{doc.ship_facilities.map((f) => t(`fac_${f}`)).join(', ')}</dd>
          </div>
        ) : null}
      </dl>
      {emb && dis ? <p style={{ marginTop: 'var(--he-space-4)' }}>{t('direction', { from: emb, to: dis })}</p> : null}
      {doc.cabins?.length ? (
        <>
          <h3 style={{ marginTop: 'var(--he-space-6)' }}>{t('cabins')}</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th scope="col">{t('cabinType')}</th>
                  <th scope="col">{t('cabinSize')}</th>
                  <th scope="col">{t('cabinBeds')}</th>
                  <th scope="col">{t('cabinPrice')}</th>
                </tr>
              </thead>
              <tbody>
                {doc.cabins.map((c) => (
                  <tr key={c.id}>
                    <td>{c.type}</td>
                    <td>{c.size_m2 ? `${c.size_m2} m²` : ''}</td>
                    <td>{c.beds}</td>
                    <td>{formatPrice(locale, c.price_from_eur, c.price_from_usd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
      {doc.start_dates?.length ? (
        <>
          <h3 style={{ marginTop: 'var(--he-space-6)' }}>{t('departures')}</h3>
          <ul>
            {doc.start_dates.map((d) => (
              <li key={d.id}>
                {new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d.date))}
                {d.note ? ` · ${d.note}` : ''}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {deck ? (
        <>
          <h3 style={{ marginTop: 'var(--he-space-6)' }}>{t('deckPlan')}</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={deck.src} alt={deck.alt} width={deck.width} height={deck.height} loading="lazy" style={{ borderRadius: 'var(--he-radius-md)' }} />
        </>
      ) : null}
    </section>
  )
}
