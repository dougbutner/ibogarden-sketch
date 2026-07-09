import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { and, eq } from "drizzle-orm";

import { GAINE_REFLECTION_MIN_BALANCE } from "@/data/reflection-destinations";
import { fetchGaineBalance } from "@/lib/solana.server";
import { getDb } from "@/server/db/client";
import { impactProjects } from "@/server/db/schema/reflection";
import { taxonomyDomains, taxonomyTerms } from "@/server/db/schema/taxonomy";
import { userAccounts, userEvents, walletProfiles } from "@/server/db/schema/users";
import { verifyHolderLogin } from "@/server/services/holder.service";
import {
  listReflectionRouting,
  saveUserReflectionPreference,
} from "@/server/services/reflection.service";
import { cleanupReflectionTestHolders } from "./fixtures/cleanup";
import {
  DEVELOPER_FUND_WALLET,
  MICRODOSE_RESEARCH_WALLET,
  REFLECTION_TEST_HOLDERS,
  TEST_REFLECTION_BALANCED,
  TEST_REFLECTION_HOLDER,
  TEST_REFLECTION_LOW,
  TEST_REFLECTION_OTHER,
} from "./fixtures/test-reflection";

const balanceByAddress: Record<string, number> = {};

vi.mock("@/lib/solana.server", () => ({
  fetchGaineBalance: vi.fn(async (address: string) => balanceByAddress[address] ?? 0),
}));

function setBalance(address: string, balance: number) {
  balanceByAddress[address] = balance;
}

async function seedHolder(holder: { address: string; email: string; balance: number; walletProvider: string }) {
  setBalance(holder.address, holder.balance);
  return verifyHolderLogin({
    address: holder.address,
    email: holder.email,
    walletProvider: holder.walletProvider,
  });
}

describe("reflection preference save", () => {
  beforeEach(async () => {
    await cleanupReflectionTestHolders(REFLECTION_TEST_HOLDERS);
    setBalance(TEST_REFLECTION_HOLDER.address, TEST_REFLECTION_HOLDER.balance);
    setBalance(TEST_REFLECTION_LOW.address, TEST_REFLECTION_LOW.balance);
    setBalance(TEST_REFLECTION_OTHER.address, TEST_REFLECTION_OTHER.balance);
  });

  afterEach(async () => {
    await cleanupReflectionTestHolders(REFLECTION_TEST_HOLDERS);
  });

  it("saves a category preference when holder has 100+ GAINE", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_HOLDER);

    const result = await saveUserReflectionPreference({
      userId,
      walletAddress: TEST_REFLECTION_HOLDER.address,
      directionSlug: "developer_fund",
    });

    expect(result.directionSlug).toBe("developer_fund");
    expect(result.projectSlug).toBeNull();

    const db = await getDb();
    const [user] = await db.select().from(userAccounts).where(eq(userAccounts.id, userId)).limit(1);
    expect(user?.reflectionDirectionId).not.toBeNull();
    expect(user?.reflectionProjectId).toBeNull();
    expect(user?.reflectionUpdatedAt).not.toBeNull();
  });

  it("saves a specific project preference", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_HOLDER);

    const result = await saveUserReflectionPreference({
      userId,
      walletAddress: TEST_REFLECTION_HOLDER.address,
      directionSlug: "specific_project",
      projectSlug: "microdose-research",
    });

    expect(result.directionSlug).toBe("specific_project");
    expect(result.projectSlug).toBe("microdose-research");

    const db = await getDb();
    const [user] = await db.select().from(userAccounts).where(eq(userAccounts.id, userId)).limit(1);
    expect(user?.reflectionDirectionId).not.toBeNull();
    expect(user?.reflectionProjectId).not.toBeNull();
  });

  it(`rejects save when balance is below ${GAINE_REFLECTION_MIN_BALANCE} GAINE`, async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_LOW);

    await expect(
      saveUserReflectionPreference({
        userId,
        walletAddress: TEST_REFLECTION_LOW.address,
        directionSlug: "developer_fund",
      }),
    ).rejects.toThrow(`Hold at least ${GAINE_REFLECTION_MIN_BALANCE} GAINE to direct rewards.`);
  });

  it("rejects save when wallet does not belong to the user", async () => {
    const holder = await seedHolder(TEST_REFLECTION_HOLDER);
    const other = await seedHolder(TEST_REFLECTION_OTHER);

    await expect(
      saveUserReflectionPreference({
        userId: other.userId,
        walletAddress: TEST_REFLECTION_HOLDER.address,
        directionSlug: "developer_fund",
      }),
    ).rejects.toThrow("Connected wallet does not match your account.");

    const db = await getDb();
    const [user] = await db.select().from(userAccounts).where(eq(userAccounts.id, holder.userId)).limit(1);
    expect(user?.reflectionDirectionId).toBeNull();
  });

  it("records a reflection_save journey event", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_HOLDER);

    await saveUserReflectionPreference({
      userId,
      walletAddress: TEST_REFLECTION_HOLDER.address,
      directionSlug: "developer_fund",
    });

    const db = await getDb();
    const [event] = await db
      .select()
      .from(userEvents)
      .where(and(eq(userEvents.userAccountId, userId), eq(userEvents.eventType, "reflection_save")))
      .limit(1);

    expect(event?.eventCategory).toBe("gaine");
    expect(event?.walletAddress).toBe(TEST_REFLECTION_HOLDER.address);
  });
});

