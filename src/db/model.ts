/**
 * Logical model map (contracts §4, §9): logical entity/field names (spec §5, what `hola:schema` reports)
 * → physical tables, columns and join tables. `hola:schema` verifies every mapping against
 * information_schema.COLUMNS of the live database.
 */

/** Where a logical field lives: a column of the main table, of the `_i18n` table, or a join table. */
export type FieldMap =
  | { main: string | string[] }
  | { i18n: string | string[] }
  | { mainAndI18n: { main: string[]; i18n: string[] } }
  | { join: string; columns: string[] }

export interface EntityMap {
  table: string
  i18n?: string
  fields: Record<string, FieldMap>
}

const main = (c: string | string[]): FieldMap => ({ main: c })
const loc = (c: string | string[]): FieldMap => ({ i18n: c })
const join = (table: string, columns: string[]): FieldMap => ({ join: table, columns })

const seo: FieldMap = { mainAndI18n: { main: ['seo_og_image_id'], i18n: ['seo_meta_title', 'seo_meta_description'] } }

const commonContent = (): Record<string, FieldMap> => ({
  title: loc('title'),
  slug: loc('slug'),
  available: loc('available'),
  excerpt: loc('excerpt'),
  featured_image: main('featured_image_id'),
  seo,
  holaSample: main('hola_sample'),
})

const trip = (type: 'tour' | 'cruise' | 'excursion'): Record<string, FieldMap> => ({
  ...commonContent(),
  overview: loc('overview'),
  subtitle: loc('subtitle'),
  gallery: main('gallery'),
  price_from_eur: main('price_from_eur'),
  price_from_usd: main('price_from_usd'),
  price_basis: main('price_basis'),
  price_note: loc('price_note'),
  group_type: main('group_type'),
  group_min: main('group_min'),
  group_max: main('group_max'),
  guide_languages: main('guide_languages'),
  highlights: loc('highlights'),
  itinerary: loc('itinerary'),
  includes: loc('includes'),
  excludes: loc('excludes'),
  what_to_bring: loc('what_to_bring'),
  availability_days: main('availability_days'),
  season_note: loc('season_note'),
  cancellation_policy: main('cancellation_policy'),
  cancellation_override: loc('cancellation_override'),
  faq: loc('faq'),
  related_trips: join('related_trips', ['owner_type', 'owner_id', 'trip_type', 'trip_id', 'position']),
  booking_mode: main('booking_mode'),
  booking_url: main('booking_url'),
  last_reviewed: main('last_reviewed'),
  featured: main('featured'),
  destinations: join('trip_destinations', ['trip_type', 'trip_id', 'destination_id', 'position']),
  ...(type === 'tour' || type === 'cruise' ? { trip_style: join('trip_trip_styles', ['trip_type', 'trip_id', 'trip_style_id', 'position']) } : {}),
  created_at: main('created_at'),
  updated_at: main('updated_at'),
})

const taxonomy = (table: string, extra: Record<string, FieldMap> = {}): EntityMap => ({
  table,
  i18n: `${table}_i18n`,
  fields: {
    name: loc('name'),
    slug: loc('slug'),
    hero: main('hero_id'),
    h1: loc('h1'),
    intro: loc('intro'),
    seo_text: loc('seo_text'),
    faq: loc('faq'),
    sort: main('sort'),
    ...extra,
  },
})

