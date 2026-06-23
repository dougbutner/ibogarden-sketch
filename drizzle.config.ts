import { defineConfig } from "drizzle-kit";

import { resolveDatabaseUrl } from "./src/lib/config.server";

const databaseUrl = resolveDatabaseUrl();
if (!databaseUrl) {
  throw new Error("Database URL is not configured. Set DATABASE_URL in .env.");
}

export default defineConfig({
  schema: "./src/server/db/schema/index.ts",
  out: "./database/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: databaseUrl,
  },
});
