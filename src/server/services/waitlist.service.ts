import { eq, like, or, desc } from "drizzle-orm";

import { getDb } from "@/server/db/client";
import { communityWaitlist } from "@/server/db/schema/users";
import { normalizeEmail } from "@/server/lib/crypto";

export async function joinWaitlist(email: string, source = "community_page") {
  const db = getDb();
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
  const db = getDb();
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
  const db = getDb();
  const term = search?.trim();

  return db
    .select()
    .from(communityWaitlist)
    .where(
      term
        ? or(like(communityWaitlist.email, `%${term}%`), like(communityWaitlist.source, `%${term}%`))
        : undefined,
    )
    .orderBy(desc(communityWaitlist.createdAt))
    .limit(limit);
}
