"use client";

import { useLocale } from "@/contexts/locale-context";
import {
  GAINE_LAUNCH_PRICE,
  GAINE_MAX_SUPPLY,
  GAINE_PROGRAM,
  GAINE_TRANSFER_FEE,
} from "@/data/gaine";
import { getGaineLaunchPriceNote, getGaineTransferFeeLabel } from "@/data/gaine-copy";

export function GaineStatRow() {
  const { t, locale } = useLocale();

  const stats = [
    { value: GAINE_MAX_SUPPLY, label: t("gaineUi.maxSupply") },
    { value: GAINE_LAUNCH_PRICE, label: t("gaineUi.launchPrice"), note: getGaineLaunchPriceNote(locale) },
    { value: GAINE_TRANSFER_FEE, label: getGaineTransferFeeLabel(locale) },
    { value: GAINE_PROGRAM, label: t("gaineUi.solanaProgram") },
  ];

  return (
    <section className="px-6 pb-16 max-w-5xl mx-auto w-full">
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map(({ value, label, note }) => (
          <div key={label} className="gaine-surface-card px-5 py-6 text-center">
            <dd className="gaine-display text-2xl md:text-3xl tracking-tight">{value}</dd>
            <dt className="mt-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--gaine-muted)" }}>
              {label}
            </dt>
            {note ? (
              <p className="mt-1 text-[10px] leading-snug" style={{ color: "var(--gaine-muted)" }}>
                {note}
              </p>
            ) : null}
          </div>
        ))}
      </dl>
    </section>
  );
}
