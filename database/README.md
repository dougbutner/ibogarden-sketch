# ibo.garden database

MariaDB schema for ibo.garden. **Canonical source of truth:** `database/schema.sql`.

## Setup (cPanel)

1. Create a MariaDB database and user in cPanel.
2. Add credentials to `.env`:

```env
DATABASE_URL=mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME
```

3. Import schema and seeds:

```bash
mysql -u USER -p DATABASE_NAME < database/schema.sql
mysql -u USER -p DATABASE_NAME < database/seeds.sql
```

## Files

| File | Purpose |
|---|---|
| `schema.sql` | Full table definitions — **update on every model change** |
| `seeds.sql` | Taxonomy seed data (idempotent `ON DUPLICATE KEY`) |
| `../src/server/db/schema/` | Drizzle ORM mirror of `schema.sql` |

## Apply order

Always run `schema.sql` before `seeds.sql` on a fresh database.

## Changing the model

1. Edit `database/schema.sql` first.
2. Mirror changes in `src/server/db/schema/*.ts`.
3. For production DBs already live, add a numbered migration in `database/migrations/` (e.g. `0002_add_foo.sql`) instead of re-running full schema.

See `.cursor/rules/database-schema.mdc` for agent instructions.
