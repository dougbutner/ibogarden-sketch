import { eq, and } from "drizzle-orm";

import { fetchGaineBalance } from "@/lib/solana.server";
import { getDb } from "@/server/db/client";
import {
  oauthIdentities,
  userAccounts,
  userJourneyStats,
  walletProfiles,
} from "@/server/db/schema/users";
import { communityMemberships } from "@/server/db/schema/community";
import { normalizeEmail } from "@/server/lib/crypto";
import { linkWaitlistEmail } from "@/server/services/waitlist.service";
import { trackEvent } from "@/server/services/journey.service";

export type VerifyHolderInput = {
  address: string;
  email?: string;
  walletProvider?: string;
  userAccountId?: number;
};

export async function requireWalletHolder(address: string): Promise<{ userId: number }> {
  const result = await verifyHolderLogin({ address });
  if (!result.isHolder) {
    throw new Error("Holder access requires a GAINE balance.");
  }
  return { userId: result.userId };
}

export async function verifyHolderLogin(input: VerifyHolderInput) {
  const balance = await fetchGaineBalance(input.address);
  const db = await getDb();
  const now = new Date();
  const isHolder = balance > 0;

  let userId = input.userAccountId;

  if (!userId && input.email) {
    const normalized = normalizeEmail(input.email);
    const [byEmail] = await db
      .select()
      .from(userAccounts)
      .where(eq(userAccounts.email, normalized))
      .limit(1);
    if (byEmail) userId = byEmail.id;
  }

  if (!userId) {
    const [inserted] = await db.insert(userAccounts).values({
      email: input.email ? normalizeEmail(input.email) : null,
      holderStatus: isHolder ? "active" : "none",
      lastLoginAt: now,
      lastSeenAt: now,
    });
    userId = Number(inserted.insertId);
  }

  const [existingWallet] = await db
    .select()
    .from(walletProfiles)
    .where(eq(walletProfiles.address, input.address))
    .limit(1);

  if (existingWallet) {
    const peak = Math.max(
      Number(existingWallet.peakGaineBalance ?? 0),
      balance,
      Number(existingWallet.lastGaineBalance ?? 0),
    );

    await db
      .update(walletProfiles)
      .set({
        userAccountId: userId,
        walletProvider: input.walletProvider ?? existingWallet.walletProvider,
        lastGaineBalance: String(balance),
        peakGaineBalance: String(peak),
        lastVerifiedAt: isHolder ? now : existingWallet.lastVerifiedAt,
        firstGaineBalance: existingWallet.firstGaineBalance ?? (isHolder ? String(balance) : null),
        firstVerifiedAt: existingWallet.firstVerifiedAt ?? (isHolder ? now : null),
      })
      .where(eq(walletProfiles.id, existingWallet.id));
  } else {
    await db.insert(walletProfiles).values({
      address: input.address,
      userAccountId: userId,
      walletProvider: input.walletProvider ?? null,
      firstGaineBalance: isHolder ? String(balance) : null,
      peakGaineBalance: isHolder ? String(balance) : null,
      lastGaineBalance: String(balance),
      firstVerifiedAt: isHolder ? now : null,
      lastVerifiedAt: isHolder ? now : null,
    });
  }

  const [wallet] = await db
    .select()
    .from(walletProfiles)
    .where(eq(walletProfiles.address, input.address))
    .limit(1);

  await db
    .update(userAccounts)
    .set({
      primaryWalletId: wallet?.id ?? null,
      holderStatus: isHolder ? "active" : "none",
      lastLoginAt: now,
      lastSeenAt: now,
      ...(input.email ? { email: normalizeEmail(input.email) } : {}),
    })
    .where(eq(userAccounts.id, userId));

  if (isHolder) {
    const [membership] = await db
      .select()
      .from(communityMemberships)
      .where(eq(communityMemberships.userAccountId, userId))
      .limit(1);

    if (!membership) {
      await db.insert(communityMemberships).values({ userAccountId: userId });
    }

    const [stats] = await db
      .select()
      .from(userJourneyStats)
      .where(eq(userJourneyStats.userAccountId, userId))
      .limit(1);

    if (!stats) {
      await db.insert(userJourneyStats).values({
        userAccountId: userId,
        firstSeenAt: now,
        firstLoginAt: now,
        firstHolderAt: now,
        lastEventAt: now,
        gainePeakBalance: String(balance),
        gaineCurrentBalance: String(balance),
        journeyStage: "holder",
      });
    } else {
      await db
        .update(userJourneyStats)
        .set({
          firstHolderAt: stats.firstHolderAt ?? now,
          gainePeakBalance: String(Math.max(Number(stats.gainePeakBalance ?? 0), balance)),
          gaineCurrentBalance: String(balance),
          journeyStage: "holder",
          lastEventAt: now,
        })
        .where(eq(userJourneyStats.userAccountId, userId));
    }
  }

  if (input.email) {
    await linkWaitlistEmail(input.email, userId, input.address);
  }

  await trackEvent({
    userAccountId: userId,
    eventType: isHolder ? "gaine_verify_pass" : "gaine_verify_fail",
    eventCategory: "auth",
    walletAddress: input.address,
    gaineBalanceSnapshot: balance,
  });

  const [user] = await db.select().from(userAccounts).where(eq(userAccounts.id, userId)).limit(1);

  return {
    userId,
    isHolder,
    balance,
    email: user?.email ?? null,
    displayName: user?.displayName ?? null,
  };
}

export async function upsertGoogleUser(profile: {
  providerUserId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}) {
  const db = await getDb();
  const now = new Date();
  const email = normalizeEmail(profile.email);

  const [existingOAuth] = await db
    .select()
    .from(oauthIdentities)
    .where(
      and(eq(oauthIdentities.provider, "google"), eq(oauthIdentities.providerUserId, profile.providerUserId)),
    )
    .limit(1);

  if (existingOAuth) {
    await db
      .update(userAccounts)
      .set({
        email,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl ?? null,
        lastLoginAt: now,
        lastSeenAt: now,
      })
      .where(eq(userAccounts.id, existingOAuth.userAccountId));

    return { userId: existingOAuth.userAccountId, email, displayName: profile.displayName };
  }

  const [byEmail] = await db.select().from(userAccounts).where(eq(userAccounts.email, email)).limit(1);

  let userId = byEmail?.id;

  if (!userId) {
    const [inserted] = await db.insert(userAccounts).values({
      email,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl ?? null,
      lastLoginAt: now,
      lastSeenAt: now,
    });
    userId = Number(inserted.insertId);

    await db.insert(userJourneyStats).values({
      userAccountId: userId,
      firstSeenAt: now,
      firstLoginAt: now,
      lastEventAt: now,
      journeyStage: "registered",
    });
  } else {
    await db
      .update(userAccounts)
      .set({
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl ?? null,
        lastLoginAt: now,
        lastSeenAt: now,
      })
      .where(eq(userAccounts.id, userId));
  }

  await db.insert(oauthIdentities).values({
    userAccountId: userId,
    provider: "google",
    providerUserId: profile.providerUserId,
  });

  await trackEvent({
    userAccountId: userId,
    eventType: "oauth_login",
    eventCategory: "auth",
    metadata: { provider: "google" },
  });

  await linkWaitlistEmail(email, userId).catch(() => undefined);

  return { userId, email, displayName: profile.displayName };
}

export async function getUserById(userId: number) {
  const db = await getDb();
  const [user] = await db.select().from(userAccounts).where(eq(userAccounts.id, userId)).limit(1);
  return user ?? null;
}
