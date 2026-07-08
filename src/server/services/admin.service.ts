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
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string" && error.trim()) {
    message = error.trim();
  } else {
    message = "Unknown database error";
  }

  if (
    message.includes("proxy request failed") &&
    message.includes("cannot connect to the specified address")
  ) {
    message +=
      "\n\nCloudflare Workers cannot reach localhost (127.0.0.1) or private IPs. " +
      "Local dev uses an SSH tunnel on port 5522; production needs your cPanel MySQL hostname " +
      "via Cloudflare Hyperdrive.";
  }

  return message;
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
