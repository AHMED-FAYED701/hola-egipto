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
