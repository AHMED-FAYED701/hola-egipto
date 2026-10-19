/**
 * Document shapes returned by the data layer (src/lib/content/*). They keep the v2 field names so the
 * front-end components stay unchanged; rich text is Markdown (contracts §4) and images come from the
 * `images` library (§13). Relations are populated objects when loaded with depth ≥ 1, else ids.
 */

/** An image-library row (contracts §13). `url` is the public path under /images or /brand. */
export interface Media {
  id: number
  path: string
  url: string
  alt: string
  alt_es: string
  alt_en: string
  width: number
  height: number
  holaSample?: boolean | null
}
export type Image = Media

export interface Tour {
  id: number;
  title: string;
  slug?: string | null;
  available?: boolean | null;
  excerpt?: string | null;
  featured_image?: (number | null) | Media;
  seo?: {
    meta_title?: string | null;
    meta_description?: string | null;
    og_image?: (number | null) | Media;
  };
  holaSample?: boolean | null;
  subtitle?: string | null;
  overview?: string | null;
  gallery?: (number | Media)[] | null;
  duration_days: number;
  duration?: (number | null) | Duration;
  trip_style?: (number | TripStyle)[] | null;
  guides?: (number | Guide)[] | null;
  price_from_eur?: number | null;
  price_from_usd?: number | null;
  price_basis?: ('per_person_double' | 'per_person' | 'per_group') | null;
  price_note?: string | null;
  group_type?: ('private' | 'small' | 'shared') | null;
  group_min?: number | null;
  group_max?: number | null;
  guide_languages?: ('es' | 'en')[] | null;
  highlights?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  itinerary?:
    | {
        label: string;
        title: string;
        description?: string | null;
        places?: (number | Destination)[] | null;
        meals?: ('B' | 'L' | 'D')[] | null;
        overnight?: string | null;
        id?: string | null;
      }[]
    | null;
  includes?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  excludes?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  what_to_bring?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  availability_days?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[] | null;
  season_note?: string | null;
  cancellation_policy?: string | null;
  cancellation_override?: string | null;
  faq?:
    | {
        q: string;
        a: string;
        id?: string | null;
      }[]
    | null;
  destinations?: (number | Destination)[] | null;
  related_trips?:
    | (
        | {
            relationTo: 'tours';
            value: number | Tour;
          }
        | {
            relationTo: 'cruises';
            value: number | Cruise;
          }
        | {
            relationTo: 'excursions';
            value: number | Excursion;
          }
      )[]
    | null;
  booking_mode?: ('inquiry' | 'external' | 'bookable') | null;
  booking_url?: string | null;
  last_reviewed?: string | null;
  featured?: boolean | null;
  updatedAt: string;
  createdAt: string;
}

export interface Duration {
  id: number;
  name: string;
  slug?: string | null;
  hero?: (number | null) | Media;
  h1?: string | null;
  intro?: string | null;
  seo_text?: string | null;
  faq?:
    | {
        q: string;
        a: string;
        id?: string | null;
      }[]
    | null;
  sort?: number | null;
  min_days?: number | null;
  max_days?: number | null;
  updatedAt: string;
  createdAt: string;
}

export interface TripStyle {
  id: number;
  name: string;
  slug?: string | null;
  hero?: (number | null) | Media;
  h1?: string | null;
  intro?: string | null;
  seo_text?: string | null;
  faq?:
    | {
        q: string;
        a: string;
        id?: string | null;
      }[]
    | null;
  sort?: number | null;
  updatedAt: string;
  createdAt: string;
}

