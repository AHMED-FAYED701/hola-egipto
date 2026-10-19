/**
 * Drizzle schema (MySQL 8 / MariaDB 10.6+), contracts §4, §7, §13, §18.
 * Shared facts live in the main table, words in `<entity>_i18n` (one row per locale).
 * No native json columns (jsonText), no CHECK, no TEXT defaults: those defaults are set in the data layer.
 */
import {
  boolean,
  customType,
  date,
  datetime,
  double,
  index,
  int,
  longtext,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
  type AnyMySqlColumn,
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

/** Structured value stored as longtext (MariaDB returns JSON as text anyway). */
export const jsonText = <T>(name: string) =>
  customType<{ data: T; driverData: string }>({
    dataType: () => 'longtext',
    toDriver: (v) => JSON.stringify(v ?? null),
    fromDriver: (v) => {
      if (v === null || v === undefined || v === '') return null as T
      try {
        return JSON.parse(String(v)) as T
      } catch {
        return null as T
      }
    },
  })(name)

const id = () => int('id').autoincrement().primaryKey()
const createdAt = () => datetime('created_at', { mode: 'date' }).notNull().default(sql`CURRENT_TIMESTAMP`)
const updatedAt = () => datetime('updated_at', { mode: 'date' }).notNull().default(sql`CURRENT_TIMESTAMP`)
const sample = () => boolean('hola_sample').notNull().default(false)
const imageRef = (name: string) => int(name).references((): AnyMySqlColumn => images.id, { onDelete: 'set null' })

export type FaqItem = { q: string; a: string }
export type Locale2 = 'es' | 'en'

// ------------------------------------------------------------------ images (§13)
export const images = mysqlTable('images', {
  id: id(),
  path: varchar('path', { length: 191 }).notNull().unique(),
  alt_es: varchar('alt_es', { length: 500 }).notNull(),
  alt_en: varchar('alt_en', { length: 500 }).notNull(),
  width: int('width').notNull(),
  height: int('height').notNull(),
  hola_sample: sample(),
  created_at: createdAt(),
  updated_at: updatedAt(),
})

// ---------------------------------------------------------------- i18n helpers

/** Localized columns shared by public content (§4 "Fields every public content entity has"). */
const contentI18n = () => ({
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 191 }),
  excerpt: text('excerpt'),
  seo_meta_title: varchar('seo_meta_title', { length: 255 }),
  seo_meta_description: text('seo_meta_description'),
})

const i18nBase = (parent: () => AnyMySqlColumn) => ({
  id: id(),
  entity_id: int('entity_id')
    .notNull()
    .references(parent, { onDelete: 'cascade' }),
  locale: varchar('locale', { length: 2 }).notNull(),
  available: boolean('available').notNull().default(false),
})

// ----------------------------------------------------------------- taxonomies
const taxonomyMain = () => ({
  id: id(),
  hero_id: imageRef('hero_id'),
  sort: int('sort').notNull().default(0),
  created_at: createdAt(),
  updated_at: updatedAt(),
})

const taxonomyI18n = () => ({
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 191 }),
  h1: varchar('h1', { length: 255 }),
  intro: text('intro'),
  seo_text: text('seo_text'),
  faq: jsonText<FaqItem[]>('faq'),
})

export const durations = mysqlTable('durations', {
  ...taxonomyMain(),
  min_days: int('min_days'),
  max_days: int('max_days'),
})
export const durations_i18n = mysqlTable('durations_i18n', { ...i18nBase(() => durations.id), ...taxonomyI18n() }, (t) => [
  uniqueIndex('durations_i18n_entity_locale').on(t.entity_id, t.locale),
  uniqueIndex('durations_i18n_locale_slug').on(t.locale, t.slug),
])

export const trip_styles = mysqlTable('trip_styles', taxonomyMain())
export const trip_styles_i18n = mysqlTable('trip_styles_i18n', { ...i18nBase(() => trip_styles.id), ...taxonomyI18n() }, (t) => [
  uniqueIndex('trip_styles_i18n_entity_locale').on(t.entity_id, t.locale),
  uniqueIndex('trip_styles_i18n_locale_slug').on(t.locale, t.slug),
])

