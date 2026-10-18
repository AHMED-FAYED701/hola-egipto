# Hola Egipto — Website Specification v1

Oct 6, 2026 · @Ahmed Fayed

> **Kit note (Next.js edition, 18 Oct 2026):** this is the spec as agreed on 6 Oct 2026, written for WordPress. The build is now **Next.js + Payload CMS**. `kit/START-HERE.md` ("Translating the spec") and `kit/docs/02`–`05` override this file wherever they differ: file names such as `single-tour.php`, plugins (Polylang, Yoast, Complianz, LiteSpeed, WP Mail SMTP, Redirection, Two Factor, UpdraftPlus), WP-CLI, `wp-content`, hosting, Cloudflare and backups. What the site **is** (pages, URLs, content model, sections, SEO, tracking, budgets, legal) still comes from here. All decisions in the table below are agreed; build on the Recommended column.

## Summary and scope

Hola Egipto launches as a bilingual (Spanish / English) WordPress site that sells Egypt tours, Nile cruises and Red Sea excursions through inquiries and WhatsApp, with online booking added in a later phase. It is a custom theme plus one custom plugin, built on the approved brand kit v1. There is no page builder, and Claude Code builds it in place on the dev server from a build kit.

**In scope for launch**

- **Content types:** 5 custom post types (Tours, Nile Cruises, Excursions, Destinations, Travel Guide), each with its own archive and single template.
- **Landing pages:** taxonomy pages that rank ("Excursions from Hurghada", "8–10 day tours").
- **Lead capture:** a multi-step "Plan my trip" inquiry form, plus WhatsApp click-to-chat with a pre-filled message on every trip page.
- **Languages:** full ES/EN parity with translated URLs, and hreflang tags so search engines match each language version.
- **Search and tracking:** schema markup for each content type, and ad tracking (GA4, Meta, Google Ads) with consent mode.
- **Fixed pages:** Home, About, Contact, FAQ, Plan my trip, legal pages, 404 and search.

**Out of scope for launch (Phase 2)**

- Online booking and payment, availability calendars, customer accounts.
- A reviews section. This waits until real reviews exist, so there is no rating claim before then.
- A blog newsletter and CRM integration beyond a webhook.

## Decisions to confirm

The rest of this spec is written on the recommended answers below. Change any row and the affected sections get revised; nothing is built until all rows read Agreed.

| # | Decision | Recommended | Why | Status |
| --- | --- | --- | --- | --- |
| 1 | Default language | Spanish at the root `/`, English under `/en/` | The brand name and audience are Spanish-speaking; the root language gets the strongest SEO weight | Agreed |
| 2 | Spanish variant | Neutral Spanish, *tú*, *ustedes* for plural | Works for Spain and Latin America; switch to *vosotros* only if Spain is the main market | Agreed |
| 3 | Display currency | EUR on Spanish pages, USD on English pages (two price fields per trip) | Matches what each audience compares against; no live conversion to maintain | Agreed |
| 4 | Build approach | Custom theme + `hola-core` plugin + Secure Custom Fields (free, ACF-compatible), Gutenberg for editorial text | Full control of templates and speed; no page-builder weight | Agreed |
| 5 | Multilingual plugin | Polylang Pro | Translates CPT and taxonomy URL slugs and syncs ACF fields; lighter than WPML | Agreed |
| 6 | Hosting | The existing dev server and domain, built in place by Claude Code behind a coming-soon page | The server is still in development, so it can be rebuilt freely; you review on the real domain while visitors see coming-soon | Agreed |
| 7 | Domain | `hola-egipto.com` (assumed; Claude Code reads the real one from WordPress) | Needs confirming before email, SSL and analytics setup | Agreed |
| 8 | Inquiry form | Custom form in `hola-core` (stored entries + email + webhook) | One form for both languages, UTM capture, no form-plugin licence | Agreed |
| 9 | URL list | Reconcile your existing URL list with section 3 | Your list was not shared yet; section 3 is a proposal | Agreed |
| 10 | Legal operator | Name the company that sells the trips and its Ministry of Tourism licence (or the licensed partner agency) | Required in the footer, terms and schema; drives the legal pages | Agreed |
| 11 | Launch content volume | 8 tours, 4 cruises, 12 excursions, 10 destinations, 6 guides per language | Enough for every menu and landing page to have real items | Agreed |

## Sitemap and URL structure

The site has 26 page types: 5 content hubs with their archive, single and taxonomy pages, plus the fixed pages. Spanish lives at the root and English under `/en/`; every slug is translated.

*(Diagram omitted in the kit: the table below is the full URL list.)*

Each hub has an archive, a page per item and indexable landing pages per taxonomy term (term counts at launch shown). English mirrors the same tree under `/en/`.