export interface Guide {
  id: number;
  title: string;
  slug?: string | null;
  available?: boolean | null;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: (number | null) | Media;
  seo?: {
    meta_title?: string | null;
    meta_description?: string | null;
    og_image?: (number | null) | Media;
  };
  holaSample?: boolean | null;
  guide_topic?: (number | GuideTopic)[] | null;
  last_updated?: string | null;
  toc?: boolean | null;
  related_destinations?: (number | Destination)[] | null;
  related_trips?:
    | (
        | {
            relationTo: 'tours';
            value: number | Tour;
          }
        | {
            relationTo: 'cruises';
            value: number | Cruise;
          }
        | {
            relationTo: 'excursions';
            value: number | Excursion;
          }
      )[]
    | null;
  author_name?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface GuideTopic {
  id: number;
  name: string;
  slug?: string | null;
  hero?: (number | null) | Media;
  h1?: string | null;
  intro?: string | null;
  seo_text?: string | null;
  faq?:
    | {
        q: string;
        a: string;
        id?: string | null;
      }[]
    | null;
  sort?: number | null;
  updatedAt: string;
  createdAt: string;
}

export interface Destination {
  id: number;
  title: string;
  slug?: string | null;
  available?: boolean | null;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: (number | null) | Media;
  seo?: {
    meta_title?: string | null;
    meta_description?: string | null;
    og_image?: (number | null) | Media;
  };
  holaSample?: boolean | null;
  region?: (number | null) | Region;
  tagline?: string | null;
  best_months?:
    ('jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec')[] | null;
  days_recommended?: number | null;
  how_to_get_there?: string | null;
  nearest_airport?: string | null;
  top_sights?:
    | {
        name: string;
        image?: (number | null) | Media;
        text?: string | null;
        map_link?: string | null;
        id?: string | null;
      }[]
    | null;
  lat?: number | null;
  lng?: number | null;
  nearby?: (number | Destination)[] | null;
  updatedAt: string;
  createdAt: string;
}

export interface Region {
  id: number;
  name: string;
  slug?: string | null;
  hero?: (number | null) | Media;
  h1?: string | null;
  intro?: string | null;
  seo_text?: string | null;
  faq?:
    | {
        q: string;
        a: string;
        id?: string | null;
      }[]
    | null;
  sort?: number | null;
  updatedAt: string;
  createdAt: string;
}

export interface Cruise {
  id: number;
  title: string;
  slug?: string | null;
  available?: boolean | null;
  excerpt?: string | null;
  featured_image?: (number | null) | Media;
  seo?: {
    meta_title?: string | null;
    meta_description?: string | null;
    og_image?: (number | null) | Media;
  };
  holaSample?: boolean | null;
  subtitle?: string | null;
  overview?: string | null;
  gallery?: (number | Media)[] | null;
  nights: number;
  cruise_type?: (number | null) | CruiseType;
  trip_style?: (number | TripStyle)[] | null;
  ship_name?: string | null;
  ship_category?: ('4star' | '5star' | 'deluxe' | 'dahabiya') | null;
  embark?: (number | null) | Destination;
  disembark?: (number | null) | Destination;
  start_dates?:
    | {
        date: string;
        note?: string | null;
        id?: string | null;
      }[]
    | null;
  cabins?:
    | {
        type?: string | null;
        size_m2?: number | null;
        beds?: string | null;
        price_from_eur?: number | null;
        price_from_usd?: number | null;
        id?: string | null;
      }[]
    | null;
  ship_facilities?: ('pool' | 'sun_deck' | 'restaurant' | 'bar' | 'air_conditioning' | 'wifi' | 'spa' | 'gym')[] | null;
  deck_plan?: (number | null) | Media;
  price_from_eur?: number | null;
  price_from_usd?: number | null;
  price_basis?: ('per_person_double' | 'per_person' | 'per_group') | null;
  price_note?: string | null;
  group_type?: ('private' | 'small' | 'shared') | null;
  group_min?: number | null;
  group_max?: number | null;
  guide_languages?: ('es' | 'en')[] | null;
  highlights?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  itinerary?:
    | {
        label: string;
        title: string;
        description?: string | null;
        places?: (number | Destination)[] | null;
        meals?: ('B' | 'L' | 'D')[] | null;
        overnight?: string | null;
        id?: string | null;
      }[]
    | null;
  includes?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  excludes?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  what_to_bring?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  availability_days?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[] | null;
  season_note?: string | null;
  cancellation_policy?: string | null;
  cancellation_override?: string | null;
  faq?:
    | {
        q: string;
        a: string;
        id?: string | null;
      }[]
    | null;
  destinations?: (number | Destination)[] | null;
  related_trips?:
    | (
        | {
            relationTo: 'tours';
            value: number | Tour;
          }
        | {
            relationTo: 'cruises';
            value: number | Cruise;
          }
        | {
            relationTo: 'excursions';
            value: number | Excursion;
          }
      )[]
    | null;
  booking_mode?: ('inquiry' | 'external' | 'bookable') | null;
  booking_url?: string | null;
  last_reviewed?: string | null;
  featured?: boolean | null;
  updatedAt: string;
  createdAt: string;
}

export interface CruiseType {
  id: number;
  name: string;
  slug?: string | null;
  hero?: (number | null) | Media;
  h1?: string | null;
  intro?: string | null;
  seo_text?: string | null;
  faq?:
    | {
        q: string;
        a: string;
        id?: string | null;
      }[]
    | null;
  sort?: number | null;
  updatedAt: string;
  createdAt: string;
}

export interface Excursion {
  id: number;
  title: string;
  slug?: string | null;
  available?: boolean | null;
  excerpt?: string | null;
  featured_image?: (number | null) | Media;
  seo?: {
    meta_title?: string | null;
    meta_description?: string | null;
    og_image?: (number | null) | Media;
  };
  holaSample?: boolean | null;
  subtitle?: string | null;
  overview?: string | null;
  gallery?: (number | Media)[] | null;
  duration_hours: number;
  departure?: (number | Departure)[] | null;
  start_times?:
    | {
        time: string;
        label?: string | null;
        id?: string | null;
      }[]
    | null;
  pickup_areas?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  child_price_eur?: number | null;
  child_price_usd?: number | null;
  min_age?: number | null;
  activity_level?: ('easy' | 'moderate' | 'demanding') | null;
  price_from_eur?: number | null;
  price_from_usd?: number | null;
  price_basis?: ('per_person_double' | 'per_person' | 'per_group') | null;
  price_note?: string | null;
  group_type?: ('private' | 'small' | 'shared') | null;
  group_min?: number | null;
  group_max?: number | null;
  guide_languages?: ('es' | 'en')[] | null;
  highlights?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  itinerary?:
    | {
        label: string;
        title: string;
        description?: string | null;
        places?: (number | Destination)[] | null;
        meals?: ('B' | 'L' | 'D')[] | null;
        overnight?: string | null;
        id?: string | null;
      }[]
    | null;
  includes?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  excludes?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  what_to_bring?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  availability_days?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[] | null;
  season_note?: string | null;
  cancellation_policy?: string | null;
  cancellation_override?: string | null;
  faq?:
    | {
        q: string;
        a: string;
        id?: string | null;
      }[]
    | null;
  destinations?: (number | Destination)[] | null;
  related_trips?:
    | (
        | {
            relationTo: 'tours';
            value: number | Tour;
          }
        | {
            relationTo: 'cruises';
            value: number | Cruise;
          }
        | {
            relationTo: 'excursions';
            value: number | Excursion;
          }
      )[]
    | null;
  booking_mode?: ('inquiry' | 'external' | 'bookable') | null;
  booking_url?: string | null;
  last_reviewed?: string | null;
  featured?: boolean | null;
  updatedAt: string;
  createdAt: string;
}

export interface Departure {
  id: number;
  name: string;
  slug?: string | null;
  hero?: (number | null) | Media;
  h1?: string | null;
  intro?: string | null;
  seo_text?: string | null;
  faq?:
    | {
        q: string;
        a: string;
        id?: string | null;
      }[]
    | null;
  sort?: number | null;
  destination?: (number | null) | Destination;
  updatedAt: string;
  createdAt: string;
}

export interface Page {
  id: number;
  title: string;
  slug?: string | null;
  available?: boolean | null;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: (number | null) | Media;
  seo?: {
    meta_title?: string | null;
    meta_description?: string | null;
    og_image?: (number | null) | Media;
  };
  holaSample?: boolean | null;
  template: 'home' | 'default' | 'about' | 'contact' | 'faq' | 'plan-my-trip' | 'thank-you' | 'legal';
  layout?:
    | (
        | {
            heading: string;
            lead?: string | null;
            image?: (number | null) | Media;
            show_stats?: boolean | null;
            draft?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'hero';
          }
        | {
            note?: string | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'booking-band';
          }
        | {
            note?: string | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'trust-bar';
          }
        | {
            eyebrow?: string | null;
            title?: string | null;
            intro?: string | null;
            limit?: number | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'destinations-grid';
          }
        | {
            eyebrow?: string | null;
            title?: string | null;
            intro?: string | null;
            limit?: number | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'trips-grid';
          }
        | {
            eyebrow?: string | null;
            title?: string | null;
            intro?: string | null;
            image?: (number | null) | Media;
            id?: string | null;
            blockName?: string | null;
            blockType: 'cruises-split';
          }
        | {
            eyebrow?: string | null;
            title?: string | null;
            intro?: string | null;
            cities?: (number | Departure)[] | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'excursions-by-city';
          }
        | {
            eyebrow?: string | null;
            title?: string | null;
            columns?:
              | {
                  icon?: ('map-pin' | 'languages' | 'compass' | 'message-circle' | 'calendar-check' | 'sun') | null;
                  title: string;
                  text: string;
                  id?: string | null;
                }[]
              | null;
            draft?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'why';
          }
        | {
            eyebrow?: string | null;
            title?: string | null;
            intro?: string | null;
            limit?: number | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'guides-grid';
          }
        | {
            title?: string | null;
            text?: string | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'cta-band';
          }
        | {
            eyebrow?: string | null;
            title?: string | null;
            body?: string | null;
            draft?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'text';
          }
        | {
            eyebrow?: string | null;
            title?: string | null;
            members?:
              | {
                  name: string;
                  role?: string | null;
                  languages?: string | null;
                  photo?: (number | null) | Media;
                  id?: string | null;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'team';
          }
        | {
            eyebrow?: string | null;
            title?: string | null;
            items?:
              | {
                  title: string;
                  text?: string | null;
                  id?: string | null;
                }[]
              | null;
            draft?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'steps';
          }
        | {
            title?: string | null;
            text?: string | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'licence';
          }
      )[]
    | null;
  faq_groups?:
    | {
        title: string;
        items?:
          | {
              q: string;
              a: string;
              id?: string | null;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
  last_updated?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface Inquiry {
  id: number;
  title?: string | null;
  status: 'new' | 'replied' | 'won' | 'lost';
  form?: ('plan_my_trip' | 'contact') | null;
  trip?:
    | ({
        relationTo: 'tours';
        value: number | Tour;
      } | null)
    | ({
        relationTo: 'cruises';
        value: number | Cruise;
      } | null)
    | ({
        relationTo: 'excursions';
        value: number | Excursion;
      } | null);
  interests?: string[] | null;
  length?: string | null;
  date_mode?: ('exact' | 'month' | 'flexible') | null;
  date_from?: string | null;
  date_to?: string | null;
  month?: string | null;
  adults?: number | null;
  children?: number | null;
  children_ages?: string | null;
  budget?: string | null;
  hotel?: string | null;
  group_type?: string | null;
  name: string;
  email: string;
  whatsapp?: string | null;
  channel?: ('whatsapp' | 'email') | null;
  message?: string | null;
  consent_at?: string | null;
  marketing?: boolean | null;
  lang: 'es' | 'en';
  page_url?: string | null;
  utm?: {
    source?: string | null;
    medium?: string | null;
    campaign?: string | null;
    term?: string | null;
    content?: string | null;
  };
  gclid?: string | null;
  fbclid?: string | null;
  landing?: string | null;
  tracked?: boolean | null;
  ip_hash?: string | null;
  holaSample?: boolean | null;
  updatedAt: string;
  createdAt: string;
}

export interface SiteSetting {
  id: number;
  whatsapp_number?: string | null;
  whatsapp_message_default?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  address?: string | null;
  reply_hours?: string | null;
  legal_name?: string | null;
  licence_number?: string | null;
  social?:
    | {
        network: 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'x' | 'linkedin';
        url: string;
        id?: string | null;
      }[]
    | null;
  booking_band?: {
    enabled?: boolean | null;
    badge?: string | null;
    title?: string | null;
    text?: string | null;
    primary_label?: string | null;
    secondary_label?: string | null;
  };
  stats?:
    | {
        value: string;
        label: string;
        id?: string | null;
      }[]
    | null;
  trust_items?:
    | {
        icon?: ('languages' | 'map-pin' | 'calendar-check' | 'message-circle' | 'compass' | 'shield-check') | null;
        text: string;
        enabled?: boolean | null;
        id?: string | null;
      }[]
    | null;
  archive_intros?: {
    tours?: {
      h1?: string | null;
      intro?: string | null;
      hero?: (number | null) | Media;
      seo_text?: string | null;
      faq?:
        | {
            q: string;
            a: string;
            id?: string | null;
          }[]
        | null;
    };
    cruises?: {
      h1?: string | null;
      intro?: string | null;
      hero?: (number | null) | Media;
      seo_text?: string | null;
      faq?:
        | {
            q: string;
            a: string;
            id?: string | null;
          }[]
        | null;
    };
    excursions?: {
      h1?: string | null;
      intro?: string | null;
      hero?: (number | null) | Media;
      seo_text?: string | null;
      faq?:
        | {
            q: string;
            a: string;
            id?: string | null;
          }[]
        | null;
    };
    destinations?: {
      h1?: string | null;
      intro?: string | null;
      hero?: (number | null) | Media;
      seo_text?: string | null;
      faq?:
        | {
            q: string;
            a: string;
            id?: string | null;
          }[]
        | null;
    };
    guides?: {
      h1?: string | null;
      intro?: string | null;
      hero?: (number | null) | Media;
      seo_text?: string | null;
      faq?:
        | {
            q: string;
            a: string;
            id?: string | null;
          }[]
        | null;
    };
  };
  cancellation_policies?:
    | {
        key: string;
        name?: string | null;
        text?: string | null;
        id?: string | null;
      }[]
    | null;
  og_default?: (number | null) | Media;
  gtm_id?: string | null;
  home?: HomeTexts | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

export interface Navigation {
  id: number;
  header?:
    | {
        label: string;
        href: string;
        columns?:
          | {
              heading?: string | null;
              links?:
                | {
                    label: string;
                    href: string;
                    id?: string | null;
                  }[]
                | null;
              id?: string | null;
            }[]
          | null;
        panel_extra?: ('featured' | 'map' | 'latest_guides' | 'none') | null;
        featured?:
          | ({
              relationTo: 'tours';
              value: number | Tour;
            } | null)
          | ({
              relationTo: 'cruises';
              value: number | Cruise;
            } | null)
          | ({
              relationTo: 'excursions';
              value: number | Excursion;
            } | null);
        id?: string | null;
      }[]
    | null;
  footer_columns?:
    | {
        heading: string;
        links?:
          | {
              label: string;
              href: string;
              id?: string | null;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
  footer_description?: string | null;
  legal_links?:
    | {
        label: string;
        href: string;
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

/** Home page texts (site_settings_i18n.home). The sections themselves are fixed in code (contracts §4). */
export interface HomeTexts {
  hero?: { heading?: string | null; lead?: string | null; image?: (number | null) | Media; show_stats?: boolean | null; draft?: boolean | null }
  destinations?: { eyebrow?: string | null; title?: string | null; intro?: string | null; limit?: number | null }
  trips?: { eyebrow?: string | null; title?: string | null; intro?: string | null; limit?: number | null }
  cruises?: { eyebrow?: string | null; title?: string | null; intro?: string | null; image?: (number | null) | Media }
  excursions?: { eyebrow?: string | null; title?: string | null; intro?: string | null; cities?: (number | Departure)[] | null }
  why?: { eyebrow?: string | null; title?: string | null; draft?: boolean | null; columns?: { icon?: string | null; title: string; text: string }[] | null }
  guides?: { eyebrow?: string | null; title?: string | null; intro?: string | null; limit?: number | null }
  cta?: { title?: string | null; text?: string | null }
}

export type PageBlock = NonNullable<Page['layout']>[number]

/** Filter conditions understood by the data layer (a small subset of the v2 query shape). */
export type Op = { equals?: unknown; not_equals?: unknown; in?: unknown[]; less_than_equal?: number; like?: string }
export type Where = { and?: Where[]; or?: Where[] } & { [field: string]: Op | Where[] | undefined }

export interface Paginated<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type ContentDoc = Tour | Cruise | Excursion | Destination | Guide
export type TermDoc = Duration | TripStyle | CruiseType | Departure | Region | GuideTopic
