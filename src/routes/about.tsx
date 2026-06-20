import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import ibogaRoot from "@/assets/iboga-root.jpg";
import ibogabonPresentation from "@/assets/Ibogabon Business Presentation Q2 2024.pdf?url";

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
  {
    name: "Hervais OMVA",
    role: "General Manager / CEO",
    bio: "Agronomist and sociologist with over 10 years' experience as coordinator of IDRC Africa NGO, providing technical assistance to institutions, local authorities, and businesses. Pioneer in agricultural development focusing on socio-economic challenges across the region and globally.",
    orgs: [{ label: "IBOGABON" }],
  },
  {
    name: "Ivan BIYEGHE",
    role: "Operations Manager / COO",
    bio: "Business consultant with nearly 5 years as Regional Director of Falcon Eye International. Expert in identifying and realizing business opportunities worldwide, specializing in creating business relationships connecting clients, solutions, and financing.",
    orgs: [{ label: "IBOGABON" }],
  },
  {
    name: "Benny Friedmann",
    role: "Sourcing Consultant",
    bio: "Has spent years on the ground in Gabon; his network extends to dozens of farmers and generational Bwiti shamans. Past hedge-fund experience and an open, connector personality make him the link Gabon needs between farms, buyers, and ceremony.",
    orgs: [{ label: "IBOGABON" }],
  },
  {
    name: "Douglas Butner",
    role: "Tech Lead",
    bio: "Architects the on-chain infrastructure of the GAINE economy and ibo.garden protocols.",
    orgs: [
      { label: "EASY", href: "https://www.flex.town" },
      { label: "cXc.world", href: "https://cxc.world" },
      { label: "Aquarius Academy", href: "https://aquarius.academy" },
    ],
  },
  {
    name: "Amaka Zazzy, RN, MSN",
    role: "Plant Alchemist & Clinical Integration",
    bio: "Bridges clinical safety and traditional preparation for facilitators worldwide.",
    orgs: [{ label: "Wellness 4 the People" }],
  },
  {
    name: "Gabonese Advisors",
    role: "Bwiti Practitioner Council",
    bio: "Elders and ngangas guiding cultural respect and benefit-sharing.",
  },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A garden, not a marketplace."
        lead={<>ibo.garden exists to provide <strong className="font-semibold text-forest">ethical, sustainable access to Iboga</strong>: for planetary healing, in partnership with the Gabonese communities who have stewarded this medicine for millennia.</>}
      />

      <section className="px-6 max-w-7xl mx-auto pb-20 grid md:grid-cols-2 gap-12 items-start">
        <img src={ibogaRoot} alt="Iboga root" loading="lazy" className="rounded-3xl w-full object-cover aspect-[4/5]" />
        <div className="space-y-8">
          <div>
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Tabernanthe Iboga</span>
            <h2 className="font-serif text-3xl italic text-forest mt-3 mb-4">The Sacred Shrub</h2>
            <p className="text-sm text-forest/75 leading-relaxed mb-4">
              Tabernanthe Iboga is a dicotyledonous plant of the family Apocynaceae, found in Africa&apos;s equatorial
              forests. A small shrub that can reach six meters high. Rich in indole-monoterpene alkaloids, chiefly
              <strong className="font-semibold text-forest"> ibogaine</strong>, it has been used in traditional African medicine for centuries: chewing the root or bark for a
              stimulating, regenerative effect.
            </p>
            <p className="text-sm text-forest/75 leading-relaxed">
              The plant reaches maturity in <strong className="font-semibold text-forest">five years</strong>, and alkaloid quality increases the longer it grows. Iboga&apos;s
              unique mechanism of action works across a range of brain receptors, with the potential to fundamentally
              change addiction treatment and address the <strong className="font-semibold text-forest">global opioid crisis</strong>.
            </p>
          </div>
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

      <section className="px-6 py-20 bg-bone">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">IBOGABON</span>
            <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 italic leading-tight">
              Operational Capacity
            </h2>
            <p className="text-forest/70 mt-5 leading-relaxed">
              IBOGABON has established significant operational capacity and strategic partnerships to lead the Iboga
              sector: a <strong className="font-semibold text-forest">certified, compliant, and legal source of Iboga</strong> via plantations in Bibasse/Oyem, Gabon.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-forest/10 border border-forest/10 rounded-2xl overflow-hidden mb-10">
            {[
              { label: "Cultivated area", value: "13 hectares" },
              { label: "Total plantation site", value: "20 hectares" },
              { label: "Total plants", value: "51,600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-earth p-8 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold-deep mb-2">{stat.label}</p>
                <p className="font-serif text-3xl italic text-forest">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div>
              <h3 className="font-serif text-2xl italic text-forest mb-4">Plantation Yields</h3>
              <div className="space-y-3">
                {[
                  { age: "7 years", area: "5 ha", plants: "19,200", yield: "7,680 kg root bark" },
                  { age: "6 years", area: "3 ha", plants: "12,800", yield: "5,120 kg root bark" },
                  { age: "4½ years", area: "3 ha", plants: "9,600", yield: "3,840 kg root bark" },
                  { age: "3½ years", area: "2 ha", plants: "10,000", yield: "4,000 kg root bark" },
                ].map((plot) => (
                  <div key={plot.age} className="bg-earth border border-forest/10 rounded-xl px-4 py-3 flex flex-wrap justify-between gap-2 text-sm">
                    <span className="font-semibold text-forest">{plot.age}</span>
                    <span className="text-forest/60">{plot.area} · {plot.plants} plants</span>
                    <span className="text-gold-deep text-xs uppercase tracking-wider w-full">{plot.yield}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl italic text-forest mb-4">Infrastructure</h3>
                <ul className="space-y-3 text-sm text-forest/75">
                  {[
                    "Network of local planters mapped for raw material sourcing",
                    "Bolokoboue GAINE village training center and nursery facilities",
                    "Made in Gabon processing house certified to AGASA standards",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-gold shrink-0 mt-0.5">◆</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-2xl italic text-forest mb-4">Development Initiatives</h3>
                <ul className="space-y-3 text-sm text-forest/75">
                  {[
                    "Support for small planters and investment in new plantations across regions",
                    "Strategic partnerships with leading laboratories and universities in South Africa and the USA",
                    "Brainbooster promotion across the USA, France, South Africa, Zambia, Burundi, Ivory Coast, Burkina Faso, Cameroon, and Congo",
                    "Partnerships with Forest Value on plantation development and GMP laboratory financing",
                    "Government recognition of Iboga's economic and social potential; Gabon planning an international forum on iboga management",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-gold shrink-0 mt-0.5">◆</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-earth border border-forest/10 rounded-3xl p-8 md:p-10">
            <h3 className="font-serif text-2xl italic text-forest mb-3">Brainbooster</h3>
            <p className="text-sm text-forest/75 leading-relaxed mb-4">
              The first product available for sale: 100% bark and roots of Tabernanthe Iboga, comprising around twenty
              indole alkaloids. A <strong className="font-semibold text-forest">non-addictive psychostimulant</strong> that heightens perception and vigilance, strengthening
              the immune system, regulating the circulatory system, and serving as a lifestyle enhancer rooted in
              traditional Gabonese medicine.
            </p>
            <p className="text-xs text-forest/55 uppercase tracking-widest">
              Product transformations include root bark and powder, micro-dosing, food supplements, cosmetics,
              homeopathic products, essential oils, energy drinks, and alkaloid extracts.
            </p>
            <a
              href={ibogabonPresentation}
              download="Ibogabon-Business-Presentation.pdf"
              className="inline-flex items-center mt-6 text-gold text-xs font-semibold uppercase tracking-widest border-b border-gold/40 pb-1 hover:text-gold-deep"
            >
              Download business presentation →
            </a>
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
                <p className="text-[11px] text-gold uppercase tracking-widest font-semibold mb-3">{p.role}</p>
                {p.orgs && p.orgs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.orgs.map((org) =>
                      org.href ? (
                        <a
                          key={org.label}
                          href={org.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] border border-gold/35 text-gold bg-gold/10 hover:opacity-80 transition-opacity"
                        >
                          {org.label}
                        </a>
                      ) : (
                        <span
                          key={org.label}
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] border border-gold/35 text-gold bg-gold/10"
                        >
                          {org.label}
                        </span>
                      ),
                    )}
                  </div>
                )}
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
