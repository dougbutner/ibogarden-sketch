import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { NetworkApplicationForm } from "@/components/network/network-application-form";
import { useLocale } from "@/contexts/locale-context";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace | ibo.garden" },
      { name: "description", content: "Treatments, ceremonies, training, products, and donations. Network-verified, GAINE-certified listings." },
      { property: "og:title", content: "ibo.garden Marketplace" },
      { property: "og:description", content: "Treatments, training, ceremonies, and ethical sourcing." },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const { t } = useLocale();

  const categories = [
    { title: t("marketplace.catTreatments"), desc: t("marketplace.catTreatmentsDesc"), icon: "✦" },
    { title: t("marketplace.catCeremonies"), desc: t("marketplace.catCeremoniesDesc"), icon: "◉" },
    {
      title: t("marketplace.catTraining"),
      desc: t("marketplace.catTrainingDesc"),
      icon: "❋",
    },
    { title: t("marketplace.catProducts"), desc: t("marketplace.catProductsDesc"), icon: "◈" },
    { title: t("marketplace.catDonations"), desc: t("marketplace.catDonationsDesc"), icon: "♢" },
    { title: t("marketplace.catCommunity"), desc: t("marketplace.catCommunityDesc"), icon: "✤" },
  ];

  const listings = [
    {
      title: t("marketplace.listing1Title"),
      cat: t("marketplace.listing1Cat"),
      price: t("marketplace.listing1Price"),
      loc: t("marketplace.listing1Loc"),
      cert: "GAINE",
    },
    {
      title: t("marketplace.listing2Title"),
      cat: t("marketplace.listing2Cat"),
      price: t("marketplace.listing2Price"),
      loc: t("marketplace.listing2Loc"),
      cert: "Decree 0239",
    },
    {
      title: t("marketplace.listing3Title"),
      cat: t("marketplace.listing3Cat"),
      price: t("marketplace.listing3Price"),
      loc: t("marketplace.listing3Loc"),
      cert: "GAINE",
    },
    {
      title: t("marketplace.listing4Title"),
      cat: t("marketplace.listing4Cat"),
      price: t("marketplace.listing4Price"),
      loc: t("marketplace.listing4Loc"),
      cert: "Nagoya",
    },
    {
      title: t("marketplace.listing5Title"),
      cat: t("marketplace.listing5Cat"),
      price: t("marketplace.listing5Price"),
      loc: t("marketplace.listing5Loc"),
      cert: "Open",
    },
    {
      title: t("marketplace.listing6Title"),
      cat: t("marketplace.listing6Cat"),
      price: t("marketplace.listing6Price"),
      loc: t("marketplace.listing6Loc"),
      cert: "GAINE",
    },
  ];

  function certLabel(cert: string) {
    if (cert === "GAINE") return t("marketplace.certGaine");
    if (cert === "Decree 0239") return t("marketplace.certDecree");
    if (cert === "Nagoya") return t("marketplace.certNagoya");
    if (cert === "Open") return t("marketplace.certOpen");
    return cert;
  }

  return (
    <>
      <PageHeader eyebrow={t("marketplace.eyebrow")} title={t("marketplace.title")} lead={t("marketplace.lead")} />

      <section className="relative px-6 max-w-7xl mx-auto pb-16">
        <div className="blur-[6px] pointer-events-none select-none" aria-hidden="true">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-12">
            {categories.map((c) => (
              <button key={c.title} className="bg-white border border-forest/10 rounded-2xl p-5 text-left">
                <div className="text-gold text-2xl mb-3">{c.icon}</div>
                <div className="font-semibold text-forest text-sm mb-1">{c.title}</div>
                <div className="text-[11px] text-forest/55 leading-snug">{c.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-end mb-6">
            <h2 className="font-serif text-3xl italic text-forest">{t("marketplace.featured")}</h2>
            <div className="text-xs text-forest/50 uppercase tracking-widest">
              {t("marketplace.activeCount", { count: listings.length })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((l) => (
              <article key={l.title} className="bg-white border border-forest/10 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">{l.cat}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-bone rounded text-forest/70 font-semibold uppercase tracking-wider">
                    {l.cert === "GAINE" ? (
                      <span className="gaine-word gaine-word-sm">{certLabel(l.cert)}</span>
                    ) : (
                      certLabel(l.cert)
                    )}
                  </span>
                </div>
                <h3 className="font-serif text-xl italic text-forest mb-2 leading-snug">{l.title}</h3>
                <p className="text-[11px] text-forest/50 uppercase tracking-wider mb-5">{l.loc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-forest/10">
                  <span className="font-semibold text-forest">{l.price}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">{t("marketplace.viewListing")}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 bg-forest text-earth rounded-3xl p-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-serif text-3xl italic mb-3">{t("marketplace.listOnMarketplace")}</h3>
              <p className="text-earth/70">{t("marketplace.listOnMarketplaceBody")}</p>
            </div>
            <div className="md:text-right">
              <span className="inline-block bg-gold text-forest px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest">
                {t("marketplace.registerInNetwork")}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex items-start justify-center p-6 overflow-y-auto">
          <div
            role="dialog"
            aria-labelledby="marketplace-inquiry-title"
            className="w-full max-w-3xl rounded-3xl border border-forest/10 bg-earth/95 p-8 md:p-10 shadow-2xl backdrop-blur-md my-auto"
          >
            <div className="text-center mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                {t("marketplace.comingSoonTitle")}
              </span>
              <h2 id="marketplace-inquiry-title" className="font-serif text-3xl italic text-forest mt-3 leading-tight">
                {t("marketplace.dialogTitle")}
              </h2>
            </div>

            <div className="space-y-6 mb-10 text-left">
              <div>
                <h3 className="font-semibold text-forest mb-2">🇬🇦 {t("marketplace.scaleTitle")}</h3>
                <p className="text-sm text-forest/65 leading-relaxed">{t("marketplace.scaleBody")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-forest mb-2">🇬🇦 {t("marketplace.qualityTitle")}</h3>
                <p className="text-sm text-forest/65 leading-relaxed">{t("marketplace.qualityBody")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-forest mb-2">🤝 {t("marketplace.shakeTitle")}</h3>
                <p className="text-sm text-forest/65 leading-relaxed">{t("marketplace.shakeBody")}</p>
              </div>
            </div>

            <NetworkApplicationForm className="mb-10" />

            <div className="text-center border-t border-forest/10 pt-8 space-y-6">
              <p className="text-sm text-forest/65 leading-relaxed">{t("marketplace.inquiryBody")}</p>
              <Link
                to="/source"
                className="inline-block bg-forest text-earth px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors"
              >
                {t("marketplace.requestConsultation")}
              </Link>

              <div className="pt-2 space-y-4">
                <p className="text-sm text-forest/65 leading-relaxed">
                  {t("marketplace.holdGaineBefore")}{" "}
                  <Link to="/gaine" hash="jupiter" className="gaine-word gaine-word-sm text-gold hover:underline">
                    GAINE
                  </Link>{" "}
                  {t("marketplace.holdGaineAfter")}
                </p>
                <Link
                  to="/community"
                  className="inline-block border border-forest/20 text-forest px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-forest hover:text-earth transition-colors"
                >
                  {t("marketplace.enterCommunity")} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
