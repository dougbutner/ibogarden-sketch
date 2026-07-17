import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { NetworkApplicationForm } from "@/components/network/network-application-form";
import { useLocale } from "@/contexts/locale-context";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Partners Network | ibo.garden" },
      {
        name: "description",
        content:
          "Register your facility, practice, or farm. Decree 0239-aligned and GAINE Certified partners earn visibility and marketplace access.",
      },
      { property: "og:title", content: "Join the ibo.garden Partners Network" },
      { property: "og:description", content: "Facilities, Practitioners, Farms: register for marketplace access." },
    ],
  }),
  component: Network,
});

function Network() {
  const { t } = useLocale();
  const cards = [
    { t: t("network.facilities"), d: t("network.facilitiesDesc") },
    { t: t("network.practitioners"), d: t("network.practitionersDesc") },
    { t: t("network.farms"), d: t("network.farmsDesc") },
  ];

  return (
    <>
      <PageHeader eyebrow={t("network.eyebrow")} title={t("network.title")} lead={t("network.lead")} />

      <section className="px-6 max-w-7xl mx-auto pb-16">
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {cards.map((c) => (
            <div key={c.t} className="bg-white border border-forest/10 rounded-3xl p-7">
              <h3 className="font-serif text-2xl italic text-forest mb-2">{c.t}</h3>
              <p className="text-sm text-forest/65">{c.d}</p>
            </div>
          ))}
        </div>

        <NetworkApplicationForm />
      </section>
    </>
  );
}
