import { ExternalLink, Loader2, AlertCircle, RefreshCw } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GAINE_PROJECT_WALLET, GAINE_TOKEN_IMAGE } from "@/data/gaine";
import { useGainePools } from "@/hooks/useGainePools";
import { getStablecoinTextColor } from "@/lib/gaine-quote-tokens";
import type { GainePoolsSummary } from "@/types/gaine-pools";
import { GainePoolShareRing } from "./gaine-pool-share-ring";

function truncateAddress(value: string) {
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
      <span className="font-semibold tabular-nums" style={{ color: "var(--gaine-text)" }}>
        {value}
      </span>
      {label ? <span>{label}</span> : null}
    </span>
  );
}

function PoolsSummaryBar({ summary }: { summary: GainePoolsSummary }) {
  const parts: Array<{ key: string; label: string; value: string }> = [
    { key: "markets", label: "Markets", value: String(summary.marketCount) },
    { key: "gaine", label: "GAINE pooled", value: summary.totalGainePooled },
    { key: "gaine-usd", label: "", value: summary.totalGaineUsd },
    { key: "usd", label: "USD backing", value: summary.usdBacking },
  ];

  if (summary.vchfAmount) {
    parts.push({ key: "chf", label: "", value: summary.vchfAmount });
  }
  if (summary.audAmount) {
    parts.push({ key: "aud", label: "", value: summary.audAmount });
  }
  if (summary.silverGrams) {
    parts.push({ key: "silver", label: "Ag", value: summary.silverGrams });
  }
  if (summary.goldGrams) {
    parts.push({ key: "gold", label: "Au", value: summary.goldGrams });
  }
  if (summary.solAmount) {
    parts.push({ key: "sol", label: "", value: summary.solAmount });
  }

  for (const backing of summary.otherBackings) {
    parts.push({
      key: `other-${backing.symbol}`,
      label: "",
      value: backing.amount,
    });
  }

  parts.push({
    key: "total",
    label: "total backing",
    value: summary.totalBackingUsd,
  });

  return (
    <div
      className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm flex-1 min-w-0"
      style={{ color: "var(--gaine-muted)" }}
    >
      {parts.map((part, index) => (
        <span key={part.key} className="inline-flex items-center gap-3">
          {index > 0 ? (
            <span className="opacity-40" aria-hidden>
              |
            </span>
          ) : null}
          <SummaryStat label={part.label} value={part.value} />
        </span>
      ))}
    </div>
  );
}

export function GainePoolsTable() {
  const { data, isLoading, isError, error, isFetching, refetch } = useGainePools();

  return (
    <section className="px-6 pb-20 max-w-7xl mx-auto w-full">
      <div className="mb-8 md:mb-10">
        <h2 className="gaine-display text-3xl md:text-4xl">Liquidity pools</h2>
        <p className="mt-4 max-w-3xl leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
          Vault balances on both sides of each GAINE pool. The ring shows what share of each
          pool&apos;s liquidity is held by the project wallet (
          <span className="font-mono text-xs">{truncateAddress(GAINE_PROJECT_WALLET)}</span>
          ).
        </p>
      </div>

      <div className="gaine-surface-card overflow-hidden">
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: "var(--gaine-border)" }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm flex-1" style={{ color: "var(--gaine-muted)" }}>
              <Loader2 className="size-4 animate-spin" />
              Loading pools…
            </div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-sm flex-1" style={{ color: "var(--gaine-muted)" }}>
              <AlertCircle className="size-4 text-red-400" />
              Failed to load pools
            </div>
          ) : data?.summary ? (
            <PoolsSummaryBar summary={data.summary} />
          ) : null}

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="shrink-0 inline-flex items-center justify-center p-1.5 rounded-md transition-colors hover:bg-white/5 disabled:opacity-40"
            style={{ color: "var(--gaine-muted)" }}
            title="Refresh pool data"
            aria-label="Refresh pool data"
          >
            <RefreshCw className={`size-3.5 opacity-50 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>

        {isError ? (
          <div className="px-5 py-10 text-center text-sm" style={{ color: "var(--gaine-muted)" }}>
            {error instanceof Error ? error.message : "Unable to fetch pool data."}
          </div>
        ) : isLoading ? (
          <div className="px-5 py-16 flex justify-center">
            <Loader2 className="size-8 animate-spin opacity-50" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow
                className="hover:bg-transparent border-b"
                style={{ borderColor: "var(--gaine-border)" }}
              >
                <TableHead style={{ color: "var(--gaine-muted)" }}>
                  <span className="inline-flex items-center gap-2">
                    <img
                      src={GAINE_TOKEN_IMAGE}
                      alt=""
                      className="size-5 rounded-full object-cover"
                      width={20}
                      height={20}
                    />
                    Price
                  </span>
                </TableHead>
                <TableHead style={{ color: "var(--gaine-muted)" }}>Pair</TableHead>
                <TableHead className="text-right" style={{ color: "var(--gaine-muted)" }}>
                  GAINE
                </TableHead>
                <TableHead className="text-right" style={{ color: "var(--gaine-muted)" }}>
                  Quote token
                </TableHead>
                <TableHead className="text-center w-24" style={{ color: "var(--gaine-muted)" }}>
                  Project
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.pools.map((pool) => {
                const quoteColor = getStablecoinTextColor(pool.quoteIsStablecoin);

                return (
                  <TableRow
                    key={pool.address}
                    className="border-b hover:bg-white/[0.02]"
                    style={{ borderColor: "var(--gaine-border)" }}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm tabular-nums">{pool.priceUsd}</span>
                        {pool.priceNative ? (
                          <span className="text-[11px] font-mono" style={{ color: "var(--gaine-muted)" }}>
                            {pool.priceNative}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        {pool.quoteCountryEmoji ? (
                          <span className="text-base leading-none mt-0.5" aria-hidden>
                            {pool.quoteCountryEmoji}
                          </span>
                        ) : null}
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate">{pool.pairLabel}</span>
                          <span className="text-[11px]" style={{ color: "var(--gaine-muted)" }}>
                            {pool.feePercent}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {pool.balanceA}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span
                          className="font-mono text-sm tabular-nums"
                          style={{ color: quoteColor }}
                        >
                          {pool.balanceB}
                        </span>
                        <span className="text-[11px]" style={{ color: quoteColor ?? "var(--gaine-muted)" }}>
                          {pool.quoteSymbol}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <GainePoolShareRing percent={pool.projectSharePercent} />
                    </TableCell>
                    <TableCell>
                      <a
                        href={pool.orcaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1 rounded-md transition-colors hover:bg-white/5"
                        style={{ color: "var(--gaine-muted)" }}
                        title="View on Orca"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}
