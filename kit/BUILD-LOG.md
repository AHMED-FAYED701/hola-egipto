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

## 2026-10-18 — S11 · Tracking and consent
- Already wired in S7–S9 and verified here: raw inline dataLayer bootstrap + Consent Mode v2 defaults (all four `denied`) as the only inline script in `<head>`; returning visitors with `hola_consent=granted` get a consent update before any tag; GTM snippet only when `gtm_id` is set (tested with a temporary `GTM-TEST123`, then cleared); own translated banner after `<main>` with "Reject all" styled exactly like "Accept all", choice stored in `hola_consent` (12 months) + `consent_update` push; "Cookie settings" in the footer reopens it.
- Events: `view_item` server-rendered on all 18 trip URLs; `whatsapp_click` (location, trip_id, language) and `language_switch` (from, to) via `data-he-*` click delegation; `plan_trip_start` / `plan_trip_step`; `generate_lead` once per ref; `filter_use` on archive filter submit; `search` on search results.
- Cookie policy page lists `hola_consent`, `hola_preview`, `payload-token`.
- Defaulted: no GTM `<noscript>` iframe (it would load the container without consent).
- Browser check (Playwright, review instance): Reject all → cookie `hola_consent=denied`, `consent update` + `consent_update` in dataLayer, banner closed; no console errors.
- DONE

## 2026-10-18 — S12 · Security, performance and accessibility pass
- Security (contracts §11): `poweredByHeader: false`; nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options and CSP-Report-Only on every response; logged-out `GET /api/users` and `/api/inquiries` → 403; no kit file served (probes 404); `git ls-files` has only `.env.example`; no users created except temporary `@hola.test` test sessions (deleted).
- Performance (A13 on the production build): home CSS and first-load JS within budget, no jQuery, exactly 2 font preloads, favicon/apple-touch/manifest links, hero `fetchpriority="high"` (eager), below-the-fold images lazy, galleries via CSS scroll-snap + `<dialog>` (no carousel library), static SVG maps (no Maps JS), named `lucide-react` imports.
- Accessibility: axe-core 4 (installed in the scratchpad, injected into the review instance) on home, a tour, a filtered archive (EN), a guide (EN), Plan my trip (EN) and a destination → **0 violations** on every page. Visible focus rings (teal / sun-sand on dark), skip link, keyboard mega menu/drawer/accordions/tabs/lightbox, labelled fields, ≥44 px targets, `prefers-reduced-motion` via tokens.
- Visual: 375 px tour page (no horizontal overflow, sticky price bar), 1280 px header with Spanish labels **and** a WhatsApp number set: the nav overflowed into the logo and switcher → fixed with tighter 1280–1439 spacing (logo 40 px, left-aligned nav, smaller toggles/buttons); measured afterwards: logo ends at 219 px, nav 231–843 px, actions from 863 px. Temporary number cleared afterwards.
- DONE

## 2026-10-18 — S13 · Acceptance and report
- Production build (`pnpm build`) + `pnpm start` (output appended to `kit/logs/server.log`), port 3000 checked free first.
- Acceptance run 1 (before the S13 commit): `pass=138 fail=1 warn=0 blocked=9` — the only FAIL was A15 "12 commits (expected ≥ 13)", which is this step's own commit. No app fix needed.
- Acceptance run 2 (after the S13 commit, production build): `ACCEPTANCE SUMMARY: pass=139 fail=0 warn=0 blocked=9`. The 9 BLOCKED are the owner inputs (WhatsApp, contact email, legal name, licence, GTM, ADMIN_EMAIL, SMTP, Turnstile, n8n).
- `kit/BUILD-REPORT.md` written from `kit/docs/06-REPORT-TEMPLATE.md` (summary, how to review, environment, status by spec section, needs you + deployment items, draft copy, deviations with commit hashes, manual checks, acceptance table, script changes: none, rollback, next runs). No script changes.
- Final sequence after this commit: `pnpm build`, `pnpm start` (appended to `kit/logs/server.log`), `bash kit/bin/acceptance.sh 2>&1 | tee kit/reports/last-run.txt`.
- DONE

