# BUILD-REPORT — Hola Egipto

*Write this file as `kit/BUILD-REPORT.md` at the end of the run. Keep it factual and short; the owner reads it first. Never include passwords, keys, the preview key or `.env.local` values.*

## Summary

Three to five sentences:

- what was built
- the final acceptance line, quoted exactly
- the one thing the owner should look at first

## How to review

- **Start the site:** `sudo service mariadb start`, then `pnpm build && pnpm start` (or `pnpm dev`) in `~/hola-egipto`.
- **Preview link:** run `pnpm -s hola:preview-url` and open the link it prints. It shows the real site in that browser for 30 days.
- **Admin:** run `pnpm -s hola:setup-url`, open the link once to create your admin account, then log in at `/admin`.
- **Pages to start with:** Home ES/EN, one tour, the tours archive, one destination, one guide, Plan my trip.
- **Samples:** every trip, destination, guide and image is a flagged sample. Remove them all with `pnpm hola:samples delete`.

## Environment

| Item | Value |
| --- | --- |
| Node / pnpm | |
| Next.js / React / next-intl / drizzle-orm / mysql2 | |
| MySQL / MariaDB (`SELECT VERSION()`) | |

## What was built (by spec section)

| Spec section | Status (Done / Partial / Not done) | Notes |
| --- | --- | --- |
| Sitemap and URLs | | |
| Navigation | | |
| Content model | | |
| Templates | | |
| Multilingual | | |
| Forms, WhatsApp, lead flow | | |
| SEO and structured data | | |
| Analytics and consent | | |
| Performance, accessibility, security | | |

## Needs you

One row per BLOCKED check or missing input, with exactly where to set it:

| Input | Why it matters | Where to set it |
| --- | --- | --- |
| WhatsApp Business number | Every WhatsApp button is hidden until it is set | Admin › Ajustes › Site settings › `whatsapp_number` |
| … | | |

Then point to `kit/docs/07-DEPLOY-HOSTINGER.md` for the deployment steps, and list what is still open after deployment (Turnstile, GTM/GA4/Ads/Meta, SMTP DNS records, admin 2FA, backups, 301 redirects, retention).

## Draft copy to review

Every piece of copy written as a draft (hero H1, Why Hola Egipto, About steps, FAQ answers, term intros).

## Deviations from the spec

What differs and why, with the commit hash.

## Manual checks (from `kit/docs/05-ACCEPTANCE.md`)

| Check | Result | Notes |
| --- | --- | --- |

## Acceptance results

The final `ACCEPTANCE SUMMARY` line and the table from `kit/reports/acceptance-latest.md`. Every WARN with its reason.

## Script changes

Any bug fixed in `kit/bin/acceptance.py` / `acceptance.sh`: what changed and why. If none, write "None".

## Rollback

- **Code:** `git log --oneline`, then `git revert <hash>`.
- **Back to v2:** `git checkout v2-payload` (Payload + Postgres) — the old Postgres database was left untouched.
- **Samples:** `pnpm hola:samples delete` removes all sample rows.

## Suggested next runs

Two to four short, ready-to-paste prompts for follow-up Claude Code runs, e.g. "Apply the review comments in kit/REVIEW.md", "Replace the samples with the content in kit/content/".
