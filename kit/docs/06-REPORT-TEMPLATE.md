# BUILD-REPORT — Hola Egipto

*Write this file as `kit/BUILD-REPORT.md` at the end of the run. Keep it factual and short; the owner reads it first. Never include passwords, keys, the preview key or `.env.local` values.*

## Summary

Three to five sentences:

- what was built
- the final acceptance line, quoted exactly
- the one thing the owner should look at first

## How to review

- **Start the site:** `sudo service postgresql start`, then `pnpm build && pnpm start` (or `pnpm dev`) in `~/hola-egipto`.
- **Preview link:** run `pnpm -s hola:preview-url` and open the link it prints. It shows the real site in that browser for 30 days.
- **Admin:** open `/admin`; the first visit asks you to create your admin account.
- **Pages to start with:** Home ES/EN, one tour, the tours archive, one destination, one guide, Plan my trip.
- **Samples:** every trip, destination, guide and image is a flagged sample. Remove them all with `pnpm hola:samples delete`.

## Environment

| Item | Value |
| --- | --- |
| Node / pnpm | |
| Next.js / Payload / React / next-intl | |
| Postgres | |

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

Also list the deployment items that are out of scope for this run (hosting, domain, HTTPS/HSTS, SMTP DNS records, Cloudflare/Turnstile, GTM/GA4/Ads/Meta, 2FA for admins, backups, 301 redirects, the retention schedule).

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
- **Database:** `pnpm payload migrate:down` steps back one migration; `pnpm hola:samples delete` removes all samples.

## Suggested next runs

Two to four short, ready-to-paste prompts for follow-up Claude Code runs, e.g. "Apply the review comments in kit/REVIEW.md", "Replace the samples with the content in kit/content/".
