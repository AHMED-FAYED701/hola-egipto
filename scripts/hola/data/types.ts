/** Shapes of the seed and sample data (content rules §2). Both languages live in one item. */
export type L<T = string> = { es: T; en: T }

export type MealCode = 'B' | 'L' | 'D'
export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
export type Month = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec'

export interface ItineraryItem {
  label: string // "Día 1" / "Day 1", or "08:00" for excursions
  title: string
  description: string // 2–4 sentences
  places: string[] // destination keys (see destinations.ts), may be []
  meals: MealCode[]
  overnight?: string // e.g. "El Cairo · Hotel 5★ (pendiente)" — never a hotel brand
}

export interface TripBase {
  key: string // stable id, e.g. "tour-classic-8"
  title: L
  slug: L // natural per language, no numeric suffix
  excerpt: L // ≤ 155 chars
  subtitle: L // ≤ 90 chars
  overview: L<string[]> // 2–4 paragraphs
  meta_description?: L // ≤ 155 chars (optional)
  featured_image: string // media key (media.ts)
  gallery: string[] // exactly 5 media keys
  price_from_eur: number
  price_from_usd: number
  price_basis: 'per_person_double' | 'per_person' | 'per_group'
  price_note: L
  group_type: 'private' | 'small' | 'shared'
  group_min: number
  group_max: number
  guide_languages: ('es' | 'en')[]
  highlights: L<string[]> // 4–8
  itinerary: L<ItineraryItem[]> // one per day (tours/cruises) or per time slot (excursions)
  includes: L<string[]> // 4–6
  excludes: L<string[]> // 4–6
  what_to_bring: L<string[]> // 3–6
  availability_days: Weekday[]
  season_note: L
  cancellation_policy: 'standard' | 'flexible'
  faq: L<{ q: string; a: string }[]> // exactly 3
  destinations: string[] // destination keys in route order
  related_trips: string[] // trip keys, max 3
  featured: boolean
}

export interface TourSample extends TripBase {
  collection: 'tours'
  duration_days: number
  trip_style: string[] // Spanish slugs of trip-styles terms
  guides: string[] // guide keys
}

export interface CruiseSample extends TripBase {
  collection: 'cruises'
  nights: number
  cruise_type: string // Spanish slug of the cruise-types term
  trip_style: string[]
  ship_name: L // e.g. "Barco 5★ (nombre pendiente)" / "5★ ship (name pending)"
  ship_category: '4star' | '5star' | 'deluxe' | 'dahabiya'
  embark: string // destination key
  disembark: string // destination key
  start_dates: { date: string; note: L }[] // ISO dates in 2027
  cabins: { type: L; size_m2: number; beds: L; price_from_eur: number; price_from_usd: number }[]
  ship_facilities: ('pool' | 'sun_deck' | 'restaurant' | 'bar' | 'air_conditioning' | 'wifi' | 'spa' | 'gym')[]
  deck_plan: string // media key
}

export interface ExcursionSample extends TripBase {
  collection: 'excursions'
  duration_hours: number
  departure: string[] // Spanish slugs of departures terms
  start_times: { time: string; label: L }[]
  pickup_areas: L<string[]>
  child_price_eur: number
  child_price_usd: number
  min_age: number
  activity_level: 'easy' | 'moderate' | 'demanding'
}

export type TripSample = TourSample | CruiseSample | ExcursionSample

export interface DestinationSample {
  key: string // e.g. "dest-luxor"
  title: L
  slug: L
  excerpt: L // ≤ 155
  content: L<string[]> // 3–5 paragraphs
  region: string // Spanish slug of the regions term
  tagline: L
  best_months: Month[]
  days_recommended: number
  how_to_get_there: L
  nearest_airport: L
  top_sights: L<{ name: string; image: string; text: string; map_link: string }[]> // exactly 4, image = media key
  lat: number
  lng: number
  nearby: string[] // destination keys
  featured_image: string // media key (tile)
}

export type GuideBlock =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { tip: { title?: string; text: string } }
  | { trip: string } // trip key → trip-card block

export interface GuideSample {
  key: string
  title: L
  slug: L
  excerpt: L // ≤ 155
  body: L<GuideBlock[]> // 900–1300 words per language, H2 sections, exactly one {trip} and one {tip}
  guide_topic: string[] // Spanish slugs of guide-topics terms (1–2)
  related_destinations: string[]
  related_trips: string[]
  featured_image: string
}
