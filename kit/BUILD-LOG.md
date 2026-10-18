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
