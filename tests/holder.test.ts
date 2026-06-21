import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";

import { getDb } from "@/server/db/client";
import { communityMemberships } from "@/server/db/schema/community";
import { userAccounts, userJourneyStats, walletProfiles } from "@/server/db/schema/users";
import { verifyHolderLogin } from "@/server/services/holder.service";
import { cleanupTestHolder } from "./fixtures/cleanup";
import { TEST_HOLDER } from "./fixtures/test-holder";

vi.mock("@/lib/solana.server", () => ({
  fetchGaineBalance: vi.fn(async () => TEST_HOLDER.balance),
}));

describe("test holder", () => {
  beforeEach(async () => {
    await cleanupTestHolder(TEST_HOLDER.address, TEST_HOLDER.email);
  });

  afterEach(async () => {
    await cleanupTestHolder(TEST_HOLDER.address, TEST_HOLDER.email);
  });

  it("verifies GAINE balance and persists an active holder", async () => {
    const result = await verifyHolderLogin({
      address: TEST_HOLDER.address,
      email: TEST_HOLDER.email,
      walletProvider: TEST_HOLDER.walletProvider,
    });

    expect(result.isHolder).toBe(true);
    expect(result.balance).toBe(TEST_HOLDER.balance);

    const db = await getDb();

    const [user] = await db.select().from(userAccounts).where(eq(userAccounts.id, result.userId)).limit(1);
    expect(user?.holderStatus).toBe("active");
    expect(user?.email).toBe(TEST_HOLDER.email);

    const [wallet] = await db
      .select()
      .from(walletProfiles)
      .where(eq(walletProfiles.address, TEST_HOLDER.address))
      .limit(1);
    expect(Number(wallet?.lastGaineBalance)).toBe(TEST_HOLDER.balance);
    expect(wallet?.firstVerifiedAt).not.toBeNull();

    const [membership] = await db
      .select()
      .from(communityMemberships)
      .where(eq(communityMemberships.userAccountId, result.userId))
      .limit(1);
    expect(membership).toBeDefined();

    const [stats] = await db
      .select()
      .from(userJourneyStats)
      .where(eq(userJourneyStats.userAccountId, result.userId))
      .limit(1);
    expect(stats?.journeyStage).toBe("holder");
  });
});
