# START HERE — Hola Egipto build goal (Next.js + Payload)

## The goal

Build the complete Hola Egipto website described in `kit/docs/01-SPEC.md` as a **Next.js + Payload CMS** app in this repository, using the brand in `kit/brand/`, in one run.

**Layout:** the repository root (`~/hola-egipto`) is the app. This kit lives in `kit/`. `.env.local` in the root already holds `DATABASE_URI` for a working local Postgres database.

The spec was written for WordPress. This file and `kit/docs/02`–`05` replace every WordPress-specific instruction in it (see "Translating the spec"). Deployment is **out of scope**: the app runs locally with `pnpm dev` and `pnpm build && pnpm start`.

**What "complete" means:**

- Everything that does not need an input from the owner gets finished.
- Anything that needs an owner input (a phone number, an email, an account ID, keys, legal text, real photos) gets the spec default or an empty, clearly named setting, and is listed under "Needs you" in `kit/BUILD-REPORT.md`.
- The run ends when `bash kit/bin/acceptance.sh`, run against the production build after the last commit, prints a last line with `fail=0`, and the report is written.

The owner reviews the result afterwards with the preview link (`pnpm -s hola:preview-url`) or logged in to `/admin`. Visitors without either see only the coming-soon page. **Do not ask questions during the run.**

## Read in this order

| File | What it is | Authority |
| --- | --- | --- |
| `kit/START-HERE.md` (this file) | Goal, stack, rules, overrides | Highest |
| `kit/docs/02-BUILD-PLAN.md` | Ordered steps S0–S13 with "done when" | 2 |
| `kit/docs/03-CONTRACTS.md` | Exact names: routes, collections, fields, scripts, env vars, API, events | 2 (same as the plan) |
| `kit/docs/04-CONTENT-RULES.md` | Sample content, copy voice, what must never be invented | 2 |
| `kit/docs/05-ACCEPTANCE.md` + `kit/bin/acceptance.sh` | Definition of done | 2 |
| `kit/docs/01-SPEC.md` | What the site is: pages, URLs, content model, templates, SEO, tracking | 3 |
| `kit/brand/BRAND-GUIDE.md`, `kit/brand/README.md` | Brand rules, palette, type, logo usage, which files the app serves | 3 |
| `kit/reference/` | The owner's homepage mockup and original logo, if present (inspiration only) | 4 |

When two files disagree, the higher authority wins. Log every conflict you resolve in `kit/BUILD-LOG.md`. **Decisions table in the spec:** all rows are agreed; build on the **Recommended** column unless this file overrides it.

## Stack

- **Next.js** App Router, TypeScript `strict`. The version the current **Payload 3.x** requires (at kit time: Payload 3.91.x needs `next >=16.3.3 <17`; Next 16.4.x, next-intl 4.14.x were current). Record exact versions in `kit/BUILD-LOG.md`. On Next.js 16 the request interceptor is `src/proxy.ts`.
- **Payload CMS 3.x** in the same app (admin at `/admin`), **Postgres** via `@payloadcms/db-postgres` on `DATABASE_URI`, migrations committed.
- **pnpm**, Node ≥ 22.
- **Styling:** plain CSS + CSS Modules. `kit/brand/05-tokens/brand-tokens.css` is the only source of colours, type scale, spacing, radius, shadow and motion. No Tailwind, Sass, CSS-in-JS or UI kit.
- **Fonts:** self-hosted woff2 from `kit/brand/05-tokens/fonts/` with `@font-face` (contracts §17). Never Google Fonts, never `next/font/google`.
- **i18n:** `next-intl` with `pathnames` (translated URL bases exactly as contracts §5). Spanish default without prefix; English under `/en/`. Payload localization `es` (default) + `en`, one document per item holding both languages.
- **Images:** Payload `media` upload collection with the sizes of contracts §13, rendered with `next/image`.
- **Icons:** `lucide-react`.

## Translating the spec

Wherever the spec says the left column, build the right column.

