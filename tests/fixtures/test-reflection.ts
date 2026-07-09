import { IMPACT_PROJECT_FALLBACK, REFLECTION_CATEGORY_FALLBACK } from "@/data/reflection-destinations";

/** Holder with 100+ GAINE for save/routing tests. */
export const TEST_REFLECTION_HOLDER = {
  address: "ReflTest1111111111111111111111111111111",
  email: "test-reflection@ibo.garden",
  balance: 1_000,
  walletProvider: "vitest",
} as const;

/** Holder with balance below reflection threshold. */
export const TEST_REFLECTION_LOW = {
  address: "ReflLow11111111111111111111111111111111",
  email: "test-reflection-low@ibo.garden",
  balance: 50,
  walletProvider: "vitest",
} as const;

/** Holder with 100+ GAINE but no saved reflection preference. */
export const TEST_REFLECTION_BALANCED = {
  address: "ReflBal11111111111111111111111111111111",
  email: "test-reflection-balanced@ibo.garden",
  balance: 200,
  walletProvider: "vitest",
} as const;

/** Second account for wallet-ownership mismatch tests. */
export const TEST_REFLECTION_OTHER = {
  address: "ReflOth11111111111111111111111111111111",
  email: "test-reflection-other@ibo.garden",
  balance: 1_000,
  walletProvider: "vitest",
} as const;

export const DEVELOPER_FUND_WALLET =
  REFLECTION_CATEGORY_FALLBACK.find((c) => c.slug === "developer_fund")!.solanaWallet!;

export const MICRODOSE_RESEARCH_WALLET =
  IMPACT_PROJECT_FALLBACK.find((p) => p.slug === "microdose-research")!.solanaWallet;

export const REFLECTION_TEST_HOLDERS = [
  TEST_REFLECTION_HOLDER,
  TEST_REFLECTION_LOW,
  TEST_REFLECTION_BALANCED,
  TEST_REFLECTION_OTHER,
] as const;
