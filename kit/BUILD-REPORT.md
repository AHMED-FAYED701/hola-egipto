# BUILD-REPORT — Hola Egipto (v3: MySQL + custom admin, ready for Hostinger)

## Summary

- The Hola Egipto site now runs on **MySQL through Drizzle ORM** (local MariaDB 11.8, Hostinger MySQL in production) instead of Payload CMS + Postgres, and has its **own admin at `/admin`** where every tour, cruise, excursion, destination, guide, page, taxonomy term, image text, setting, menu, inquiry and user can be edited in Spanish and English.
- What visitors see is unchanged: the same 104 URLs answer as before, and 94 of them are structurally identical to the v2 pages. The other 10 differ only in an internal trip id inside the "Plan this trip" link. Images are now static files in `public/images/`, and the app follows the Hostinger rules: it builds without a database, applies migrations at startup and reads `SITE_URL` at runtime.
- Final acceptance line: `ACCEPTANCE SUMMARY: pass=162 fail=0 warn=1 blocked=9`.
- **Look at this first:** run `pnpm -s hola:setup-url`, create your admin account and open `/admin`. Edit one tour in both languages and check it on the site with the preview link.

## How to review

- **Start the site:** `sudo service mariadb start`, then `pnpm build && pnpm start` (or `pnpm dev`) in `~/hola-egipto`.
- **Preview link:** run `pnpm -s hola:preview-url` and open the link it prints. It shows the real site in that browser for 30 days.
- **Admin:** run `pnpm -s hola:setup-url`, open the link once to create your admin account, then log in at `/admin`. The link only works while there are no users.
- **Pages to start with:** Home ES/EN, one tour, the tours archive, one destination, one guide, Plan my trip.
- **Samples:** every trip, destination, guide and image is a flagged sample (a "Muestra" badge in the admin). Remove them all with `pnpm hola:samples delete`. The image files stay in the repository.

## Environment

| Item | Value |
| --- | --- |
| Node / pnpm | v24.22.0 / 12.14.0 (`packageManager: pnpm@12.14.0`, `engines.node >=22`) |
| Next.js / React / next-intl / drizzle-orm / mysql2 | 16.4.2 / 19.2.6 / 4.14.9 / 0.45.4 / 3.24.6 (also drizzle-kit 0.31.11, zod 4.6.7, bcryptjs 3.0.3, jose 6.2.12, nodemailer 7.0.13, marked 18.1.1, sanitize-html 2.18.1) |
| MySQL / MariaDB (`SELECT VERSION()`) | `11.8.6-MariaDB-5ubuntu0.1 from Ubuntu` (database charset utf8mb4 / utf8mb4_unicode_ci) |

## What changed from v2

- **Database:** 41 tables from one Drizzle migration (`drizzle/0000_brave_sumo.sql`). Each entity has a main table for shared facts and an `_i18n` table for the words in each language. Ordered relations live in join tables, and lists are stored as JSON text. There are no native JSON columns, CHECK constraints or TEXT defaults, so the same SQL runs on MySQL 8 and MariaDB.
- **Data layer:** `src/lib/content/*`. Every page, layout, metadata function, sitemap and API route reads through it, and the page components were kept unchanged.
- **Rich text is Markdown**, rendered and sanitized on the server. Guides use two shortcodes: `[[trip-card:tour:ID]]` for a trip card and `:::tip Title … :::` for a tip box.
- **Admin (`/admin`):** login with a database-backed rate limit (5 failures in 15 minutes), a one-time setup link, admin and editor roles, and an ES/EN interface. Every screen in contracts §18 is there: content lists and editors with ES/EN tabs, list editors, relationship pickers, Markdown preview and an image picker; the image library with "scan for new files"; settings; navigation; inquiries with status changes and CSV export; users; and "my account". You never edit raw JSON.
- **Removed:** Payload, `@payloadcms/*`, `graphql`, `pg`, the `(payload)` routes, collections, globals, the Postgres migrations and `payload-types.ts`. The v2 code is kept under the `v2-payload` git tag.
- **Hostinger:**
    - `next.config.ts` exports a plain object with `output: 'standalone'`.
    - The migrations are traced into the standalone output.
    - The startup migration runs only when `HOLA_AUTO_MIGRATE=1`.
    - Redirects are built from `SITE_URL`.
    - Cookies are `Secure` on https.
    - No native modules run at runtime.
