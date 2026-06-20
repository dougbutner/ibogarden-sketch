import { getServerConfig } from "@/lib/config.server";
import { getDb } from "@/server/db/client";
import { safeEqual } from "@/server/lib/crypto";
import { sql } from "drizzle-orm";

export function verifyAdminCredentials(email: string, password: string): boolean {
  const { adminEmail, adminPassword } = getServerConfig();
  if (!adminPassword) return false;
  return safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase()) && safeEqual(password, adminPassword);
}

export async function checkDatabaseHealth() {
  const db = getDb();
  const [row] = await db.execute<{ ok: number; taxonomyTerms: number }>(
    sql`SELECT 1 AS ok, (SELECT COUNT(*) FROM taxonomy_terms) AS taxonomyTerms`,
  );
  const result = Array.isArray(row) ? row[0] : row;
  return {
    ok: true as const,
    taxonomyTerms: Number(result?.taxonomyTerms ?? 0),
  };
}
