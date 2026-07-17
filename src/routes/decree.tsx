import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { useLocale } from "@/contexts/locale-context";

export const Route = createFileRoute("/decree")({
  head: () => ({
    meta: [
      { title: "Gabon Decree 0239 | ibo.garden" },
      {
        name: "description",
        content:
          "Plain-English guide to Gabon Presidential Decree No. 0239/PR/MJSRCAVA (22 May 2026): Iboga access, use, research, transformation, commercialization, and traditional knowledge.",
      },
      { property: "og:title", content: "Gabon Decree 0239: Iboga Sovereignty & Regulation" },
      {
        property: "og:description",
        content:
          "How Gabon regulates Iboga, its derivatives, and associated traditional knowledge: and what it means for ethical sourcing.",
      },
    ],
  }),
  component: Decree,
});

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-serif text-3xl md:text-4xl italic text-forest mb-6">{title}</h2>
      {children}
    </section>
  );
}

function Decree() {
  const { t } = useLocale();

  const nav = [
    ["overview", t("decree.navOverview")],
    ["definitions", t("decree.navDefinitions")],
    ["scope", t("decree.navScope")],
    ["authorization", t("decree.navAuthorization")],
    ["export", t("decree.navExport")],
    ["benefits", t("decree.navCommunities")],
    ["knowledge", t("decree.navCommunities")],
    ["ip", t("decree.navScope")],
    ["fund", t("decree.navFund")],
    ["commission", t("decree.navCommission")],
    ["alignment", t("decree.navAlignment")],
  ] as const;

  const definitions = [
    { term: t("decree.defIboga"), text: t("decree.defIbogaText") },
    { term: t("decree.defDerivatives"), text: t("decree.defDerivativesText") },
    { term: t("decree.defKnowledge"), text: t("decree.defKnowledgeText") },
    { term: t("decree.defTargeted"), text: t("decree.defTargetedText") },
    { term: t("decree.defUse"), text: t("decree.defUseText") },
  ];

  const authItems = [t("decree.auth1"), t("decree.auth2"), t("decree.auth3"), t("decree.auth4")];
  const fundItems = [t("decree.fund1"), t("decree.fund2"), t("decree.fund3")];
  const fundSources = [t("decree.fundS1"), t("decree.fundS2"), t("decree.fundS3"), t("decree.fundS4")];
  const commissionItems = [t("decree.commission1"), t("decree.commission2"), t("decree.commission3"), t("decree.commission4")];

  const alignment = [
    [t("decree.align1Title"), t("decree.align1Body")],
    [t("decree.align2Title"), t("decree.align2Body")],
    [t("decree.align3Title"), t("decree.align3Body")],
    [t("decree.align4Title"), t("decree.align4Body")],
    [t("decree.align5Title"), t("decree.align5Body")],
    [t("decree.align6Title"), t("decree.align6Body")],
  ] as const;

  return (
    <>
      <PageHeader eyebrow={t("decree.eyebrow")} title={t("decree.title")} lead={t("decree.lead")}>
        <p className="mt-4 text-sm text-forest/60 leading-relaxed max-w-2xl">{t("decree.published")}</p>
      </PageHeader>

      <section className="px-6 max-w-7xl mx-auto pb-8">
        <nav className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-widest">
          {nav.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="px-3 py-1.5 rounded-full border border-forest/15 text-forest/70 hover:border-gold/50 hover:text-gold transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </section>

      <section className="px-6 max-w-7xl mx-auto pb-24 space-y-20">
        <Section id="overview" title={t("decree.overviewTitle")}>
          <p className="text-forest/80 leading-relaxed max-w-3xl">{t("decree.overviewBody")}</p>
        </Section>

        <Section id="definitions" title={t("decree.definitionsTitle")}>
          <div className="grid md:grid-cols-2 gap-4">
            {definitions.map((d) => (
              <div key={d.term} className="bg-white border border-forest/10 rounded-2xl p-6">
                <h3 className="font-semibold text-forest mb-2">{d.term}</h3>
                <p className="text-sm text-forest/70 leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="scope" title={t("decree.scopeTitle")}>
          <p className="text-forest/80 leading-relaxed max-w-3xl">{t("decree.scopeBody")}</p>
        </Section>

        <Section id="authorization" title={t("decree.authTitle")}>
          <p className="text-forest/80 leading-relaxed mb-8 max-w-3xl">{t("decree.authIntro")}</p>
          <div className="grid md:grid-cols-2 gap-8">
            <ul className="space-y-4">
              {authItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-forest/80 leading-relaxed">
                  <span className="text-gold mt-0.5 shrink-0">◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-white border border-forest/10 rounded-2xl p-6">
              <h3 className="font-semibold text-forest mb-2">{t("decree.communitiesTitle")}</h3>
              <p className="text-sm text-forest/70 leading-relaxed">{t("decree.communitiesBody")}</p>
            </div>
          </div>
        </Section>

        <Section id="export" title={t("decree.exportTitle")}>
          <p className="text-forest/80 leading-relaxed max-w-3xl">{t("decree.exportBody")}</p>
        </Section>

        <Section id="benefits" title={t("decree.align2Title")}>
          <p className="text-forest/80 leading-relaxed max-w-3xl">{t("decree.align2Body")}</p>
        </Section>

        <Section id="knowledge" title={t("decree.defKnowledge")}>
          <p className="text-forest/80 leading-relaxed max-w-3xl">{t("decree.defKnowledgeText")}</p>
        </Section>

        <Section id="ip" title={t("decree.align5Title")}>
          <p className="text-forest/80 leading-relaxed max-w-3xl">{t("decree.align5Body")}</p>
        </Section>

        <Section id="fund" title={t("decree.fundTitle")}>
          <p className="text-forest/80 leading-relaxed mb-8 max-w-3xl">{t("decree.fundIntro")}</p>
          <div className="grid md:grid-cols-2 gap-8">
            <ul className="space-y-3">
              {fundItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-forest/80">
                  <span className="text-gold">◆</span>
                  {item}
                </li>
              ))}
            </ul>
            <div>
              <h3 className="font-semibold text-forest uppercase tracking-widest text-xs mb-4">
                {t("decree.fundSourcesIntro")}
              </h3>
              <ul className="space-y-3">
                {fundSources.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-forest/80">
                    <span className="text-gold">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="commission" title={t("decree.commissionTitle")}>
          <p className="text-forest/80 leading-relaxed mb-8 max-w-3xl">{t("decree.commissionIntro")}</p>
          <ul className="grid md:grid-cols-2 gap-4">
            {commissionItems.map((item) => (
              <li
                key={item}
                className="bg-white border border-forest/10 rounded-2xl p-5 text-sm text-forest/80 leading-relaxed flex gap-3"
              >
                <span className="text-gold shrink-0">◆</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="alignment" title={t("decree.alignmentTitle")}>
          <div className="bg-forest text-earth rounded-[2rem] p-10 md:p-14">
            <p className="text-earth/80 leading-relaxed mb-10 max-w-3xl">{t("decree.ctaBody")}</p>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {alignment.map(([title, body]) => (
                <div key={title} className="border border-earth/15 rounded-2xl p-6">
                  <h3 className="font-semibold text-gold mb-2">{title}</h3>
                  <p className="text-sm text-earth/70 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/network"
                className="bg-gold text-forest px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold/90 transition-colors"
              >
                {t("decree.ctaNetwork")}
              </Link>
              <Link
                to="/impact"
                className="border border-earth/30 text-earth px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-earth/10 transition-colors"
              >
                {t("decree.ctaSource")}
              </Link>
            </div>
          </div>
        </Section>

        <section className="border-t border-forest/10 pt-12">
          <p className="text-xs text-forest/50 leading-relaxed max-w-3xl">{t("decree.disclaimer")}</p>
        </section>
      </section>
    </>
  );
}