export const cruise_types = mysqlTable('cruise_types', taxonomyMain())
export const cruise_types_i18n = mysqlTable('cruise_types_i18n', { ...i18nBase(() => cruise_types.id), ...taxonomyI18n() }, (t) => [
  uniqueIndex('cruise_types_i18n_entity_locale').on(t.entity_id, t.locale),
  uniqueIndex('cruise_types_i18n_locale_slug').on(t.locale, t.slug),
])

export const regions = mysqlTable('regions', taxonomyMain())
export const regions_i18n = mysqlTable('regions_i18n', { ...i18nBase(() => regions.id), ...taxonomyI18n() }, (t) => [
  uniqueIndex('regions_i18n_entity_locale').on(t.entity_id, t.locale),
  uniqueIndex('regions_i18n_locale_slug').on(t.locale, t.slug),
])

export const guide_topics = mysqlTable('guide_topics', taxonomyMain())
export const guide_topics_i18n = mysqlTable('guide_topics_i18n', { ...i18nBase(() => guide_topics.id), ...taxonomyI18n() }, (t) => [
  uniqueIndex('guide_topics_i18n_entity_locale').on(t.entity_id, t.locale),
  uniqueIndex('guide_topics_i18n_locale_slug').on(t.locale, t.slug),
])

// --------------------------------------------------------------- destinations
export const destinations = mysqlTable(
  'destinations',
  {
    id: id(),
    featured_image_id: imageRef('featured_image_id'),
    seo_og_image_id: imageRef('seo_og_image_id'),
    region_id: int('region_id').references(() => regions.id, { onDelete: 'set null' }),
    best_months: jsonText<string[]>('best_months'),
    days_recommended: int('days_recommended'),
    lat: double('lat'),
    lng: double('lng'),
    hola_sample: sample(),
    created_at: createdAt(),
    updated_at: updatedAt(),
  },
  (t) => [index('destinations_region').on(t.region_id)],
)

export type TopSight = { name: string; image: number | null; text: string; map_link: string }

export const destinations_i18n = mysqlTable(
  'destinations_i18n',
  {
    ...i18nBase(() => destinations.id),
    ...contentI18n(),
    content: longtext('content'),
    tagline: varchar('tagline', { length: 255 }),
    how_to_get_there: text('how_to_get_there'),
    nearest_airport: varchar('nearest_airport', { length: 255 }),
    top_sights: jsonText<TopSight[]>('top_sights'),
  },
  (t) => [
    uniqueIndex('destinations_i18n_entity_locale').on(t.entity_id, t.locale),
    uniqueIndex('destinations_i18n_locale_slug').on(t.locale, t.slug),
  ],
)

/** Departures ("excursions from {city}") have an extra `destination`. */
export const departures = mysqlTable('departures', {
  ...taxonomyMain(),
  destination_id: int('destination_id').references(() => destinations.id, { onDelete: 'set null' }),
})
export const departures_i18n = mysqlTable('departures_i18n', { ...i18nBase(() => departures.id), ...taxonomyI18n() }, (t) => [
  uniqueIndex('departures_i18n_entity_locale').on(t.entity_id, t.locale),
  uniqueIndex('departures_i18n_locale_slug').on(t.locale, t.slug),
])

export const destination_nearby = mysqlTable(
  'destination_nearby',
  {
    id: id(),
    destination_id: int('destination_id')
      .notNull()
      .references(() => destinations.id, { onDelete: 'cascade' }),
    nearby_id: int('nearby_id')
      .notNull()
      .references(() => destinations.id, { onDelete: 'cascade' }),
    position: int('position').notNull().default(0),
  },
  (t) => [index('destination_nearby_owner').on(t.destination_id)],
)

