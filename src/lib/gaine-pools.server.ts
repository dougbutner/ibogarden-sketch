import { createSolanaRpc, address } from "@solana/kit";
import { fetchPositionsForOwner, WhirlpoolDeployment } from "@orca-so/whirlpools";

import {
  GAINE_CONTRACT_ADDRESS,
  GAINE_MIN_EXPECTED_POOLS,
  GAINE_PROJECT_WALLET,
  gainePoolOrcaUrl,
} from "@/data/gaine";
import { getQuoteTokenMeta } from "@/lib/gaine-quote-tokens";
import type { GainePoolRow, GainePoolsPayload, GainePoolsSummary } from "@/types/gaine-pools";

const ORCA_POOLS_API = "https://api.orca.so/v2/solana/pools";
const ORCA_TOKENS_API = "https://api.orca.so/v2/solana/tokens";
const DEFAULT_RPC_URL = "https://api.mainnet-beta.solana.com";
const TROY_OZ_TO_GRAMS = 31.1034768;
const GOLD_GRAM_SYMBOLS = new Set(["XAUt0"]);
const SILVER_GRAM_SYMBOLS = new Set(["SLVon"]);

type OrcaToken = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
};

type OrcaPool = {
  address: string;
  tickSpacing: number;
  feeRate: number;
  liquidity: string;
  price: string;
  tokenMintA: string;
  tokenMintB: string;
  tokenBalanceA: string;
  tokenBalanceB: string;
  tokenA: OrcaToken;
  tokenB: OrcaToken;
};

type OrcaPoolsResponse = {
  data: OrcaPool[];
  meta?: { cursor?: { next?: string | null; previous?: string | null } };
};

type OrcaTokenResponse = {
  data?: { priceUsdc?: string };
};

function getRpcUrl() {
  return process.env.SOLANA_RPC_URL ?? DEFAULT_RPC_URL;
}

const ASSET_MAX_DECIMALS = 3;
const USD_MAX_DECIMALS = 2;

function formatAssetAmount(value: number, maxFractionDigits = ASSET_MAX_DECIMALS): string {
  if (!Number.isFinite(value) || value === 0) return "0";

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  });
}

function formatTokenAmount(raw: string, decimals: number): string {
  return formatAssetAmount(rawToAmount(raw, decimals));
}

function formatFeePercent(feeRate: number): string {
  const percent = feeRate / 10_000;
  return `${percent.toLocaleString("en-US", {
    minimumFractionDigits: percent < 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })}%`;
}

function formatUsdPrice(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "N/A";
  if (value >= 1_000_000) return `$${value.toExponential(2)}`;
  if (value >= 1_000) {
    return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  if (value >= 1) {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: USD_MAX_DECIMALS, maximumFractionDigits: USD_MAX_DECIMALS })}`;
  }
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: USD_MAX_DECIMALS, maximumFractionDigits: USD_MAX_DECIMALS })}`;
}

function formatNativePrice(value: number, symbol: string): string {
  return `${formatAssetAmount(value)} ${symbol}`;
}