---

# v3 run — Payload/Postgres → Drizzle/MySQL + custom admin (Hostinger)

## 2026-10-19 — M0 · Preflight and baseline
- Git tree clean at start; tag `v2-payload` created on `ca4fc74` (Kit v3 commit, last v2 code).
- Versions: node v24.22.0, pnpm 12.14.0, MariaDB client 11.8.6 (`mariadb from 11.8.6-MariaDB`).
- `.env.local` has `DATABASE_URL` (1 line, value not printed). One-off `mysql2` connection (mysql2 installed in the session scratchpad, not the repo): `SELECT VERSION()` = `11.8.6-MariaDB-5ubuntu0.1 from Ubuntu`, database charset `utf8mb4` / `utf8mb4_unicode_ci`, 0 tables.
- Baseline: the v2 production server (`pnpm start`, left running by the v2 run) answered on :3000. Saved `pnpm -s hola:urls` → `kit/logs/v2-urls.tsv` (104 rows: home 2, archive 10, single 36, term 34, page 18, search 2, 404 2) and the HTML of **all 104 URLs** (a superset of the 6 required) plus robots/sitemap/filtered archive → `kit/logs/v2-pages/`; every URL answered its expected status.
- Stopped the v2 server, then `bash kit/bin/acceptance.sh --preflight` reached its summary: `ACCEPTANCE SUMMARY: pass=49 fail=42 warn=1 blocked=9` (failures expected before the migration).
- No commit for M0 (tag only).
- DONE

## 2026-10-19 — M1 · Environment and dependencies
- `.env.local` (no values printed, each guarded by `grep -q`): added `APP_SECRET` (copied from `PAYLOAD_SECRET` via sed), `SITE_URL` (copied from `NEXT_PUBLIC_SITE_URL`; it is `http://localhost:3000`), `HOLA_AUTO_MIGRATE=0`. `HOLA_PREVIEW_KEY` and `N8N_WEBHOOK_URL` already existed. Old keys stay until M4.
- `.env.example` rewritten from contracts §2 (every name, empty values, short comments).
- Added `drizzle-orm` 0.45.4, `mysql2` 3.24.6, `bcryptjs` 3.0.3, `jose` 6.2.12 (already present), `zod` 4.6.7, `nodemailer` 7 (already present), `marked` 18.1.1, `sanitize-html` 2.18.1; dev: `drizzle-kit` 0.31.11, `@types/sanitize-html`, `@types/bcryptjs` (`tsx` 4.23.15 already a devDependency). `sharp` 0.35.4 moved to devDependencies. Payload stays until M4.
- Gates: `pnpm lint` 0, `pnpm typecheck` 0, `pnpm build` 0 (v2 site, still on Postgres; ~12 min compile).
- DONE