| Spec says (WordPress) | Build this |
| --- | --- |
| Custom post types, taxonomies | Payload collections; taxonomies as collections linked with `relationship` fields (contracts §4) |
| Secure Custom Fields groups, ACF blocks, options pages | Payload fields, `blocks` fields rendered by React components, the `site-settings` and `navigation` globals |
| Polylang / Polylang Pro, translation sync | `next-intl` routing + Payload localization; shared (non-localized) fields replace syncing; per-locale `available` replaces "publish only when translated" |
| PHP templates, `template-parts/` | Route segments under `src/app/(frontend)/[locale]/…` and React components |
| Yoast SEO | `generateMetadata`, `sitemap.ts`, `robots.ts`, hreflang alternates, JSON-LD components (contracts §10) |
| `wp hola …` WP-CLI commands | `pnpm hola:<name>` scripts on Payload's Local API (contracts §9) |
| `/wp-json/hola/v1/…` | `/api/hola/…` (contracts §7) |
| `_hola_sample` meta | `holaSample` checkbox on every collection that gets sample content |
| mu-plugin coming-soon page + preview cookie | the request interceptor (contracts §3) |
| WP Mail SMTP, dev mail mu-plugin | `sendMail()` with the dev redirect and mail log (contracts §7) |
| LiteSpeed Cache, WP cron, transients | ISR + on-demand revalidation (contracts §16); retention as a script |
| Complianz | own consent banner with Consent Mode v2 (contracts §15) |
| Redirection plugin | not in this run (no live URLs yet); list "301 redirects at launch" under Needs you |
| Two Factor, UpdraftPlus, Cloudflare, hosting, DNS, SMTP DNS records | not in this run; list them under Needs you as deployment items |
| `theme.json` | not used; tokens come from `brand-tokens.css` |
| Site Icon / `head-snippet.html` | `src/app/favicon.ico`, `icon.svg`, `apple-icon.png`, `manifest.ts` from `kit/brand/02-favicon/` |

## Overrides

1. **Local only.** No server, Docker, GitHub remote, CDN or deployment config. Git stays local (no remote, no push).
2. **Owner inputs** (WhatsApp number, contact email, phone, address, legal name, licence number, GTM ID, admin email, SMTP, Turnstile keys, n8n webhook) stay empty. The site must work correctly with them empty: hide every WhatsApp button, skip GTM, accept forms without Turnstile while `HOLA_DEV_MODE=1`, send no mail but log it.
3. **Coming-soon mode** per contracts §3 (`HOLA_COMING_SOON=1`). `robots.ts` stays permissive; the 503 keeps crawlers out.
4. **Filtered archives** are `noindex, follow` with no canonical (this replaces spec §3's "canonical to the clean archive").
5. **Images:** there are no real photos. Generate branded placeholders (content rules §4). Never download stock photos or any image from the web.
6. **Migrations:** Payload Postgres migrations from the first schema on; the final state must not depend on dev auto-push.
7. **Users:** never create a permanent user. The owner creates the first admin at `/admin/create-first-user`. Test sessions use `pnpm hola:test-session`.

## Hard rules

- **Stay in scope:** work only inside this repository. Do not touch other projects, other databases, global configs or system services. Installing npm packages the app needs is fine; `sudo` is not needed and not allowed.
- **Database:** only the database in `DATABASE_URI`. Never drop or recreate the database itself; resetting its schema through Payload migrations is fine.
- **`.env.local`:** never print it, `cat` it, echo its values, copy it, commit it or rewrite `DATABASE_URI`. Append missing keys only (contracts §2).
- **Protect the kit:** never copy `kit/docs/`, `kit/reference/`, `kit/START-HERE.md` or `kit/CLAUDE.md` into `public/` or any route. Copy only the brand files listed in `kit/brand/README.md`.
- **Secrets:** no secrets in the transcript, git, the log, the report or kit files.
- **Email:** while `HOLA_DEV_MODE=1`, mail goes only to `ADMIN_EMAIL`, or nowhere when it is empty. Never to form submitters or third parties.
- **Samples:** every sample has `holaSample: true`, so `pnpm hola:samples delete` removes all of it, including media files, in one command.
- **Acceptance checks:** never weaken, skip or delete a check in `kit/bin/acceptance.py` or `acceptance.sh` to make it pass. Fix the app. If a check itself has a genuine bug, fix the bug and list the change under "Script changes" in the report.
- **Quality gates:** `pnpm lint`, `pnpm typecheck` and `pnpm build` pass with no errors before a step is marked done.
- **When stuck:** use the spec default, log it, move on. Stop early only if Node, pnpm or the database cannot be reached; then write `kit/BUILD-REPORT.md` saying what is needed.

## How to work

1. Follow `kit/docs/02-BUILD-PLAN.md` S0 → S13 in order.
    - **Resumed run:** if `kit/BUILD-LOG.md` already has entries, continue from the first step without a `DONE` entry, after re-checking that the database is reachable and `pnpm build` passes.
2. After each step: commit `S<n>: <name>`, append to `kit/BUILD-LOG.md`, print `STEP S<n> DONE — <summary>`.
3. Prefer small, verifiable increments. After building each route, request it with the preview cookie, and fix any server error, hydration warning or console error before moving on.
4. At S13: commit; `pnpm build`; `pnpm start` in the background (output to `kit/logs/server.log`); `bash kit/bin/acceptance.sh 2>&1 | tee kit/reports/last-run.txt`; fix every FAIL, commit, rebuild and re-run until the last line has `fail=0`; write `kit/BUILD-REPORT.md` from `kit/docs/06-REPORT-TEMPLATE.md`; commit; print the final proofs (S13 step 6).
