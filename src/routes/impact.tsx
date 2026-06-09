import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import gabonPlantation from "@/assets/gabon-plantation.jpg";
import seedling from "@/assets/seedling.jpg";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact in Gabon — ibo.garden" },
      { name: "description", content: "Live impact dashboard. Trees planted, people helped, USDC to Gabon, certified farms. Photography and stories from partners." },
      { property: "og:title", content: "Impact in Gabon — ibo.garden" },
      { property: "og:description", content: "Live dashboard and reforestation tracking." },
      { property: "og:image", content: gabonPlantation },
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
        lead="Every dollar, every tree, every family. Tracked, audited, and made visible on-chain."
      />

      <section className="px-6 max-w-7xl mx-auto pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["14,202", "Trees Planted", "+312 this week"],
            ["840", "Families Supported", "+12 this month"],
            ["$284,420", "USDC to Gabon", "+$18.4K this month"],
            ["14", "Farms Certified", "+2 in Q1"],
          ].map(([n, l, sub]) => (
            <div key={l} className="bg-white border border-forest/10 rounded-3xl p-6">
              <div className="font-serif text-4xl md:text-5xl text-gold-deep mb-2">{n}</div>
              <p className="text-[11px] uppercase tracking-widest font-semibold text-forest mb-1">{l}</p>
              <p className="text-[10px] text-forest/50">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <img src={gabonPlantation} alt="Gabon iboga plantation" loading="lazy" className="rounded-3xl w-full aspect-[4/3] object-cover" />
        <div>
          <h2 className="font-serif text-4xl italic text-forest mb-5">Reforestation Program</h2>
          <p className="text-forest/75 leading-relaxed mb-6">
            For every wild root that has been ethically harvested, three new iboga trees are planted in cooperation with Gabonese smallholders. Plot coordinates are recorded; verification is open.
          </p>
          <ul className="space-y-3 text-sm text-forest/80">
            <li className="flex gap-3"><span className="text-gold mt-1">◆</span>14 partner farms across Estuaire and Ogooué-Maritime</li>
            <li className="flex gap-3"><span className="text-gold mt-1">◆</span>Quarterly drone surveys + on-ground audit</li>
            <li className="flex gap-3"><span className="text-gold mt-1">◆</span>Smallholder revenue paid in USDC, monthly</li>
          </ul>
        </div>
      </section>

      <section className="px-6 py-20 bg-forest text-earth">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl italic mb-12">Fund Split, Honestly</h2>
          <div className="grid md:grid-cols-3 gap-px bg-earth/10 rounded-2xl overflow-hidden">
            {[
              ["20%", "Organization", "Operations, audits, technical."],
              ["30%", "Economic Participants", "Certified partners, farms, holders."],
              ["50%", "Philanthropy", "Gabon communities, healing, education."],
            ].map(([p, t, d]) => (
              <div key={t} className="bg-forest p-8">
                <div className="text-gold font-serif text-5xl mb-2">{p}</div>
                <h3 className="font-serif text-xl italic mb-2">{t}</h3>
                <p className="text-sm text-earth/65">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-serif text-4xl italic text-forest mb-5">Stories from Partners</h2>
          <figure className="bg-bone p-7 rounded-3xl border border-forest/10 mb-4">
            <blockquote className="font-serif italic text-xl text-forest leading-snug">"The first time the medicine traveled out, it carried our names with it. Now, the names return as schools, as wells, as trees."</blockquote>
            <figcaption className="mt-4 text-xs uppercase tracking-widest text-gold-deep font-semibold">— Bwiti elder, Lambaréné</figcaption>
          </figure>
        </div>
        <img src={seedling} alt="Iboga seedling held in hands" loading="lazy" className="rounded-3xl w-full aspect-[4/3] object-cover" />
      </section>
    </>
  );
}