## 2026-10-19 — M2 · Schema and migrations
- `src/db/schema.ts`: Drizzle `mysql-core` schema for every entity (main + `_i18n` with `entity_id`/`locale`/`available`, unique (`entity_id`,`locale`) and (`locale`,`slug`)), the six taxonomies, join tables (`trip_destinations`, `related_trips`, `trip_trip_styles`, `excursion_departures`, `tour_guides`, `guide_guide_topics`, `guide_destinations`, `destination_nearby`, all with `position`), `images`, `site_settings(+_i18n)`, `navigation(+_i18n)`, `inquiries`, `users`, `login_attempts`. Lists use the one `jsonText<T>()` custom type (longtext). Timestamps `datetime` (pool `timezone: 'Z'` → UTC), dates `date` strings.
- Defaults taken (logged): `last_reviewed` (trips) and `last_updated` (guides, pages) are shared dates on the main table (contracts §4 "dates are shared"; v2 had them localized). Cruise `cabins`/`start_dates` and excursion `start_times` live in the `_i18n` table (each language keeps its own list, because their notes/labels are words). Text lists (highlights, includes…) are stored as plain `string[]`. Pages get a localized `sections` jsonText (About page blocks: story, team, steps, licence) — an added name; the home sections are fixed in code with their texts in `site_settings_i18n.home` (contracts §4).
- `src/db/client.ts`: one lazily created `mysql2/promise` pool (connectionLimit 5, utf8mb4, UTC), cached on `globalThis`, Drizzle on top; importing it opens no connection.
- `drizzle.config.ts` (dialect mysql, out `drizzle/`, migrations table `__drizzle_migrations`). `pnpm db:generate` → `drizzle/0000_brave_sumo.sql`: no `json` columns, no CHECK, no TEXT defaults; longest constraint name 52 chars.
- `src/db/migrate.ts` (contracts §19 procedure: dedicated connection, `GET_LOCK('hola_migrate',30)`, count before/after, `migrate()`, `RELEASE_LOCK`, `end()`), used by `scripts/hola/migrate.ts` (`pnpm migrate`) and `src/instrumentation.ts` (only nodejs runtime, not during build, only `HOLA_AUTO_MIGRATE=1`; logs, never throws).
- `scripts/hola/run.mjs`: `node --env-file=<.env.local | .env.hostinger.local with --env=hostinger> --import tsx scripts/hola/<name>.ts …args`.
- `src/db/model.ts` (logical name → table/column/join map) + `hola:schema` (verified against `information_schema.COLUMNS`, exit 1 on missing) + `hola:health`.
- Proof: `pnpm -s migrate` → `{"applied":1}` on the empty database (41 tables), second run `{"applied":0}`; `pnpm -s hola:health` → `{"db":true,"version":"11.8.6-MariaDB-5ubuntu0.1 from Ubuntu","tables":41}`; `pnpm -s hola:schema` exits 0 and the acceptance A3 function run alone gives 17/17 PASS.
- Note: pnpm 12 echoes `$ <command>` on stdout even with `-s`; the acceptance script tolerates leading noise (it parses the last JSON line).
- Gates: lint 0, typecheck 0, build 0 (still the v2 front end).
- DONE

## 2026-10-19 — M3 · Data layer
- `src/lib/content/`: `types.ts` (document shapes derived from the v2 types so components keep their props; rich text is now a Markdown string, images are library rows `{id,path,url,alt,width,height}`), `tables.ts` (logical name → Drizzle tables), `hydrate.ts` (main + `_i18n` row + join tables → document; depth ≥ 1 populates relations at depth − 1 like the v2 Local API; images always populated at depth ≥ 1), `read.ts` (`listAvailable` with server-side filters/sort/pagination via SQL incl. join-table subqueries, `findAvailableBySlug`, `alternateSlug`, `findById`, `findPageByTemplate`, `findTermBySlug`, `termSlugIn`, `listTerms`, `getSettings`, `getNavigation`, `getSharedSettings`, `countAvailable`; memoized per request with React `cache()`), `routes.ts` (route index for the interceptor, sitemap/URL groups), `inquiries.ts` (create, thank-you `markTracked` as a conditional UPDATE so only one request fires `generate_lead`, DB rate-limit count, admin list/status, retention), `write.ts` (`saveDoc` with i18n upserts, join replacement, tour `duration` auto-assigned from `duration_days`; `loadEditable`, `deleteDocs` with polymorphic cleanup, `duplicateDoc`).
- `src/lib/markdown.ts`: `marked` + `sanitize-html` allow-list; heading ids (TOC anchors) as in v2; `[pendiente]`/`[pending]` wrapped in the dashed marker; shortcodes `[[trip-card:<type>:<id>]]` and `:::tip … :::` split out and rendered by `RichText` blocks. `SimpleRich` (Lexical) removed; fixed pages use `RichText`.
- Replaced every Payload Local API call in pages, layouts, metadata, sitemap, route handlers and components: home sections now fixed in code (`homeBlocks()`) with texts from `site-settings.home`; thank-you tracking, inquiry validation/storage/mail, sitemap, `/api/hola/routes`, coming-soon settings, guide trip cards (`findById`).
- Inquiry rate limit now counted in the database (`inquiries.ip_hash` in the last hour) instead of process memory (Hostinger idles processes).
- `siteUrl()` reads `SITE_URL` at request time; `metadataBase` moved into `generateMetadata`; `robots.ts` is `force-dynamic`; `NEXT_PUBLIC_SITE_URL` gone from `src/`. `APP_SECRET` replaces `PAYLOAD_SECRET` in `src/lib/secrets.ts`.
- `src/lib/session.ts` (`hola_session` HS256 JWT via `jose`); the interceptor checks it instead of `payload-token`. `AdminPending` asks `/api/hola/me` (added; `/api/users/me` will 404) — logged as an added `/api/hola/*` route.
- No Payload Local API calls remain outside the old Payload files (`src/collections`, `src/globals`, `src/payload.config.ts`, `src/app/(payload)`, `src/lib/payload.ts`, which are removed in M4).
- Proof: `DATABASE_URL=mysql://x:x@127.0.0.1:1/x pnpm build` → exit 0; normal `pnpm build` → exit 0. Lint 0, typecheck 0.
- DONE

