# Namecheap data API

Cloudflare Worker cannot reach Namecheap MySQL. When `ADMIN_DATA_API_*` is set, **all** database calls in production go through this PHP bridge.

Upload `index.php` + `.htaccess` to cPanel subdomain `a.ibo.garden`.

1. cPanel → **Subdomains** → create `a` → note docroot path.
2. Upload both files. Edit the top of `index.php` with your MySQL credentials and a secret.
3. Cloudflare DNS → **A** record `a` → Namecheap server IP → **DNS only** (grey cloud).
4. Cloudflare → Workers & Pages → **ibogarden** → Settings → Variables:
   - `ADMIN_DATA_API_URL` = `https://a.ibo.garden/index.php`
   - `ADMIN_DATA_API_SECRET` = same secret as in `index.php` (encrypt)
5. `npm run deploy`

Test:

```bash
curl -sS -X POST "https://a.ibo.garden/index.php" \
  -H "content-type: application/json" \
  -H "x-admin-secret: YOUR_SECRET" \
  -d '{"action":"admin.health"}'
```
