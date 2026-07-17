import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { and, eq } from "drizzle-orm";

import { GAINE_REFLECTION_MIN_BALANCE } from "@/data/reflection-destinations";
import { fetchGaineBalance } from "@/lib/solana.server";
import { getDb } from "@/server/db/client";
import { taxonomyDomains, taxonomyTerms } from "@/server/db/schema/taxonomy";
import { userAccounts, userEvents } from "@/server/db/schema/users";
import { verifyHolderLogin } from "@/server/services/holder.service";
import {
  listReflectionRouting,
  recordReflectionDisbursement,
  ReflectionDisbursementError,
  saveUserReflectionPreference,
} from "@/server/services/reflection.service";
import { reflectionDisbursementTotals, reflectionDisbursements } from "@/server/db/schema/reflection";
import { cleanupReflectionTestHolders } from "./fixtures/cleanup";
import {
  REFLECTION_TEST_HOLDERS,
  TECH_INNOVATION_WALLET,
  TEST_REFLECTION_BALANCED,
  TEST_REFLECTION_HOLDER,
  TEST_REFLECTION_LOW,
  TEST_REFLECTION_OTHER,
  TEST_UNREGISTERED,
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
      directionSlug: "tech_innovation",
    });

    expect(result.directionSlug).toBe("tech_innovation");
    expect(result.customTitle).toBeNull();
    expect(result.customWallet).toBeNull();

    const db = await getDb();
    const [user] = await db.select().from(userAccounts).where(eq(userAccounts.id, userId)).limit(1);
    expect(user?.reflectionDirectionId).not.toBeNull();
    expect(user?.reflectionCustomTitle).toBeNull();
    expect(user?.reflectionCustomWallet).toBeNull();
    expect(user?.reflectionUpdatedAt).not.toBeNull();
  });

  it("saves an unregistered project title and wallet", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_HOLDER);

    const result = await saveUserReflectionPreference({
      userId,
      walletAddress: TEST_REFLECTION_HOLDER.address,
      directionSlug: "unregistered_project",
      customTitle: TEST_UNREGISTERED.title,
      customWallet: TEST_UNREGISTERED.wallet,
    });

    expect(result.directionSlug).toBe("unregistered_project");
    expect(result.customTitle).toBe(TEST_UNREGISTERED.title);
    expect(result.customWallet).toBe(TEST_UNREGISTERED.wallet);

    const db = await getDb();
    const [user] = await db.select().from(userAccounts).where(eq(userAccounts.id, userId)).limit(1);
    expect(user?.reflectionCustomTitle).toBe(TEST_UNREGISTERED.title);
    expect(user?.reflectionCustomWallet).toBe(TEST_UNREGISTERED.wallet);
    expect(user?.reflectionProjectId).toBeNull();
  });

  it("rejects unregistered save without title or wallet", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_HOLDER);

    await expect(
      saveUserReflectionPreference({
        userId,
        walletAddress: TEST_REFLECTION_HOLDER.address,
        directionSlug: "unregistered_project",
        customTitle: "",
        customWallet: TEST_UNREGISTERED.wallet,
      }),
    ).rejects.toThrow("Enter a project title");

    await expect(
      saveUserReflectionPreference({
        userId,
        walletAddress: TEST_REFLECTION_HOLDER.address,
        directionSlug: "unregistered_project",
        customTitle: TEST_UNREGISTERED.title,
        customWallet: "short",
      }),
    ).rejects.toThrow("Enter a valid Solana wallet address");
  });

  it(`rejects save when balance is below ${GAINE_REFLECTION_MIN_BALANCE} GAINE`, async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_LOW);

    await expect(
      saveUserReflectionPreference({
        userId,
        walletAddress: TEST_REFLECTION_LOW.address,
        directionSlug: "tech_innovation",
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
        directionSlug: "tech_innovation",
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
      directionSlug: "research_fund",
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
      directionSlug: "tech_innovation",
    });

    const { routing } = await listReflectionRouting();
    const row = routing.find((item) => item.holderWallet === TEST_REFLECTION_HOLDER.address);

    expect(row).toBeDefined();
    expect(row?.userAccountId).toBe(userId);
    expect(row?.reflectionDirectionId).toEqual(expect.any(Number));
    expect(row?.destinationType).toBe("category");
    expect(row?.destinationSlug).toBe("tech_innovation");
    expect(row?.destinationWallet).toBe(TECH_INNOVATION_WALLET);
  });

  it("resolves unregistered destination wallet and title", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_HOLDER);
    await saveUserReflectionPreference({
      userId,
      walletAddress: TEST_REFLECTION_HOLDER.address,
      directionSlug: "unregistered_project",
      customTitle: TEST_UNREGISTERED.title,
      customWallet: TEST_UNREGISTERED.wallet,
    });

    const { routing } = await listReflectionRouting();
    const row = routing.find((item) => item.holderWallet === TEST_REFLECTION_HOLDER.address);

    expect(row).toBeDefined();
    expect(row?.userAccountId).toBe(userId);
    expect(row?.reflectionDirectionId).toEqual(expect.any(Number));
    expect(row?.destinationType).toBe("unregistered");
    expect(row?.destinationSlug).toBe("unregistered_project");
    expect(row?.destinationWallet).toBe(TEST_UNREGISTERED.wallet);
    expect(row?.customTitle).toBe(TEST_UNREGISTERED.title);
  });

  it("returns balanced routing when holder has no saved preference", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_BALANCED);

    const { routing } = await listReflectionRouting();
    const row = routing.find((item) => item.holderWallet === TEST_REFLECTION_BALANCED.address);

    expect(row).toBeDefined();
    expect(row?.userAccountId).toBe(userId);
    expect(row?.reflectionDirectionId).toBeNull();
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

  it("includes active reflection categories", async () => {
    const { categories } = await listReflectionRouting();

    expect(categories.length).toBeGreaterThan(0);

    const db = await getDb();
    const [category] = await db
      .select({ slug: taxonomyTerms.slug })
      .from(taxonomyTerms)
      .innerJoin(taxonomyDomains, eq(taxonomyTerms.domainId, taxonomyDomains.id))
      .where(and(eq(taxonomyDomains.slug, "reflection_direction"), eq(taxonomyTerms.slug, "tech_innovation")))
      .limit(1);

    if (category) {
      expect(categories.some((item) => item.slug === "tech_innovation")).toBe(true);
      expect(categories.some((item) => item.slug === "unregistered_project")).toBe(true);
      expect(categories.some((item) => item.slug === "microdose_research")).toBe(false);
    }
  });
});

