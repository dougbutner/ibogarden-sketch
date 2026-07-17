import { createFileRoute, Link } from "@tanstack/react-router";
import { GaineContractAddress } from "@/components/gaine/gaine-contract-address";
import { GaineDisclaimer } from "@/components/gaine/gaine-disclaimer";
import { GaineHero } from "@/components/gaine/gaine-hero";
import { GainePanels } from "@/components/gaine/gaine-panels";
import { GaineReflection } from "@/components/gaine/gaine-reflection";
import { GainePoolsTable } from "@/components/gaine/gaine-pools-table";
import { GaineJupiterSwap } from "@/components/gaine/gaine-jupiter-swap";
import { GaineStatRow } from "@/components/gaine/gaine-stat-row";
import { useLocale } from "@/contexts/locale-context";
import { getGaineInfoPanels } from "@/data/gaine-copy";

export const Route = createFileRoute("/gaine")({
  head: () => ({
    meta: [
      { title: "GAINE Token on Solana | ibo.garden" },
      {
        name: "description",
        content:
          "GAINE on Solana: digitized fiat routes, buy-to-mint backing from $1–$10M per token, and a 2% transfer fee directed to Gabon farm operations, market-making, and iboga-focused initiatives.",
      },
      { property: "og:title", content: "GAINE: Impact that stays. Investment that grows." },
      {
        property: "og:description",
        content:
          "DeFi money model on Solana: trusted fiat routes, range-backed GAINE, and transparent 2% redistribution.",
      },
    ],
  }),
  component: Gaine,
});

function Gaine() {
  const { t, locale } = useLocale();
  const panels = getGaineInfoPanels(locale);

  return (
    <div className="gaine-page -mt-12 pb-0">
      <GaineHero />
      <GaineStatRow />
      <GainePoolsTable />
      <GaineReflection />

      <section id="what-is-gaine" className="px-6 pb-20 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="mb-8 md:mb-10">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--gaine-accent)" }}
          >
            {t("gaine.howDifferent")}
          </span>
          <h2 className="gaine-display text-3xl md:text-4xl mt-3">{t("gaine.realFinancial")}</h2>
          <div className="mt-4 max-w-3xl space-y-4 leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
            <p>{t("gaine.p1")}</p>
            <p>{t("gaine.p2")}</p>
            <p>{t("gaine.p3")}</p>
          </div>
        </div>
        <GainePanels panels={panels} />
      </section>

      <section id="jupiter" className="px-6 py-20 max-w-7xl mx-auto w-full space-y-12 scroll-mt-24">
        <GaineJupiterSwap />

        <div className="gaine-surface-card p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="gaine-display text-2xl mb-2">{t("gaine.legalFramework")}</h2>
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--gaine-muted)" }}>
              {t("gaine.legalBody")}
            </p>
          </div>
          <Link
            to="/decree"
            className="shrink-0 border px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-colors hover:bg-white/5 text-center"
            style={{ borderColor: "var(--gaine-border)", color: "var(--gaine-text)" }}
          >
            {t("gaine.readDecree")}
          </Link>
        </div>

        <div>
          <h2 className="gaine-display text-3xl mb-8">{t("gaine.tokenUtility")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: t("gaine.accessChat"), body: t("gaine.accessChatBody") },
              { title: t("gaine.supportInitiatives"), body: t("gaine.supportInitiativesBody") },
            ].map((item) => (
              <div key={item.title} className="gaine-surface-card p-7">
                <h3 className="gaine-display text-lg mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GaineContractAddress />

      <GaineDisclaimer />
    </div>
  );
}
