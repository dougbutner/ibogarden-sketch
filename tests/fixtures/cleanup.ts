import { eq, or } from "drizzle-orm";

import { getDb } from "@/server/db/client";
import { communityMemberships } from "@/server/db/schema/community";
import { communityWaitlist, userAccounts, userEvents, userJourneyStats, walletProfiles } from "@/server/db/schema/users";

export async function cleanupTestHolder(address: string, email: string) {
  const db = getDb();

  const [wallet] = await db.select().from(walletProfiles).where(eq(walletProfiles.address, address)).limit(1);
  const [user] = await db.select().from(userAccounts).where(eq(userAccounts.email, email)).limit(1);
  const userId = wallet?.userAccountId ?? user?.id;

  if (userId) {
    await db.delete(userEvents).where(eq(userEvents.userAccountId, userId));
    await db.delete(communityMemberships).where(eq(communityMemberships.userAccountId, userId));
    await db.delete(userJourneyStats).where(eq(userJourneyStats.userAccountId, userId));
    await db.update(userAccounts).set({ primaryWalletId: null }).where(eq(userAccounts.id, userId));
    await db.delete(walletProfiles).where(eq(walletProfiles.userAccountId, userId));
    await db.delete(userAccounts).where(eq(userAccounts.id, userId));
  } else {
    await db.delete(walletProfiles).where(eq(walletProfiles.address, address));
  }

  await db
    .delete(communityWaitlist)
    .where(or(eq(communityWaitlist.email, email), eq(communityWaitlist.walletAddress, address)));
}

export async function cleanupWaitlistEmail(email: string) {
  const db = getDb();
  await db.delete(communityWaitlist).where(eq(communityWaitlist.email, email));
}