| Page type | Template | Spanish URL | English URL | Index |
| --- | --- | --- | --- | --- |
| Home | `front-page.php` | `/` | `/en/` | yes |
| Tours archive | `archive-tour.php` | `/viajes-a-egipto/` | `/en/egypt-tours/` | yes |
| Tour | `single-tour.php` | `/viajes-a-egipto/{slug}/` | `/en/egypt-tours/{slug}/` | yes |
| Tours by duration | `taxonomy-duration.php` | `/viajes-a-egipto/duracion/{term}/` | `/en/egypt-tours/duration/{term}/` | yes |
| Tours by style | `taxonomy-trip_style.php` | `/viajes-a-egipto/estilo/{term}/` | `/en/egypt-tours/style/{term}/` | yes |
| Cruises archive | `archive-cruise.php` | `/cruceros-por-el-nilo/` | `/en/nile-cruises/` | yes |
| Cruise | `single-cruise.php` | `/cruceros-por-el-nilo/{slug}/` | `/en/nile-cruises/{slug}/` | yes |
| Cruises by type | `taxonomy-cruise_type.php` | `/cruceros-por-el-nilo/tipo/{term}/` | `/en/nile-cruises/type/{term}/` | yes |
| Excursions archive | `archive-excursion.php` | `/excursiones/` | `/en/excursions/` | yes |
| Excursion | `single-excursion.php` | `/excursiones/{slug}/` | `/en/excursions/{slug}/` | yes |
| Excursions by departure city | `taxonomy-departure.php` | `/excursiones/desde/{city}/` | `/en/excursions/from/{city}/` | yes |
| Destinations archive | `archive-destination.php` | `/destinos/` | `/en/destinations/` | yes |
| Destination | `single-destination.php` | `/destinos/{slug}/` | `/en/destinations/{slug}/` | yes |
| Region | `taxonomy-region.php` | `/destinos/region/{term}/` | `/en/destinations/region/{term}/` | yes |
| Travel Guide archive | `archive-guide.php` | `/guia-de-viaje/` | `/en/travel-guide/` | yes |
| Guide article | `single-guide.php` | `/guia-de-viaje/{slug}/` | `/en/travel-guide/{slug}/` | yes |
| Guide topic | `taxonomy-guide_topic.php` | `/guia-de-viaje/tema/{term}/` | `/en/travel-guide/topic/{term}/` | yes |
| Plan my trip | `page-templates/plan-my-trip.php` | `/planifica-tu-viaje/` | `/en/plan-my-trip/` | yes |
| Thank you | `page-templates/thank-you.php` | `/gracias/` | `/en/thank-you/` | no |
| About us | `page.php` + blocks | `/sobre-nosotros/` | `/en/about-us/` | yes |
| Contact | `page-templates/contact.php` | `/contacto/` | `/en/contact/` | yes |
| FAQ | `page-templates/faq.php` | `/preguntas-frecuentes/` | `/en/faq/` | yes |
| Legal notice | `page.php` | `/aviso-legal/` | `/en/legal-notice/` | yes |
| Privacy policy | `page.php` | `/politica-de-privacidad/` | `/en/privacy-policy/` | yes |
| Cookie policy | `page.php` | `/politica-de-cookies/` | `/en/cookie-policy/` | yes |
| Terms and cancellation | `page.php` | `/condiciones-y-cancelacion/` | `/en/terms-and-cancellation/` | yes |

Search results and `404.php` complete the set. Both are noindex.

**URL rules**

- **Slug format:** lowercase, hyphens, trailing slash, no accents (`n` for `ñ`), 2–5 words, keyword first.
- **Filters:** filtered archive states (`?duracion=8-10&estilo=privado`) stay crawlable for links but are `noindex, follow` with a canonical to the clean archive. Only taxonomy terms are indexable landing pages.
- **Spanish head term:** `/viajes-a-egipto/` vs `/tours-por-egipto/` gets settled by a keyword-volume check before launch. The OG image follows whichever wins.
- **Slug changes:** a changed slug always gets a 301 in Redirection.

## Navigation

The header keeps the mockup's six items. Each dropdown opens a mega panel built from a normal WordPress menu (one menu per language), so the owner can edit it without code.

**Header mega panels (Spanish labels, English mirrors them)**

| Menu item | Column 1 | Column 2 | Column 3 |
| --- | --- | --- | --- |
| Viajes a Egipto | By duration: up to 6 days, 7–9, 10–12, 13+ | By style: classic, Egypt + Red Sea, private, family, honeymoon, desert | Featured trip card + "All trips" |
| Cruceros por el Nilo | By type: Luxor–Aswan ships, dahabiyas, Lake Nasser | The 2–3 main routes (Luxor → Aswan 4 nights, Aswan → Luxor 3 nights) | Featured cruise card |
| Excursiones | From Hurghada, El Gouna, Marsa Alam, Sharm el Sheikh | From Cairo, Luxor, Aswan | Featured excursion card |
| Destinos | Cairo & Giza, Alexandria · Upper Egypt: Luxor, Aswan, Abu Simbel | Red Sea: Hurghada, El Gouna, Marsa Alam, Sharm, Dahab · Desert: Siwa, White Desert | Small Egypt map with region links |
| Guía de viaje | Plan: visa, best time, budget, safety | What to see, food & culture, diving & Red Sea, itineraries | Latest 2 articles |

The featured card in each panel is picked per menu item with an ACF field. The panels are keyboard-operable (Enter / Esc / arrow keys) and open on click, not hover-only.

**Right side of the header:** ES | EN switcher, WhatsApp ("Escríbenos"), and the terracotta "Planifica tu viaje" button.

**Breakpoints** (this fixes the overflow risk from the mockup):

- **≥ 1280 px:** full header as in the mockup.
- **1024–1279 px:** WhatsApp collapses to its icon and the switcher shows "ES".
- **< 1024 px:** logo + hamburger drawer with accordion sections; the CTA and switcher sit inside the drawer.
- **Mobile, every page:** a sticky bottom bar with WhatsApp + "Planifica tu viaje". On trip pages it shows the price-from instead.

The header is sticky and shrinks from 88 px to 64 px tall after 120 px of scroll.

**Language switcher:** links to the translated version of the same page. If a translation is missing, that language's link is hidden on that page rather than dumping the visitor on the other homepage.

**Breadcrumbs:** on every page except Home (`Inicio › Viajes a Egipto › {trip}`), with BreadcrumbList schema.

**Footer** (`deep-oasis` with the deep pattern, four columns, then a bottom bar)

1. Reverse stacked logo, a two-line description, WhatsApp, email, social icons.
2. **Viajes:** top durations and styles, Nile cruises.
3. **Excursiones y destinos:** departure cities, top 5 destinations.
4. **Hola Egipto:** About, Travel Guide, FAQ, Contact, Plan my trip.
5. **Bottom bar:** legal links, operating company + tourism licence number, © 2026, language switcher.

