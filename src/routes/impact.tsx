import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
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
        content:
          "Direct farm investment, export compliance, and GAINE as financial rails from Solana to Gabon.",
      },
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
        title="Rooted in the farmers."
        lead="Ibogarden is on the ground with growers: investing directly in farms, connecting existing operators into a trusted network, and helping them meet Gabon's new export requirements under Decree 0239."
      />

      <section className="px-6 py-16 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <img
          src={gabonFarm}
          alt="Iboga fields in Gabon"
          loading="lazy"
          className="rounded-3xl w-full aspect-[4/3] object-cover"
        />
        <div>
          <h2 className="font-serif text-4xl italic text-forest mb-5">Investing in farms</h2>
          <p className="text-forest/75 leading-relaxed mb-6">
            We are not abstract impact reporting. Ibogabon and ibo.garden put capital and attention where
            the root actually grows: working farms, nursery stock, harvest practices, and the people who have
            stewarded Tabernanthe Iboga for generations.
          </p>
          <p className="text-forest/75 leading-relaxed mb-6">
            For growers already in the network, we help with coordination, traceability, and the paperwork
            and standards the new export regime demands. Certification, benefit-sharing, and legal pathways
            are not optional extras. They are how the Holy Root reaches the world without leaving Gabonese
            communities behind.
          </p>
          <ul className="space-y-3 text-sm text-forest/80">
            <li className="flex gap-3">
              <span className="text-gold mt-1">◆</span>
              Direct investment in sustainable, regulated production
            </li>
            <li className="flex gap-3">
              <span className="text-gold mt-1">◆</span>
              Network support for existing farms across Gabon
            </li>
            <li className="flex gap-3">
              <span className="text-gold mt-1">◆</span>
              Guidance on Decree 0239 compliance, traceability, and export certification
            </li>
          </ul>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-serif text-4xl italic text-forest mb-5">
            <span className="gaine-word gaine-word-sm">GAINE</span> as further impact
          </h2>
          <p className="text-forest/75 leading-relaxed mb-6">
            Farm work is the foundation. <span className="gaine-word gaine-word-sm">GAINE</span> extends it
            into the digital realm: a DeFi money model designed to provide financial rails for the Australian
            dollar on Solana, alongside USD, EUR, GBP, CHF, BRL, and gold-backed liquidity.
          </p>
          <p className="text-forest/75 leading-relaxed mb-6">
            Through the ordinary movements of markets, arbitrage, and pooled liquidity, value can travel across
            borders in ways that traditional aid never could. A butterfly effect: capital circulating on-chain,
            fees routing toward Ibogabon and holder-chosen impact, and more of the world&apos;s attention and
            resources bending toward Gabon.
          </p>
          <p className="text-forest/75 leading-relaxed mb-6">
            The spirit of Iboga does not stay in the forest. It moves with the root, with the story, with the
            people who carry it. <span className="gaine-word gaine-word-sm">GAINE</span> is one connective
            layer in that movement: finance in service of the medicine, not the other way around.
          </p>
          <Link
            to="/gaine"
            className="inline-flex items-center text-gold font-semibold tracking-wider uppercase text-sm group"
          >
            Learn about GAINE
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <img
          src={seedling}
          alt="Young iboga plants"
          loading="lazy"
          className="rounded-3xl w-full aspect-[4/3] object-cover"
        />
      </section>

      <section className="px-6 pb-24 max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl italic text-forest mb-6 text-center">Why it matters</h2>
        <div className="space-y-6 text-forest/75 leading-relaxed text-lg">
          <p>
            The final benefit is not measured only in hectares planted or tokens traded. It is measured in
            healing: the addiction American society carries to consumerism, to substances, and to negative
            emotions held as identity.
          </p>
          <p>
            Two cultural misalignments run through each energetic center, blocking the harmonization of human
            beings with themselves, with their families, and with the Earth itself. Iboga opens a path back
            to that harmony. Getting the root to people ethically, and getting value back to the farmers who
            grow it, is how ibo.garden serves that path.
          </p>
          <p className="text-forest/60 text-base italic text-center pt-4">
            From Gabonese soil to Solana rails to the person ready to heal: one connected garden.
          </p>
        </div>
      </section>
    </>
  );
}
