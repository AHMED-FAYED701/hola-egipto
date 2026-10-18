# Build plan — S0 to S13 (Next.js + Payload)

Work through the steps in order. S0 is log-only (no commit; git starts in S1). After each step from S1 on:

1. `pnpm lint`, `pnpm typecheck` and `pnpm build` pass (from S1 on).
2. Commit `S<n>: <name>`.
3. Append to `kit/BUILD-LOG.md`: time, step, what changed, anything defaulted, `DONE`.
4. Print `STEP S<n> DONE — <one-line summary>`.

**Running the server.** Whenever a step needs the running site, use the production build: `pnpm build`, then `pnpm start` in the background with output appended to `kit/logs/server.log`, wait until `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/robots.txt` answers `200`, and stop it again before the next `pnpm build`. Use `pnpm dev` only for quick checks.

**Reading a value from `.env.local`** (strips optional quotes; never echo the result): `envv() { sed -nE "s/^$1=[\"']?([^\"']*)[\"']?\$/\1/p" .env.local; }`.

**Checking a page.** Get the preview cookie once per session with `curl -s -c kit/logs/he.jar -o /dev/null "http://localhost:3000/?hola_preview=$(envv HOLA_PREVIEW_KEY)"`, then fetch pages with `-b kit/logs/he.jar`.

**Port 3000:** before `pnpm start`, check nothing else listens there (`ss -ltn | grep -q ':3000 '`); if something does and it is not this app, stop and log it instead of crawling another app.

## S0 · Preflight (no app code yet)

1. Confirm the layout: you are in the repository root; `kit/START-HERE.md` exists; `.env.local` exists. Check `.env.local` contains `DATABASE_URI` **without printing the file** (`grep -c '^DATABASE_URI=' .env.local`).
2. Versions: `node -v` (≥ 22), `pnpm -v`, `psql --version`, `git --version`, `python3 --version`. Record them in `BUILD-LOG.md`.
3. Database (never let the password reach the transcript): `DBURI=$(sed -nE "s/^DATABASE_URI=[\"']?([^\"']*)[\"']?\$/\1/p" .env.local); psql "$DBURI" -tAc 'select 1' 2>&1 | sed -E 's#//[^@]*@#//***@#'` prints `1`. If it fails, check that Postgres is running (`pg_isready`); if it still fails, stop and write `kit/BUILD-REPORT.md` saying what is needed (START-HERE "When stuck").
4. If the folder is a git repo with commits already, this is a resumed run: follow START-HERE "Resumed run".
5. Run `bash kit/bin/acceptance.sh --preflight` once. It must run to the end and print an `ACCEPTANCE SUMMARY` line (most checks fail now; that is expected). If the script itself crashes, fix the cause and log it.

**Done when:** versions and DB check are in the log and the preflight run printed its summary. (No commit for S0.)

## S1 · Foundation

1. **Scaffold** with this exact command (no prompts; the dummy connection string is replaced later, never pass the real URI on the command line):
   ```
   mkdir -p .scaffold && cd .scaffold && pnpm dlx create-payload-app@3 --name app --template blank --db postgres --db-connection-string postgres://x:x@127.0.0.1:5432/x --use-pnpm --no-agent --no-git
   ```
   If a flag is rejected by the installed version, run `pnpm dlx create-payload-app@3 --help` and use its equivalent non-interactive flags. Move the contents of `.scaffold/app/` into the repository root (never overwrite `.env.local` or anything in `kit/`), then delete `.scaffold/`. After moving:
   - delete the scaffold's `.env`, `Dockerfile` and `docker-compose.yml` (local only, no Docker);
   - use `DATABASE_URI` (not `DATABASE_URL`) in `payload.config.ts`;
   - rename `src/app/(payload)/custom.scss` to `custom.css` and update its import (no Sass);
   - delete the scaffold's `src/app/(frontend)/page.tsx` and `layout.tsx` (they clash with `[locale]`);
   - set `pnpm.onlyBuiltDependencies` in `package.json` (e.g. `sharp`, `esbuild`) and never run the interactive `pnpm approve-builds`.

   Versions: `@payloadcms/next` 3.9x requires `next >=16.3.3 <17`; at kit time the current releases were Next 16.4.x, Payload 3.91.x, next-intl 4.14.x. Use the latest Payload 3.x and the Next/React versions it requires; record exact versions of `next`, `payload`, `@payloadcms/*`, `react`, `next-intl`, `sharp`, `jose` in the log.