## Content model

Six post types (five public, one private), six taxonomies and one settings page carry all the content. They are registered in the `hola-core` plugin, so the content survives a theme change. Fields are Secure Custom Fields groups (the free, ACF-compatible plugin) saved as JSON in the plugin (version-controlled).

**Post types**

| Key | Admin label (ES / EN) | Supports | Taxonomies | Relations |
| --- | --- | --- | --- | --- |
| `tour` | Viajes / Egypt Tours | title, editor (overview), excerpt, featured image, revisions | `duration` (auto), `trip_style` | destinations visited (ordered), related trips, guides |
| `cruise` | Cruceros / Nile Cruises | same as tour | `cruise_type`, `trip_style` | route destinations (ordered), related trips |
| `excursion` | Excursiones / Excursions | same as tour | `departure` | destinations visited, related trips |
| `destination` | Destinos / Destinations | title, editor, excerpt, featured image | `region` | nearby destinations; trips and guides are pulled in by reverse lookup |
| `guide` | Guía / Travel Guide | title, editor, excerpt, featured image, author, revisions | `guide_topic` | destinations, trips mentioned |
| `inquiry` (private) | Solicitudes / Inquiries | title only, admin-only | none | trip the inquiry came from |

**Taxonomies**

| Key | On | Launch terms (ES) | Assigned |
| --- | --- | --- | --- |
| `duration` | tour | Hasta 6 días, 7–9 días, 10–12 días, 13 días o más | Automatically from `duration_days` on save; editors can't set it |
| `trip_style` | tour, cruise | Clásico, Egipto y Mar Rojo, Privado, En familia, Luna de miel, Desierto y aventura | Manually, several per trip |
| `cruise_type` | cruise | Crucero Luxor–Asuán, Dahabiya, Lago Nasser | Manually, one |
| `departure` | excursion | Hurghada, El Gouna, Marsa Alam, Sharm el Sheikh, El Cairo, Luxor, Asuán | Manually, one or more |
| `region` | destination | El Cairo y el Norte, Alto Egipto, Mar Rojo, Sinaí, Desierto Occidental | Manually, one |
| `guide_topic` | guide | Planificar el viaje, Qué ver, Cultura y gastronomía, Mar Rojo y buceo, Itinerarios | Manually, one or two |

Every taxonomy term gets the same landing-page fields: hero image, H1 override, intro, bottom SEO text and an FAQ repeater. A `departure` term also links to its destination.

**Trip fields: shared by tour, cruise and excursion**

| Field | Type | Rule |
| --- | --- | --- |
| `subtitle` | text | ≤ 90 characters |
| `gallery` | gallery | 5–15 images, ≥ 1600 px wide, alt text required |
| `price_from_eur`, `price_from_usd` | number | Both required while the trip is published (synced across languages) |
| `price_basis` | select | per person in a double room / per person / per group |
| `price_note` | text | e.g. "Flights not included" |
| `duration_days` (tour), `nights` (cruise), `duration_hours` (excursion) | number | Drives the duration chip and the `duration` term |
| `group_type` | select | private / small group / shared |
| `group_min`, `group_max` | number |  |
| `guide_languages` | checkbox | Spanish, English |
| `highlights` | repeater (text) | 3–8 items |
| `itinerary` | repeater | label ("Día 1" or "08:00"), title, description, places (destinations), meals (B/L/D), overnight |
| `includes`, `excludes` | repeater (text) |  |
| `what_to_bring` | repeater (text) | optional |
| `availability_days` | checkbox | Mon–Sun |
| `season_note` | text | optional |
| `cancellation_policy` | select | from the policies on the settings page, plus an optional override |
| `faq` | repeater (question, answer) |  |
| `related_trips` | relationship | max 3; falls back to same-destination trips |
| `booking_mode` | select | inquiry (launch) / external link / bookable (Phase 2) |
| `booking_url` | url | only for external link mode |
| `last_reviewed` | date | Shown as "Actualizado oct 2026"; backs the "fresh guides" claim |
| `featured` | true/false | Puts the trip on Home and in its menu panel |

**Type-specific fields**

| Type | Extra fields |
| --- | --- |
| Cruise | `ship_name`, `ship_category` (4★ / 5★ / deluxe / dahabiya), `embark` and `disembark` (destinations), `start_dates` (repeater: date + note), `cabins` (repeater: type, m², beds, price from EUR/USD), `ship_facilities` (checkbox), `deck_plan` (image) |
| Excursion | `start_times` (repeater), `pickup_areas` (repeater), `child_price_eur` / `child_price_usd`, `min_age`, `activity_level` (easy / moderate / demanding) |
| Destination | `tagline`, `best_months` (checkbox Jan–Dec), `days_recommended`, `how_to_get_there`, `nearest_airport`, `top_sights` (repeater: name, image, text, map link), `lat` / `lng`, `nearby` (relationship) |
| Guide | `last_updated` (date), `toc` (true/false), `related_destinations`, `related_trips`; reading time is computed |
| Inquiry | trip, dates or month, adults, children, budget band, interests, name, email, WhatsApp, message, language, page URL, UTM / `gclid` / `fbclid`, status (new / replied / won / lost) |

**Settings page: "Hola Egipto" (text fields per language)**

- **Contact:** WhatsApp number (E.164), default WhatsApp message ES/EN, email, phone, address, reply hours (Cairo time), social links.
- **Company:** legal name, tourism licence number or partner agency.
- **Home blocks:** booking band (on/off, badge, title, text, buttons), stats strip (repeater), trust bar (repeater with an on/off per item, so only true claims are shown).
- **Archive intros:** per post type, an H1, intro, hero image, bottom SEO text and FAQ for each archive page.
- **Cancellation policies:** repeater (name, text) that trips pick from.
- **Defaults:** OG image ES/EN, GTM container ID.

