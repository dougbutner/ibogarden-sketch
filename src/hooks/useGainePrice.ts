import { useQuery } from "@tanstack/react-query";
import { GAINE_INITIAL_PRICE, GAINE_MINT } from "@/data/gaine";

type DexScreenerResponse = {
  pairs?: Array<{ priceUsd?: string; baseToken?: { symbol?: string } }>;
};

async function fetchGainePrice(): Promise<number | null> {
  if (!GAINE_MINT) return null;

  const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${GAINE_MINT}`);
  if (!res.ok) throw new Error("Price feed unavailable");

  const data = (await res.json()) as DexScreenerResponse;
  const pair = data.pairs?.find((p) => p.baseToken?.symbol === "GAINE") ?? data.pairs?.[0];
  const price = pair?.priceUsd ? Number.parseFloat(pair.priceUsd) : NaN;

  return Number.isFinite(price) ? price : null;
}

export function useGainePrice() {
  return useQuery({
    queryKey: ["gaine-price", GAINE_MINT],
    queryFn: fetchGainePrice,
    enabled: Boolean(GAINE_MINT),
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 2,
  });
}

export function formatGainePrice(price: number | null | undefined, loading: boolean) {
  if (loading) return "…";
  if (price == null) return `$${GAINE_INITIAL_PRICE.toFixed(2)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
}