describe("reflection routing", () => {
  beforeEach(async () => {
    await cleanupReflectionTestHolders(REFLECTION_TEST_HOLDERS);
  });

  afterEach(async () => {
    await cleanupReflectionTestHolders(REFLECTION_TEST_HOLDERS);
  });

  it("resolves category destination wallet for a saved preference", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_HOLDER);
    await saveUserReflectionPreference({
      userId,
      walletAddress: TEST_REFLECTION_HOLDER.address,
      directionSlug: "developer_fund",
    });

    const { routing } = await listReflectionRouting();
    const row = routing.find((item) => item.holderWallet === TEST_REFLECTION_HOLDER.address);

    expect(row).toBeDefined();
    expect(row?.userAccountId).toBe(userId);
    expect(row?.destinationType).toBe("category");
    expect(row?.destinationSlug).toBe("developer_fund");
    expect(row?.destinationWallet).toBe(DEVELOPER_FUND_WALLET);
  });

  it("resolves project destination wallet for specific_project", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_HOLDER);
    await saveUserReflectionPreference({
      userId,
      walletAddress: TEST_REFLECTION_HOLDER.address,
      directionSlug: "specific_project",
      projectSlug: "microdose-research",
    });

    const { routing } = await listReflectionRouting();
    const row = routing.find((item) => item.holderWallet === TEST_REFLECTION_HOLDER.address);

    expect(row).toBeDefined();
    expect(row?.userAccountId).toBe(userId);
    expect(row?.destinationType).toBe("project");
    expect(row?.destinationSlug).toBe("microdose-research");
    expect(row?.destinationWallet).toBe(MICRODOSE_RESEARCH_WALLET);
  });

  it("returns balanced routing when holder has no saved preference", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_BALANCED);

    const { routing } = await listReflectionRouting();
    const row = routing.find((item) => item.holderWallet === TEST_REFLECTION_BALANCED.address);

    expect(row).toBeDefined();
    expect(row?.userAccountId).toBe(userId);
    expect(row?.destinationType).toBe("balanced");
    expect(row?.destinationSlug).toBeNull();
    expect(row?.destinationWallet).toBeNull();
  });

  it("excludes holders below the 100 GAINE threshold", async () => {
    await seedHolder(TEST_REFLECTION_LOW);

    const { routing } = await listReflectionRouting();
    const row = routing.find((item) => item.holderWallet === TEST_REFLECTION_LOW.address);

    expect(row).toBeUndefined();
  });

  it("includes categories and projects reference tables", async () => {
    const { categories, projects } = await listReflectionRouting();

    expect(categories.length).toBeGreaterThan(0);
    expect(projects.length).toBeGreaterThan(0);

    const db = await getDb();
    const [category] = await db
      .select({ slug: taxonomyTerms.slug })
      .from(taxonomyTerms)
      .innerJoin(taxonomyDomains, eq(taxonomyTerms.domainId, taxonomyDomains.id))
      .where(and(eq(taxonomyDomains.slug, "reflection_direction"), eq(taxonomyTerms.slug, "developer_fund")))
      .limit(1);
    const [project] = await db
      .select({ slug: impactProjects.slug })
      .from(impactProjects)
      .where(eq(impactProjects.slug, "microdose-research"))
      .limit(1);

    if (category) {
      expect(categories.some((item) => item.slug === "developer_fund")).toBe(true);
    }
    if (project) {
      expect(projects.some((item) => item.slug === "microdose-research")).toBe(true);
    }
  });
});

describe("fetchGaineBalance mock", () => {
  it("is wired for per-address balances in tests", async () => {
    setBalance("MockAddr1111111111111111111111111111111", 42);
    await expect(fetchGaineBalance("MockAddr1111111111111111111111111111111")).resolves.toBe(42);
  });
});