## Templates and page sections

The templates are PHP files driven by ACF fields; Home and About are built from ACF blocks so the owner can reorder sections. Sections are listed top to bottom; header, breadcrumbs and footer are on every template and left out below.

**Home (from the mockup)**

1. **Hero:** full-bleed photo, H1, lead, "Planifica tu viaje" + WhatsApp buttons. A stats strip sits on the photo's lower edge (2026 · 100% ES & EN · based on the Red Sea).
2. **Booking band:** "Próximamente" badge, "Online booking is on its way", two CTAs. Toggled from settings.
3. **Trust bar** (`deep-oasis`): items from settings; only true claims are switched on.
4. **Destinations:** eyebrow, "The corners of Egypt worth building your trip around", intro, 6 tiles (3:4), link to all.
5. **Featured tours:** 3–6 trip cards and a link to the archive.
6. **Nile cruises:** split image plus 2 cruise cards.
7. **Excursions by departure city:** city tabs (Hurghada first), 4 cards each.
8. **Why Hola Egipto:** 3 columns, with copy supplied by the owner.
9. **Travel guide:** the latest 3 articles.
10. **CTA band:** `deep-oasis` + pattern, "Tell us what you're planning", plus the two CTAs.

**All other templates**

| Template | Sections, top to bottom |
| --- | --- |
| Tour (`single-tour.php`) | Title block (H1, subtitle, chips: duration, style, group, languages, "Actualizado") · gallery mosaic 1 + 4 with lightbox · two columns: main = overview + highlights → day-by-day itinerary accordion → includes / excludes → prices and notes → practical info → cancellation → FAQ; sticky sidebar = price from (EUR on ES, USD on EN), basis, duration, "Planifica este viaje" (pre-fills the form), WhatsApp with "Hola, me interesa {trip}" · route list with a static map · related trips · guides for its destinations · mobile sticky price bar |
| Cruise (`single-cruise.php`) | As Tour, plus: ship section (category, facilities, deck plan), cabins table, departure dates, route direction note |
| Excursion (`single-excursion.php`) | As Tour, with a timeline of start times instead of days, pickup areas, adult and child price, minimum age, activity level, and "More excursions from {city}" |
| Trip archives (`archive-tour/cruise/excursion.php`) | Hero (H1 + intro from settings) · filter bar: duration, style, destination, price range, group type (city chips on excursions) · result count + sort (featured, price, duration) · 3-column card grid, 12 per page · bottom SEO text · FAQ · CTA band |
| Trip taxonomy landings (`duration`, `trip_style`, `cruise_type`, `departure`) | Same as the archive, pre-filtered; H1, intro, hero and FAQ come from the term's fields |
| Destination (`single-destination.php`) | Hero (image, H1, tagline) · quick facts (region, best months as a 12-month strip, days recommended, getting there) · intro · top sights grid · static map · "Trips that visit {destination}" with tours / cruises / excursions tabs (reverse lookup) · nearby destinations · guides · CTA |
| Destinations archive and Region | H1 + intro · region tabs · 3:4 tile grid · an SVG map of Egypt with region links |
| Guide article (`single-guide.php`) | Header (topic, H1, reading time, updated date, author) · table of contents from H2s · article body (allowed blocks: paragraph, heading, list, image, gallery, quote, table, YouTube, and two custom blocks, Trip card and Tip box) · author box · related destinations, trips, guides · CTA |
| Guide archive and topic | Featured article · topic chips · card grid · pagination |
| Plan my trip | H1 + one-line intro · 4-step form (section 10) · side panel: what happens next (3 steps), reply hours, WhatsApp alternative |
| Thank you | Confirmation with the next step · WhatsApp button · 3 guides to read while waiting; fires the lead conversion |
| Contact | Contact methods (WhatsApp, email, phone, hours) · short form (name, email, message) · company and licence details |
| FAQ | Grouped accordions (before booking, payments, during the trip, cancellations) from a page repeater; FAQ schema |
| About | Blocks: story, team grid (photo, name, role, languages), how we work, licence |
| Legal pages | Plain `page.php`, narrow column, last-updated date |
| 404 | Short message · search · 4 featured trips · links to the archives |
| Search | Results grouped by type (trips, destinations, guides) |

**Shared components** (`template-parts/` + matching CSS)

- **Cards:** trip card, destination tile, guide card. The trip card is a 4:3 image, duration chip, 2-line title, destinations line, price from + basis, and the whole card is clickable.
- **Page sections:** stats strip, booking band, trust bar, CTA band, filter bar, breadcrumbs.
- **Trip page parts:** price box, itinerary accordion, includes/excludes lists, gallery + lightbox.
- **Small elements:** chips, badge, WhatsApp button, language switcher, accordion (FAQ), Tip box, Trip card block.

## Tech stack and plugins

The stack is WordPress with a custom theme, one custom plugin and eight third-party plugins; only Polylang Pro needs a paid licence, for translated URL slugs.

**Core**

| Layer | Choice |
| --- | --- |
| CMS | WordPress, latest stable at build time, auto-updates for minor releases |
| PHP | 8.3 (8.2 minimum) with OPcache |
| Database | MySQL 8 or MariaDB 10.11 |
| Theme | `hola-egipto` (custom): PHP templates + `theme.json` from the brand kit, vanilla JS modules, CSS on the brand tokens, no jQuery on the front end |
| Plugin | `hola-core` (custom): post types, taxonomies, ACF JSON, schema, inquiry form, WhatsApp helper, auto duration terms, admin columns |
| Fonts | Fraunces + Plus Jakarta Sans, self-hosted woff2 (2 preloaded) |
| Build | None: plain CSS and JS files, minified by the cache plugin; WP-CLI and PHP lint for checks |
| Local dev | None: built in place on the dev server; a local git repo in wp-content tracks every change |

