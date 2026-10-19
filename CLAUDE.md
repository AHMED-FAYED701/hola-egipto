# Hola Egipto — project instructions for Claude Code

This repository is the Hola Egipto website: a Next.js app at the root, and its build kit in `kit/`. Production runs on a Hostinger Business plan with MySQL. The owner (Fayed) has authorized Claude Code to change the code here, locally. **Read `kit/START-HERE.md` before doing anything.**

## Authorized

- Creating, editing and deleting files in this repository (except the protected files below).
- Installing and removing npm packages with pnpm for this app.
- Creating, migrating and seeding the tables of the **local** MySQL/MariaDB database in `.env.local` `DATABASE_URL`.
- Renaming/appending keys in `.env.local` as contracts §2 says, without printing it.
- Running `pnpm dev`, `pnpm build`, `pnpm start` locally, and `kit/bin/acceptance.sh`.
- Local git commits and tags.

## Never

- Print, `cat`, echo, copy or commit `.env.local`, `.env.hostinger.local` or any secret value; never rewrite `DATABASE_URL`.
- Connect to the production (Hostinger) database or run any `--env=hostinger` command.
- `git push`, change remotes, or touch GitHub. The owner pushes.
- Touch files outside this repository, other databases (including the old local Postgres), system services or global config; never use `sudo`.
- Drop or recreate a database itself.
- Copy `kit/docs/`, `kit/reference/`, `kit/START-HERE.md` or this file into `public/` or any route.
- Send email to anyone except `ADMIN_EMAIL` (dev mail redirect).
- Create permanent user accounts, buy anything, create external accounts or API keys.
- Download stock photos or any image from the web.
- Invent ratings, reviews, testimonials, company details, licence numbers or legal text.
- Weaken, skip or delete an acceptance check to make it pass.
- Stop to ask questions mid-run: use the spec default, log it in `kit/BUILD-LOG.md`, continue.

## Conventions

- One commit per build-plan step: `M<n>: <step name>`. Append to `kit/BUILD-LOG.md` after every step.
- Spanish is the default language (no URL prefix); English lives under `/en/`. Code comments and commit messages in English.
- Exact names come from `kit/docs/03-CONTRACTS.md`; the acceptance script depends on them.
