import csvRaw from "@/data/gaine-quote-tokens.csv?raw";

export type GaineQuoteTokenMeta = {
  mint: string;
  symbol: string;
  isStablecoin: boolean;
  isUsdPegged: boolean;
  countryEmoji: string | null;
  notes: string;
};

const STABLECOIN_TEXT_COLOR = "#86efac";

function parseCsv(raw: string): GaineQuoteTokenMeta[] {
  const lines = raw.trim().split("\n");
  const [, ...rows] = lines;

  return rows
    .map((line) => {
      const [mint, symbol, isStablecoin, isUsdPegged, countryEmoji, notes] = line.split(",");
      return {
        mint: mint.trim(),
        symbol: symbol.trim(),
        isStablecoin: isStablecoin.trim() === "true",
        isUsdPegged: isUsdPegged.trim() === "true",
        countryEmoji: countryEmoji.trim() || null,
        notes: (notes ?? "").trim(),
      };
    })
    .filter((row) => row.mint.length > 0);
}

const QUOTE_TOKEN_ROWS = parseCsv(csvRaw);

const byMint = new Map(QUOTE_TOKEN_ROWS.map((row) => [row.mint, row]));
const bySymbol = new Map(QUOTE_TOKEN_ROWS.map((row) => [row.symbol.toUpperCase(), row]));

export function getQuoteTokenMeta(mint: string, symbol: string): GaineQuoteTokenMeta {
  return (
    byMint.get(mint) ??
    bySymbol.get(symbol.toUpperCase()) ?? {
      mint,
      symbol,
      isStablecoin: false,
      isUsdPegged: false,
      countryEmoji: null,
      notes: "",
    }
  );
}

export function getStablecoinTextColor(isStablecoin: boolean): string | undefined {
  return isStablecoin ? STABLECOIN_TEXT_COLOR : undefined;
}

export { QUOTE_TOKEN_ROWS };