**Plugins**

| Plugin | Job | Licence |
| --- | --- | --- |
| Secure Custom Fields | Field groups, settings page, ACF blocks | Free (includes repeater, options pages, blocks) |
| Polylang Pro | ES/EN, translated post type and taxonomy slugs, ACF field translation and sync | Paid, yearly |
| Yoast SEO | Titles and meta, XML sitemaps, base schema graph that `hola-core` extends | Free |
| LiteSpeed Cache | Page cache, CSS/JS minify, WebP/AVIF images | Free (needs LiteSpeed hosting) |
| Complianz | Cookie banner, Google Consent Mode v2, cookie policy | Free |
| WP Mail SMTP | Sends form and admin email through the domain mailbox | Free |
| Redirection | 301s and a 404 log | Free |
| Two Factor (WordPress.org) | 2FA for every admin and editor | Free |
| UpdraftPlus | Off-site backups to Google Drive, on top of the host's backups | Free |

**Services**

- **Cloudflare:** DNS, CDN, WAF, and Turnstile anti-spam on forms.
- **Google:** Tag Manager, GA4, Ads, Search Console, Business Profile.
- **Meta:** Pixel via GTM.
- **Bing Webmaster Tools.**
- **Domain mailbox** (Zoho Mail or Google Workspace).
- **n8n webhook** for inquiries.
- **Git** for the code, as a local repository in wp-content.

**Deliberately not used:**

- page builders
- slider/carousel plugins
- Google Fonts CDN
- Contact Form 7 and other form plugins
- all-in-one security suites (Cloudflare covers the WAF)
- Google Maps JavaScript API (static maps avoid API cost and cookie consent)

## Theme and plugin architecture

The theme only presents content and the plugin owns all data and logic, so swapping the theme later loses no content, fields or URLs. Both are tracked in a local git repository in `wp-content` on the dev server (no WordPress core, no uploads), so every change can be reviewed and rolled back. There is no build step: CSS and JS ship as plain files.

```
wp-content/                     local git repo (no core, no uploads)
├─ mu-plugins/hola-coming-soon.php   branded 503 page for logged-out visitors
├─ themes/hola-egipto/
│  ├─ style.css                 theme header only
│  ├─ theme.json                palette, fonts, sizes from brand kit v1
│  ├─ functions.php             loads inc/*
│  ├─ inc/
│  │  ├─ setup.php              supports, menus, image sizes
│  │  ├─ assets.php             enqueue CSS/JS, preload fonts + hero
│  │  ├─ mega-menu.php          walker reading field values on menu items
│  │  ├─ template-tags.php      price, duration, chips, breadcrumbs helpers
│  │  └─ blocks.php             registers the field-group blocks in /blocks
│  ├─ front-page.php  page.php  index.php  search.php  404.php
│  ├─ single-tour.php  single-cruise.php  single-excursion.php
│  ├─ single-destination.php  single-guide.php
│  ├─ archive-tour.php  archive-cruise.php  archive-excursion.php
│  ├─ archive-destination.php  archive-guide.php
│  ├─ taxonomy-duration.php  taxonomy-trip_style.php  taxonomy-cruise_type.php
│  ├─ taxonomy-departure.php  taxonomy-region.php  taxonomy-guide_topic.php
│  ├─ page-templates/           plan-my-trip.php  thank-you.php  contact.php  faq.php
│  ├─ template-parts/
│  │  ├─ header/  footer/
│  │  ├─ cards/                 trip.php  destination.php  guide.php
│  │  ├─ sections/              hero  stats  booking-band  trust-bar  cta-band  faq  filters
│  │  └─ trip/                  title  gallery  price-box  itinerary  includes  route  related
│  ├─ blocks/                   hero  stats  booking-band  trust-bar  destinations-grid
│  │                             trips-grid  excursions-by-city  guides-grid  text-image
│  │                             cta-band  faq  team  trip-card  tip-box
│  ├─ assets/css/               tokens.css (brand kit), base, components, templates
│  ├─ assets/js/                menu, gallery, filters, sticky-bar, form steps (no jQuery)
│  ├─ assets/fonts/  assets/img/  (logo SVGs, pattern tiles, dividers)
│  └─ languages/                hola-egipto.pot, es_ES, en_US
└─ plugins/hola-core/
   ├─ hola-core.php
   ├─ src/
   │  ├─ PostTypes.php  Taxonomies.php  Fields.php (loads acf-json)
   │  ├─ DurationTerms.php        auto-assigns the duration term on save
   │  ├─ TranslationSync.php      copies the synced fields across translations
   │  ├─ Schema.php               adds TouristTrip / TouristDestination pieces to Yoast
   │  ├─ Inquiry/                 Form.php  Handler.php (REST)  Notifier.php (mail + webhook)
   │  ├─ WhatsApp.php             wa.me links with per-trip, per-language messages
   │  ├─ Polylang.php             string registration, slug handling
   │  ├─ Samples.php              WP-CLI: wp hola samples create | delete
   │  └─ Admin.php                list columns, required-field checks, settings page
   ├─ acf-json/                  every field group, version-controlled
   └─ languages/
```

**Image sizes** (registered in `setup.php`):

- `card` 640×480
- `tile` 600×800
- `hero` 1920×1080
- `hero-mobile` 900×1125
- `gallery` 1600 wide

The default WordPress intermediate sizes are switched off except `thumbnail` and `medium`.

## Multilingual setup

Every item exists twice, once per language, linked as translations in Polylang Pro. Facts are synced and words are translated, so a price changed in Spanish is the same in English automatically.

