# START HERE — Hola Egipto v3: move to MySQL + custom admin, ready for Hostinger

## The goal

The Hola Egipto site already exists in this repository (built in the v2 run: Next.js + Payload CMS + Postgres, acceptance `fail=0`). The production host is a **Hostinger Business plan**, which runs Node.js apps but offers **only MySQL**, and Payload does not support MySQL. This run:

1. **Removes Payload CMS and Postgres** and moves all content to **MySQL** through **Drizzle ORM** + `mysql2`.
2. **Builds a custom admin** at `/admin` so the owner can edit everything himself (contracts §18).
3. **Makes images static files** in `public/images/` (no uploads).
4. **Makes the app deployable on Hostinger** (contracts §19): plain-object `next.config.ts`, no database access at build time, migrations at startup, runtime `SITE_URL`.
5. Keeps **everything visitors see** working exactly as before: pages, URLs, design, SEO, forms, tracking, coming-soon mode.

Deployment itself is done by the owner afterwards with `kit/docs/07-DEPLOY-HOSTINGER.md`. This run works **locally** against a local MariaDB database.

**What "complete" means:** every step of `kit/docs/02-BUILD-PLAN.md` is done; `bash kit/bin/acceptance.sh`, run against the production build after the last commit, prints a last line with `fail=0`; the build also succeeds with an unreachable database; and `kit/BUILD-REPORT.md` is rewritten for v3. **Do not ask questions during the run.**

## Read in this order

| File | What it is | Authority |
| --- | --- | --- |
| `kit/START-HERE.md` (this file) | Goal, stack, rules | Highest |
| `kit/docs/02-BUILD-PLAN.md` | Ordered steps M0–M10 with "done when" | 2 |
| `kit/docs/03-CONTRACTS.md` | Exact names: tables, fields, routes, scripts, env vars, admin, Hostinger rules | 2 (same as the plan) |
| `kit/docs/04-CONTENT-RULES.md` | Sample content, copy voice, what must never be invented | 2 |
| `kit/docs/05-ACCEPTANCE.md` + `kit/bin/acceptance.sh` | Definition of done | 2 |
| `kit/docs/07-DEPLOY-HOSTINGER.md` | What the owner does after the run (keep the code compatible with it) | 2 |
| `kit/docs/01-SPEC.md` | What the site is | 3 |
| `kit/brand/BRAND-GUIDE.md`, `kit/brand/README.md` | Brand rules | 3 |
| `kit/BUILD-LOG.md`, the v2 `kit/BUILD-REPORT.md`, git history | What v2 built and why | 4 (context) |

When two files disagree, the higher authority wins. Log every conflict you resolve in `kit/BUILD-LOG.md`.

## Stack (v3)

- **Next.js 16** App Router, TypeScript `strict`, pnpm, Node ≥ 22. Keep the v2 versions of `next`, `react`, `next-intl` unless a change is required; record final versions.
- **Database:** MySQL-compatible (Hostinger MySQL in production, local **MariaDB** in development) via **Drizzle ORM** (`drizzle-orm`, `drizzle-kit`) and **`mysql2`**. SQL compatible with MySQL 8 and MariaDB 10.6+ (contracts §4).
- **Admin:** own server-rendered pages under `/admin`, `bcryptjs`, `jose`, `zod` (contracts §18).
- **Content text:** Markdown rendered with `marked` + `sanitize-html` (contracts §4).
- **Mail:** `nodemailer` behind `sendMail()` (contracts §7).
- **Styling, fonts, i18n, icons:** unchanged from v2 (plain CSS + CSS Modules, tokens only, self-hosted fonts, `next-intl` pathnames, `lucide-react`).
- **Removed:** `payload`, `@payloadcms/*`, `graphql`, `pg`, the `(payload)` route group, Payload collections/globals/migrations (contracts §1).

## Hard rules

- **Stay in scope:** work only inside this repository. No `sudo`, no other projects, no global config.
- **Databases:** use only the MySQL database in `.env.local` `DATABASE_URL`. Never drop or recreate a database itself; resetting **its** tables through migrations is fine. Do not touch the old local Postgres database (leave it; do not drop it).
- **Production database:** never connect to it. `.env.hostinger.local` and every `--env=hostinger` command are for the owner after the run. Never create `.env.production.local` or `.env.production` (Next loads them automatically).
- **`.env.local`:** never print, `cat`, echo, copy or commit it, and never rewrite `DATABASE_URL`. Only the renames/additions of contracts §2, done without printing values.
- **Protect the kit:** never copy `kit/docs/`, `kit/reference/`, `kit/START-HERE.md` or `kit/CLAUDE.md` into `public/` or any route.
- **Secrets:** none in the transcript, git, the log, the report or kit files.
- **Email:** while `HOLA_DEV_MODE=1`, mail goes only to `ADMIN_EMAIL`, or nowhere when it is empty.
- **Users:** never create a permanent user; tests use `hola:test-session`.
- **Images:** never download images from the web; regenerate placeholders (content rules §4).
- **Acceptance checks:** never weaken, skip or delete a check in `kit/bin/acceptance.py` or `acceptance.sh`. If a check has a genuine bug, fix it and list it under "Script changes" in the report.
- **Quality gates:** `pnpm lint`, `pnpm typecheck` and `pnpm build` pass before a step is marked done.
- **When stuck:** use the spec default, log it, move on. Stop early only if Node, pnpm or the MySQL database in `DATABASE_URL` cannot be reached; then write `kit/BUILD-REPORT.md` saying what is needed.

## How to work

1. Follow `kit/docs/02-BUILD-PLAN.md` M0 → M10 in order.
    - **Resumed run:** if `kit/BUILD-LOG.md` has `M<n> … DONE` entries, continue from the first M-step without one, after re-checking the database and `pnpm build`.
2. After each step: append to `kit/BUILD-LOG.md` (time, step, what changed, defaults, `DONE`), **then** commit `M<n>: <name>` with the log included, print `STEP M<n> DONE — <summary>`.
3. Keep the visitor-facing site identical: from M5 on (once MySQL is seeded), request pages in both languages with the preview cookie and compare against the v2 baseline.
4. At M10: commit; production build; `pnpm start` in the background (output to `kit/logs/server.log`); `bash kit/bin/acceptance.sh 2>&1 | tee kit/reports/last-run.txt`; fix every FAIL, commit, rebuild, re-run until `fail=0`; rewrite `kit/BUILD-REPORT.md` from `kit/docs/06-REPORT-TEMPLATE.md`; commit; print the final proofs.