// ---------------------------------------------------------------------- trips
export type ItineraryItem = {
  label: string
  title: string
  description?: string | null
  places?: number[] | null
  meals?: ('B' | 'L' | 'D')[] | null
  overnight?: string | null
}

/** Shared trip facts (tours, cruises, excursions). */
const tripMain = () => ({
  id: id(),
  featured_image_id: imageRef('featured_image_id'),
  seo_og_image_id: imageRef('seo_og_image_id'),
  gallery: jsonText<number[]>('gallery'),
  price_from_eur: int('price_from_eur'),
  price_from_usd: int('price_from_usd'),
  price_basis: varchar('price_basis', { length: 32 }).notNull().default('per_person_double'),
  group_type: varchar('group_type', { length: 16 }).notNull().default('small'),
  group_min: int('group_min'),
  group_max: int('group_max'),
  guide_languages: jsonText<string[]>('guide_languages'),
  availability_days: jsonText<string[]>('availability_days'),
  cancellation_policy: varchar('cancellation_policy', { length: 64 }),
  booking_mode: varchar('booking_mode', { length: 16 }).notNull().default('inquiry'),
  booking_url: varchar('booking_url', { length: 500 }),
  last_reviewed: date('last_reviewed', { mode: 'string' }),
  featured: boolean('featured').notNull().default(false),
  hola_sample: sample(),
  created_at: createdAt(),
  updated_at: updatedAt(),
})

/** Localized trip words. */
const tripI18n = () => ({
  ...contentI18n(),
  subtitle: varchar('subtitle', { length: 255 }),
  overview: longtext('overview'),
  price_note: text('price_note'),
  highlights: jsonText<string[]>('highlights'),
  itinerary: jsonText<ItineraryItem[]>('itinerary'),
  includes: jsonText<string[]>('includes'),
  excludes: jsonText<string[]>('excludes'),
  what_to_bring: jsonText<string[]>('what_to_bring'),
  season_note: text('season_note'),
  cancellation_override: text('cancellation_override'),
  faq: jsonText<FaqItem[]>('faq'),
})

export const tours = mysqlTable(
  'tours',
  {
    ...tripMain(),
    duration_days: int('duration_days').notNull(),
    duration_id: int('duration_id').references(() => durations.id, { onDelete: 'set null' }),
  },
  (t) => [index('tours_duration').on(t.duration_id)],
)
export const tours_i18n = mysqlTable('tours_i18n', { ...i18nBase(() => tours.id), ...tripI18n() }, (t) => [
  uniqueIndex('tours_i18n_entity_locale').on(t.entity_id, t.locale),
  uniqueIndex('tours_i18n_locale_slug').on(t.locale, t.slug),
])

export type Cabin = { type: string; size_m2: number | null; beds: string; price_from_eur: number | null; price_from_usd: number | null }
export type StartDate = { date: string; note: string }

export const cruises = mysqlTable(
  'cruises',
  {
    ...tripMain(),
    nights: int('nights').notNull(),
    cruise_type_id: int('cruise_type_id').references(() => cruise_types.id, { onDelete: 'set null' }),
    ship_category: varchar('ship_category', { length: 16 }),
    embark_id: int('embark_id').references(() => destinations.id, { onDelete: 'set null' }),
    disembark_id: int('disembark_id').references(() => destinations.id, { onDelete: 'set null' }),
    ship_facilities: jsonText<string[]>('ship_facilities'),
    deck_plan_id: imageRef('deck_plan_id'),
  },
  (t) => [index('cruises_cruise_type').on(t.cruise_type_id)],
)
export const cruises_i18n = mysqlTable(
  'cruises_i18n',
  {
    ...i18nBase(() => cruises.id),
    ...tripI18n(),
    ship_name: varchar('ship_name', { length: 255 }),
    start_dates: jsonText<StartDate[]>('start_dates'),
    cabins: jsonText<Cabin[]>('cabins'),
  },
  (t) => [uniqueIndex('cruises_i18n_entity_locale').on(t.entity_id, t.locale), uniqueIndex('cruises_i18n_locale_slug').on(t.locale, t.slug)],
)