| Setting | Value |
| --- | --- |
| Languages | Spanish `es_ES` (default, no prefix), English `en_US` (`/en/`) |
| URL mode | Directory prefix; post type and taxonomy bases translated (see section 3) |
| hreflang | `es`, `en`, and `x-default` → Spanish, output by Polylang on every translated page |
| Browser-language redirect | Off. Visitors are not redirected; the switcher and hreflang do the job, and crawlers see both versions |
| Media | One media library; alt text and captions translated |
| Menus | One menu per language per location (primary, footer × 4) |
| Settings page | Text fields per language; numbers and IDs shared |
| Theme strings | `__()` in the theme and plugin, `.pot` files for both; Spanish and English `.po/.mo` shipped |
| Form | One form; labels, errors and emails follow the page language; the language is saved on the inquiry |

**ACF sync rules**

- **Synced** (same value in both languages): prices, durations, group sizes, dates, availability, gallery images, relationships, `featured`, `booking_mode`, coordinates.
- **Translated:** subtitle, highlights, itinerary text, includes/excludes, FAQ, notes, policy text, SEO fields.

**Editorial rules**

- Spanish is written first and English is a full translation, never a machine dump. The `last_reviewed` date is per language.
- An item is not published in one language until its translation is ready, so the switcher never shows a dead end.

## Forms, WhatsApp and lead flow

Every CTA ends in one of two places: the "Plan my trip" form or a WhatsApp chat with a pre-filled message. Both are tracked as leads, and the form keeps the ad source of each inquiry.

*(Diagram omitted in the kit: form → stored inquiry + team email + webhook → thank-you; WhatsApp → chat with the team.)*

The form path ends in a stored inquiry that the team and n8n both receive; the WhatsApp path hands the conversation straight to the team.

**"Plan my trip" form: 4 steps, one page, works without JavaScript as a single long form**

| Step | Fields |
| --- | --- |
| 1 · Trip | Trip of interest (pre-filled when coming from a trip page, or "Not sure yet"), interests (Cairo & pyramids, Nile cruise, Luxor & Aswan, Abu Simbel, Red Sea beach, diving/snorkelling, desert), trip length |
| 2 · When and who | Exact dates or a month + "flexible", adults, children + ages |
| 3 · Style | Budget per person (bands in EUR on ES, USD on EN), hotel level (3★ / 4★ / 5★ / mixed), private or group |
| 4 · Contact | Name, email, WhatsApp with country code, preferred channel (WhatsApp / email), message, privacy consent (required), marketing opt-in (unticked) |

Hidden fields: language, page URL, trip ID, `utm_*`, `gclid`, `fbclid`, first landing page. The ad parameters are kept in `sessionStorage` from the visitor's first page and sent only with the form.

**Processing** (`hola-core`, REST endpoint `POST /wp-json/hola/v1/inquiry`)

1. Check the nonce, Turnstile token and honeypot; rate-limit to 5 per IP per hour.
2. Validate fields and save a private `inquiry` post (status "new").
3. Email the team (reply-to = the traveller) and send the traveller an auto-reply in their language.
4. POST the inquiry as JSON to the n8n webhook (sheet / CRM / WhatsApp alert to the team).
5. Redirect to the Thank you page, which pushes `generate_lead` to the dataLayer with trip and language.

Inquiries are deleted automatically after 24 months unless marked "won" (GDPR data minimisation).

**WhatsApp**

- **Links:** `https://wa.me/{number}?text={message}`. The number comes from settings and must be a WhatsApp Business number.
- **Messages:**
  - Generic: "Hola, quiero planificar un viaje a Egipto" / "Hi, I'd like to plan a trip to Egypt".
  - Trip pages: "Hola, me interesa «{trip}» — {url}" / "Hi, I'm interested in “{trip}” — {url}".
- **Placement:** header, mobile sticky bar, trip sidebar, Contact, Thank you. No floating chat widget script.
- **Tracking:** every click pushes `whatsapp_click` with the location (header / sticky / sidebar / page) and the trip, if any.

## SEO and structured data

SEO comes from the structure itself: one indexable URL per trip, destination, guide and landing term, in both languages, cross-linked automatically. Yoast handles titles and sitemaps; `hola-core` adds travel schema to Yoast's graph.

**Schema by template**

| Template | Schema | Notes |
| --- | --- | --- |
| Site-wide | `TravelAgency` (Organization): name, logo, URL, social profiles, WhatsApp contact point, area served Egypt, languages es/en | Licence number as `identifier` once confirmed |
| Tour, cruise, excursion | `TouristTrip`: name, description, images, itinerary as an ordered `ItemList` of places, `offers` (price from + currency of the page language), `provider` | No Google rich result exists for this type; it feeds entity understanding and AI search |
| Destination | `TouristDestination` with `includesAttraction` (top sights) and `geo` |  |
| Guide | `Article` with author `Person` and `dateModified` |  |
| FAQ blocks | `FAQPage` | Google limits FAQ rich results, so kept for clarity only |
| Every page | `BreadcrumbList` |  |
| Reviews | none | `AggregateRating` only once real, verifiable reviews exist |

**Title and description templates** (editable per item)

| Type | Spanish | English |
| --- | --- | --- |
| Tour | `{trip} · {n} días por Egipto · Hola Egipto` | `{trip} · {n}-day Egypt tour · Hola Egipto` |
| Cruise | `{trip} · crucero por el Nilo · Hola Egipto` | `{trip} · Nile cruise · Hola Egipto` |
| Excursion | `{trip} desde {city} · Hola Egipto` | `{trip} from {city} · Hola Egipto` |
| Destination | `Qué ver en {destino}: guía y viajes · Hola Egipto` | `Things to do in {destination}: guide and trips · Hola Egipto` |
| Guide | `{title} · Guía de viaje Hola Egipto` | `{title} · Hola Egipto Travel Guide` |

Meta descriptions default to the excerpt (≤ 155 characters). OG images default to the featured image cropped to 1200×630, or the brand kit's default OG for the page's language.

**Technical rules**

