import {
  GAINE_MAX_SUPPLY,
  GAINE_LAUNCH_PRICE,
  GAINE_PROGRAM,
  GAINE_TRANSFER_FEE,
} from "@/data/gaine";

const STATS = [
  { value: GAINE_MAX_SUPPLY, label: "Max Supply" },
  { value: GAINE_LAUNCH_PRICE, label: "Launch Price" },
  { value: GAINE_TRANSFER_FEE, label: "Transfer Fee → USDC" },
  { value: GAINE_PROGRAM, label: "Solana Program" },
] as const;

export function GaineStatRow() {
  return (
    <section className="px-6 pb-16 max-w-5xl mx-auto w-full">
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {STATS.map(({ value, label }) => (
          <div key={label} className="gaine-surface-card px-5 py-6 text-center">
            <dd className="gaine-display text-2xl md:text-3xl tracking-tight">{value}</dd>
            <dt className="mt-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--gaine-muted)" }}>
              {label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
