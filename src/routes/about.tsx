import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import ibogaRoot from "@/assets/iboga-root.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | ibo.garden" },
      { name: "description", content: "Mission, team, and values: ethical, sustainable access to Iboga rooted in Gabonese Bwiti tradition and the Nagoya Protocol." },
      { property: "og:title", content: "About ibo.garden" },
      { property: "og:description", content: "Mission, team, and values rooted in Gabon and Bwiti tradition." },
      { property: "og:image", content: ibogaRoot },
    ],
  }),
  component: About,
});

const TEAM = [
  { name: "Douglas Butner", role: "Tech Lead", bio: "Architects the on-chain infrastructure of the GAINE economy and ibo.garden protocols." },
  { name: "Benny Friedmann", role: "Sourcing Consultant", bio: "Direct relationships with Gabonese farms. Offers $250 sourcing consultations." },
  { name: "Amaka Zazzy, RN, MSN", role: "Plant Alchemist & Clinical Integration", bio: "Bridges clinical safety and traditional preparation for facilitators worldwide." },
  { name: "Gabonese Advisors", role: "Bwiti Practitioner Council", bio: "Elders and ngangas guiding cultural respect and benefit-sharing." },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A garden, not a marketplace."
        lead="ibo.garden exists to provide ethical, sustainable access to Iboga: for planetary healing, in partnership with the Gabonese communities who have stewarded this medicine for millennia."
      />

      <section className="px-6 max-w-7xl mx-auto pb-20 grid md:grid-cols-2 gap-12 items-start">
        <img src={ibogaRoot} alt="Iboga root" loading="lazy" className="rounded-3xl w-full object-cover aspect-[4/5]" />
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-3xl italic text-forest mb-4">Our Values</h2>
            <ul className="space-y-3 text-forest/80">
              {["Sustainability: every harvest replanted, tracked, and verified.",
                "Reciprocity: funds flow back to Gabon, not away from it.",
                "Transparency: sourcing, finances, and certification on-chain.",
                "Accessibility: care for those who cannot afford it, through nomination.",
              ].map((v) => (
                <li key={v} className="flex gap-3"><span className="text-gold mt-1">◆</span><span>{v}</span></li>
              ))}
            </ul>
          </div>
          <div className="bg-bone p-6 rounded-2xl border border-forest/10">
            <h3 className="font-serif text-xl italic text-forest mb-2">Gabon Decree 0239 & Nagoya Protocol</h3>
            <p className="text-sm text-forest/70 leading-relaxed mb-4">
              Gabon's Presidential Decree 0239 (22 May 2026) establishes sovereign control over Iboga, its
              derivatives, and associated traditional knowledge: requiring prior authorization, community
              consultation, traceable export from certified farms, and fair benefit-sharing. We operate
              within this framework and the Nagoya Protocol, under guidance from a Bwiti Practitioner Council.
            </p>
            <Link to="/decree" className="text-xs font-semibold uppercase tracking-widest text-gold hover:text-gold-deep">
              Read the decree summary →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-forest text-earth">
        <div className="max-w-7xl mx-auto">
          <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Team</span>
          <h2 className="font-serif text-4xl md:text-5xl italic mt-4 mb-12">Stewards of the Garden</h2>
          <div className="grid md:grid-cols-2 gap-px bg-earth/10 rounded-2xl overflow-hidden border border-earth/10">
            {TEAM.map((p) => (
              <div key={p.name} className="bg-forest p-8">
                <h3 className="font-serif text-2xl italic text-earth mb-1">{p.name}</h3>
                <p className="text-[11px] text-gold uppercase tracking-widest font-semibold mb-4">{p.role}</p>
                <p className="text-sm text-earth/70 leading-relaxed">{p.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-3xl mx-auto text-center">
        <p className="text-xs text-forest/50 uppercase tracking-widest">
          Disclaimer · Nothing on this site constitutes medical advice. Iboga is restricted or controlled in many jurisdictions. 18+. Check your local laws.
        </p>
      </section>
    </>
  );
}
