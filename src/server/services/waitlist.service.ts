import { eq, like, or, desc } from "drizzle-orm";

import { getDb } from "@/server/db/client";
import { communityWaitlist } from "@/server/db/schema/users";
import { normalizeEmail } from "@/server/lib/crypto";
import { callDataApi, remoteDb } from "@/server/services/data-api.server";

export async function joinWaitlist(email: string, source = "community_page") {
  if (remoteDb()) return callDataApi("waitlist.join", { email, source });
  const db = await getDb();
  const normalized = normalizeEmail(email);

  const [existing] = await db
    .select()
    .from(communityWaitlist)
    .where(eq(communityWaitlist.email, normalized))
    .limit(1);

  if (existing) {
    return { ok: true as const, alreadyExists: true, id: existing.id };
  }

  const [result] = await db.insert(communityWaitlist).values({ email: normalized, source });
  return { ok: true as const, alreadyExists: false, id: Number(result.insertId) };
}

export async function linkWaitlistEmail(email: string, userAccountId: number, walletAddress?: string) {
  if (remoteDb()) {
    await callDataApi("waitlist.link", { email, userAccountId, walletAddress: walletAddress ?? null });
    return;
  }
  const db = await getDb();
  const normalized = normalizeEmail(email);

  await db
    .update(communityWaitlist)
    .set({
      userAccountId,
      walletAddress: walletAddress ?? null,
      linkedAt: new Date(),
    })
    .where(eq(communityWaitlist.email, normalized));
}

export async function listWaitlist(search?: string, limit = 100) {
  if (remoteDb()) return callDataApi("admin.waitlist", { search: search?.trim() || null, limit });
  const db = await getDb();
  const term = search?.trim();

  const rows = await db
    .select()
    .from(communityWaitlist)
    .where(
      term
        ? or(like(communityWaitlist.email, `%${term}%`), like(communityWaitlist.source, `%${term}%`))
        : undefined,
    )
    .orderBy(desc(communityWaitlist.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    source: row.source,
    walletAddress: row.walletAddress,
    userAccountId: row.userAccountId,
    createdAt: row.createdAt?.toISOString() ?? null,
    linkedAt: row.linkedAt?.toISOString() ?? null,
  }));
}
