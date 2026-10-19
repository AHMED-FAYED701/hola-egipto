# Hola Egipto — kit v3 (Next.js + MySQL + custom admin, for Hostinger)

This kit moves the existing site from Payload CMS + Postgres to Drizzle ORM + MySQL with its own admin, so it runs on the client's Hostinger Business plan.

```
~/hola-egipto/                 ← repository root = the app
├── .env.local                 ← local secrets (you add DATABASE_URL for MariaDB)
├── CLAUDE.md                  ← copied from kit/CLAUDE.md by the install command
└── kit/
    ├── START-HERE.md          goal, stack, rules (highest authority)
    ├── GOAL.txt               the one /goal command to paste
    ├── docs/02-BUILD-PLAN.md  steps M0–M10
    ├── docs/03-CONTRACTS.md   exact names (tables, routes, scripts, admin, Hostinger rules)
    ├── docs/05-ACCEPTANCE.md  definition of done
    ├── docs/07-DEPLOY-HOSTINGER.md   what you do after the run
    └── bin/acceptance.sh      the checks
```

## Before the run (local MariaDB)

```bash
sudo apt install -y mariadb-server
sudo service mariadb start
sudo service postgresql start          # the v2 site is still on Postgres until the run moves it
sudo mariadb -e "CREATE DATABASE hola_egipto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
read -rs -p "New MariaDB password for user hola: " P; echo
sudo mariadb -e "CREATE USER IF NOT EXISTS 'hola'@'localhost' IDENTIFIED BY '$P'; GRANT ALL PRIVILEGES ON hola_egipto.* TO 'hola'@'localhost'; FLUSH PRIVILEGES;"
cd ~/hola-egipto
printf 'DATABASE_URL=mysql://hola:%s@127.0.0.1:3306/hola_egipto\n' "$P" >> .env.local; unset P
```

Use letters and digits only in that password.

## Run it

```bash
cd ~/hola-egipto
claude --permission-mode auto
```

Paste the full contents of `kit/GOAL.txt` as your first message and leave it running. If it stops, run `claude --continue --permission-mode auto`.

## After the run

Read `kit/BUILD-REPORT.md`, check the site and the admin locally, then follow `kit/docs/07-DEPLOY-HOSTINGER.md`.
