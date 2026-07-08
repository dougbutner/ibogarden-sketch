# Namecheap Data API

Internal PHP bridge so Cloudflare Workers can read/write MariaDB on Namecheap shared hosting (localhost-only MySQL).

**Currently wired:** admin dashboard only (`/admin`).

## Files to upload

Upload everything in this folder to your subdomain docroot:

- `index.php`
- `.htaccess`
- `config.php` (create from `config.example.php` on the server — do not commit)

---

## Namecheap setup (step by step)

### 1. Create subdomain in cPanel

1. Log in to cPanel (`premium30.web-hosting.com:2083`).
2. Open **Domains → Subdomains** (or **Subdomains**).
3. Create e.g. `data` → `data.yourdomain.com`.
4. Note the document root (often `public_html/data` or similar).

### 2. Upload API files

Using **File Manager** or FTP, upload to that docroot:

```
index.php
.htaccess
config.example.php
```

Then in File Manager:

1. Copy `config.example.php` → `config.php`
2. Edit `config.php`:

```php
const DB_HOST = "127.0.0.1";
const DB_PORT = 3306;
const DB_NAME = "bambigth_ibogarden";   // your DB name from phpMyAdmin
const DB_USER = "bambigth_ibo";         // your DB user
const DB_PASSWORD = "...";              // your DB password
const ADMIN_DATA_API_SECRET = "...";    // see step 3
```

Use **127.0.0.1:3306** on the server (not 5522 — that port is only for SSH tunnel on your Mac).

### 3. Generate shared secret

On your computer:

```bash
openssl rand -hex 32
```

Put the same value in:

- `config.php` → `ADMIN_DATA_API_SECRET`
- Cloudflare Worker secret → `ADMIN_DATA_API_SECRET`

### 4. Point DNS to Namecheap

If your domain DNS is on Cloudflare:

1. Cloudflare → **DNS** → **Add record**
2. Type: **A**
3. Name: `data` (for `data.yourdomain.com`)
4. Target: your Namecheap server IP (from hosting welcome email or cPanel **Server Information**)
5. Proxy status: **DNS only** (grey cloud) is fine

Wait a few minutes for DNS + AutoSSL (HTTPS).

### 5. Test the PHP API

```bash
curl -sS -X POST "https://data.yourdomain.com/index.php" \
  -H "content-type: application/json" \
  -H "x-admin-secret: YOUR_SECRET" \
  -d '{"action":"admin.health"}'
```

Expected:

```json
{"ok":true,"data":{"connected":true,"taxonomyTerms":42}}
```

If you get `401 Unauthorized`, the secret does not match.  
If you get `DB connect failed`, check `config.php` credentials against cPanel → **MySQL Databases**.

### 6. Configure Cloudflare Worker

From project root:

```bash
npx wrangler secret put ADMIN_DATA_API_SECRET
# paste the same secret from config.php

npx wrangler secret put ADMIN_DATA_API_URL
# paste: https://data.yourdomain.com/index.php
```

Or in Cloudflare dashboard: **Workers & Pages → ibogarden → Settings → Variables**.

Then redeploy:

```bash
npm run deploy
```

### 7. Verify admin dashboard

1. Open `https://yourdomain.com/admin`
2. Connect admin wallet
3. You should see **Database connected · N taxonomy terms**

---

## Local dev

Leave `ADMIN_DATA_API_URL` and `ADMIN_DATA_API_SECRET` empty in `.env`.  
Admin uses your SSH tunnel (`127.0.0.1:5522`) via `DATABASE_URL` as before.

---

## Security

- `config.php` is blocked from direct download via `.htaccess`
- Never commit `config.php`
- Use a long random secret (32+ bytes)
- Keep the subdomain URL private

---

## Adding more actions later

Add a new `case` in `index.php`, then call it from the app via `callRemoteAdminDataApi("your.action", { ... })`.

Current actions:

| Action | Purpose |
|--------|---------|
| `admin.health` | DB ping + taxonomy count |
| `admin.waitlist` | List waitlist |
| `admin.holders` | List verified holders |
| `admin.applications` | List network applications |
| `admin.deleteApplication` | Delete application by id |
| `admin.reflections` | List reflection preferences |
