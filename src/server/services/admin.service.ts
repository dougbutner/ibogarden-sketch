import { getServerConfig } from "@/lib/config.server";
import { getDb } from "@/server/db/client";
import { safeEqual } from "@/server/lib/crypto";
import { sql } from "drizzle-orm";

export function isAdminDevWallet(address: string): boolean {
  const { adminDevWallet } = getServerConfig();
  if (!adminDevWallet) return false;
  return safeEqual(address.trim(), adminDevWallet.trim());
}

export function formatDatabaseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }
  return "Unknown database error";
}

export async function checkDatabaseHealth() {
  const db = await getDb();
  const [row] = await db.execute<{ ok: number; taxonomyTerms: number }>(
    sql`SELECT 1 AS ok, (SELECT COUNT(*) FROM taxonomy_terms) AS taxonomyTerms`,
  );
  const result = Array.isArray(row) ? row[0] : row;
  return {
    ok: true as const,
    taxonomyTerms: Number(result?.taxonomyTerms ?? 0),
  };
}