function formatCompactUsd(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "$0.00";
  if (value >= 1_000) {
    return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: USD_MAX_DECIMALS, maximumFractionDigits: USD_MAX_DECIMALS })}`;
}

function formatGaineAmount(value: number): string {
  return formatAssetAmount(value);
}

function formatGrams(troyOunces: number): string {
  const grams = troyOunces * TROY_OZ_TO_GRAMS;
  return `${formatAssetAmount(grams)}g`;
}

function hasAssetBalance(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function rawToAmount(raw: string, decimals: number): number {
  return Number(BigInt(raw)) / 10 ** decimals;
}

async function fetchOrcaPoolsForMint(mint: string): Promise<OrcaPool[]> {
  const params = new URLSearchParams({
    token: mint,
    size: "100",
    sortBy: "tvl",
    sortDirection: "desc",
  });

  const res = await fetch(`${ORCA_POOLS_API}?${params}`);
  if (!res.ok) {
    throw new Error(`Orca pools API error (${res.status})`);
  }

  const body = (await res.json()) as OrcaPoolsResponse;
  const pools = body.data ?? [];

  if (body.meta?.cursor?.next) {
    throw new Error("Unexpected pagination: GAINE pool list may be incomplete");
  }

  return pools;
}

async function fetchTokenPriceUsdc(mint: string, cache: Map<string, number>): Promise<number> {
  const cached = cache.get(mint);
  if (cached != null) return cached;

  const res = await fetch(`${ORCA_TOKENS_API}/${mint}`);
  if (!res.ok) {
    cache.set(mint, 1);
    return 1;
  }

  const body = (await res.json()) as OrcaTokenResponse;
  const price = Number(body.data?.priceUsdc ?? 1);
  const resolved = Number.isFinite(price) && price > 0 ? price : 1;
  cache.set(mint, resolved);
  return resolved;
}

async function fetchProjectLiquidityByPool(wallet: string) {
  const rpc = createSolanaRpc(getRpcUrl());
  const positions = await fetchPositionsForOwner(
    rpc,
    address(wallet),
    WhirlpoolDeployment.mainnet,
  );

  const byPool = new Map<string, bigint>();
  for (const position of positions) {
    const poolAddress = position.data.whirlpool;
    const liquidity = BigInt(position.data.liquidity);
    byPool.set(poolAddress, (byPool.get(poolAddress) ?? 0n) + liquidity);
  }

  return byPool;
}

function computeSharePercent(projectLiquidity: bigint, poolLiquidity: bigint): number {
  if (poolLiquidity <= 0n) {
    return projectLiquidity > 0n ? 100 : 0;
  }

  const basisPoints = (projectLiquidity * 10_000n) / poolLiquidity;
  return Number(basisPoints) / 100;
}

function getQuoteToken(pool: OrcaPool): OrcaToken {
  if (pool.tokenMintA === GAINE_CONTRACT_ADDRESS) return pool.tokenB;
  if (pool.tokenMintB === GAINE_CONTRACT_ADDRESS) return pool.tokenA;
  return pool.tokenB;
}

type SummaryAccumulator = {
  totalGaine: number;
  usdBackingUsd: number;
  vchf: number;
  audd: number;
  silverOz: number;
  goldOz: number;
  sol: number;
  otherBySymbol: Map<string, number>;
  totalBackingUsd: number;
};

const SUMMARY_ASSET_SYMBOLS = new Set(["VCHF", "AUDD", "SLVon", "XAUt0", "SOL"]);

function accumulateBacking(
  acc: SummaryAccumulator,
  quoteSymbol: string,
  quoteMint: string,
  quoteMeta: ReturnType<typeof getQuoteTokenMeta>,
  quoteAmount: number,
  quoteUsd: number,
) {
  if (quoteMint === GAINE_CONTRACT_ADDRESS) {
    return;
  }

  const quoteUsdValue = quoteAmount * quoteUsd;
  acc.totalBackingUsd += quoteUsdValue;

  if (!hasAssetBalance(quoteAmount)) {
    return;
  }

  if (quoteMeta.isUsdPegged) {
    acc.usdBackingUsd += quoteUsdValue;
    return;
  }

  switch (quoteSymbol) {
    case "VCHF":
      acc.vchf += quoteAmount;
      break;
    case "AUDD":
      acc.audd += quoteAmount;
      break;
    case "SLVon":
      if (SILVER_GRAM_SYMBOLS.has(quoteSymbol)) {
        acc.silverOz += quoteAmount;
      }
      break;
    case "XAUt0":
      if (GOLD_GRAM_SYMBOLS.has(quoteSymbol)) {
        acc.goldOz += quoteAmount;
      }
      break;
    case "SOL":
      acc.sol += quoteAmount;
      break;
    default:
      if (!SUMMARY_ASSET_SYMBOLS.has(quoteSymbol)) {
        acc.otherBySymbol.set(
          quoteSymbol,
          (acc.otherBySymbol.get(quoteSymbol) ?? 0) + quoteAmount,
        );
      }
      break;
  }
}

function buildSummary(
  acc: SummaryAccumulator,
  marketCount: number,
  gaineUsdPrice: number,
): GainePoolsSummary {
  const totalGaineUsd = acc.totalGaine * gaineUsdPrice;
  const otherBackings = [...acc.otherBySymbol.entries()]
    .filter(([, amount]) => hasAssetBalance(amount))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([symbol, amount]) => ({
      symbol,
      amount: formatNativePrice(amount, symbol),
    }));

  return {
    marketCount,
    totalGainePooled: formatGaineAmount(acc.totalGaine),
    totalGaineUsd: formatCompactUsd(totalGaineUsd),
    usdBacking: formatCompactUsd(acc.usdBackingUsd),
    vchfAmount: hasAssetBalance(acc.vchf) ? formatNativePrice(acc.vchf, "CHF") : null,
    audAmount: hasAssetBalance(acc.audd) ? formatNativePrice(acc.audd, "AUD") : null,
    silverGrams: hasAssetBalance(acc.silverOz) ? formatGrams(acc.silverOz) : null,
    goldGrams: hasAssetBalance(acc.goldOz) ? formatGrams(acc.goldOz) : null,
    solAmount: hasAssetBalance(acc.sol) ? formatNativePrice(acc.sol, "SOL") : null,
    otherBackings,
    totalBackingUsd: formatCompactUsd(acc.totalBackingUsd),
  };
}

export async function fetchGainePoolsData(): Promise<GainePoolsPayload> {
  const [orcaPools, projectLiquidityByPool] = await Promise.all([
    fetchOrcaPoolsForMint(GAINE_CONTRACT_ADDRESS),
    fetchProjectLiquidityByPool(GAINE_PROJECT_WALLET),
  ]);

  const priceCache = new Map<string, number>();
  const uniqueQuoteMints = [...new Set(orcaPools.map((pool) => getQuoteToken(pool).address))];
  await Promise.all([
    fetchTokenPriceUsdc(GAINE_CONTRACT_ADDRESS, priceCache),
    ...uniqueQuoteMints.map((mint) => fetchTokenPriceUsdc(mint, priceCache)),
  ]);

  const gaineUsdPrice = priceCache.get(GAINE_CONTRACT_ADDRESS) ?? 1;
  const summaryAcc: SummaryAccumulator = {
    totalGaine: 0,
    usdBackingUsd: 0,
    vchf: 0,
    audd: 0,
    silverOz: 0,
    goldOz: 0,
    sol: 0,
    otherBySymbol: new Map(),
    totalBackingUsd: 0,
  };

  const pools: GainePoolRow[] = orcaPools
    .map((pool) => {
      const projectLiquidity = projectLiquidityByPool.get(pool.address) ?? 0n;
      const poolLiquidity = BigInt(pool.liquidity || "0");
      const quoteToken = getQuoteToken(pool);
      const quoteMeta = getQuoteTokenMeta(quoteToken.address, quoteToken.symbol);
      const poolPrice = Number(pool.price);
      const quoteUsd = priceCache.get(quoteToken.address) ?? 1;
      const gaineUsd = poolPrice * quoteUsd;

      const gaineIsA = pool.tokenMintA === GAINE_CONTRACT_ADDRESS;
      const gaineToken = gaineIsA ? pool.tokenA : pool.tokenB;
      const gaineBalanceRaw = gaineIsA ? pool.tokenBalanceA : pool.tokenBalanceB;
      const quoteBalanceRaw = gaineIsA ? pool.tokenBalanceB : pool.tokenBalanceA;
      const gaineAmount = rawToAmount(gaineBalanceRaw, gaineToken.decimals);
      const quoteAmount = rawToAmount(quoteBalanceRaw, quoteToken.decimals);

      summaryAcc.totalGaine += gaineAmount;
      accumulateBacking(
        summaryAcc,
        quoteToken.symbol,
        quoteToken.address,
        quoteMeta,
        quoteAmount,
        quoteUsd,
      );

      return {
        address: pool.address,
        priceUsd: formatUsdPrice(gaineUsd),
        priceNative: quoteMeta.isUsdPegged ? null : formatNativePrice(poolPrice, quoteToken.symbol),
        feePercent: formatFeePercent(pool.feeRate),
        pairLabel: `${gaineToken.symbol} / ${quoteToken.symbol}`,
        quoteSymbol: quoteToken.symbol,
        quoteIsStablecoin: quoteMeta.isStablecoin,
        quoteIsUsdPegged: quoteMeta.isUsdPegged,
        quoteCountryEmoji: quoteMeta.countryEmoji,
        tokenA: pool.tokenA,
        tokenB: pool.tokenB,
        balanceA: formatTokenAmount(gaineBalanceRaw, gaineToken.decimals),
        balanceB: formatTokenAmount(quoteBalanceRaw, quoteToken.decimals),
        balanceARaw: gaineBalanceRaw,
        balanceBRaw: quoteBalanceRaw,
        poolLiquidity: poolLiquidity.toString(),
        projectLiquidity: projectLiquidity.toString(),
        projectSharePercent: computeSharePercent(projectLiquidity, poolLiquidity),
        orcaUrl: gainePoolOrcaUrl(pool.address),
      };
    })
    .toSorted((a, b) => {
      const diff = BigInt(b.balanceARaw) - BigInt(a.balanceARaw);
      if (diff > 0n) return 1;
      if (diff < 0n) return -1;
      return 0;
    });

  const totalCount = pools.length;
  const summary = buildSummary(summaryAcc, totalCount, gaineUsdPrice);

  return {
    pools,
    summary,
    totalCount,
    expectedMinCount: GAINE_MIN_EXPECTED_POOLS,
    isComplete: totalCount >= GAINE_MIN_EXPECTED_POOLS,
    projectWallet: GAINE_PROJECT_WALLET,
    fetchedAt: new Date().toISOString(),
  };
}