export type StartTime = { time: string; label: string }

export const excursions = mysqlTable('excursions', {
  ...tripMain(),
  duration_hours: int('duration_hours').notNull(),
  child_price_eur: int('child_price_eur'),
  child_price_usd: int('child_price_usd'),
  min_age: int('min_age'),
  activity_level: varchar('activity_level', { length: 16 }),
})
export const excursions_i18n = mysqlTable(
  'excursions_i18n',
  {
    ...i18nBase(() => excursions.id),
    ...tripI18n(),
    start_times: jsonText<StartTime[]>('start_times'),
    pickup_areas: jsonText<string[]>('pickup_areas'),
  },
  (t) => [
    uniqueIndex('excursions_i18n_entity_locale').on(t.entity_id, t.locale),
    uniqueIndex('excursions_i18n_locale_slug').on(t.locale, t.slug),
  ],
)

// --------------------------------------------------------------------- guides
export const guides = mysqlTable('guides', {
  id: id(),
  featured_image_id: imageRef('featured_image_id'),
  seo_og_image_id: imageRef('seo_og_image_id'),
  last_updated: date('last_updated', { mode: 'string' }),
  toc: boolean('toc').notNull().default(true),
  hola_sample: sample(),
  created_at: createdAt(),
  updated_at: updatedAt(),
})
export const guides_i18n = mysqlTable(
  'guides_i18n',
  {
    ...i18nBase(() => guides.id),
    ...contentI18n(),
    content: longtext('content'),
    author_name: varchar('author_name', { length: 255 }),
  },
  (t) => [uniqueIndex('guides_i18n_entity_locale').on(t.entity_id, t.locale), uniqueIndex('guides_i18n_locale_slug').on(t.locale, t.slug)],
)

// ----------------------------------------------------------- join tables (§4)
/** Ordered route of a trip (`destinations` on tours, cruises, excursions). */
export const trip_destinations = mysqlTable(
  'trip_destinations',
  {
    id: id(),
    trip_type: varchar('trip_type', { length: 16 }).notNull(),
    trip_id: int('trip_id').notNull(),
    destination_id: int('destination_id')
      .notNull()
      .references(() => destinations.id, { onDelete: 'cascade' }),
    position: int('position').notNull().default(0),
  },
  (t) => [index('trip_destinations_trip').on(t.trip_type, t.trip_id), index('trip_destinations_dest').on(t.destination_id)],
)

/** `related_trips` of trips and guides (max 3, any trip type). */
export const related_trips = mysqlTable(
  'related_trips',
  {
    id: id(),
    owner_type: varchar('owner_type', { length: 16 }).notNull(),
    owner_id: int('owner_id').notNull(),
    trip_type: varchar('trip_type', { length: 16 }).notNull(),
    trip_id: int('trip_id').notNull(),
    position: int('position').notNull().default(0),
  },
  (t) => [index('related_trips_owner').on(t.owner_type, t.owner_id), index('related_trips_trip').on(t.trip_type, t.trip_id)],
)

/** `trip_style` on tours and cruises. */
export const trip_trip_styles = mysqlTable(
  'trip_trip_styles',
  {
    id: id(),
    trip_type: varchar('trip_type', { length: 16 }).notNull(),
    trip_id: int('trip_id').notNull(),
    trip_style_id: int('trip_style_id')
      .notNull()
      .references(() => trip_styles.id, { onDelete: 'cascade' }),
    position: int('position').notNull().default(0),
  },
  (t) => [index('trip_trip_styles_trip').on(t.trip_type, t.trip_id), index('trip_trip_styles_style').on(t.trip_style_id)],
)

