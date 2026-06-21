import { desc, eq, isNull } from "drizzle-orm";

import { getDb } from "@/server/db/client";
import { communityMessages } from "@/server/db/schema/community";
import { userAccounts } from "@/server/db/schema/users";
import { trackEvent } from "@/server/services/journey.service";

export async function listCommunityMessages(limit = 50) {
  const db = await getDb();

  const rows = await db
    .select({
      id: communityMessages.id,
      body: communityMessages.body,
      createdAt: communityMessages.createdAt,
      userAccountId: communityMessages.userAccountId,
      displayName: userAccounts.displayName,
      email: userAccounts.email,
    })
    .from(communityMessages)
    .innerJoin(userAccounts, eq(communityMessages.userAccountId, userAccounts.id))
    .where(isNull(communityMessages.deletedAt))
    .orderBy(desc(communityMessages.createdAt))
    .limit(limit);

  return rows.reverse();
}

export async function postCommunityMessage(userAccountId: number, body: string) {
  const db = await getDb();
  const trimmed = body.trim();
  if (!trimmed) throw new Error("Message is required");

  const [user] = await db.select().from(userAccounts).where(eq(userAccounts.id, userAccountId)).limit(1);
  if (!user || user.holderStatus !== "active") {
    throw new Error("Holder access required");
  }

  const [result] = await db.insert(communityMessages).values({
    userAccountId,
    body: trimmed,
  });

  await trackEvent({
    userAccountId,
    eventType: "community_message",
    eventCategory: "community",
    entityType: "community_message",
    entityId: Number(result.insertId),
  });

  return { id: Number(result.insertId) };
}

export function messageAuthorLabel(row: {
  displayName: string | null;
  email: string | null;
  userAccountId: number;
}) {
  if (row.displayName?.trim()) return row.displayName.trim();
  if (row.email?.trim()) return row.email.split("@")[0] ?? row.email;
  return `Holder ${row.userAccountId}`;
}
