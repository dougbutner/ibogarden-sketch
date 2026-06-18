import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import gabonFarm from "@/assets/gabon-farm.jpg";
import seedling from "@/assets/seedling.jpg";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact in Gabon | ibo.garden" },
      { name: "description", content: "Reforestation, partner farms, and benefit-sharing in Gabon. Photography and stories from the field." },
      { property: "og:title", content: "Impact in Gabon | ibo.garden" },
      { property: "og:description", content: "Reforestation and partner farms in Gabon." },
      { property: "og:image", content: gabonFarm },
    ],
  }),
  component: Impact,
});

function Impact() {
  return (
    <>
      <PageHeader
        eyebrow="Impact in Gabon"
        title="Verified by the forest itself."
        lead="Reforestation, fair returns to communities, and open verification: aligned with Gabon Decree 0239."
      />

      <section className="px-6 py-16 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <img src={gabonFarm} alt="Gabon iboga farm" loading="lazy" className="rounded-3xl w-full aspect-[4/3] object-cover" />
        <div>
          <h2 className="font-serif text-4xl italic text-forest mb-5">Reforestation Program</h2>
          <p className="text-forest/75 leading-relaxed mb-6">
            For every wild root that has been ethically harvested, three new iboga trees are planted in cooperation with Gabonese smallholders. Plot coordinates are recorded; verification is open.
          </p>
          <ul className="space-y-3 text-sm text-forest/80">
            <li className="flex gap-3"><span className="text-gold mt-1">◆</span>Partner farms across Estuaire and Ogooué-Maritime</li>
            <li className="flex gap-3"><span className="text-gold mt-1">◆</span>Quarterly drone surveys + on-ground audit</li>
            <li className="flex gap-3"><span className="text-gold mt-1">◆</span>Smallholder revenue paid in USDC, monthly</li>
          </ul>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-serif text-4xl italic text-forest mb-5">Partner Farms</h2>
          <p className="text-forest/75 leading-relaxed mb-6">
            Partner farms across Estuaire and Ogooué-Maritime. Plot coordinates recorded, quarterly drone
            surveys, and on-ground audits verify every tree planted under Decree 0239: which requires legal
            farm certification, traceability, and benefit-sharing with Gabonese communities.
          </p>
          <p className="text-sm text-forest/60">
            Partner stories and field reports will be published as verified partnerships are established.
          </p>
        </div>
        <img src={seedling} alt="Iboga seedling held in hands" loading="lazy" className="rounded-3xl w-full aspect-[4/3] object-cover" />
      </section>
    </>
  );
}
