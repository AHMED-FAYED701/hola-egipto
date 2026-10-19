# Acceptance — definition of done

The run is done when an acceptance run made **after the last commit that changes code, against the production build** (`pnpm build`, then `pnpm start`):

```
bash kit/bin/acceptance.sh 2>&1 | tee kit/reports/last-run.txt
```

prints, as its last line:

```
ACCEPTANCE SUMMARY: pass=<n> fail=0 warn=<n> blocked=<n>
```

…and `kit/BUILD-REPORT.md` is written. Every run also saves `kit/reports/acceptance-<time>.md` and `kit/reports/acceptance-latest.md`.

The script is `kit/bin/acceptance.py` (Python 3 standard library) behind `kit/bin/acceptance.sh`. It reads `.env.local` itself and never prints its values. It runs `pnpm lint` and `pnpm typecheck`, calls the `pnpm hola:*` scripts, and crawls the site over HTTP.

**Status meanings:**

- **BLOCKED** is allowed only for owner inputs (A16): WhatsApp number, contact email, legal name, licence number, GTM ID, `ADMIN_EMAIL`, SMTP, Turnstile keys, n8n webhook. Each one appears under "Needs you" in the report.
- **WARN** never blocks completion, but every WARN goes into the report with a reason or a fix.

| Check | What it proves | Contract |
| --- | --- | --- |
| A0 | Node ≥ 22, pnpm, kit layout, `.env.local` keys present (`DATABASE_URL` as `mysql://`, `APP_SECRET`, `HOLA_PREVIEW_KEY`, `SITE_URL`; values not printed), no obsolete v2 keys, `HOLA_COMING_SOON=1`, `HOLA_DEV_MODE=1`, server answering, production build present | §2 |
| A1 | `package.json` scripts, required files (db, auth, site, instrumentation…), ≥ 1 Drizzle SQL migration without native `json`/CHECK/RETURNING, Payload code removed, no Payload/Postgres/UI-kit dependencies, runtime deps present, `sharp` dev-only, no Google Fonts / Payload imports / `NEXT_PUBLIC_SITE_URL` in `src/`, no kit files in `public/` | §1, §4, §17 |
| A2 | `pnpm lint` and `pnpm typecheck` pass | — |
| A3 | Every entity, setting and field the spec needs exists in the live MySQL database (`pnpm hola:schema`, verified against `information_schema`) | §4, §9 |
| A4 | Locales `es` (default) + `en`; `/` and `/en/` with the right `lang`; no-slash URLs 308 to the slash; unknown paths 404 | §5 |
| A5 | Visitors get the 503 coming-soon page with its headers; an invalid `hola_session` is a visitor; a wrong preview key sets nothing; `/admin` leads to the login page; `/admin/setup` without the key is 404; `/api/hola/token`, robots, sitemap, favicons, manifest pass through | §3, §18 |
| A6 | The preview link sets the cookie and shows the real site; an admin session (temporary test user) shows the real site and opens the admin dashboard; the test user is deleted | §3, §9, §18 |
| A7 | Every URL from `pnpm hola:urls` answers its expected status with: `lang`, one `<h1>`, a title, robots meta, self-canonical + hreflang `es`/`en`/`x-default` on indexable pages, valid JSON-LD with the required types, `alt` on every image, the dataLayer bootstrap in `<head>`, `view_item` on trips, the skip link first, and no forbidden claims; the list covers every archive and fixed page; filtered archives are `noindex, follow` without canonical; robots.txt and sitemap.xml are right | §5, §10, §12, §15 |
| A8 | The inquiry API: valid JSON → 201, missing email → 422, honeypot and forged token → 400, form-encoded → 303 to the thank-you page; exactly the valid ones are stored (flagged sample); mail goes only to `ADMIN_EMAIL` or is not sent | §7 |
| A9 | The thank-you page fires `generate_lead` once per ref, never on reload or a forged ref, and is `noindex` | §7, §15 |
| A10 | Revalidation endpoint works and refuses a wrong key; with a (temporary) number, trip-page WhatsApp links carry the number, the trip message and the tracking attributes; with no number, no WhatsApp link is rendered | §8, §16 |
| A11 | The sample set matches content rules §2; `samples delete --dry-run` reports and changes nothing | §9, content rules §2 |
| A12 | Security headers, no `X-Powered-By`, kit files not served, no JSON API (`/api/users`, `/api/inquiries`, `/api/tours`, `/api/graphql` → 404), admin pages redirect to login without a valid session, `.env.local` untracked and ignored, no secret values in git, the log or the report | §11, §18 |
| A13 | Home: CSS ≤ 40 KB gz; first-load JS ≤ 200 KB gz (framework included); no jQuery; exactly the 2 font preloads; favicon/apple-touch/manifest links; hero `fetchpriority="high"` | §13, §17 |
| A14 | No errors in `kit/logs/server.log` (WARN only) | — |
| A15 | ≥ 13 commits, clean tree (except BUILD-LOG/BUILD-REPORT), `drizzle/` migrations committed, `.env.hostinger.local` untracked, `.env.example` complete with empty secrets and committed | §2, §14 |
| A16 | Owner inputs (BLOCKED while empty) | §2, §4 |
| A17 | Hostinger readiness: `next.config` exports a plain object, migrations traced into the standalone output, guarded startup migration, `hola:deploy-check` passes, database answers with its version | §19 |

The JS budget replaces the spec's "own JS ≤ 50 KB": in a Next.js app the framework runtime ships with every page, so the measurable budget is total first-load JS. Keep the site's own client code small anyway (server components by default).

## What the script cannot see (check by hand and record in the report)

- **Visuals:** each template at 375, 768, 1280 and 1440 px wide; the header must not overflow at 1280 px with Spanish labels (spec §4). If a headless browser is available (Playwright), take screenshots and look at them; otherwise list this as a manual check.
- **Keyboard:** a keyboard-only pass through the mega menu, the drawer, the gallery lightbox and the 4-step form.
- **Form without JavaScript:** the plan-my-trip form works as one long form.
- **Language switcher:** it links to the translated equivalent.
- **Archive filters:** they combine correctly.
- **Accessibility:** axe results if it could run (build plan S12).
- **Draft copy:** everything marked as draft is listed in the report.
- **Build without a database:** `DATABASE_URL=mysql://x:x@127.0.0.1:1/x pnpm build` exits 0 (shown in the transcript; required by `GOAL.txt`).
- **Admin by hand:** create, edit and delete one item of each entity in both languages; change an inquiry status; add and remove a user (build plan M8).
