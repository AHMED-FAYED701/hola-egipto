# BUILD-LOG — Hola Egipto (Next.js + Payload)

## 2026-10-18 — S0 · Preflight
- Layout: repository root `~/hola-egipto`, `kit/START-HERE.md` present, `.env.local` present with `DATABASE_URI` (checked with grep -c, not printed). `.env.local` only holds `DATABASE_URI`; the other keys are appended in S1.
- Versions: node v24.22.0, pnpm 12.14.0, psql (PostgreSQL) 18.6, git 2.53.0, Python 3.14.4.
- Database: `select 1` → `1` (PostgreSQL 18.6 server); public schema empty (0 tables).
- Not a git repo yet: fresh run (no resume).
- `bash kit/bin/acceptance.sh --preflight` ran to the end: `ACCEPTANCE SUMMARY: pass=6 fail=32 warn=3 blocked=4` (failures expected before any app code).
- Port 3000 free. Playwright Chromium is available in the user cache (used later for visual/axe checks if possible).
- DONE

## 2026-10-18 — S1 · Foundation
- Scaffolded with `create-payload-app@3 --template blank --db postgres` (dummy URI) in `.scaffold/`, moved to the root, `.scaffold/` removed. Deleted the scaffold's `.env`, `Dockerfile`, `docker-compose.yml`, test setup (vitest/playwright), `my-route`, and the `(frontend)` page/layout.
- Versions: next 16.4.2, payload 3.91.0, @payloadcms/{db-postgres,next,richtext-lexical,ui,translations} 3.91.0, react/react-dom 19.2.6, next-intl 4.14.9, jose 6.2.12, sharp 0.35.4, lucide-react 1.59.0, typescript 5.7.3, eslint 9.39.5 + eslint-config-next 16.4.2.
- Defaulted: create-payload-app installed Next 16.3.3; upgraded to Next 16.4.2 (latest 16.x, within Payload's `>=16.3.3 <17`).
- `custom.scss` → `custom.css`. `pnpm.onlyBuiltDependencies` kept (sharp, esbuild, unrs-resolver); pnpm 12 also needs `allowBuilds` in `pnpm-workspace.yaml` (non-interactive; @parcel/watcher, @swc/core, workerd denied).
- ESLint: the scaffold's FlatCompat config needed `@eslint/eslintrc`; replaced with eslint-config-next 16's native flat configs.
- `.env.local`: appended PAYLOAD_SECRET (48 hex) and HOLA_PREVIEW_KEY (32 hex) generated with openssl without printing, NEXT_PUBLIC_SITE_URL, HOLA_COMING_SOON=1, HOLA_DEV_MODE=1, HOLA_MAIL_LOG, and empty owner keys. `.env.example` lists every key empty. `.gitignore` per contracts §14.
- Payload: postgres adapter on DATABASE_URI with `push: false`, `disableCreateDatabase: true`; localization es (default) + en, `fallback: false`; admin i18n es/en; `users` with `role` (admin | editor; first user forced to admin). Migration `initial` created and applied (`migrate:status` → Ran: Yes).
- next.config: `poweredByHeader: false`, `trailingSlash: true`, `skipTrailingSlashRedirect: true`, `htmlLimitedBots: /.*/`, `images.localPatterns` (/api/media/file/**, /brand/**), next-intl plugin.
- `scripts/serve.sh start|stop|restart` runs `pnpm start` in the background with output appended to `kit/logs/server.log`.
- Verified: lint, typecheck, build pass; `pnpm start` → `/admin` 200, `/api/users` 403 without redirect.
- DONE

## 2026-10-18 — S2 · Coming-soon page, preview bypass, headers
- `src/proxy.ts` (Node runtime): passes `/admin…`, `/api/…`, `/_next/…`, metadata files and any path whose last segment has a dot; `?hola_preview=<key>` → 307 without the parameter + `hola_preview` HMAC cookie (HttpOnly, Lax, 30 days, Secure only on HTTPS); wrong key → coming-soon; `payload-token` verified with jose against SHA-256(PAYLOAD_SECRET)[0:32]; front-end no-slash URLs → 308 to the slashed URL (query kept).
- Coming-soon page: `GET /api/hola/coming-soon` route (proxy rewrites visitors to it) → 503 with `Retry-After: 86400`, `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`; self-contained HTML, lang es, inline stacked colour logo, both languages, papyrus + pattern, brand fonts; WhatsApp button only when `whatsapp_number` is set.
- Security headers (contracts §11) via `next.config` `headers()`, CSP in report-only.
- Brand files copied per kit/brand/README.md: header/footer logos, stacked logo, simple mark, pattern tiles + dividers → `public/brand/`, OG PNGs → `public/brand/og/`, woff2 + OFL → `public/fonts/`, favicon.ico/icon.svg/apple-icon.png → `src/app/`, Android/maskable PNGs → `public/`; `manifest.ts`, `robots.ts`.
- Helpers: `src/lib/secrets.ts` (preview HMAC, JWT key, inquiry token, ref, ip hash), `src/lib/whatsapp.ts`.
- Fixed during the step: NextURL drops the trailing slash on stringify, so the 308 target is built with `new URL()`; the SVG's own `<title>` is stripped so the page has one title.
- Verified on the production build: visitor `/` → 503 + 3 headers; `payload-token=garbage` → 503; wrong preview key → 503, no cookie; preview link → 307 + cookie, cookie passes the gate; `/admin` 200, `/api/users` 403, robots/favicon/icon/apple-icon/manifest/brand/fonts 200; `/en?x=1` → 308 `/en/?x=1`.
- DONE

## 2026-10-18 — S3 · Content model
- Collections: `tours`, `cruises`, `excursions` (shared trip fields in `src/fields/trip.ts`), `destinations`, `guides`, `pages`, `media`, taxonomies `durations`, `trip-styles`, `cruise-types`, `departures` (+ `destination`), `regions`, `guide-topics`, `inquiries`, `users`. Globals `site-settings`, `navigation`. Field names verbatim from spec §5 / contracts §4; facts shared, words localized.
- Admin labels ES/EN; admin groups Viajes, Contenido, Taxonomías, Solicitudes, Ajustes.
- `tours.beforeChange` sets `duration` from `duration_days` via the fixed ES slugs (≤6 / 7–9 / 10–12 / ≥13); `duration` is read-only in admin.
- Validation: `subtitle` ≤ 90, `highlights` 3–8 (when available), `related_trips` max 3, `guide_topic` max 2, `gallery` max 15, `alt` required (localized), prices required when the trip is available in the locale being saved, slug format + unique per locale, `excerpt` ≤ 155.
- Access: public read on content, taxonomies, media, globals; create/update/delete logged-in; `inquiries` admin-only; `users` read logged-in, create/delete admin.
- Guides use Lexical with `trip-card` and `tip-box` blocks. Pages: `template` select, localized `layout` blocks (home/about sections), `faq_groups`, `last_updated`.
- Media: `staticDir` = `media/` (gitignored); sizes card 640×480, tile 600×800, hero 1920×1080, hero-mobile 900×1125, gallery 1600w, all WebP.
- Revalidation hooks on every content collection + globals revalidate the whole front-end layout and never throw outside Next. Defaulted: "affected paths" simplified to the whole site (small site, heavy cross-linking).
- Migration `content_model` created (drizzle's interactive create/rename prompts answered "create" through a pty; no renames) and applied.
- `pnpm hola:schema` written (§9): every collection, global and field A3 expects is listed; locales ["es","en"], default "es". Payload logger now writes to stderr so scripts print only JSON on stdout.
- Lint, typecheck, build pass.
- DONE

## 2026-10-18 — S4 · Internationalised routing
- next-intl 4.14.9: `localePrefix: 'as-needed'`, `localeDetection: false`, `localeCookie: false`, `alternateLinks: false`, `pathnames` exactly per contracts §5 (`src/i18n/routing.ts`, `request.ts`, `navigation.ts`). Integrated in `src/proxy.ts` after the coming-soon gate and the trailing-slash 308.
- Routes under `src/app/(frontend)/[locale]/`: home, 5 archives, 5 singles, 6 term landings, `search`, `[page]` (fixed pages), `[...rest]` catch-all (`notFound()`), `not-found.tsx`. All content routes are ISR (`generateStaticParams` → [] + on-demand rendering). No `loading.tsx`.
- `src/lib/urls.ts` builds every localized URL (archives, docs, terms, fixed pages, search); `src/lib/data.ts` is the Local API data layer; `src/messages/es.json` / `en.json` hold the UI strings (key parity checked).
- **Deviation (Next.js 16.4.2 behaviour):** a page-level `notFound()` renders Next's empty error shell (`<html id="__next_error__">`, no lang/h1) — reproduced in a minimal Next 16.4.2 app in the scratchpad (static, dynamic, ISR and generateMetadata variants), while a proxy `NextResponse.rewrite(url, { status: 404 })` serves full HTML. So the proxy answers unknown front-end URLs itself: `src/lib/route-match.ts` matches the path structurally and checks slugs against `/api/hola/routes` (index of existing slugs, cached 5 s in the proxy), then rewrites to the localized `/[locale]/hola-404/` page with status 404 (full layout, right `lang`, `noindex`). Pages still call `notFound()` as a backstop; junk paths with a dot never reach the database (`resolveLocale()` guards every page).
- `agentRules: false` in next.config (Next 16 dev writes AGENTS.md otherwise).
- Verified on the production build with the preview cookie: `/` lang es, `/en/` lang en, every archive and search 200 in both languages, unknown paths 404 with the localized page, `/viajes-a-egipto` → 308, `/es/…` → 307 to the unprefixed URL. Single/term/fixed-page routes answer 404 until content exists; they are verified with data in S6/S8.
- DONE

## 2026-10-18 — S5 · CLI scripts
- `scripts/hola/*.ts`, wired as `payload run scripts/hola/<name>.ts --`: `health`, `schema`, `seed`, `placeholders [--force]`, `samples create|delete [--dry-run]|count`, `urls`, `token`, `preview-url`, `test-session create|delete`, `settings get|set`, `inquiries count|last`, `retention [--dry-run]`. JSON/TSV on stdout only (Payload logger → stderr), exit 0, no prompts, no secrets (only `preview-url` prints the key, by contract).
- `payload run` strips the script path from argv, so engines live in `_samples.ts` / `_placeholders.ts` and the CLI files are thin wrappers; `args()` treats every argument as a string.
- `POST /api/hola/revalidate` (header `x-hola-revalidate`, body `{"all":true}`) → 200 `{"ok":true}`, wrong/missing key → 401; it also signals the proxy to refresh its slug index. Content-changing scripts call it at the end when the server answers.
- Seed engine + launch data written now (terms with draft landing copy, settings defaults, navigation, fixed pages); sample content data files (`scripts/hola/data/{tours,cruises,excursions,destinations}.ts`, `data/guides/*.ts`) were drafted in parallel by writing subagents against `data/types.ts` and a shared brief (content rules §1–§3), then checked (types, lengths, forbidden phrases).
- Defaulted: `retention --dry-run` prints `{"deleted":0,"would_delete":n,"dry_run":true}`.
- Verified on the empty database: health `{"db":true,"payload":true,"collections":15}`; samples count/dry-run, urls, inquiries, settings get, token, retention, test-session create (JWT) + delete (`{"deleted":1}`) all exit 0; revalidate 200 / 401.
- DONE

## 2026-10-18 — S6 · Launch data and sample content
- `pnpm hola:seed` (idempotent): launch terms (contracts §4, slugs = ascii-lowercased names, fixed duration slugs) with draft landing copy (h1, intro, SEO text, FAQ) for every term that has items; 55 branded placeholder JPEGs (sharp, q82, deep/teal tile at 2×, papyrus label, localized alt) in `media` with `holaSample`; `site-settings` defaults (booking band on, stats strip, 3 true trust items, archive intros for all 5 collections ES/EN, 2 sample cancellation policies, default WhatsApp messages, `reply_hours` `[pendiente]`/`[pending]`); `hola:samples create`; the 10 fixed pages with templates and copy (home/about blocks, contact, FAQ 4×3, plan, thank-you, 4 legal pages with spec headings + `[Texto legal pendiente…]`, cookie list); `navigation` (5 mega items, 3 footer columns, legal links per language).
- Sample set: tours 3/3, cruises 2/2, excursions 4/4, destinations 6/6, guides 3/3 (es/en), media 55 — `pnpm -s hola:samples count` matches content rules §2. Running `hola:seed` twice creates no duplicates (same ids/counts).
- Bugs fixed: (1) the tours `beforeChange` hook passed `locale: 'es'` together with the shared `req`, which switched `req.locale` and wrote English saves into Spanish — the hook now restores `req.locale`; (2) a localized `required` field inside a shared array (`cabins.type`) blocked the English pass — made optional (migration `cabin_type_optional`). Partial sample data from the failed runs was removed with `hola:samples delete` before the final seed.
- `hola:urls`: 104 rows (home 2, archive 10, single 36, term 34, page 18, search 2, 404 2); every row answers its expected status with the preview cookie.
- DONE

## 2026-10-18 — S7 · Design system, layout and components
- Brand: `kit/brand/05-tokens/brand-tokens.css` → `src/styles/tokens.css` (only source of design values), `fonts.css` → `src/styles/fonts.css` with `/fonts/…` paths, `global.css` (base, container/section, buttons, chips, `[pendiente]` dashed marker, prose, native accordions, form fields, breadcrumbs). Plain CSS + CSS Modules only.
- Root layout (`[locale]/layout.tsx`): `<html lang>`, raw inline dataLayer + Consent Mode v2 default script in `<head>`, GTM only when `gtm_id` is set, exactly two font preloads, skip link first, consent banner + tracking client after the page. Favicons/manifest via Next metadata files.
- `PageShell`: header, `<main id="main">`, footer, mobile sticky bar, drawer (after `<main>`), site-wide `TravelAgency` JSON-LD (contactPoint/identifier only when set).
- Header: logo, mega panels from `navigation` (link + toggle per item; click/Enter, Esc returns focus, ←/→ between items, ↓ into the panel, outside click closes), featured trip / SVG region map / latest guides in the third column, ES|EN switcher, WhatsApp (only with a number), terracotta CTA; ≥1280 full (compacted spacing below 1440), 1024–1279 WhatsApp icon-only and only the other language code, <1024 hamburger drawer with accordions (focus trap, Esc). Sticky, 88 → 64 px after 120 px.
- Footer on deep-oasis + pattern: reverse logo, description, WhatsApp/email/social, 3 link columns, legal links + cookie settings, legal name + licence (`[pendiente]` only for logged-in admins via `/api/users/me`), © 2026, switcher.
- Components: trip card (whole card clickable), destination tile, guide card, mini card, stats strip, booking band, trust bar, CTA band, breadcrumbs + BreadcrumbList, Egypt SVG map, WhatsApp link (`data-he-*`), language switcher, consent banner ("Reject all" styled identically to "Accept all"), tracking client (whatsapp_click / language_switch delegation, first-touch UTM in sessionStorage), `Pending`/`AdminPending`.
- Defaulted: lucide-react 1.x has no brand icons, so WhatsApp uses an inline drawn bubble+handset glyph on the WhatsApp-green button and social links use a generic globe icon + network name.
- Fixed: Payload media URLs are absolute (serverURL) with a trailing slash; `localUrl()` turns them into local paths for next/image.
- Visual check: a review instance on :3002 with `HOLA_COMING_SOON=0` in the process env only (`scripts/serve.sh visual`), screenshots via Playwright (`.playwright-mcp/`, gitignored): 1280 px header with mega panel + map, 375 px drawer; no console errors after the image fix.
- DONE

## 2026-10-18 — S8 · Templates
- Home from `pages` home blocks: hero (next/image `fetchPriority="high"`, eager) + overlapping stats strip, booking band, trust bar, 6 destination tiles, featured tours, Nile cruises split, excursions by departure city (accessible tabs, Hurghada first), Why Hola Egipto (marked draft), latest 3 guides, CTA band.
- Trip pages (tour/cruise/excursion share `TripPage`): title block (H1 = title, subtitle, chips incl. "Actualizado"), 1+4 gallery mosaic with `<dialog>` lightbox (scroll-snap, keyboard), overview + highlights, itinerary accordion (`<details>`, timeline for excursions), includes/excludes, cruise ship section (category, facilities, cabins table, departure dates, route direction, deck plan), prices and notes, practical info, cancellation (policy from settings or override), FAQ + FAQPage, sticky sidebar price box ("Planifica este viaje" → `?trip=<type>-<id>`, WhatsApp sidebar), route list + SVG route map, related trips (fallback: same destinations), guides, "More excursions from {city}", mobile sticky price bar, server-rendered `view_item`, TouristTrip JSON-LD.
- Archives + term landings (`TripArchive`): hero from settings/term, city chips (excursions), GET filter form (duration, style, destination, max price, group, sort; works without JS; `filter_use` on submit), result count, 12 per page with pagination, SEO text, FAQ, CTA. Filtering runs on the server (`src/lib/archive.ts`).
- Destination: hero, quick facts (region, 12-month strip, days, airport), content, getting there, top sights, SVG map, trips tabs (reverse lookup), nearby, guides, TouristDestination JSON-LD. Destinations archive + region: region chips, 3:4 tiles, SVG Egypt map with region links.
- Guide: topic chips, H1, reading time, updated date, author (`[pendiente]`), TOC from H2s, Lexical body with `trip-card` and `tip-box` blocks, author box, related destinations/trips/guides, Article JSON-LD. Guides archive + topic: featured article, topic chips, grid, pagination.
- Fixed pages by template: about (blocks: story `[pendiente]`, 3 placeholder team members, 3 steps, licence), contact (methods from settings; empty fields `[pendiente]` for admins only), FAQ (4 groups, FAQPage), legal/default (narrow column, last updated, dashed placeholders), plan-my-trip and thank-you (forms in S9). Search with grouped results (`search` event), localized 404 view (search, 4 featured trips, archive links).
- Metadata per contracts §10 (title templates, canonical, hreflang, robots, OG fallbacks). Defaulted: excursion titles already name the city, so the template drops the repeated "desde {city}".
- Fixed: routes that read `searchParams` inherited static params from the layout and failed with DYNAMIC_SERVER_USAGE → `dynamic = 'force-dynamic'` there; font preloads were emitted twice → `ReactDOM.preload()`.
- Verified: every one of the 104 `hola:urls` rows answers its expected status with the preview cookie; filtered archive 200; screenshots of home and a tour at 1280 px look right.
- DONE

## 2026-10-18 — S9 · Forms, inquiry API, WhatsApp
- `GET /api/hola/token` → `{"token":"<ts>.<hmac>"}`, `Cache-Control: no-store`.
- `POST /api/hola/inquiry` (JSON and form-encoded): honeypot `website` and bad/expired token → 400; Turnstile verified server-side when both keys are set, accepted without keys only while `HOLA_DEV_MODE=1`; rate limit 5 per `ip_hash`/hour (skipped with `X-Hola-Test: 1` in dev mode, which also flags the inquiry `holaSample`); validation per contracts §7 with messages in the inquiry language (422); trip must be an available tour/cruise/excursion (`trip_id`+`trip_type`, or `trip=<type>-<id>` from the no-JS form); stored via the Local API with the contract title, `consent_at`, UTM group, `ip_hash`; JSON 201 `{ok,id,redirect}`; form-encoded 303 to the thank-you URL, or 303 back to `page_url` with `?errors=<fields>#form` (same-origin only). Webhook (n8n) after the response via `after()`, 5 s timeout, `X-Hola-Signature`.
- `sendMail()` in `src/lib/mail.ts`: dev redirect to `ADMIN_EMAIL` with `[DEV → …]` subject and no Cc/Bcc, nothing sent when `ADMIN_EMAIL`/`SMTP_HOST` are empty, one mail-log line per call. Team notification + traveller auto-reply per inquiry. Payload's own emails use the same function (custom email adapter; nodemailer only when SMTP is configured).
- Plan my trip: 4 steps on one page; without JS one long form (server-rendered token, posts form-encoded); with JS step navigation, progress bar, `aria-live` step announcements, error summary, fresh token on first focus, `plan_trip_start` / `plan_trip_step`, first-touch UTM/gclid/fbclid/landing from sessionStorage; pre-fills `?trip=<type>-<id>`; side panel (next steps, reply hours, WhatsApp alternative). Contact page short form (`form=contact`).
- Thank-you: renders the `generate_lead` push only for a valid ref whose inquiry is not yet `tracked`, then sets `tracked`; page is dynamic and `noindex`; WhatsApp button and 3 guides.
- WhatsApp: `whatsappUrl()` everywhere (header, drawer, sticky, sidebar, page bands, contact, thank-you, footer), always with `?text=`, trip message on trip sidebars, `data-he-event/location/trip`; no link at all while the number is empty.
- Verified: JSON + `X-Hola-Test` → 201 and stored with `holaSample: true`; form-encoded → 303 to `/en/thank-you/?ref=…`; missing email → 303 back with `errors=email`; mail log lines `to=(not-sent)`; thank-you fires `generate_lead` once and not on reload; with a temporary number the tour page has header/sidebar/page/footer links and the sidebar message names the trip and URL; after clearing, none.
- DONE

## 2026-10-18 — S10 · SEO
- `generateMetadata` on every route via `src/lib/seo.ts`: title templates (contracts §10), description = `seo.meta_description` else excerpt (≤155), absolute self-canonical with trailing slash on indexable pages, hreflang `es`/`en`/`x-default` (→ Spanish) only when the item exists in both languages, `noindex, follow` on filtered archive states (no canonical), thank-you, search and 404; `?page=N` alone is self-canonical. Open Graph title/description/url/locale (`es_ES`/`en_US`) with image chain `seo.og_image` → featured image → `og_default` → `/brand/og/og-default-<lang>-1200x630.png`.
- `robots.ts` (Allow /, Disallow /admin, /api/, /buscar/, /en/search/, Sitemap line) and `sitemap.ts` (every indexable available URL in both languages with `xhtml:link` alternates; terms only when they have items; no thank-you): 98 URLs.
- JSON-LD: TravelAgency everywhere, BreadcrumbList on every page except home, TouristTrip, TouristDestination, Article, FAQPage; no AggregateRating/Review.
- Verified with `ACCEPT_SKIP_GATES=1 bash kit/bin/acceptance.sh`: all A7 page checks pass on the 104 URLs, filtered archive, robots and sitemap; only A15 (commit count / uncommitted file) failed, as expected before S13.
- DONE
