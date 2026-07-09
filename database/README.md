# ibo.garden database

MariaDB schema for ibo.garden. **Canonical source of truth:** `database/schema.sql` + `database/seeds.sql`.

## Setup (fresh database)

1. Create a MariaDB database and user in cPanel (or local).
2. Add credentials to `.env`:

```env
DATABASE_URL=mysql://USER:PASSWORD@127.0.0.1:5522/DATABASE_NAME
```

3. Import schema, then seeds (order matters):

```bash
mysql -u USER -p DATABASE_NAME < database/schema.sql
mysql -u USER -p DATABASE_NAME < database/seeds.sql
```

Or use the npm script (requires `DB_USER` and `DB_NAME` env vars):

```bash
npm run db:schema
```

That is the **only** database bootstrap needed for a new environment. There are no separate migration scripts to run.

## Files

| File | Purpose |
|---|---|
| `schema.sql` | Full table definitions — **update on every model change** |
| `seeds.sql` | Taxonomy, reflection categories, impact projects — idempotent seed data |
| `../src/server/db/schema/` | Drizzle ORM mirror of `schema.sql` |
| `migrations/` | Reserved for optional drizzle-kit output; not used for deploy |

## Changing the model

1. Edit `database/schema.sql` first (tables, columns, indexes, FKs).
2. Mirror changes in `src/server/db/schema/*.ts`.
3. Add or update reference rows in `database/seeds.sql` (taxonomy terms, impact projects, etc.).

For an **already-live** production database, apply the equivalent `ALTER TABLE` / `INSERT` statements manually or via cPanel phpMyAdmin — do not re-run full `schema.sql` on production (tables already exist).

See `.cursor/rules/database-schema.mdc` for agent instructions.
