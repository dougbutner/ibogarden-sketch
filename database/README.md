# ibo.garden database

MariaDB schema for ibo.garden. **Canonical source of truth:** `database/schema.sql` (tables + reference data).

## Setup (fresh database)

1. Create a MariaDB database and user in cPanel (or local).
2. Add credentials to `.env`:

```env
DATABASE_URL=mysql://USER:PASSWORD@127.0.0.1:5522/DATABASE_NAME
```

3. Import the single file:

```bash
mysql -u USER -p DATABASE_NAME < database/schema.sql
```

Or:

```bash
npm run db:schema
```

That is the **only** database bootstrap needed for a new environment.

## Files

| File | Purpose |
|---|---|
| `schema.sql` | Full table definitions **and** taxonomy / impact-project seeds |
| `../src/server/db/schema/` | Drizzle ORM mirror of the tables in `schema.sql` |
| `migrations/` | Unused; do not add numbered upgrade scripts |

## Changing the model

1. Edit `database/schema.sql` first (tables, columns, indexes, FKs, and seed rows).
2. Mirror table changes in `src/server/db/schema/*.ts`.

For an **already-live** production database, do **not** re-run the full `CREATE TABLE` section. Compare phpMyAdmin structure to this file and apply only missing `ALTER TABLE` / `INSERT` pieces. The seed `INSERT`s at the bottom of `schema.sql` are idempotent (`ON DUPLICATE KEY UPDATE`) and are safe to re-run on live.

See `.cursor/rules/database-schema.mdc` for agent instructions.
