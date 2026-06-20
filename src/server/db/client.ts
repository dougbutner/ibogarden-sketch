import mysql from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";

import { getServerConfig } from "@/lib/config.server";
import * as schema from "./schema";

let pool: mysql.Pool | null = null;
let db: MySql2Database<typeof schema> | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const { databaseUrl, databasePoolSize } = getServerConfig();
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not configured");
    }
    pool = mysql.createPool({
      uri: databaseUrl,
      connectionLimit: databasePoolSize,
      waitForConnections: true,
    });
  }
  return pool;
}

export function getDb(): MySql2Database<typeof schema> {
  if (!db) {
    db = drizzle(getDbPool(), { schema, mode: "default" });
  }
  return db;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;
  }
}

export { schema };
