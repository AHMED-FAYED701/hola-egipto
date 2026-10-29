# Deploy to Hostinger (owner steps, after the v3 run)

Hostinger Business plan, Node.js Web App, MySQL. Repo: `AHMED-FAYED701/hola-egipto` (private), branch `main`.

Nothing here is done by Claude Code. Never paste passwords into a chat.

## 1. Create the MySQL database (hPanel)

1. **Websites → hola-egipto.com → Databases → Management.**
2. Create a database and user. Hostinger prefixes both with your account id (e.g. `u889087686_hola` / `u889087686_hola`). Use a strong password **with letters and digits only** (no `@ : / # ?` — they break the connection URL).
3. Note: database name, user, password. Host for the app is `localhost`, port `3306`.
4. Open **phpMyAdmin** for that database → **Operations** and check the collation is `utf8mb4_unicode_ci` (change it there if not, before step 4 below).

## 2. Allow your machine (Remote MySQL)

1. **Databases → Remote MySQL.** Add your current public IP (search "what is my ip"), choose the database, **Add**.
2. Note the **hostname** shown there (e.g. `srvXXXX.hstgr.io`).
3. Your home IP can change; if a later command can't connect, update the allowed IP here.

## 3. Production env file on your machine (WSL)

```bash
cd ~/hola-egipto
cp .env.example .env.hostinger.local
chmod 600 .env.hostinger.local
nano .env.hostinger.local
```

The name matters: Next.js automatically loads `.env.production.local`, so never use that name — it would make local builds talk to the live database. `.env.hostinger.local` is ignored by Next and by git.

Fill in (values never go into git or chat):

```
DATABASE_URL=mysql://DBUSER:DBPASSWORD@srvXXXX.hstgr.io:3306/DBNAME
APP_SECRET=            # openssl rand -hex 32  (new, not the local one)
SITE_URL=https://hola-egipto.com
HOLA_COMING_SOON=1
HOLA_PREVIEW_KEY=      # openssl rand -hex 16
HOLA_DEV_MODE=1
HOLA_AUTO_MIGRATE=1
ADMIN_EMAIL=you@yourdomain
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=noreply@hola-egipto.com
SMTP_PASS=
SMTP_FROM=Hola Egipto <noreply@hola-egipto.com>
HOLA_MAIL_LOG=/tmp/hola-mail.log
```

Generate the two secrets without showing them on screen:

```bash
sed -i "s/^APP_SECRET=.*/APP_SECRET=$(openssl rand -hex 32)/; s/^HOLA_PREVIEW_KEY=.*/HOLA_PREVIEW_KEY=$(openssl rand -hex 16)/" .env.hostinger.local
```

(The `noreply@` mailbox is created in hPanel → Emails. Leave `SMTP_PASS` empty until it exists; mail is then logged but not sent.)

## 4. Create tables and seed the content (from WSL)

```bash
pnpm -s migrate --env=hostinger
pnpm -s hola:seed --env=hostinger
pnpm -s hola:deploy-check --env=hostinger
```

`deploy-check` must print `{"ok":true}`. This puts the launch data **and the sample content** in the Hostinger database so the site can be reviewed; remove samples later with `pnpm -s hola:samples delete --env=hostinger`.

## 5. Create the Node.js app (hPanel)

1. If `hola-egipto.com` already has a website in hPanel (e.g. an old WordPress), back it up and remove that website first — Hostinger requires it before the domain can be used by a Node.js app.
2. **Websites → Add website → Node.js Apps → Import Git repository**, connect GitHub, pick `AHMED-FAYED701/hola-egipto`, branch `main`.
3. Build settings: framework **Next.js**, Node **22**, package manager **pnpm**, build script **build**, output **.next**, root **/** (leave entry file empty).
4. **Environment variables:** add every line from `.env.hostinger.local` **except** change `DATABASE_URL`'s host to `localhost`:
   `mysql://DBUSER:DBPASSWORD@localhost:3306/DBNAME`
5. Deploy. When the build finishes, open `https://hola-egipto.com` — you should see the coming-soon page. Also check that a sample image (`/images/samples/…webp`) and a font (`/fonts/fraunces-latin-600-normal.woff2`) load.

## 6. First login

```bash
pnpm -s hola:preview-url --env=hostinger   # preview link for you and the client
pnpm -s hola:setup-url --env=hostinger     # one-time link to create your admin account
```

Open the setup link, create your admin user, then log in at `https://hola-egipto.com/admin`.

## Later

- **Updates:** push to `main`; Hostinger rebuilds; new migrations apply on startup (`HOLA_AUTO_MIGRATE=1`).
- **New photos:** upload them in **Admin → Images → Subir imágenes**, or with **Subir imagen** inside any image picker. Files are stored outside the app in `HOLA_UPLOAD_DIR` (`/home/u889087686/domains/hola-egipto.com/hola-uploads`), so they survive redeploys; no redeploy is needed. Large photos are reduced to 2400 px in the browser. Photos committed under `public/images/` still work with **Scan**.
- **Before launch:** Turnstile keys, `HOLA_DEV_MODE=0`, `HOLA_COMING_SOON=0`, real content, remove samples, legal texts, GTM ID. After changing variables, **redeploy** from hPanel (a restart may not pick up every change).
- **Inquiry retention:** `pnpm -s hola:retention --env=hostinger` from time to time.
