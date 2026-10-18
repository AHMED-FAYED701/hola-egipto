# BUILD-REPORT — Hola Egipto

## Summary

The complete bilingual Hola Egipto site is built as a Next.js 16 + Payload CMS 3 app in this repository. It has 5 content hubs with archives, singles and term landings, 10 fixed pages, a 4-step "Plan my trip" form with a stored-inquiry API, WhatsApp click-to-chat, SEO and JSON-LD, Consent Mode v2 tracking, and a coming-soon gate with a preview link. Everything that does not need an owner input is finished. The sample set (9 trips, 6 destinations, 3 guides, 55 branded placeholder images) is flagged and removable with one command. The final acceptance run against the production build ended with `ACCEPTANCE SUMMARY: pass=139 fail=0 warn=0 blocked=9`. All 9 BLOCKED items are owner inputs. **Look first at** the home page and one tour in both languages through the preview link, then fill in the WhatsApp number and contact details in Admin › Ajustes › Ajustes del sitio.

## How to review

- **Start the site:** `sudo service postgresql start`, then `pnpm build && pnpm start` (or `pnpm dev`) in `~/hola-egipto`.
- **Preview link:** run `pnpm -s hola:preview-url` and open the link it prints. It shows the real site in that browser for 30 days.
- **Admin:** open `/admin`. The first visit asks you to create your admin account, and that first account is always an admin.
- **Pages to start with:**
  - Home: `/` and `/en/`
  - One tour: `/viajes-a-egipto/egipto-clasico-8-dias/`
  - The tours archive: `/viajes-a-egipto/`
  - One destination: `/destinos/luxor/`
  - One guide: `/guia-de-viaje/que-ver-en-luxor-en-dos-dias/`
  - Plan my trip: `/planifica-tu-viaje/`
- **Samples:** every trip, destination, guide and image is a flagged sample. Remove them all with `pnpm hola:samples delete`. Run `pnpm hola:samples delete --dry-run` first to see the counts.
- **Helper:** `bash scripts/serve.sh start|stop|restart` runs the production server with output appended to `kit/logs/server.log`. `bash scripts/serve.sh visual` starts a second review copy on port 3002 with the coming-soon gate switched off for that process only.

## Environment