## 2026-10-19 — M4 · Scripts, images and seed
- Every `hola:*` script rewritten on the data layer and run through `scripts/hola/run.mjs` (`node --env-file=… --import tsx`, `--env=hostinger` → `.env.hostinger.local`): health, schema, seed, placeholders, samples, urls, token, preview-url, setup-url (new), test-session, settings, inquiries, retention, deploy-check (new: required env names, DB answers, all migrations applied, site-settings row, utf8mb4 collations; names only). Shared helpers in `scripts/hola/_cli.ts`; seeding in `scripts/hola/_seed.ts`.
- `hola:placeholders` → 55 WebP files (quality 75) in `public/images/samples/` (0.9 MB): deep/teal pattern tile at 2× tiled, papyrus label "FOTO DE MUESTRA · SAMPLE PHOTO" + subject, sizes hero 1920×1080, card 1200×900, tile 900×1200, gallery 1600×1067; generic sans-serif font. No image downloaded. The v2 `media/` folder (gitignored) is not used.
- `hola:seed`: terms (with landing copy), image-library rows (alt ES/EN from the v2 data), site-settings (home texts moved from the v2 home blocks into `home`, archive intros with heroes, cancellation policies), 10 fixed pages (About sections → `sections`; legal/contact content converted to Markdown), sample set, navigation (featured trips). The v2 data files in `scripts/hola/data/` are reused unchanged except the cookie policy, which now lists `hola_session` and `hola_admin_lang` instead of `payload-token` (content rules §6). Guide bodies converted to Markdown with `[[trip-card:<type>:<id>]]` and `:::tip` shortcodes.
- Proof: `pnpm -s hola:seed` → `{"ok":true,"samples":{"tours":{"es":3,"en":3},"cruises":{"es":2,"en":2},"excursions":{"es":4,"en":4},"destinations":{"es":6,"en":6},"guides":{"es":3,"en":3},"images":55,"inquiries":0}}` (content rules §2). A second `hola:seed` leaves every table's row count identical (compared with a temporary count script). `hola:samples delete --dry-run` → `{"would_delete":{"tours":3,"cruises":2,"excursions":4,"destinations":6,"guides":3,"pages":0,"inquiries":0,"images":55}}` and `samples count` unchanged afterwards.
- Payload removed: dependencies `payload`, `@payloadcms/*` (db-postgres, next, richtext-lexical, translations, ui), `graphql`, `dotenv` (and with them `pg`); files `src/payload.config.ts`, `src/app/(payload)/`, `src/collections/`, `src/globals/`, `src/blocks/`, `src/fields/`, `src/hooks/`, `src/access.ts`, `src/migrations/`, `src/payload-types.ts`, `src/lib/payload.ts`, `src/lib/email-adapter.ts`, old Lexical script helpers. `next.config.ts` no longer wraps `withPayload` (images.localPatterns now `/images/**` + `/brand/**`); `@payload-config` path alias removed.
- `.env.local`: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL` deleted with sed (no printing); 0 obsolete keys remain, `DATABASE_URL` untouched.
- `grep -rnE "from ['\"](payload|@payloadcms/)|getPayload|payload\.config|payload-types|withPayload" src scripts package.json next.config.*` → nothing.
- Gates: lint 0, typecheck 0, build 0 (4 m 41 s; compile 21 s instead of ~11 min with Payload).
- DONE

## 2026-10-19 — M5 · Site on MySQL
- Production build + `pnpm start` (output appended to `kit/logs/server.log`), preview cookie via `?hola_preview=`.
- `pnpm -s hola:urls` → 104 rows, **identical** to the v2 list in `kit/logs/v2-urls.tsv` (home 2, archive 10, single 36, term 34, page 18, search 2, 404 2). Every row answers its expected status (0 mismatches). No error lines in the server log.
- Comparison with the v2 baseline (all 104 pages, not only the 6 required), with a scratchpad script that compares lang, title, h1–h3, meta description, robots, og:title/og:locale, canonical + hreflang, JSON-LD types, internal links, section and image counts: **94/104 identical**; the other 10 differ only in the trip id inside `/planifica-tu-viaje/?trip=<type>-<id>` links (ids are allowed to differ).
- Visible-text comparison: differences are only (a) dates — seeded today (19 Oct) instead of 18 Oct; (b) the cookie policy listing `hola_session` / `hola_admin_lang` instead of `payload-token` (content rules §6); (c) cruise start dates now show the stored date (`2027-01-11` → "11 de enero"): v2 displayed them one day early because of a Payload date/timezone shift — a v2 bug, fixed; (d) one guide's reading time (4 → 5 min): v2's Lexical text extraction glued paragraphs together and undercounted words.
- `robots.txt` byte-identical; `sitemap.xml` has the same 98 URLs and 294 `xhtml:link` alternates.
- Fixed while comparing: list tie-breaks now newest-first like the Local API (latest guides, home cards); `createdAt` sorting uses the id (seeded rows share a created_at second); the reading-time word count excludes shortcode blocks, as in v2.
- Gates: lint 0, typecheck 0, build 0.
- DONE

## 2026-10-19 — M6 · Inquiries, mail, WhatsApp
- The inquiry stack was moved to MySQL in M3 (`src/lib/inquiry.ts` on `src/lib/content/inquiries.ts`, rate limit counted in the database); this step verifies it against the production build.
- `GET /api/hola/token` → token; JSON `POST /api/hola/inquiry` with `X-Hola-Test: 1` (trip `tour`/1) → `201 {"ok":true,"id":1,"redirect":"/gracias/?ref=…"}`, stored with `holaSample: true`; missing email → 422; honeypot → 400; form-encoded valid → `303 /en/thank-you/?ref=…`; form-encoded invalid → `303 /en/plan-my-trip/?errors=name,email#form`. `hola:inquiries count` → `{"total":2,"sample":2}`; `hola:inquiries last` shows lang/status/tracked/holaSample/utm.
- Mail log: one line per `sendMail()` call (team + traveller per inquiry), all `to=(not-sent)` (ADMIN_EMAIL/SMTP empty, dev mode).
- Thank-you: first load renders exactly one inline `generate_lead` push (counted like the acceptance script, ignoring the RSC payload copy), reload → 0, forged ref → 0; page is `noindex`. `markTracked()` is a conditional UPDATE, so concurrent loads cannot both fire.
- Rate limit: 6 posts from one IP without the test header → `201 ×5, 429`.
- WhatsApp with a temporary number (`hola:settings set whatsapp_number 34600000000`): header/sidebar/page/footer links on a tour page, all `https://wa.me/<number>?text=…`, `data-he-event="whatsapp_click"`, `data-he-location`, sidebar `data-he-trip` with the «title» — URL message; after clearing the number no `wa.me/` link is rendered. Number cleared (`""`).
- Webhook: `N8N_WEBHOOK_URL` is empty (owner input), so `after()` posts nothing; code unchanged from v2 (signed `X-Hola-Signature`, 5 s timeout).
- Test inquiries removed afterwards (8 rows with `@hola.test` emails, via a temporary script deleted after use).
- Gates: lint 0, typecheck 0, build 0 (no code change in this step).
- DONE