- **Sitemaps and canonicals:** XML sitemaps per language. Every URL is self-canonical; paginated pages are self-canonical; filtered states are `noindex, follow`.
- **During development:** a coming-soon page for logged-out visitors plus `noindex`. Production `robots.txt` blocks only `/wp-admin/` (except `admin-ajax.php`) and internal search.
- **Automatic internal links:** trip → its destinations and guides, destination → trips and guides, guide → trips via the Trip card block.
- **Images:** alt text is required by `hola-core` validation, and file names are descriptive.
- **Search Console:** one domain property, submitted with both sitemaps. Google Business Profile only if there is a real office address.
- **Keyword map:** before content writing, each indexable URL gets one primary Spanish and one English keyword in the content sheet.

## Analytics and ad tracking

All tags run through one Google Tag Manager container. The theme only pushes clean dataLayer events, so ad platforms can be added or swapped in GTM without code changes. Nothing marketing-related fires before consent.

**dataLayer events**

| Event | Fires when | Parameters | Sent to |
| --- | --- | --- | --- |
| `generate_lead` | Thank you page loads after a valid submit | trip\_id, trip\_name, trip\_type, language, form | GA4 key event · Meta `Lead` · Google Ads conversion "Inquiry" (primary) |
| `whatsapp_click` | Any wa.me link is clicked | location, trip\_id, language | GA4 key event · Meta `Contact` · Google Ads conversion "WhatsApp" (secondary) |
| `view_item` | A trip page loads | trip\_id, trip\_name, trip\_type, price\_from, currency | GA4 · Meta `ViewContent` |
| `plan_trip_start` | First field of the form is touched | trip\_id, entry page | GA4 |
| `plan_trip_step` | A form step is completed | step (1–4) | GA4 (funnel report) |
| `filter_use` | Archive filters are applied | filter names and values | GA4 |
| `language_switch` | Switcher is used | from, to | GA4 |
| `search` | Internal search runs | search\_term | GA4 |

**Consent**

- Complianz sets Google Consent Mode v2 defaults to *denied* for `analytics_storage`, `ad_storage`, `ad_user_data` and `ad_personalization`.
- GA4 runs in cookieless mode until consent; Meta Pixel loads only after marketing consent.
- The banner is translated, and "Reject all" is as visible as "Accept all" (a Spanish AEPD requirement).

**Attribution loop**

- **Launch:** every inquiry stores `utm_*`, `gclid` and `fbclid`, so leads can be tied to campaigns from day one.
- **Phase 2:** Google Ads enhanced conversions for leads (hashed email), Meta Conversions API from the server, and an offline-conversion upload when an inquiry is marked "won". This lets bidding optimise for sold trips, not form fills.

**UTM convention**

- `utm_source`: google / meta / whatsapp / newsletter / partner name.
- `utm_medium`: cpc / paid\_social / organic\_social / email / referral.
- `utm_campaign`: `{lang}_{product}_{goal}_{yyyymm}`, e.g. `es_cruceros_leads_202611`.

## Performance, accessibility, security, email, legal

The site launches only when the targets below pass on Home, a tour, a trip archive and a guide, tested on mobile.

**Performance budget**

| Metric | Target |
| --- | --- |
| Largest Contentful Paint | ≤ 2.5 s (mobile, 4G) |
| Interaction to Next Paint | ≤ 200 ms |
| Cumulative Layout Shift | ≤ 0.1 |
| Lighthouse mobile performance | ≥ 90 |
| Server response, cached | ≤ 600 ms |
| Own JavaScript | ≤ 50 KB gzipped per page |
| Own CSS | ≤ 40 KB gzipped |
| Home first load | ≤ 1.2 MB |

How:

- The hero image is preloaded with `fetchpriority=high`; everything below the fold lazy-loads.
- WebP/AVIF images in responsive sizes, and 2 preloaded font files.
- No jQuery, no sliders; galleries use CSS scroll-snap.
- Static maps instead of the Maps JS API.

**Accessibility: WCAG 2.2 AA**

- Every text colour pair passes contrast (brand kit tokens).
- Visible focus rings, a skip link, keyboard-operable mega menus and accordions.
- Form labels, an error summary and `aria-live` step changes.
- Alt text required on images; tap targets ≥ 44 px; `prefers-reduced-motion` respected; `lang` set per language.
- Tested with axe, keyboard-only and VoiceOver.

**Security**

- Cloudflare WAF and bot protection; HTTPS with HSTS.
- `DISALLOW_FILE_EDIT`; XML-RPC off; user enumeration via REST blocked.
- 2FA for every account; no `admin` username; editors get the Editor role, not Administrator.
- Security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP in report-only first).
- Plugin updates run weekly, after a backup.

**Backups:** host daily (14 days kept), plus UpdraftPlus daily database and weekly full backups to Google Drive (8 weeks kept). Claude Code takes a full backup before its first change, and one restore is tested before launch.

**Email**

- **Mailboxes** on the domain: `info@` and `viajes@` (sales).
- **Site email:** sent as `noreply@` through WP Mail SMTP, with reply-to set to the traveller.
- **DNS records:** SPF, DKIM and DMARC (start at `p=none`, move to `quarantine` after 4 weeks of clean reports).

**Legal**

The site provides the pages; the owner and a lawyer supply and approve the text.

| Page | Must cover |
| --- | --- |
| Aviso legal / Legal notice | Operating company, address, registration, tourism licence, contact |
| Privacy policy | Controller, purposes (handling inquiries), legal basis, processors (host, email, Google, Meta, n8n), transfer of EU visitors' data to Egypt and the safeguard used, 24-month retention, rights. Egypt's Personal Data Protection Law 151/2020 applies alongside GDPR |
| Cookie policy | Generated and kept current by Complianz |
| Terms and cancellation | Booking and payment terms, cancellation tiers per policy, changes, force majeure, liability. Review whether EU package-travel rules apply to packages sold to EU travellers |