- **No-database build proof**, shown after the last code commit: `DATABASE_URL=mysql://x:x@127.0.0.1:1/x pnpm build -> exit 0`.

## What was built (by spec section)

| Spec section | Status (Done / Partial / Not done) | Notes |
| --- | --- | --- |
| Sitemap and URLs | Done | The 104 test URLs are identical to v2. `sitemap.xml` has the same 98 URLs and 294 alternates, and `robots.txt` is byte-identical. |
| Navigation | Done | Built from the `navigation` table and edited in Admin › Navegación with a structured form. |
| Content model | Done | Drizzle/MySQL. `hola:schema` is verified against `information_schema` and A3 passes 17/17. |
| Templates | Done | Unchanged components. The home sections are fixed in code and their texts come from Settings › Inicio. |
| Multilingual | Done | ES at the root, EN under `/en/`. Each item is published per language, and hreflang only appears when both languages exist. |
| Forms, WhatsApp, lead flow | Done | The inquiry API runs on MySQL. The rate limit is counted in the database. `generate_lead` fires once per ref (a conditional update). Mail goes through `sendMail()`. |
| SEO and structured data | Done | A7 passes on all 104 URLs. |
| Analytics and consent | Done | Unchanged from v2. The cookie policy now lists `hola_session` and `hola_admin_lang`. |
| Performance, accessibility, security | Done | Home CSS is 8.9 KB gz and first-load JS 142.7 KB gz. Security headers are set, there is no JSON API, and `/admin` is protected. axe was not re-run in v3 (see the manual checks). |

## Needs you

