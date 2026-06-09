import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/source")({
  head: () => ({
    meta: [
      { title: "Direct Sourcing Consultation — ibo.garden" },
      { name: "description", content: "Direct sourcing consultation with Benny Friedman, $250 USD. Ethical, Gabon-rooted Iboga procurement guidance." },
      { property: "og:title", content: "Source Iboga — Consultation with Benny Friedman" },
      { property: "og:description", content: "$250 consultation for ethical Gabonese sourcing." },
    ],
  }),
  component: Source,
});

function Source() {
  return (
    <>
      <PageHeader
        eyebrow="Source Iboga"
        title="Direct sourcing, with respect."
        lead="A one-on-one consultation with Benny Friedman — sourcing relationships built directly with Gabonese growers, Nagoya-aligned, no intermediaries."
      />
      <section className="px-6 pb-24 max-w-3xl mx-auto">
        <div className="bg-white border border-forest/10 rounded-3xl p-10 shadow-sm">
          <div className="flex items-baseline justify-between mb-8 pb-8 border-b border-forest/10">
            <div>
              <h2 className="font-serif text-3xl italic text-forest">Consultation</h2>
              <p className="text-sm text-forest/60 mt-2">60 minutes · video call · written summary</p>
            </div>
            <div className="text-right">
              <div className="font-serif text-4xl text-gold-deep">$250</div>
              <p className="text-[11px] uppercase tracking-widest text-forest/40">USD</p>
            </div>
          </div>
          <ul className="space-y-4 text-forest/80 mb-10">
            {["Vetted Gabonese farms and cooperatives",
              "Nagoya Protocol compliance pathway",
              "Logistics, customs, and legal jurisdiction map",
              "Introductions to GAINE Certified suppliers",
              "Written sourcing brief delivered within 7 days",
            ].map((b) => (
              <li key={b} className="flex gap-3"><span className="text-gold mt-1">◆</span><span>{b}</span></li>
            ))}
          </ul>
          <button className="w-full bg-forest text-earth py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-moss transition-colors">
            Book with Benny
          </button>
          <p className="mt-4 text-center text-xs text-forest/50">
            Or <Link to="/network" className="text-gold underline">register your facility</Link> for ongoing sourcing partnerships.
          </p>
        </div>
      </section>
    </>
  );
}
