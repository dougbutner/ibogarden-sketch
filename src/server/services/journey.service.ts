import { eq, sql, desc } from "drizzle-orm";

import { getDb } from "@/server/db/client";
import { userEvents, userJourneyStats, walletProfiles, userAccounts } from "@/server/db/schema/users";

export type TrackEventInput = {
  userAccountId?: number | null;
  anonymousSessionId?: string | null;
  sessionId?: string | null;
  eventType: string;
  eventCategory: string;
  path?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  refCode?: string;
  entityType?: string;
  entityId?: number;
  metadata?: Record<string, unknown>;
  walletAddress?: string;
  gaineBalanceSnapshot?: number;
};

export async function trackEvent(input: TrackEventInput) {
  const db = getDb();

  await db.insert(userEvents).values({
    userAccountId: input.userAccountId ?? null,
    anonymousSessionId: input.anonymousSessionId ?? null,
    sessionId: input.sessionId ?? null,
    eventType: input.eventType,
    eventCategory: input.eventCategory,
    path: input.path ?? null,
    referrer: input.referrer ?? null,
    utmSource: input.utmSource ?? null,
    utmMedium: input.utmMedium ?? null,
    utmCampaign: input.utmCampaign ?? null,
    refCode: input.refCode ?? null,
    entityType: input.entityType ?? null,
    entityId: input.entityId ?? null,
    metadata: input.metadata ?? null,
    walletAddress: input.walletAddress ?? null,
    gaineBalanceSnapshot: input.gaineBalanceSnapshot != null ? String(input.gaineBalanceSnapshot) : null,
  });

  if (input.userAccountId) {
    await refreshJourneyStats(input.userAccountId, input);
  }
}

async function refreshJourneyStats(userAccountId: number, input: TrackEventInput) {
  const db = getDb();
  const now = new Date();

  const [existing] = await db
    .select()
    .from(userJourneyStats)
    .where(eq(userJourneyStats.userAccountId, userAccountId))
    .limit(1);

  if (!existing) {
    await db.insert(userJourneyStats).values({
      userAccountId,
      firstSeenAt: now,
      lastEventAt: now,
      totalPageViews: input.eventType === "page_view" ? 1 : 0,
      learnArticlesRead: input.eventType === "article_click" ? 1 : 0,
      listingsViewed: input.eventType === "listing_view" ? 1 : 0,
      listingsInquired: input.eventType === "listing_inquiry" ? 1 : 0,
      shareActions: input.eventType === "share_copy" ? 1 : 0,
      gaineCurrentBalance:
        input.gaineBalanceSnapshot != null ? String(input.gaineBalanceSnapshot) : null,
      journeyStage: "registered",
    });
    return;
  }

  await db
    .update(userJourneyStats)
    .set({
      lastEventAt: now,
      totalPageViews:
        input.eventType === "page_view" ? existing.totalPageViews + 1 : existing.totalPageViews,
      learnArticlesRead:
        input.eventType === "article_click"
          ? existing.learnArticlesRead + 1
          : existing.learnArticlesRead,
      listingsViewed:
        input.eventType === "listing_view" ? existing.listingsViewed + 1 : existing.listingsViewed,
      listingsInquired:
        input.eventType === "listing_inquiry"
          ? existing.listingsInquired + 1
          : existing.listingsInquired,
      shareActions:
        input.eventType === "share_copy" ? existing.shareActions + 1 : existing.shareActions,
      gaineCurrentBalance:
        input.gaineBalanceSnapshot != null
          ? String(input.gaineBalanceSnapshot)
          : existing.gaineCurrentBalance,
    })
    .where(eq(userJourneyStats.userAccountId, userAccountId));
}

export async function listVerifiedHolders(limit = 100) {
  const db = getDb();
  return db
    .select({
      address: walletProfiles.address,
      email: userAccounts.email,
      displayName: userAccounts.displayName,
      firstGaineBalance: walletProfiles.firstGaineBalance,
      lastGaineBalance: walletProfiles.lastGaineBalance,
      firstVerifiedAt: walletProfiles.firstVerifiedAt,
      lastVerifiedAt: walletProfiles.lastVerifiedAt,
      holderStatus: userAccounts.holderStatus,
    })
    .from(walletProfiles)
    .leftJoin(userAccounts, eq(walletProfiles.userAccountId, userAccounts.id))
    .where(sql`CAST(${walletProfiles.lastGaineBalance} AS DECIMAL(24,8)) > 0`)
    .orderBy(desc(walletProfiles.lastVerifiedAt))
    .limit(limit);
}