The form's consent checkbox links to the privacy policy. The footer shows the company name and the Ministry of Tourism licence number, or the licensed partner agency.

## Delivery: one Claude Code run on the dev server

The site is built in place on the existing dev server and domain. One Claude Code session, started next to the site with the build kit beside it, builds everything in this spec that does not need you, behind a coming-soon page. It ends with a report of what is done and what is waiting on you.

*(Diagram omitted in the kit.)*

| What | Where | Notes |
| --- | --- | --- |
| Build kit | `hola-egipto-build/`, one level above the web root | Brand assets, START-HERE brief, this spec, checklist, report template. Never inside the public folder |
| WordPress | The existing install on the dev domain | Treated as disposable; Claude Code backs it up first |
| Theme and plugin | `wp-content/themes/hola-egipto`, `wp-content/plugins/hola-core` | Tracked in a local git repo in `wp-content`, one commit per build step |
| Coming-soon page | `wp-content/mu-plugins/hola-coming-soon.php` | Logged-out visitors get a branded 503 page; logged-in you see the real site |
| Report | `hola-egipto-build/BUILD-REPORT.md` | Done / not done / needs you, URL checks, test results |

**How the run works**

1. You unzip the kit one level above the web root. If you have a Polylang Pro licence, put its zip in `hola-egipto-build/licensed-plugins/`.
2. You start Claude Code in the folder that holds both the site and the kit, and give it one instruction: read `hola-egipto-build/START-HERE.md` and complete the goal.
3. It inspects the server, takes a full backup, switches on the coming-soon page, then builds in the order of the build plan, committing after each step.
4. It checks every URL in section 3 in both languages, submits test inquiries, and validates the schema.
5. It writes `BUILD-REPORT.md` and stops. You review on the real domain while logged in.
6. Your comments go into a shorter follow-up run. Real content then replaces the samples, and launch removes the coming-soon page.

**Rules the run follows**

- **Scope:** works only inside this WordPress install. No DNS, hosting-panel or billing changes, and no other sites on the server.
- **No side effects:** email goes only to the admin address, nothing is purchased, and paid plugins come only from the provided zips.
- **Samples:** sample content is flagged, so `wp hola samples delete` removes all of it in one command.
- **Missing inputs:** a missing credential or decision gets the default from this spec and a line in the report; the run keeps going instead of stopping.

**Before you start Claude Code**

- WordPress is installed on the domain with an admin account.
- Claude Code runs on the server (or over SSH) with shell access to the site folder.
- PHP 8.2+ and outbound HTTPS to wordpress.org are available. WP-CLI helps; Claude Code downloads a local copy if it is missing.
- **Optional inputs:** Polylang Pro zip, WhatsApp Business number, contact email, GTM container ID. Anything missing becomes an empty setting listed in the report.

## Deliverables, phases and launch checklist

The project ships 12 deliverables over 6 phases. Each phase ends at a gate you approve before the next one starts.

*(Diagram omitted in the kit.)*

Phase 3 builds deliverables 4–8 in one run. Each review round is a shorter follow-up run fed by your comments. What needs you (real content, legal text, account IDs) is listed in the run's report.

| # | Deliverable | Format | Phase |
| --- | --- | --- | --- |
| 1 | Brand kit v1 (logos, favicons, pattern, social, tokens, fonts) | Zip + brand system page | 0 · done |
| 2 | This specification | This doc | 1 · done |
| 3 | Claude Code build kit: brand assets, START-HERE brief, this spec, build plan, acceptance checklist, report template | Zip | 2 · now |
| 4 | `hola-egipto` theme | `wp-content/themes`, local git | 3 · Claude Code run |
| 5 | `hola-core` plugin (post types, fields, schema, form, WhatsApp, translation sync, samples command) | `wp-content/plugins`, local git | 3 · Claude Code run |
| 6 | WordPress configured: plugins, languages, menus, settings, coming-soon page | Dev server | 3 · Claude Code run |
| 7 | Every template filled with flagged sample content in ES and EN, with branded placeholder images | Dev server | 3 · Claude Code run |
| 8 | `BUILD-REPORT.md`: done, not done, needs you, URL checks, test results | File in the kit folder | 3 · Claude Code run |
| 9 | Review comments fixed | Follow-up Claude Code runs | 4 · review |
| 10 | Real content, photos and legal text replace the samples | Dev server | 5 · content |
| 11 | Tracking IDs, SMTP, Cloudflare, Search Console connected | Configured | 5 · launch |
| 12 | Go-live: coming-soon removed, indexing allowed, launch checklist complete | Live site | 5 · launch |

**Launch checklist**

- [x] All decisions in section 2 marked Agreed
- [ ] Domain, Cloudflare and SSL live; `www` → apex redirect
- [ ] SPF, DKIM, DMARC published; form email lands in inbox (not spam) on Gmail and Outlook
- [ ] Every launch item published in Spanish and English, translations linked
- [ ] Legal pages approved; licence number in the footer
- [ ] Trust bar shows only true claims; no rating shown
- [ ] Form: 3 test submissions per language reach email, the inquiries list and the n8n webhook
- [ ] WhatsApp links open the right number with the right message on iOS, Android and desktop
- [ ] GTM preview: `generate_lead` and `whatsapp_click` fire once, only after consent for ads
- [ ] Lighthouse mobile ≥ 90 and Core Web Vitals targets met on the 4 test pages
- [ ] axe shows 0 serious issues; keyboard-only run through header, form and gallery
- [ ] Sitemaps submitted; coming-soon page removed, search engines allowed, no leftover `noindex`
- [ ] Full backup taken and a restore tested
- [ ] Favicons, OG images and the web manifest checked on a shared link in WhatsApp