2. **Environment:** append to `.env.local` the keys of contracts §2 that are missing (`PAYLOAD_SECRET`, `HOLA_PREVIEW_KEY` generated with `openssl rand` without printing; `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, `HOLA_COMING_SOON=1`, `HOLA_DEV_MODE=1`, `HOLA_MAIL_LOG=kit/logs/mail.log`, and the empty owner keys). Write `.env.example` from contracts §2 with empty values.
3. **Repository:** `git init` (if needed), `.gitignore` per contracts §14, `package.json` scripts per contracts §1 (`typecheck` = `tsc --noEmit`, `migrate` = `payload migrate`), ESLint working, TypeScript `strict: true`.
4. **Payload:** `postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI }, push: false, disableCreateDatabase: true })` from the first commit (dev schema push would make `migrate` and the `hola:*` scripts stop at interactive prompts). `users` collection with `role`, localization `es` (default) + `en` with `fallback: false`, admin at `/admin`. Create migrations with `pnpm payload migrate:create <name> --skip-empty`, apply with `pnpm migrate`, confirm with `pnpm payload migrate:status`.
5. **Config:** `poweredByHeader: false`, `trailingSlash: true` + `skipTrailingSlashRedirect: true` (contracts §5), `htmlLimitedBots: /.*/` (metadata blocks rendering, so `notFound()` gives a real 404), `images.localPatterns` (contracts §13).
6. Create `kit/logs/`.

**Done when:** `pnpm build` passes, `pnpm start` serves `/admin` (200 or a redirect to the first-user screen), `/api/users` answers without a redirect, and `pnpm payload migrate:status` shows the migration applied.

## S2 · Coming-soon page, preview bypass, headers

1. `src/proxy.ts` (Next ≥ 16) or `src/middleware.ts` exactly per contracts §3, including JWT verification of `payload-token` (with the derived key in §3) and the preview cookie HMAC, plus the front-end trailing-slash 308 of contracts §5.
2. The coming-soon HTML per contracts §3 (inline the stacked colour logo SVG from `kit/brand/01-logo/svg/`).
3. Security headers per contracts §11 in `next.config` `headers()`.

**Done when:** a visitor gets 503 with the three headers; `payload-token=garbage` still gets 503; the preview link sets the cookie and the cookie gets past; `/admin`, `/api/…`, `/robots.txt` and `/favicon.ico` are not intercepted.

## S3 · Content model

1. Collections, taxonomy collections and globals exactly per contracts §4 and spec §5, field names verbatim, localized vs shared per the rule in contracts §4.
2. Admin labels in Spanish and English (Payload `i18n` for the admin: `es`, `en`). Group the admin nav: Viajes, Contenido, Taxonomías, Solicitudes, Ajustes.
3. `tours` `beforeChange` hook: set `duration` from `duration_days` using the fixed slugs (contracts §4).
4. Validation from the spec: `subtitle` ≤ 90, `highlights` 3–8, `related_trips` ≤ 3, `alt` required on media, both prices required when `available` is true in any locale.
5. Access: public read on content collections, taxonomies, media and globals; `inquiries` and `users` admin-only; create/update/delete for logged-in users only.
6. Lexical editor with the blocks `trip-card` (relationship to a trip) and `tip-box` (localized text) for guides.
7. `media` per contracts §13.
8. Revalidation hooks per contracts §16 (safe outside Next).
9. Generate types, create a migration, run it.

**Done when:** `pnpm -s hola:schema` (write it now, §9) lists every collection, global and field the acceptance script expects (A3), and the migration ran.

## S4 · Internationalised routing

1. `next-intl` with `localePrefix: 'as-needed'`, `localeDetection: false`, and the `pathnames` table of contracts §5. Integrate its handling into the same `proxy.ts`/`middleware.ts` after the coming-soon logic (coming-soon wins).
2. Route files under `src/app/(frontend)/[locale]/…` for every internal pathname, a `[page]` route for fixed pages, `search`, and a catch-all that calls `notFound()` with a localized `not-found.tsx` (status 404). Call `notFound()` in the page component before any Suspense boundary, and add no `loading.tsx` under `[locale]` (a streamed 200 cannot become a 404).
3. URL helpers in `src/lib/urls.ts` that build the localized URL of any document and of its other-language version (or `null` when not available).
4. Messages files `src/messages/es.json` and `en.json` for every UI string.

**Done when:** `/` and `/en/` render with the right `<html lang>`, a stub page for each route type answers 200 in both languages, unknown paths answer 404, and a no-slash URL answers 308.

## S5 · CLI scripts

Write every `pnpm hola:*` script of contracts §9 in `scripts/hola/`, with the exact output formats, wired in `package.json` as `payload run scripts/hola/<name>.ts --` (trailing ` --` required) or `tsx` with `.env.local` loaded. Never print secrets; `hola:test-session create` prints the JWT only to stdout for the acceptance script.

Also build `POST /api/hola/revalidate` (contracts §16) now, so the scripts can call it.

**Done when:** `pnpm -s hola:health` prints `{"db":true,…}`, each script runs on an empty database without crashing or prompting, and (after S6) `pnpm -s hola:samples delete --dry-run` prints `would_delete` while `pnpm -s hola:samples count` stays unchanged.

## S6 · Launch data and sample content

1. `pnpm hola:seed`: launch terms (contracts §4) with term-landing fields filled for every term that has items (draft copy), the fixed pages (contracts §5) with their templates and copy (content rules §5–§6), `site-settings` defaults (booking band on, stats strip, true trust items only, archive intros for all 5 collections in both languages, 2 sample cancellation policies, default WhatsApp messages, `reply_hours` `[pendiente]` / `[pending]`), the `navigation` global (spec §4), and the placeholder images.
2. `pnpm hola:samples create`: the sample set of content rules §2, both languages in each document.

**Done when:** `pnpm -s hola:samples count` matches content rules §2 and running `hola:seed` twice creates no duplicates.

## S7 · Design system, layout and components

**Design direction**

- The owner's mockup (`kit/reference/homepage-mockup.jpeg`, if present) is the target look: `papyrus` page ground, Fraunces SemiBold headings, Plus Jakarta Sans text, `deep-oasis` bands, terracotta primary button, generous whitespace.
- Use the real logo SVGs from `kit/brand/` in place of the mockup's text logo.
- Apply `kit/brand/BRAND-GUIDE.md` strictly: token-only colours, the contrast rules, sparing pattern use.
- Do not copy the mockup's rating, "free cancellation" or "pay online" claims, or its emoji icons. Use `lucide-react` icons (no icon CDN).

**Order of work**

1. **Brand files:** copy the brand assets per `kit/brand/README.md` ("In the app"). Import `kit/brand/05-tokens/brand-tokens.css` (copied to `src/styles/tokens.css`) once in the root layout. Fonts per contracts §17.
2. **Styles:** plain CSS + CSS Modules only; every colour, size, space, radius, shadow and duration from the tokens. No Tailwind, Sass, CSS-in-JS or UI kit.
3. **Root layout:** `<html lang>`, dataLayer + consent default first in `<head>` as raw inline `<script>` tags (not `next/script`; contracts §15), the two font preloads, skip link, `<main id="main">`, consent banner after `<main>`.
4. **Header** per spec §4: mega panels from `navigation` (click/Enter/Esc/arrow keys, not hover-only), ES|EN switcher, WhatsApp (only when the number is set), terracotta CTA; breakpoints ≥1280 / 1024–1279 / <1024 drawer; sticky, shrinking 88 → 64 px after 120 px of scroll; mobile sticky bottom bar (price-from on trip pages).
5. **Footer** per spec §4 on `deep-oasis` with the deep pattern, reverse stacked logo, 4 columns, bottom bar with legal links, `legal_name` + `licence_number` (or `[pendiente]` for admins only), © 2026, switcher.
6. **Components:** trip card, destination tile, guide card, stats strip, booking band, trust bar, CTA band, filter bar, breadcrumbs (with BreadcrumbList), price box, itinerary accordion, includes/excludes, gallery (CSS scroll-snap + `<dialog>` lightbox), chips, badge, WhatsApp button, language switcher, FAQ accordion, `[pendiente]` marker.
7. Client components only where interaction needs them (menu, drawer, gallery, filters, form steps, consent, sticky bar). Everything else is a server component.

**Done when:** the layout renders on `/` and `/en/` with no hydration warning and no console error.

## S8 · Templates

Build every template of spec "Templates and page sections" on the sample data, in both languages: Home (sections 1–10, from `pages` `home` blocks), tour, cruise, excursion, the three trip archives and their term landings (filters per contracts §5, 12 per page, sort, result count, SEO text, FAQ, CTA band), destination, destinations archive + region (with an inline SVG map of Egypt with region links), guide, guides archive + topic, Plan my trip (form placeholder until S9), thank-you, contact, FAQ, about, legal, search (grouped results), 404.

After each template: request one ES and one EN URL of that type with the preview cookie, fix every server error, hydration warning and console error before moving on.

**Done when:** every row of `pnpm -s hola:urls` answers its expected status with the preview cookie.

## S9 · Forms, inquiry API, WhatsApp

1. `GET /api/hola/token` and `POST /api/hola/inquiry` exactly per contracts §7 (JSON and form-encoded paths, honeypot, token, Turnstile when keys are set, rate limit, `X-Hola-Test`, storage, ref, mail through `sendMail()`, mail log, webhook after the response).
2. Plan my trip: 4 steps, one page; without JavaScript it is one long form that posts form-encoded and gets a 303. With JavaScript: step navigation, `aria-live` step changes, an error summary, the token fetched on first focus, `plan_trip_start` / `plan_trip_step` events. Pre-fills the trip from `?trip=<type>-<id>`.
3. Contact page form with `form=contact` on the same endpoint.
4. Thank-you page: confirmation, WhatsApp button, 3 guides, `generate_lead` once per ref (contracts §7).
5. UTM capture: `utm_*`, `gclid`, `fbclid` and the first landing page are kept in `sessionStorage` from the first page and sent only with the form.
6. `whatsappUrl()` and every WhatsApp placement per contracts §8 and spec "WhatsApp".

**Done when:** a JSON submission with `X-Hola-Test: 1` returns 201, the inquiry is stored with `holaSample: true`, the mail log has a new line whose `to=` is `ADMIN_EMAIL` or `(not-sent)`, and the thank-you page fires `generate_lead` once.

## S10 · SEO

Everything in contracts §10: metadata and title templates, canonical, hreflang, robots meta, `robots.ts`, `sitemap.ts`, OG images, JSON-LD per page type. `noindex, follow` and no canonical on filtered states.

**Done when:** A7's SEO checks pass on every URL from `hola:urls`.

## S11 · Tracking and consent

dataLayer bootstrap, Consent Mode v2 defaults, the consent banner (translated, "Reject all" as prominent as "Accept all"), GTM only when `gtm_id` is set, and every event of contracts §15 wired (`data-he-*` attributes, server-rendered `view_item`). The cookie policy page lists the site's cookies.

**Done when:** `view_item` is in the HTML of every trip page and no GTM script is present while `gtm_id` is empty.

## S12 · Security, performance and accessibility pass

1. **Security:** contracts §11; confirm logged-out `GET /api/users` and `GET /api/inquiries` are refused; no kit file is served; `git ls-files` has no `.env*` except `.env.example`.
2. **Performance:** budgets of spec "Performance" adapted in `05-ACCEPTANCE.md` A13. Hero image `fetchpriority="high"`, everything below the fold lazy, no carousel library, static map images (no Maps JavaScript API), tree-shaken `lucide-react` imports.
3. **Accessibility:** WCAG 2.2 AA per spec: visible focus rings, keyboard-operable menus and accordions, labelled form fields, tap targets ≥ 44 px, `prefers-reduced-motion`. If `npx @axe-core/cli` (or Playwright + axe) can run here, run it on Home, a tour, an archive and a guide in both languages, fix serious issues and log the results; if it cannot run, log that as a manual check.

**Done when:** A12 and A13 pass and findings are logged.

## S13 · Acceptance and report

1. Commit.
2. Check port 3000 is free, `pnpm build`, then `pnpm start` in the background (output to `kit/logs/server.log`), wait for it.
3. `bash kit/bin/acceptance.sh 2>&1 | tee kit/reports/last-run.txt`.
4. Fix every `FAIL` in the app (never by weakening a check; START-HERE "Acceptance checks"), commit, rebuild, restart, and re-run until the last line reads `fail=0`.
5. Write `kit/BUILD-REPORT.md` from `kit/docs/06-REPORT-TEMPLATE.md` and commit it with the log.
6. In your last message print: the final `ACCEPTANCE SUMMARY` line, `git log --oneline | head -20`, and the report's "Summary" and "Needs you" sections.