describe("reflection disbursement recording", () => {
  beforeEach(async () => {
    await cleanupReflectionTestHolders(REFLECTION_TEST_HOLDERS);
  });

  afterEach(async () => {
    await cleanupReflectionTestHolders(REFLECTION_TEST_HOLDERS);
  });

  it("records a send and upserts fund totals", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_HOLDER);
    await saveUserReflectionPreference({
      userId,
      walletAddress: TEST_REFLECTION_HOLDER.address,
      directionSlug: "tech_innovation",
    });

    const { routing } = await listReflectionRouting();
    const row = routing.find((item) => item.holderWallet === TEST_REFLECTION_HOLDER.address);
    expect(row?.reflectionDirectionId).toEqual(expect.any(Number));

    const first = await recordReflectionDisbursement({
      userAccountId: userId,
      reflectionDirectionId: row!.reflectionDirectionId!,
      holderWallet: TEST_REFLECTION_HOLDER.address,
      destinationWallet: TECH_INNOVATION_WALLET,
      amountGaine: "10.5",
      solanaTxSignature: "TxSig111111111111111111111111111111111111111111111111111111111",
      destinationType: "category",
      destinationSlug: "tech_innovation",
    });
    expect(first.id).toBeGreaterThan(0);
    expect(first.duplicate).toBe(false);

    const db = await getDb();
    const [disbursement] = await db
      .select()
      .from(reflectionDisbursements)
      .where(eq(reflectionDisbursements.id, first.id))
      .limit(1);
    expect(Number(disbursement?.amountGaine)).toBe(10.5);

    const [total] = await db
      .select()
      .from(reflectionDisbursementTotals)
      .where(eq(reflectionDisbursementTotals.destinationWallet, TECH_INNOVATION_WALLET))
      .limit(1);
    expect(Number(total?.totalAmountGaine)).toBe(10.5);
    expect(total?.sendCount).toBe(1);

    await recordReflectionDisbursement({
      userAccountId: userId,
      reflectionDirectionId: row!.reflectionDirectionId!,
      holderWallet: TEST_REFLECTION_HOLDER.address,
      destinationWallet: TECH_INNOVATION_WALLET,
      amountGaine: "2.25",
      solanaTxSignature: "TxSig222222222222222222222222222222222222222222222222222222222",
      destinationType: "category",
      destinationSlug: "tech_innovation",
    });

    const [totalAfter] = await db
      .select()
      .from(reflectionDisbursementTotals)
      .where(eq(reflectionDisbursementTotals.destinationWallet, TECH_INNOVATION_WALLET))
      .limit(1);
    expect(Number(totalAfter?.totalAmountGaine)).toBe(12.75);
    expect(totalAfter?.sendCount).toBe(2);
  });

  it("rejects duplicate solanaTxSignature with 409 semantics", async () => {
    const { userId } = await seedHolder(TEST_REFLECTION_HOLDER);
    await saveUserReflectionPreference({
      userId,
      walletAddress: TEST_REFLECTION_HOLDER.address,
      directionSlug: "tech_innovation",
    });
    const { routing } = await listReflectionRouting();
    const row = routing.find((item) => item.holderWallet === TEST_REFLECTION_HOLDER.address);
    const signature = "TxDup111111111111111111111111111111111111111111111111111111111";

    await recordReflectionDisbursement({
      userAccountId: userId,
      reflectionDirectionId: row!.reflectionDirectionId!,
      holderWallet: TEST_REFLECTION_HOLDER.address,
      destinationWallet: TECH_INNOVATION_WALLET,
      amountGaine: "1",
      solanaTxSignature: signature,
    });

    await expect(
      recordReflectionDisbursement({
        userAccountId: userId,
        reflectionDirectionId: row!.reflectionDirectionId!,
        holderWallet: TEST_REFLECTION_HOLDER.address,
        destinationWallet: TECH_INNOVATION_WALLET,
        amountGaine: "1",
        solanaTxSignature: signature,
      }),
    ).rejects.toMatchObject({
      name: "ReflectionDisbursementError",
      status: 409,
    } satisfies Partial<ReflectionDisbursementError>);
  });
});

describe("fetchGaineBalance mock", () => {
  it("is wired for per-address balances in tests", async () => {
    setBalance("MockAddr1111111111111111111111111111111", 42);
    await expect(fetchGaineBalance("MockAddr1111111111111111111111111111111")).resolves.toBe(42);
  });
});