| Input | Why it matters | Where to set it |
| --- | --- | --- |
| WhatsApp Business number | Every WhatsApp button stays hidden until it is set | Admin › Ajustes › Datos comunes › `whatsapp_number` (digits only, with the country code, no `+`) |
| Contact email | The contact page hides it, and team mail falls back to `ADMIN_EMAIL` | Admin › Ajustes › `contact_email` |
| Legal company name | Footer and legal pages | Admin › Ajustes › `legal_name` |
| Tourism licence number | Footer, About and JSON-LD `identifier` | Admin › Ajustes › `licence_number` |
| GTM container ID | Analytics and ads tags load only when it is set | Admin › Ajustes › `gtm_id` (`GTM-XXXXXXX`) |
| `ADMIN_EMAIL` | The only mail recipient while `HOLA_DEV_MODE=1`. Without it, mail is logged but not sent | `.env.local` (local), `.env.hostinger.local` + hPanel environment variables (production) |
| SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`) | Sending mail at all | Same as `ADMIN_EMAIL`. Create the `noreply@` mailbox in hPanel › Emails |
| Turnstile keys (`TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`) | Forms are refused without them once `HOLA_DEV_MODE=0` | Cloudflare Turnstile, then the env files and hPanel |
| n8n webhook (`N8N_WEBHOOK_URL`, `HOLA_WEBHOOK_SECRET`) | Optional: forwards each inquiry | The env files and hPanel |
| Your admin account | The run creates no permanent users | `pnpm -s hola:setup-url` (locally) or `pnpm -s hola:setup-url --env=hostinger` |

**Deployment:** follow `kit/docs/07-DEPLOY-HOSTINGER.md`: create the database, allow Remote MySQL, write `.env.hostinger.local`, run `pnpm -s migrate --env=hostinger`, `pnpm -s hola:seed --env=hostinger` and `pnpm -s hola:deploy-check --env=hostinger`, then create the Node.js app from GitHub. I checked the guide against the code: every env name, script and build setting matches, so the guide needed no changes.

**Still open after deployment:**

- Turnstile.
- GTM, GA4, Google Ads and Meta.
- SMTP DNS records (SPF, DKIM and DMARC for the `noreply@` mailbox).
- Admin 2FA (not built; passwords plus the login rate limit only).
- Database backups (hPanel).
- 301 redirects from any old site URLs.
- Run `pnpm -s hola:retention --env=hostinger` from time to time.
- Before launch: `HOLA_DEV_MODE=0`, `HOLA_COMING_SOON=0`, real content, delete the samples, add the legal texts, then **redeploy** from hPanel.

## Draft copy to review

All of this was carried over unchanged from v2 and is now edited in the admin:

- **Home hero H1:** "Tu viaje a Egipto, planificado con gente de aquí" / "Your Egypt trip, planned with people who live here", plus the lead sentence (Admin › Ajustes › Inicio).
- **Home sections:** Why Hola Egipto (3 columns, marked "Texto provisional") and the intros of the destinations, tours, cruises, excursions, guides and CTA sections.
- **Booking band text:** adapted from the mockup.
- **About:** the "Cómo trabajamos" / "How we work" steps (marked as a draft) and the team block titles. Names are "Nombre pendiente".
- **FAQ page answers:** 4 groups × 3 questions, no guarantees, and owner facts marked `[pendiente]`.
- **Term and archive copy:** the landing copy for every term (H1, intro, SEO text, 2 FAQs), plus the intros, SEO texts and FAQs of the 5 archives.
- **Sample content:** trips, destinations and guides are drafted samples. Changeable facts are marked `[verificar]` / `[verify]` and have not been fact-checked against current sources.

## Deviations from the spec

| What | Why | Commit |
| --- | --- | --- |
| `last_reviewed` (trips) and `last_updated` (guides, pages) are shared dates, not localized | Contracts §4 says dates are shared. v2 had them per language. | `c9b59a7` |
| Cruise `cabins`/`start_dates` and excursion `start_times` are stored per language | Their notes and labels are words, so each language keeps its own list. | `c9b59a7` |
| Pages have an added localized `sections` field | It holds the About page blocks (story, team, steps, licence). Home texts live in `site-settings.home` as contracts §4 says. | `c9b59a7` |
| An added `/api/hola/me` route | It shows owner-only `[pendiente]` markers to signed-in staff. The v2 route `/api/users/me` had to become a 404. | `26c09c1` |
| The inquiry rate limit is counted in the database | Hostinger stops idle processes, which would reset an in-memory counter. | `26c09c1` |
| Cruise start dates show the stored date | v2 displayed them one day early because of a Payload timezone shift. | `26c09c1` |
| One guide's reading time is 5 min instead of 4 | v2 undercounted words because it glued paragraphs together. Tip boxes are still not counted, as in v2. | `184f882` |
| The interceptor builds its redirects from `SITE_URL` | Next rejects a relative `Location` from the interceptor, and contracts §19 forbids the request host. | `0a9af04` |
| `next start` prints the "standalone" warning | `output: 'standalone'` is required for Hostinger, and contracts §19 says this warning is fine. | `2b74a89` |

## Manual checks (from `kit/docs/05-ACCEPTANCE.md`)

| Check | Result | Notes |
| --- | --- | --- |
| Build without a database | Pass | `DATABASE_URL=mysql://x:x@127.0.0.1:1/x pnpm build -> exit 0`, run after the last code commit (also in M3 and M9). |
| Admin by hand (M8) | Pass | Browser automation (Playwright with the system Chrome) on all 12 entities: create in ES and EN, open both public URLs (200, right H1), edit, check the site, delete, then the URL gives 404. Also tested: validation messages, image, destination and trip pickers, list rows, Markdown preview, duplicate, settings, navigation, image alt text and scan, inquiry status and CSV export, adding/resetting/deleting a user, the editor role being refused, and changing your own password. All test data was removed. |
| Login, rate limit, setup | Pass | 5 wrong passwords lock the account (the right one is refused too). The cookie is HttpOnly, Lax, `Path=/`, 7 days. `/admin/setup` without the key gives 404. A session for a deleted user is refused. |
| Site unchanged vs v2 | Pass | All 104 URLs were compared with the v2 baseline in `kit/logs/v2-pages/`. See "What changed from v2". |
| Admin layout | Pass | Checked at 1280 px and 375 px: no horizontal scroll. |
| Visuals of the public site at 375 / 768 / 1280 / 1440 | Not re-done | The templates and CSS are unchanged from v2 (see the v2 notes in git history). Please look at 768 and 1440. |
| Keyboard pass, form without JS, language switcher, filters | Unchanged from v2 | The components are unchanged. The no-JS form path is covered by A8 (303 to the thank-you page). |
| Accessibility (axe) | Not re-run | v2 had 0 violations on 6 pages, and the public markup is unchanged. The admin was not audited with axe; please run it on the admin forms. |
| Draft copy listed | Done | See "Draft copy to review". |

