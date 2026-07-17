import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { useLocale } from "@/contexts/locale-context";
import gabonFarm from "@/assets/gabon-farm.jpg";
import seedling from "@/assets/seedling.jpg";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact in Gabon | ibo.garden" },
      {
        name: "description",
        content:
          "Ibogarden invests in Gabonese farms, helps growers comply with Decree 0239, and routes GAINE liquidity toward ethical export and global healing.",
      },
      { property: "og:title", content: "Impact in Gabon | ibo.garden" },
      {
        property: "og:description",
        content: "Direct farm investment, export compliance, and GAINE as financial rails from Solana to Gabon.",
      },
      { property: "og:image", content: gabonFarm },
    ],
  }),
  component: Impact,
});

function Impact() {
  const { t } = useLocale();

  return (
    <>
      <PageHeader eyebrow={t("impact.eyebrow")} title={t("impact.title")} lead={t("impact.lead")} />

      <section className="px-6 py-16 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <img
          src={gabonFarm}
          alt={t("impact.altFields")}
          loading="lazy"
          className="rounded-3xl w-full aspect-[4/3] object-cover"
        />
        <div>
          <h2 className="font-serif text-4xl italic text-forest mb-5">{t("impact.farmsTitle")}</h2>
          <p className="text-forest/75 leading-relaxed mb-6">{t("impact.farmsP1")}</p>
          <p className="text-forest/75 leading-relaxed mb-6">{t("impact.farmsP2")}</p>
          <ul className="space-y-3 text-sm text-forest/80">
            {[t("impact.bullet1"), t("impact.bullet2"), t("impact.bullet3")].map((b) => (
              <li key={b} className="flex gap-3">
                <span className="text-gold mt-1">◆</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-serif text-4xl italic text-forest mb-5">{t("impact.gaineTitle")}</h2>
          <p className="text-forest/75 leading-relaxed mb-6">{t("impact.gaineP1")}</p>
          <p className="text-forest/75 leading-relaxed mb-6">{t("impact.gaineP2")}</p>
          <p className="text-forest/75 leading-relaxed mb-6">{t("impact.gaineP3")}</p>
          <Link
            to="/gaine"
            className="inline-flex items-center text-gold font-semibold tracking-wider uppercase text-sm group"
          >
            {t("impact.learnGaine")}
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <img
          src={seedling}
          alt={t("impact.altSeedling")}
          loading="lazy"
          className="rounded-3xl w-full aspect-[4/3] object-cover"
        />
      </section>

      <section className="px-6 pb-24 max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl italic text-forest mb-6 text-center">{t("impact.whyTitle")}</h2>
        <div className="space-y-6 text-forest/75 leading-relaxed text-lg">
          <p>{t("impact.whyP1")}</p>
          <p>{t("impact.whyP2")}</p>
          <p className="text-forest/60 text-base italic text-center pt-4">{t("impact.whyClose")}</p>
        </div>
      </section>
    </>
  );
}
