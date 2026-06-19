import {
  GAINE_LAUNCH_PRICE,
  GAINE_LAUNCH_PRICE_NOTE,
  GAINE_MAX_SUPPLY,
  GAINE_PROGRAM,
  GAINE_TRANSFER_FEE,
  GAINE_TRANSFER_FEE_LABEL,
} from "@/data/gaine";

const STATS = [
  { value: GAINE_MAX_SUPPLY, label: "Max Supply" },
  { value: GAINE_LAUNCH_PRICE, label: "Launch Price", note: GAINE_LAUNCH_PRICE_NOTE },
  { value: GAINE_TRANSFER_FEE, label: GAINE_TRANSFER_FEE_LABEL },
  { value: GAINE_PROGRAM, label: "Solana Program" },
] as const;

export function GaineStatRow() {
  return (
    <section className="px-6 pb-16 max-w-5xl mx-auto w-full">
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {STATS.map(({ value, label, ...rest }) => (
          <div key={label} className="gaine-surface-card px-5 py-6 text-center">
            <dd className="gaine-display text-2xl md:text-3xl tracking-tight">{value}</dd>
            <dt className="mt-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--gaine-muted)" }}>
              {label}
            </dt>
            {"note" in rest && rest.note ? (
              <p className="mt-1 text-[10px] leading-snug" style={{ color: "var(--gaine-muted)" }}>
                {rest.note}
              </p>
            ) : null}
          </div>
        ))}
      </dl>
    </section>
  );
}
