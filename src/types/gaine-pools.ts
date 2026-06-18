export type GainePoolToken = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
};

export type GainePoolRow = {
  address: string;
  priceUsd: string;
  priceNative: string | null;
  feePercent: string;
  pairLabel: string;
  quoteSymbol: string;
  quoteIsStablecoin: boolean;
  quoteIsUsdPegged: boolean;
  quoteCountryEmoji: string | null;
  tokenA: GainePoolToken;
  tokenB: GainePoolToken;
  balanceA: string;
  balanceB: string;
  balanceARaw: string;
  balanceBRaw: string;
  poolLiquidity: string;
  projectLiquidity: string;
  projectSharePercent: number;
  orcaUrl: string;
};

export type GaineBackingLine = {
  symbol: string;
  amount: string;
};

export type GainePoolsSummary = {
  marketCount: number;
  totalGainePooled: string;
  totalGaineUsd: string;
  usdBacking: string;
  vchfAmount: string | null;
  audAmount: string | null;
  silverGrams: string | null;
  goldGrams: string | null;
  solAmount: string | null;
  otherBackings: GaineBackingLine[];
  totalBackingUsd: string;
};

export type GainePoolsPayload = {
  pools: GainePoolRow[];
  summary: GainePoolsSummary;
  totalCount: number;
  expectedMinCount: number;
  isComplete: boolean;
  projectWallet: string;
  fetchedAt: string;
};
