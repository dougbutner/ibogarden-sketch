import mysql from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";

import { getServerConfig } from "@/lib/config.server";
import * as schema from "./schema";

type Db = MySql2Database<typeof schema>;

let pool: mysql.Pool | null = null;
let pooledDb: Db | null = null;

function isWorkerRuntime(): boolean {
  return typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
}

export async function getDb(): Promise<Db> {
  const { databaseUrl, databasePoolSize } = getServerConfig();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  // Cloudflare Workers: TCP per request (no global pool). Local Node keeps a pool.
  if (isWorkerRuntime()) {
    const connection = await mysql.createConnection({
      uri: databaseUrl,
      disableEval: true,
    });
    return drizzle(connection, { schema, mode: "default" });
  }

  if (!pool) {
    pool = mysql.createPool({
      uri: databaseUrl,
      connectionLimit: databasePoolSize,
      waitForConnections: true,
    });
    pooledDb = drizzle(pool, { schema, mode: "default" });
  }
  return pooledDb;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    pooledDb = null;
  }
}

export { schema };