## Acceptance results

`ACCEPTANCE SUMMARY: pass=162 fail=0 warn=1 blocked=9`

This was run after the last code commit, against the production build (`pnpm build`, then `pnpm start`). The full output is in `kit/reports/last-run.txt` and `kit/reports/acceptance-latest.md`.

| Check | Result |
| --- | --- |
| A0 environment | 13 PASS |
| A1 structure, Payload removed, MariaDB-safe SQL | 22 PASS |
| A2 lint and typecheck | 2 PASS |
| A3 model in the live database | 17 PASS |
| A4 locales, slash redirect, 404 | 5 PASS |
| A5 coming-soon page, admin redirect, pass-throughs | 19 PASS |
| A6 preview link and admin session | 6 PASS |
| A7 104 URLs, filtered archive, robots, sitemap | 7 PASS |
| A8 inquiry API and mail log | 9 PASS |
| A9 thank-you `generate_lead` | 4 PASS |
| A10 revalidation and WhatsApp | 6 PASS |
| A11 sample set | 8 PASS |
| A12 security | 24 PASS |
| A13 performance | 9 PASS |
| A14 server log | 1 WARN |
| A15 git and env files | 6 PASS |
| A16 owner inputs | 9 BLOCKED (see "Needs you") |
| A17 Hostinger readiness | 5 PASS |

**The WARN (A14):** `kit/logs/server.log` has 4 error lines from earlier in this run, and none appeared after the final server start. They come from two bugs I found and fixed while testing:

- Lines 86 and 93 (`TypeError: Invalid URL`): the M7 interceptor used a relative redirect. Fixed in M7 by building the URL from `SITE_URL`.
- Lines 114 and 146 (`Column 'price_basis' cannot be null`): the first M8 admin save of a tour. Fixed in M8: NOT NULL columns get their default value, and failed saves return a message.

The task says to append to the log, so it was not truncated.

## Script changes

None. `kit/bin/acceptance.py` and `kit/bin/acceptance.sh` are unchanged.

## Rollback

- **Code:** `git log --oneline`, then `git revert <hash>`.
- **Back to v2:** `git checkout v2-payload` (Payload + Postgres). The old Postgres database was left untouched.
- **Samples:** `pnpm hola:samples delete` removes all sample rows.
- **Database reset (local only):** drop the tables of the `hola_egipto` database (not the database itself), then run `pnpm -s migrate && pnpm -s hola:seed`.

## Suggested next runs

- "Replace the sample trips, destinations and guides with the content in kit/content/ through the data layer, keep the samples flagged until I approve, and run the acceptance script."
- "Add TOTP two-factor authentication to the /admin login (contracts §18 style), with recovery codes, and test it with Playwright."
- "Run axe-core on every admin screen and on the public templates at 375/768/1280/1440 px, fix every violation, and record the results in the report."
- "Prepare the launch: set HOLA_DEV_MODE=0 behaviour checks, Turnstile on both forms, and a pre-launch checklist script (`pnpm hola:launch-check`)."