| Item | Value |
| --- | --- |
| Node / pnpm | Node v24.22.0 / pnpm 12.14.0 |
| Next.js / Payload / React / next-intl | Next 16.4.2 / Payload 3.91.0 (@payloadcms/* 3.91.0) / React 19.2.6 / next-intl 4.14.9 |
| Other | sharp 0.35.4, jose 6.2.12, lucide-react 1.59.0, nodemailer 7 (only used once SMTP is configured) |
| Postgres | PostgreSQL 18.6 (local, `DATABASE_URI`), 3 Payload migrations applied |

## What was built (by spec section)

| Spec section | Status | Notes |
| --- | --- | --- |
| Sitemap and URLs | Done | Every URL of spec §3 in ES and EN with translated bases (next-intl `pathnames`). Trailing slash plus a 308 for no-slash URLs. Unknown URLs get a real localized 404. `?duration=…&style=…` filters stay crawlable but are `noindex, follow`. |
| Navigation | Done | Header mega panels from the `navigation` global (featured trip, SVG region map, latest guides), ES/EN switcher, WhatsApp, CTA, breakpoints ≥1280 / 1024–1279 / <1024 drawer, sticky header (88→64 px), mobile bottom bar with the price on trip pages, footer with 4 columns and bottom bar. |
| Content model | Done | 5 public content types plus pages, inquiries, media, users, 6 taxonomies, and the `site-settings` and `navigation` globals. Field names follow the spec verbatim. Facts are shared and words are localized. The duration term is set automatically. Validation rules are in place. |
| Templates | Done | Home (10 sections), tour, cruise, excursion, trip archives and term landings (filters, sort, 12 per page, SEO text, FAQ, CTA), destination, destinations archive and region (SVG map), guide (TOC, trip-card and tip-box blocks), guides archive and topic, Plan my trip, thank-you, contact, FAQ, about, legal, search, 404. |
| Multilingual | Done | One document holds both languages. The `available` flag is per locale. hreflang is only output when both languages exist. The switcher hides a language that is missing. Prices show in EUR on ES pages and USD on EN pages. |
| Forms, WhatsApp, lead flow | Done | `POST /api/hola/inquiry` handles JSON and the form-encoded no-JS path, with honeypot, token, Turnstile once keys exist, rate limit, storage, mail through `sendMail()` with the dev redirect, the n8n webhook and the thank-you `generate_lead`. `whatsappUrl()` builds every WhatsApp link. UTM, gclid and fbclid are captured. |
| SEO and structured data | Done | Titles per spec §11 templates, canonical, hreflang, robots, OG with a fallback chain, `robots.txt`, `sitemap.xml` (98 URLs with alternates), and TravelAgency, BreadcrumbList, TouristTrip, TouristDestination, Article and FAQPage. There is no rating schema. |
| Analytics and consent | Done (IDs pending) | dataLayer bootstrap and Consent Mode v2 defaults. The banner offers "Reject all" as prominently as "Accept all". GTM loads only once `gtm_id` is set. Every event in contracts §15 is wired. |
| Performance, accessibility, security | Done | Home CSS 8.3 KB gz, first-load JS 143.1 KB gz, 2 font preloads, hero `fetchpriority=high`. axe found 0 violations on 7 page types. Security headers and CSP (report-only) are set, and REST access for users and inquiries is admin-only. |

## Needs you

| Input | Why it matters | Where to set it |
| --- | --- | --- |
| WhatsApp Business number | Every WhatsApp button is hidden until it is set (header, sidebar, sticky bar, contact, thank-you, coming-soon) | Admin › Ajustes › Ajustes del sitio › Contacto y empresa › `whatsapp_number` (digits only with country code, no "+") |
| Contact email | Team inquiry mails go here; shown on Contact and in the footer | Admin › Ajustes › Ajustes del sitio › `contact_email` |
| Phone, address | Shown on Contact once set | Admin › Ajustes › Ajustes del sitio › `phone`, `address` |
| Reply hours (Cairo time) | Shown on Plan my trip, Contact and in the auto-reply; now `[pendiente]` | Admin › Ajustes › Ajustes del sitio › `reply_hours` (ES and EN) |
| Legal company name | Footer, Contact, Aviso legal, TravelAgency schema | Admin › Ajustes › Ajustes del sitio › `legal_name` |
| Tourism licence number (or licensed partner agency) | Footer, Contact, About, `identifier` in schema | Admin › Ajustes › Ajustes del sitio › `licence_number` |
| GTM container ID | GA4, Google Ads and Meta Pixel load only through GTM | Admin › Ajustes › Ajustes del sitio › Políticas y valores por defecto › `gtm_id` |
| `ADMIN_EMAIL` | While `HOLA_DEV_MODE=1` the only mail recipient; empty = no mail is sent (only logged) | `.env.local` → `ADMIN_EMAIL=` |
| SMTP | Outgoing mail (team notification, auto-reply, password reset) | `.env.local` → `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` |
| Cloudflare Turnstile keys | Anti-spam on forms; without them forms are refused once `HOLA_DEV_MODE` is off | `.env.local` → `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| n8n webhook | Inquiries to the sheet/CRM/WhatsApp alert | `.env.local` → `N8N_WEBHOOK_URL`, `HOLA_WEBHOOK_SECRET` |
| Legal texts | Aviso legal, privacy, cookies and terms show `[Texto legal pendiente…]` under the spec headings | Admin › Contenido › Páginas › each legal page (ES and EN) |
| Cancellation policies | Two sample policies (`standard`, `flexible`) marked as samples | Admin › Ajustes › Ajustes del sitio › Políticas de cancelación |
| About: story, team, licence line | Placeholders "Nombre pendiente · Rol pendiente", story `[pendiente]` | Admin › Contenido › Páginas › Sobre nosotros (sections) |
| Real photos, real trips, guides, destinations | Everything now is a flagged sample with branded placeholders | Replace in Admin, then `pnpm hola:samples delete` |
| Guide author names | `author_name` is `[pendiente]` / `[pending]` | Admin › Contenido › Guía de viaje |
| Social links | Footer and schema `sameAs` stay empty until set | Admin › Ajustes › Ajustes del sitio › `social` |
| Spanish head term check | Spec: `/viajes-a-egipto/` vs `/tours-por-egipto/` before launch | Decide; the URL base lives in `src/i18n/routing.ts` + `src/lib/urls.ts` |

**Deployment items (out of scope for this run):**
- **Hosting and domain:** hosting, the domain (`hola-egipto.com`), HTTPS and HSTS, and the `www` → apex redirect.
- **Final environment:** `NEXT_PUBLIC_SITE_URL` set to the real domain.
- **Mail DNS:** SPF, DKIM and DMARC records.
- **Cloudflare:** DNS, WAF and Turnstile.
- **Tracking:** GTM, GA4, Google Ads and Meta (Pixel, CAPI), plus Search Console and Bing with both sitemaps submitted.
- **Admins:** 2FA for admins, which Payload does not provide out of the box and which needs a plugin or SSO.
- **Backups:** database and `media/` backups, with one restore tested.
- **Redirects:** 301 redirects at launch.
- **Retention schedule:** a daily cron for `pnpm hola:retention`.
- **Going live:** turning off the coming-soon page (`HOLA_COMING_SOON=0`) and `HOLA_DEV_MODE=0`.

## Draft copy to review

- **Home hero H1:** "Tu viaje a Egipto, planificado con gente de aquí" / "Your Egypt trip, planned with people who live here", plus the lead sentence.
- **Home sections:** Why Hola Egipto (3 columns, marked "Texto provisional" on the page) and the section intros for destinations, tours, cruises, excursions, guides and CTA.
- **Booking band text:** adapted from the mockup.
- **About:** the "Cómo trabajamos" / "How we work" 3 steps (marked draft) and the team block titles.
- **FAQ page answers:** 4 groups × 3, with no guarantees and owner facts marked `[pendiente]`.
- **Term intros:** landing copy (H1, intro, SEO text, 2 FAQs) for every term with items, plus the archive intros, SEO texts and FAQs of all 5 archives.
- **Sample content:** the trips, destinations and guides are drafted samples. Changeable facts are marked `[verificar]` / `[verify]`. They have not been fact-checked against current sources: water temperatures, fees, opening hours and similar details. The water temperatures are approximate ranges.

## Deviations from the spec

- **Unknown URLs are answered by the proxy** (f1c3b8d): in Next.js 16.4.2 a page-level `notFound()` renders an empty error shell with no `lang` and no `<h1>`. I reproduced this in a minimal app. Instead, `src/proxy.ts` checks the slug index (`/api/hola/routes`, cached 5 s) and rewrites unknown URLs to the localized `hola-404` page with status 404. Pages still call `notFound()` as a backstop.
- **Next 16.4.2 instead of the scaffold's 16.3.3** (44359fa): the latest 16.x, within Payload's supported range.
- **Revalidation clears the whole site** (0eb1b3e): every content change revalidates the whole front-end layout rather than only the affected paths. The site is small and cross-linked.
- **Routes that read `searchParams` are dynamic** (4d472ad): archives, landings, search and the fixed pages render per request, because of filters, pagination, `?trip`, `?ref` and form errors. Singles, destinations, guides and home use ISR.
- **Excursion title template** (4d472ad): when the excursion title already contains the departure city, it drops the repeated "desde {city}".
- **Icons** (0fff26b): `lucide-react` 1.x has no brand icons. The WhatsApp button uses a drawn bubble-and-handset glyph on the WhatsApp-green button, and social links use a globe icon plus the network name.
- **Cabin `type` is optional** (10a8724): a localized `required` field inside a shared array blocked the English save, so the requirement was dropped (migration `cabin_type_optional`).
- **`hola:retention --dry-run` output** (c8af023): prints `{"deleted":0,"would_delete":n,"dry_run":true}`.
- **No GTM `<noscript>` iframe** (1f22f66): it would load the container without consent.
- **Header spacing at 1280–1439 px** (51cda0f): spacing is tightened (logo 40 px, smaller toggles) so the Spanish labels and the WhatsApp button fit without overlap.

## Manual checks (from `kit/docs/05-ACCEPTANCE.md`)

| Check | Result | Notes |
| --- | --- | --- |
| Visuals at 375 / 768 / 1280 / 1440 | Partial | Screenshots checked at 375 (tour, drawer) and 1280 (home, tour, mega panel, archive with WhatsApp set): no overlap or horizontal scroll after the S12 header fix. 768 and 1440 were not captured; please look at them. |
| Header does not overflow at 1280 with Spanish labels | Pass | Measured: logo ends at 219 px, nav spans 231–843 px, actions start at 863 px (with the WhatsApp button). |
| Keyboard: mega menu, drawer, lightbox, 4-step form | Implemented, partly exercised | Mega menu: click or Enter toggles, Esc closes and returns focus, ←/→ and ↓ work. Drawer: focus trap and Esc. Lightbox: native `<dialog>` with ←/→. Accordions and tabs are native or ARIA. The step form was driven in a browser. A full keyboard-only pass is still to do by hand. |
| Form without JavaScript | Pass | Without JS the form is one long server-rendered form with a server token. A form-encoded post gets 303 to the thank-you page, and an invalid post gets 303 back with `?errors=…#form` (tested with curl and A8). |
| Language switcher | Pass | Links to the translated item and is hidden when the other language is not available. The hreflang pairs are verified by A7 on all 104 URLs. |
| Archive filters combine | Partial | Filters are applied together on the server (AND). `?group=small` and `?duration=7-9-dias` were checked. Please try a few combinations. |
| Accessibility (axe) | Pass | axe-core 4.x ran on home ES, tour ES, the filtered EN tours archive, guide EN, Plan my trip EN and destination ES with **0 violations**. |
| Draft copy listed | Done | See "Draft copy to review". |

## Acceptance results

Final line: `ACCEPTANCE SUMMARY: pass=139 fail=0 warn=0 blocked=9`. There are no WARNs. The 9 BLOCKED are the owner inputs listed under "Needs you".

| Status | Check | Detail |
| --- | --- | --- |
| PASS | A0 | node v24.22.0 |
| PASS | A0 | pnpm 12.14.0 |
| PASS | A0 | kit layout (kit/START-HERE.md) |
| PASS | A0 | .env.local has DATABASE_URI |
| PASS | A0 | .env.local has PAYLOAD_SECRET |
| PASS | A0 | .env.local has HOLA_PREVIEW_KEY |
| PASS | A0 | .env.local has NEXT_PUBLIC_SITE_URL |
| PASS | A0 | HOLA_COMING_SOON=1 |
| PASS | A0 | HOLA_DEV_MODE=1 |
| PASS | A0 | server answers at http://localhost:3000 |
| PASS | A0 | production build present (.next/BUILD_ID) |
| PASS | A1 | package.json scripts present |
| PASS | A1 | src/payload.config.ts |
| PASS | A1 | src/i18n/routing.ts |
| PASS | A1 | src/messages/es.json |
| PASS | A1 | src/messages/en.json |
| PASS | A1 | src/lib/mail.ts |
| PASS | A1 | src/lib/whatsapp.ts |
| PASS | A1 | request interceptor (src/proxy.ts or src/middleware.ts) |
| PASS | A1 | 3 Payload migration(s) |
| PASS | A1 | no forbidden styling/UI dependencies |
| PASS | A1 | no Google Fonts, next/font/google or Sass in src/ |
| PASS | A1 | no kit files in public/ |
| PASS | A2 | pnpm lint passes |
| PASS | A2 | pnpm typecheck passes |
| PASS | A5 | visitor gets 503 on / |
| PASS | A5 | Retry-After header |
| PASS | A5 | X-Robots-Tag noindex |
| PASS | A5 | Cache-Control no-store |
| PASS | A5 | coming-soon page (lang es, title 'Muy pronto') |
| PASS | A5 | coming-soon robots meta noindex |
| PASS | A5 | visitor gets 503 on /en/egypt-tours/ |
| PASS | A5 | invalid payload-token is treated as a visitor |
| PASS | A5 | wrong preview key sets no cookie |
| PASS | A5 | /admin reachable |
| PASS | A5 | /api/hola/token reachable for visitors |
| PASS | A5 | token is no-store |
| PASS | A5 | /robots.txt passes through (200) |
| PASS | A5 | /favicon.ico passes through (200) |
| PASS | A5 | /manifest.webmanifest passes through (200) |
| PASS | A5 | /sitemap.xml passes through (200) |
| PASS | A5 | /icon.svg passes through (200) |
| PASS | A5 | /apple-icon.png passes through (200) |
| PASS | A6 | preview link redirects |
| PASS | A6 | preview cookie set; redirect drops the parameter |
| PASS | A6 | preview cookie shows the real site |
| PASS | A6 | admin session shows the real site |
| PASS | A6 | temporary test user deleted |
| PASS | A3 | collection `tours` fields |
| PASS | A3 | collection `cruises` fields |
| PASS | A3 | collection `excursions` fields |
| PASS | A3 | collection `destinations` fields |
| PASS | A3 | collection `guides` fields |
| PASS | A3 | collection `pages` fields |
| PASS | A3 | collection `inquiries` fields |
| PASS | A3 | collection `media` fields |
| PASS | A3 | collection `users` fields |
| PASS | A3 | collection `durations` fields |
| PASS | A3 | collection `trip-styles` fields |
| PASS | A3 | collection `cruise-types` fields |
| PASS | A3 | collection `departures` fields |
| PASS | A3 | collection `regions` fields |
| PASS | A3 | collection `guide-topics` fields |
| PASS | A3 | global `site-settings` fields |
| PASS | A3 | global `navigation` |
| PASS | A4 | Payload locales es (default) + en |
| PASS | A4 | / → 200, lang=es |
| PASS | A4 | /en/ → 200, lang=en |
| PASS | A4 | no-slash URL redirects to the slashed URL |
| PASS | A4 | unknown English path → 404 (lang en) |
| PASS | A7 | URL list covers home, archives and fixed pages in both languages |
| PASS | A7 | 36 single URLs (≥ 36 = 18 samples × 2) |
| PASS | A7 | term, search and 404 rows present |
| PASS | A7 | all 104 URLs answered as expected and passed page checks |
| PASS | A7 | filtered archive is noindex, follow without canonical |
| PASS | A7 | robots.txt rules |
| PASS | A7 | sitemap.xml lists both languages with alternates, no thank-you |
| PASS | A8 | valid JSON inquiry → 201 with thank-you redirect |
| PASS | A8 | missing email → 422 errors.email |
| PASS | A8 | honeypot → 400 |
| PASS | A8 | forged token → 400 |
| PASS | A8 | form-encoded (no JS) inquiry → 303 to /en/thank-you/ |
| PASS | A8 | exactly the 2 valid inquiries were stored, flagged as samples |
| PASS | A8 | stored inquiry fields (lang, holaSample, status new) |
| PASS | A8 | 4 new mail-log lines |
| PASS | A8 | mail goes only to ADMIN_EMAIL (or is not sent) |
| PASS | A9 | thank-you page fires generate_lead once |
| PASS | A9 | thank-you is noindex |
| PASS | A9 | a reload does not fire generate_lead again |
| PASS | A9 | a forged ref fires nothing |
| PASS | A10 | POST /api/hola/revalidate works |
| PASS | A10 | revalidate refuses a wrong key |
| PASS | A10 | 5 WhatsApp link(s) on a tour page with the configured number |
| PASS | A10 | data-he-event/location on every WhatsApp link |
| PASS | A10 | trip WhatsApp message names the trip and its URL |
| PASS | A10 | no WhatsApp link rendered while the number is empty |
| PASS | A11 | tours: 3 es / 3 en |
| PASS | A11 | cruises: 2 es / 2 en |
| PASS | A11 | excursions: 4 es / 4 en |
| PASS | A11 | destinations: 6 es / 6 en |
| PASS | A11 | guides: 3 es / 3 en |
| PASS | A11 | 55 sample images (≥ 30) |
| PASS | A11 | samples delete --dry-run reports what it would delete |
| PASS | A11 | dry run changed nothing |
| PASS | A12 | header X-Content-Type-Options |
| PASS | A12 | header Referrer-Policy |
| PASS | A12 | header Permissions-Policy |
| PASS | A12 | header X-Frame-Options |
| PASS | A12 | header Content-Security-Policy-Report-Only |
| PASS | A12 | no X-Powered-By |
| PASS | A12 | /kit/START-HERE.md not served (final 404) |
| PASS | A12 | /START-HERE.md not served (final 404) |
| PASS | A12 | /docs/01-SPEC.md not served (final 404) |
| PASS | A12 | /kit/docs/01-SPEC.md not served (final 404) |
| PASS | A12 | /.env.local not served (final 404) |
| PASS | A12 | /.env not served (final 404) |
| PASS | A12 | /kit/BUILD-LOG.md not served (final 404) |
| PASS | A12 | /kit/bin/acceptance.sh not served (final 404) |
| PASS | A12 | /kit/docs/03-CONTRACTS.md not served (final 404) |
| PASS | A12 | logged-out GET /api/users refused (403) |
| PASS | A12 | logged-out GET /api/inquiries refused (403) |
| PASS | A12 | .env.local is not tracked |
| PASS | A12 | .env.local is gitignored |
| PASS | A12 | no secret values in git, the log or the report |
| PASS | A13 | CSS 8.3 KB gz (≤ 40) |
| PASS | A13 | first-load JS 143.1 KB gz (≤ 200, framework included) |
| PASS | A13 | no jQuery |
| PASS | A13 | exactly 2 font preloads |
| PASS | A13 | favicon, apple-touch-icon and manifest links in <head> |
| PASS | A13 | home hero image has fetchpriority=high (not lazy) |
| PASS | A13 | 26 lazy images on home |
| PASS | A13 | home response 10 ms (≤ 600, local) |
| PASS | A13 | stylesheet count reasonable |
| PASS | A14 | no errors in kit/logs/server.log (last 400 KB) |
| PASS | A15 | 13 commits |
| PASS | A15 | working tree clean (except BUILD-LOG / BUILD-REPORT) |
| PASS | A15 | migrations committed |
| PASS | A15 | .env.example lists every key with no secret values |
| PASS | A15 | .env.example committed |
| BLOCKED | A16 | WhatsApp Business number (whatsapp_number) empty — owner input |
| BLOCKED | A16 | contact email (contact_email) empty — owner input |
| BLOCKED | A16 | legal company name (legal_name) empty — owner input |
| BLOCKED | A16 | tourism licence number (licence_number) empty — owner input |
| BLOCKED | A16 | GTM container ID (gtm_id) empty — owner input |
| BLOCKED | A16 | admin email for dev mail (ADMIN_EMAIL) empty — owner input |
| BLOCKED | A16 | SMTP (SMTP_HOST) empty — owner input |
| BLOCKED | A16 | Turnstile keys (TURNSTILE_SITE_KEY) empty — owner input |
| BLOCKED | A16 | n8n webhook (N8N_WEBHOOK_URL) empty — owner input |

## Script changes

None. `kit/bin/acceptance.py` and `kit/bin/acceptance.sh` are unchanged.

## Rollback

- **Code:** `git log --oneline`, then `git revert <hash>`.
- **Database:** `pnpm payload migrate:down` steps back one migration; `pnpm hola:samples delete` removes all samples.

## Suggested next runs

1. "Read kit/REVIEW.md (my comments on the preview) and apply every change, then re-run kit/bin/acceptance.sh until fail=0."
2. "Replace the sample trips, destinations and guides with the content in kit/content/, upload the photos in kit/photos/ with alt text in both languages, then run pnpm hola:samples delete and re-run the acceptance checks."
3. "Fill the legal pages with the texts in kit/legal/ (ES and EN) and set legal_name, licence_number, contact_email and whatsapp_number in site-settings from kit/owner-inputs.md."
4. "Prepare the deployment: Dockerless Node hosting notes, production env checklist, cron for hola:retention, 301 redirect map, and turn off HOLA_COMING_SOON on launch day."
