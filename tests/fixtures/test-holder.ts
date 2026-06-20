/** Canonical test holder used by integration tests (mocked GAINE balance, not on-chain). */
export const TEST_HOLDER = {
  address: "TestHolder1111111111111111111111111111111",
  email: "test-holder@ibo.garden",
  balance: 1_000,
  walletProvider: "vitest",
} as const;