/** `departure` on excursions. */
export const excursion_departures = mysqlTable(
  'excursion_departures',
  {
    id: id(),
    excursion_id: int('excursion_id')
      .notNull()
      .references(() => excursions.id, { onDelete: 'cascade' }),
    departure_id: int('departure_id')
      .notNull()
      .references(() => departures.id, { onDelete: 'cascade' }),
    position: int('position').notNull().default(0),
  },
  (t) => [index('excursion_departures_exc').on(t.excursion_id), index('excursion_departures_dep').on(t.departure_id)],
)

/** `guides` on tours. */
export const tour_guides = mysqlTable(
  'tour_guides',
  {
    id: id(),
    tour_id: int('tour_id')
      .notNull()
      .references(() => tours.id, { onDelete: 'cascade' }),
    guide_id: int('guide_id')
      .notNull()
      .references(() => guides.id, { onDelete: 'cascade' }),
    position: int('position').notNull().default(0),
  },
  (t) => [index('tour_guides_tour').on(t.tour_id), index('tour_guides_guide').on(t.guide_id)],
)

/** `guide_topic` on guides (max 2). */
export const guide_guide_topics = mysqlTable(
  'guide_guide_topics',
  {
    id: id(),
    guide_id: int('guide_id')
      .notNull()
      .references(() => guides.id, { onDelete: 'cascade' }),
    guide_topic_id: int('guide_topic_id')
      .notNull()
      .references(() => guide_topics.id, { onDelete: 'cascade' }),
    position: int('position').notNull().default(0),
  },
  (t) => [index('guide_guide_topics_guide').on(t.guide_id), index('guide_guide_topics_topic').on(t.guide_topic_id)],
)

/** `related_destinations` on guides. */
export const guide_destinations = mysqlTable(
  'guide_destinations',
  {
    id: id(),
    guide_id: int('guide_id')
      .notNull()
      .references(() => guides.id, { onDelete: 'cascade' }),
    destination_id: int('destination_id')
      .notNull()
      .references(() => destinations.id, { onDelete: 'cascade' }),
    position: int('position').notNull().default(0),
  },
  (t) => [index('guide_destinations_guide').on(t.guide_id), index('guide_destinations_dest').on(t.destination_id)],
)

// ---------------------------------------------------------------------- pages
export type FaqGroup = { title: string; items: FaqItem[] }
export type PageSection = Record<string, unknown> & { blockType: string }

export const pages = mysqlTable('pages', {
  id: id(),
  template: varchar('template', { length: 32 }).notNull().default('default'),
  featured_image_id: imageRef('featured_image_id'),
  seo_og_image_id: imageRef('seo_og_image_id'),
  last_updated: date('last_updated', { mode: 'string' }),
  hola_sample: sample(),
  created_at: createdAt(),
  updated_at: updatedAt(),
})
export const pages_i18n = mysqlTable(
  'pages_i18n',
  {
    ...i18nBase(() => pages.id),
    ...contentI18n(),
    content: longtext('content'),
    sections: jsonText<PageSection[]>('sections'),
    faq_groups: jsonText<FaqGroup[]>('faq_groups'),
  },
  (t) => [uniqueIndex('pages_i18n_entity_locale').on(t.entity_id, t.locale), uniqueIndex('pages_i18n_locale_slug').on(t.locale, t.slug)],
)

// -------------------------------------------------------------- site settings
export type SocialLink = { network: string; url: string }

export const site_settings = mysqlTable('site_settings', {
  id: id(),
  whatsapp_number: varchar('whatsapp_number', { length: 32 }),
  contact_email: varchar('contact_email', { length: 255 }),
  phone: varchar('phone', { length: 64 }),
  address: text('address'),
  legal_name: varchar('legal_name', { length: 255 }),
  licence_number: varchar('licence_number', { length: 128 }),
  gtm_id: varchar('gtm_id', { length: 32 }),
  social: jsonText<SocialLink[]>('social'),
  updated_at: updatedAt(),
})

