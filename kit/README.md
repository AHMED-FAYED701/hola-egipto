# Hola Egipto — build kit v2 (Next.js + Payload)

Everything Claude Code needs to build the whole Hola Egipto site in one run.

```
~/hola-egipto/                 ← repository root = the app (Claude Code creates it)
├── .env.local                 ← you created it: DATABASE_URI
├── CLAUDE.md                  ← copied from kit/CLAUDE.md by the install command
└── kit/
    ├── START-HERE.md          goal, stack, overrides, hard rules (highest authority)
    ├── CLAUDE.md              rules Claude Code loads automatically
    ├── GOAL.txt               the one /goal command to paste
    ├── docs/
    │   ├── 01-SPEC.md         what the site is (the agreed spec)
    │   ├── 02-BUILD-PLAN.md   steps S0–S13
    │   ├── 03-CONTRACTS.md    exact names the checks depend on
    │   ├── 04-CONTENT-RULES.md
    │   ├── 05-ACCEPTANCE.md   definition of done
    │   └── 06-REPORT-TEMPLATE.md
    ├── bin/acceptance.sh      the acceptance checks (runs acceptance.py)
    ├── brand/                 logos, favicons, pattern, social, tokens, fonts, brand guide
    ├── reference/             optional: homepage-mockup.jpeg, original-logo.jpeg
    └── setup/env.example
```

## Before you start (every time you open WSL)

```bash
sudo service postgresql start
```

## Run it

```bash
cd ~/hola-egipto
claude --permission-mode auto
```

Paste the full contents of `kit/GOAL.txt` (it starts with `/goal`) as your first message and leave it running.

**If it stops** (usage limit, error): fix the cause, run `claude --continue --permission-mode auto` in the same folder. The goal resumes; if it doesn't, paste `kit/GOAL.txt` again. The plan, `kit/BUILD-LOG.md` and git history let it pick up where it stopped.

## When it finishes

1. Read `kit/BUILD-REPORT.md`.
2. `pnpm -s hola:preview-url` prints your private preview link. Open it.
3. Open `http://localhost:3000/admin` and create your admin account (first visit only).
