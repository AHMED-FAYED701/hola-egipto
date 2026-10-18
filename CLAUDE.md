# Hola Egipto — project instructions for Claude Code

This repository is the Hola Egipto website: a Next.js + Payload CMS app at the root, and its build kit in `kit/`. The owner (Fayed) has authorized Claude Code to build the whole site here, locally, in one run. **Read `kit/START-HERE.md` before doing anything.**

## Authorized

- Creating and editing any file in this repository (except the protected files below).
- Installing npm packages with pnpm for this app.
- Creating, migrating and seeding the schema of the database in `DATABASE_URI` (`.env.local`), through Payload.
- Appending missing keys to `.env.local` (contracts §2) without printing it.
- Running `pnpm dev`, `pnpm build`, `pnpm start` locally, and `kit/bin/acceptance.sh`.
- A local git repository: commits only, no remote, no push.

## Never

- Print, `cat`, echo, copy or commit `.env.local` or any secret value; never rewrite `DATABASE_URI`.
- Touch files outside this repository, other databases, system services or global config; never use `sudo`.
- Drop or recreate the database itself.
- Copy `kit/docs/`, `kit/reference/`, `kit/START-HERE.md` or this file into `public/` or any route.
- Send email to anyone except `ADMIN_EMAIL` (dev mail redirect).
- Create permanent user accounts, buy anything, create external accounts or API keys.
- Download stock photos or any image from the web.
- Invent ratings, reviews, testimonials, prices of third parties, company details, licence numbers or legal text.
- Weaken, skip or delete an acceptance check to make it pass.
- Stop to ask questions mid-run: use the spec default, log it in `kit/BUILD-LOG.md`, continue.

## Conventions

- One commit per build-plan step: `S<n>: <step name>`. Append to `kit/BUILD-LOG.md` after every step.
- Spanish is the default language (no URL prefix); English lives under `/en/`. Code comments and commit messages in English.
- Exact names come from `kit/docs/03-CONTRACTS.md`; the acceptance script depends on them.