export const site_settings_i18n = mysqlTable(
  'site_settings_i18n',
  {
    ...i18nBase(() => site_settings.id),
    whatsapp_message_default: varchar('whatsapp_message_default', { length: 500 }),
    reply_hours: varchar('reply_hours', { length: 255 }),
    home: jsonText<Record<string, unknown>>('home'),
    booking_band: jsonText<Record<string, unknown>>('booking_band'),
    stats: jsonText<{ value: string; label: string }[]>('stats'),
    trust_items: jsonText<{ icon: string; text: string; enabled: boolean }[]>('trust_items'),
    archive_intros: jsonText<Record<string, unknown>>('archive_intros'),
    cancellation_policies: jsonText<{ key: string; name: string; text: string }[]>('cancellation_policies'),
    og_default_id: imageRef('og_default_id'),
  },
  (t) => [uniqueIndex('site_settings_i18n_entity_locale').on(t.entity_id, t.locale)],
)

// ----------------------------------------------------------------- navigation
export const navigation = mysqlTable('navigation', {
  id: id(),
  updated_at: updatedAt(),
})

export const navigation_i18n = mysqlTable(
  'navigation_i18n',
  {
    ...i18nBase(() => navigation.id),
    tree: jsonText<Record<string, unknown>>('tree'),
  },
  (t) => [uniqueIndex('navigation_i18n_entity_locale').on(t.entity_id, t.locale)],
)

// ------------------------------------------------------------ inquiries (§7)
export type Utm = { source: string; medium: string; campaign: string; term: string; content: string }

export const inquiries = mysqlTable(
  'inquiries',
  {
    id: id(),
    title: varchar('title', { length: 255 }).notNull(),
    form: varchar('form', { length: 16 }).notNull().default('plan_my_trip'),
    trip_type: varchar('trip_type', { length: 16 }),
    trip_id: int('trip_id'),
    interests: jsonText<string[]>('interests'),
    length: varchar('length', { length: 64 }),
    date_mode: varchar('date_mode', { length: 16 }),
    date_from: date('date_from', { mode: 'string' }),
    date_to: date('date_to', { mode: 'string' }),
    month: varchar('month', { length: 32 }),
    adults: int('adults'),
    children: int('children'),
    children_ages: varchar('children_ages', { length: 100 }),
    budget: varchar('budget', { length: 64 }),
    hotel: varchar('hotel', { length: 64 }),
    group_type: varchar('group_type', { length: 64 }),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    whatsapp: varchar('whatsapp', { length: 64 }),
    channel: varchar('channel', { length: 16 }),
    message: text('message'),
    consent_at: datetime('consent_at', { mode: 'date' }),
    marketing: boolean('marketing').notNull().default(false),
    lang: varchar('lang', { length: 2 }).notNull(),
    page_url: varchar('page_url', { length: 500 }),
    utm: jsonText<Utm>('utm'),
    gclid: varchar('gclid', { length: 300 }),
    fbclid: varchar('fbclid', { length: 300 }),
    landing: varchar('landing', { length: 500 }),
    status: varchar('status', { length: 16 }).notNull().default('new'),
    tracked: boolean('tracked').notNull().default(false),
    ip_hash: varchar('ip_hash', { length: 64 }),
    hola_sample: sample(),
    created_at: createdAt(),
    updated_at: updatedAt(),
  },
  (t) => [index('inquiries_created').on(t.created_at), index('inquiries_ip').on(t.ip_hash, t.created_at), index('inquiries_status').on(t.status)],
)

// ------------------------------------------------------------- users (§18)
export const users = mysqlTable('users', {
  id: id(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 16 }).notNull().default('editor'),
  session_version: int('session_version').notNull().default(1),
  created_at: createdAt(),
  last_login_at: datetime('last_login_at', { mode: 'date' }),
})

export const login_attempts = mysqlTable(
  'login_attempts',
  {
    id: id(),
    ip_hash: varchar('ip_hash', { length: 64 }).notNull(),
    email: varchar('email', { length: 191 }).notNull(),
    created_at: createdAt(),
  },
  (t) => [index('login_attempts_ip').on(t.ip_hash, t.created_at), index('login_attempts_email').on(t.email, t.created_at)],
)
