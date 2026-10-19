# Build plan v3 — M0 to M10 (Payload/Postgres → Drizzle/MySQL + custom admin)

Work through the steps in order. After each step: `pnpm lint`, `pnpm typecheck` and `pnpm build` pass; append to `kit/BUILD-LOG.md`; **then** commit `M<n>: <name>` (log included); print `STEP M<n> DONE — <one-line summary>`.

**Never** name an env file `.env.production.local` or `.env.production` (Next loads them automatically). Never pass `envv` output to `curl -v` or anything that echoes it.

**Reading a value from `.env.local`** (strips optional quotes; never echo the result): `envv() { sed -nE "s/^$1=[\"']?([^\"']*)[\"']?\$/\1/p" .env.local; }`.

**Running the server:** stop any server you started; check port 3000 is free (`ss -ltn | grep -q ':3000 '`); `pnpm build`; `pnpm start` in the background with output appended to `kit/logs/server.log`; wait until `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/robots.txt` answers `200`.

**Checking a page:** `curl -s -c kit/logs/he.jar -o /dev/null "http://localhost:3000/?hola_preview=$(envv HOLA_PREVIEW_KEY)"`, then fetch pages with `-b kit/logs/he.jar`.

## M0 · Preflight and baseline

1. `git status --porcelain` is empty (commit or stash nothing of the owner's; if dirty with your own files from a crashed run, log and continue). Tag the v2 state once: `git rev-parse -q --verify refs/tags/v2-payload >/dev/null || git tag v2-payload` (never move the tag).
2. Versions: node, pnpm, `mariadb --version` (or `mysql --version`). Record them.
3. `.env.local` has `DATABASE_URL` (check with `grep -c '^DATABASE_URL=' .env.local`, never print). Connect with a one-off `node -e` + `mysql2` snippet that reads the URL from the env file and prints only `SELECT VERSION()`; on failure print only the error code (e.g. `ER_ACCESS_DENIED_ERROR`, `ECONNREFUSED`). If it fails, stop and write `kit/BUILD-REPORT.md` saying what is needed.
4. Baseline for comparison: with the v2 app still running on Postgres, save `pnpm -s hola:urls` to `kit/logs/v2-urls.tsv` and the HTML of 6 pages (home ES/EN, one tour, tours archive, one guide, plan my trip) to `kit/logs/v2-pages/`. If the v2 app can no longer start, log it and skip the baseline.
5. **Stop the v2 server**, then run `bash kit/bin/acceptance.sh --preflight`; it must reach its summary line (failures are expected). (With the v2 server up it would write test data into the old Postgres database.)

**Done when:** versions, DB check and baseline are logged. (No commit for M0 except the tag.)

## M1 · Environment and dependencies

1. `.env.local`, without printing values, each guarded by `grep -q '^KEY=' .env.local ||` so a rerun never duplicates: **add** `APP_SECRET` with the same value as `PAYLOAD_SECRET` (`sed -n 's/^PAYLOAD_SECRET=/APP_SECRET=/p' .env.local >> .env.local`, or `openssl rand -hex 32` if there is none), `SITE_URL` from `NEXT_PUBLIC_SITE_URL` the same way (else `SITE_URL=http://localhost:3000`), `HOLA_PREVIEW_KEY` (`openssl rand -hex 16`) if absent, `HOLA_AUTO_MIGRATE=0`. The old keys (`DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`) stay until M4 so the v2 code keeps building. Rewrite `.env.example` from contracts §2.
2. **Add** `drizzle-orm`, `mysql2`, `bcryptjs`, `jose`, `zod`, `nodemailer`, `marked`, `sanitize-html`; dev: `drizzle-kit`, `tsx`, `@types/*` as needed. Move `sharp` to devDependencies if it is a dependency. Do **not** remove Payload yet: old and new code live side by side until M4.

**Done when:** install succeeds; the v2 site still builds; `.env.example` matches contracts §2.

## M2 · Schema and migrations

1. `src/db/schema.ts` for every entity, `_i18n` table, join table, settings, navigation, images, inquiries, users, `login_attempts` per contracts §4, §7, §13, §18. Use the `jsonText` custom type for lists.
2. `src/db/client.ts`: one `mysql2/promise` pool from `DATABASE_URL` (connectionLimit 5, `charset: 'utf8mb4'`), cached on `globalThis` in dev; Drizzle on top.
3. `drizzle.config.ts` (dialect `mysql`, schema path, out `drizzle`). Generate the first migration with `pnpm db:generate`. Inspect the SQL: no `json` columns, no CHECK, no TEXT defaults. (utf8mb4 comes from the database default; `hola:deploy-check` verifies table collations.)
4. `pnpm migrate` script and `src/instrumentation.ts` startup migration, both using the procedure in contracts §19.
5. `src/db/model.ts` + `hola:schema` and `hola:health` (contracts §9).

**Done when:** `pnpm -s migrate` prints `{"applied":1}` (or more) on the empty local database, a second run prints `{"applied":0}`, and `pnpm -s hola:schema` exits 0 with every field A3 expects.

## M3 · Data layer

1. `src/lib/content/*.ts`: typed read functions for every page type (by slug and locale, lists with the archive filters/sort/pagination of contracts §5, reverse lookups, search, sitemap, URL list), and write functions used by the admin and scripts (create/update/delete per entity, including the `duration` auto-assignment and `i18n` upserts).
2. Replace every Payload Local API call in pages, layouts, metadata, sitemap, route handlers and components with these functions. Same props, same output.
3. Pages: no database access at build (contracts §16).

**Done when:** every page, layout, metadata function, sitemap and route handler reads through `src/lib/content/*` (no Payload Local API calls left outside the old Payload files), and `pnpm build` succeeds **with** and **without** a reachable MySQL database (`DATABASE_URL=mysql://x:x@127.0.0.1:1/x pnpm build`). If the v2 Payload config still needs Postgres at build time, keep it out of the import graph of the front end so the no-DB build passes.

## M4 · Scripts, images and seed

1. Rewrite every `hola:*` script on the data layer (contracts §9), including `hola:setup-url`, `hola:deploy-check`, `--env=hostinger` support.
2. `hola:placeholders` → `public/images/samples/` (content rules §4); image library rows created by `hola:seed`.
3. Port the v2 sample content and launch data (terms, pages, settings, navigation) into `hola:seed` / `hola:samples create`, reusing the v2 data files (from the working tree or `git show v2-payload:<path>`). Convert rich text to Markdown with the guide shortcodes.
4. Remove Payload: the `payload`, `@payloadcms/*`, `graphql`, `pg` dependencies, `src/payload.config.ts`, the `(payload)` routes, collections/globals, `src/migrations/`, `payload-types.ts`, `media/` usage. Then delete the obsolete `.env.local` lines without printing (`sed -i '/^DATABASE_URI=/d; /^PAYLOAD_SECRET=/d; /^NEXT_PUBLIC_SITE_URL=/d' .env.local`). The v2 code stays available through the `v2-payload` tag.

**Done when:** on the local MariaDB database, `pnpm -s hola:seed` then `pnpm -s hola:samples count` matches content rules §2; running `hola:seed` twice creates no duplicates; `hola:samples delete --dry-run` changes nothing; `grep -rnE "from ['\"](payload|@payloadcms/)|getPayload|payload\.config|payload-types|withPayload" src scripts package.json next.config.*` finds nothing; `.env.local` has no obsolete keys.

## M5 · Site on MySQL

Run the production build and walk every row of `pnpm -s hola:urls` with the preview cookie: every URL answers its expected status; compare the 6 baseline pages with `kit/logs/v2-pages/` (same headings, sections, links, metadata; allowed differences: image URLs, ids). Fix regressions.

**Done when:** every `hola:urls` row answers as expected, and the comparison is logged.

## M6 · Inquiries, mail, WhatsApp

`/api/hola/token`, `/api/hola/inquiry`, thank-you tracking, rate limit, `sendMail()` with nodemailer and the mail log, webhook, WhatsApp links — all per contracts §7–§8, now on MySQL.

**Done when:** a JSON submission with `X-Hola-Test: 1` returns 201 and is stored with `holaSample` true; the mail log gets a line with `to=(not-sent)` or `ADMIN_EMAIL`; the thank-you page fires `generate_lead` once.

## M7 · Auth and admin shell

`src/lib/auth.ts`, `/admin/login`, logout, `/admin/setup?key=`, session checks, roles, login rate limit, the admin layout (nav, language toggle, brand tokens), dashboard; interceptor update (`hola_session`, contracts §3, §11). `hola:test-session` on the new users table.

**Done when:** a visitor gets 307 from `/admin` to `/admin/login`; a `hola:test-session` token opens the dashboard; `/admin/setup` without the key answers 404; `/api/users` answers 404.

## M8 · Admin screens

Every screen in contracts §18 with full create/edit/delete, ES/EN tabs, list-field editors, relationship pickers, Markdown preview, validation, and revalidation on save. Test each screen by hand with a test session in a browser (Playwright if available): create an item in both languages, see it on the site, edit it, delete it. Remove test data afterwards.

**Done when:** every entity can be created, edited and deleted from the admin in both languages and the change shows on the site; inquiries can change status and export CSV; users can be added and removed.

## M9 · Hostinger readiness

1. `next.config.ts` is a plain object (contracts §19); `outputFileTracingIncludes` for `drizzle/`; `images.localPatterns` for `/images/**` and `/brand/**`.
2. Prove: `DATABASE_URL=mysql://x:x@127.0.0.1:1/x pnpm build` succeeds; then a normal build, and `pnpm start` with `HOLA_AUTO_MIGRATE=1` applies nothing new and logs the migrator result.
3. Prove the standalone output contains the migrations: `ls .next/standalone/drizzle .next/standalone/drizzle/meta` lists the SQL files and `_journal.json`.
4. `pnpm -s hola:deploy-check` passes locally.
5. Check `kit/docs/07-DEPLOY-HOSTINGER.md` against the code (env names, scripts, build settings). Fix the code, not the guide, unless the guide is wrong; log any guide fix.

**Done when:** all four proofs are logged.

## M10 · Acceptance and report

1. Commit; stop the server; check port 3000; `pnpm build`; `pnpm start` in the background (output to `kit/logs/server.log`).
2. `bash kit/bin/acceptance.sh 2>&1 | tee kit/reports/last-run.txt`.
3. Fix every `FAIL` in the app, commit, rebuild, restart, re-run until the last line reads `fail=0`.
4. Rewrite `kit/BUILD-REPORT.md` for v3 from `kit/docs/06-REPORT-TEMPLATE.md` (what changed from v2, the admin, the no-DB build proof, what the owner does next with `07-DEPLOY-HOSTINGER.md`), append the final log entry, and commit both. This report/log commit is the only commit allowed after the acceptance run and does not require re-running it.
5. In your last message print: the final `ACCEPTANCE SUMMARY` line, the no-DB build proof line, `git log --oneline | head -15`, and the report's "Summary" and "Needs you" sections.