export const MODEL: { collections: Record<string, EntityMap>; globals: Record<string, EntityMap> } = {
  collections: {
    tours: {
      table: 'tours',
      i18n: 'tours_i18n',
      fields: {
        ...trip('tour'),
        duration_days: main('duration_days'),
        duration: main('duration_id'),
        guides: join('tour_guides', ['tour_id', 'guide_id', 'position']),
      },
    },
    cruises: {
      table: 'cruises',
      i18n: 'cruises_i18n',
      fields: {
        ...trip('cruise'),
        nights: main('nights'),
        cruise_type: main('cruise_type_id'),
        ship_name: loc('ship_name'),
        ship_category: main('ship_category'),
        embark: main('embark_id'),
        disembark: main('disembark_id'),
        start_dates: loc('start_dates'),
        cabins: loc('cabins'),
        ship_facilities: main('ship_facilities'),
        deck_plan: main('deck_plan_id'),
      },
    },
    excursions: {
      table: 'excursions',
      i18n: 'excursions_i18n',
      fields: {
        ...trip('excursion'),
        duration_hours: main('duration_hours'),
        departure: join('excursion_departures', ['excursion_id', 'departure_id', 'position']),
        start_times: loc('start_times'),
        pickup_areas: loc('pickup_areas'),
        child_price_eur: main('child_price_eur'),
        child_price_usd: main('child_price_usd'),
        min_age: main('min_age'),
        activity_level: main('activity_level'),
      },
    },
    destinations: {
      table: 'destinations',
      i18n: 'destinations_i18n',
      fields: {
        ...commonContent(),
        content: loc('content'),
        region: main('region_id'),
        tagline: loc('tagline'),
        best_months: main('best_months'),
        days_recommended: main('days_recommended'),
        how_to_get_there: loc('how_to_get_there'),
        nearest_airport: loc('nearest_airport'),
        top_sights: loc('top_sights'),
        lat: main('lat'),
        lng: main('lng'),
        nearby: join('destination_nearby', ['destination_id', 'nearby_id', 'position']),
      },
    },
    guides: {
      table: 'guides',
      i18n: 'guides_i18n',
      fields: {
        ...commonContent(),
        content: loc('content'),
        guide_topic: join('guide_guide_topics', ['guide_id', 'guide_topic_id', 'position']),
        last_updated: main('last_updated'),
        toc: main('toc'),
        related_destinations: join('guide_destinations', ['guide_id', 'destination_id', 'position']),
        related_trips: join('related_trips', ['owner_type', 'owner_id', 'trip_type', 'trip_id', 'position']),
        author_name: loc('author_name'),
      },
    },
    pages: {
      table: 'pages',
      i18n: 'pages_i18n',
      fields: {
        ...commonContent(),
        content: loc('content'),
        template: main('template'),
        sections: loc('sections'),
        faq_groups: loc('faq_groups'),
        last_updated: main('last_updated'),
      },
    },
    inquiries: {
      table: 'inquiries',
      fields: Object.fromEntries(
        [
          'title', 'form', 'interests', 'length', 'date_mode', 'date_from', 'date_to', 'month', 'adults', 'children',
          'children_ages', 'budget', 'hotel', 'group_type', 'name', 'email', 'whatsapp', 'channel', 'message',
          'consent_at', 'marketing', 'lang', 'page_url', 'utm', 'gclid', 'fbclid', 'landing', 'status', 'tracked',
          'ip_hash', 'created_at',
        ]
          .map((f) => [f, main(f)] as [string, FieldMap])
          .concat([
            ['trip', main(['trip_type', 'trip_id'])],
            ['holaSample', main('hola_sample')],
          ]),
      ),
    },
    images: {
      table: 'images',
      fields: {
        path: main('path'),
        alt: main(['alt_es', 'alt_en']),
        width: main('width'),
        height: main('height'),
        holaSample: main('hola_sample'),
      },
    },
    users: {
      table: 'users',
      fields: {
        email: main('email'),
        password_hash: main('password_hash'),
        role: main('role'),
        session_version: main('session_version'),
        created_at: main('created_at'),
        last_login_at: main('last_login_at'),
      },
    },
    durations: taxonomy('durations', { min_days: main('min_days'), max_days: main('max_days') }),
    'trip-styles': taxonomy('trip_styles'),
    'cruise-types': taxonomy('cruise_types'),
    departures: taxonomy('departures', { destination: main('destination_id') }),
    regions: taxonomy('regions'),
    'guide-topics': taxonomy('guide_topics'),
  },
  globals: {
    'site-settings': {
      table: 'site_settings',
      i18n: 'site_settings_i18n',
      fields: {
        whatsapp_number: main('whatsapp_number'),
        contact_email: main('contact_email'),
        phone: main('phone'),
        address: main('address'),
        legal_name: main('legal_name'),
        licence_number: main('licence_number'),
        gtm_id: main('gtm_id'),
        social: main('social'),
        whatsapp_message_default: loc('whatsapp_message_default'),
        reply_hours: loc('reply_hours'),
        home: loc('home'),
        booking_band: loc('booking_band'),
        stats: loc('stats'),
        trust_items: loc('trust_items'),
        archive_intros: loc('archive_intros'),
        cancellation_policies: loc('cancellation_policies'),
        og_default: loc('og_default_id'),
      },
    },
    navigation: {
      table: 'navigation',
      i18n: 'navigation_i18n',
      fields: {
        header: loc('tree'),
        footer_columns: loc('tree'),
        footer_description: loc('tree'),
        legal_links: loc('tree'),
      },
    },
  },
}

/** Extra tables that are not entities but must exist (login rate limit, §18). */
export const SUPPORT_TABLES: Record<string, string[]> = {
  login_attempts: ['ip_hash', 'email', 'created_at'],
}

/** Every (table, column) pair the model needs. */
export function requiredColumns(e: EntityMap): [string, string][] {
  const out: [string, string][] = [[e.table, 'id']]
  if (e.i18n) out.push([e.i18n, 'entity_id'], [e.i18n, 'locale'], [e.i18n, 'available'])
  const arr = (v: string | string[]) => (Array.isArray(v) ? v : [v])
  for (const f of Object.values(e.fields)) {
    if ('main' in f) for (const c of arr(f.main)) out.push([e.table, c])
    else if ('i18n' in f) for (const c of arr(f.i18n)) out.push([e.i18n as string, c])
    else if ('mainAndI18n' in f) {
      for (const c of f.mainAndI18n.main) out.push([e.table, c])
      for (const c of f.mainAndI18n.i18n) out.push([e.i18n as string, c])
    } else for (const c of f.columns) out.push([f.join, c])
  }
  return out
}
