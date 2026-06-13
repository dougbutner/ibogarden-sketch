import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/decree")({
  head: () => ({
    meta: [
      { title: "Gabon Decree 0239 — ibo.garden" },
      {
        name: "description",
        content:
          "Plain-English guide to Gabon Presidential Decree No. 0239/PR/MJSRCAVA (22 May 2026): Iboga access, use, research, transformation, commercialization, and traditional knowledge.",
      },
      { property: "og:title", content: "Gabon Decree 0239 — Iboga Sovereignty & Regulation" },
      {
        property: "og:description",
        content:
          "How Gabon regulates Iboga, its derivatives, and associated traditional knowledge — and what it means for ethical sourcing.",
      },
    ],
  }),
  component: Decree,
});

const DEFINITIONS = [
  {
    term: "Iboga",
    text: "Tabernanthe iboga — a Gabonese forest medicinal shrub (also known as Eboghe or Bois Sacré). Rich in indole alkaloids, notably ibogaine. Used traditionally in ritual, spiritual, and therapeutic practice; studied for addiction and neurological conditions.",
  },
  {
    term: "Iboga derivatives",
    text: "All alkaloids, metabolites, derivatives, analogues, and any chemical substance whose structure, properties, or applications derive directly or indirectly from Iboga.",
  },
  {
    term: "Associated traditional knowledge",
    text: "Gabonese traditional rites and practices involving Iboga.",
  },
  {
    term: "Targeted substance",
    text: "Any plant-based remedy, traditional botanical preparation, metabolite, derivative, or new chemical entity whose molecular scaffold or pharmacophore is essentially derived from or inspired by Iboga compounds.",
  },
  {
    term: "Use",
    text: "Any use of Iboga, its derivatives, or associated traditional knowledge for purposes other than private use.",
  },
];

const AUTHORIZATION = [
  "Prior authorization from the Minister of Culture, after consultation with affected indigenous and local communities and with the unanimous approval of the Interministerial Technical Commission.",
  "A terms-of-reference document (cahier des charges) attached to every authorization.",
  "Valid for one year, renewable.",
  "Subject to a fee; amount and payment terms set by subsequent regulations.",
];

const SOVEREIGN_FUND = [
  "Development of the Iboga sector",
  "National scientific research",
  "Promotion and valorization of cultural heritage",
];

const FUND_SOURCES = [
  "Authorization fees and benefit-sharing agreements",
  "Fines and penalties",
  "Contributions from international partners",
  "Donations and bequests",
];

const COMMISSION = [
  "Review authorization requests under this decree",
  "Certify the origin of Iboga and its derivatives",
  "Advise the Minister of Culture on all Iboga-related matters",
  "Monitor patent applications in line with Article 17",
];

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
  return (
    <>
      <PageHeader
        eyebrow="Official Gazette · 22 May 2026"
        title="Gabon Decree 0239"
        lead={
          <>
            Presidential Decree No.{" "}
            <strong className="font-semibold text-forest">0239/PR/MJSRCAVA</strong> of 22 May 2026 regulates
            access, use, exploitation, research, transformation, and commercialization of Iboga, its derivatives,
            and associated traditional knowledge in the Gabonese Republic.
          </>
        }
      >
        <p className="mt-4 text-sm text-forest/60 leading-relaxed max-w-2xl">
          Published in the <em>Journal Officiel de la République Gabonaise</em>, No. 115 Quinquies. Signed by
          President Brice Clotaire Oligui Nguema. Issued under the Ministry of Youth, Sports, Cultural Outreach
          and the Arts, responsible for Associative Life.
        </p>
      </PageHeader>

      <section className="px-6 max-w-7xl mx-auto pb-8">
        <nav className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-widest">
          {[
            ["overview", "Overview"],
            ["definitions", "Definitions"],
            ["scope", "Scope"],
            ["authorization", "Authorization"],
            ["export", "Export"],
            ["benefits", "Benefit-sharing"],
            ["knowledge", "Traditional knowledge"],
            ["ip", "Intellectual property"],
            ["fund", "Sovereign Fund"],
            ["commission", "Commission"],
            ["alignment", "ibo.garden alignment"],
          ].map(([id, label]) => (
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
        <Section id="overview" title="What this decree does">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-forest/80 leading-relaxed">
              <p>
                Decree 0239 establishes Gabon's sovereign framework for Iboga — from wild harvest and farm
                cultivation to research, processing, domestic trade, and export. It applies to Iboga in all forms,
                ibogaine and all related alkaloids, and any compound whose properties were first identified from
                Iboga, regardless of where it is later produced.
              </p>
              <p>
                The decree applies to all persons and entities — Gabonese or foreign — whose activities involve
                use, exploitation, research, transformation, or commercialization of Iboga, its derivatives, or
                associated traditional knowledge.
              </p>
            </div>
            <div className="bg-bone border border-forest/10 rounded-3xl p-8 space-y-4">
              <h3 className="font-semibold text-forest uppercase tracking-widest text-xs">Legal basis</h3>
              <ul className="space-y-2 text-sm text-forest/75">
                <li>Constitution of Gabon (Article 95)</li>
                <li>Convention on Biological Diversity (1992)</li>
                <li>UNESCO Intangible Cultural Heritage Convention (2003)</li>
                <li>UNESCO Cultural Diversity Convention (2005)</li>
                <li>WIPO Treaty on Genetic Resources & Traditional Knowledge (2024)</li>
                <li>Nagoya Protocol on Access and Benefit-sharing (2010)</li>
                <li>Gabon Forest Code, Research Law, and Cultural Property Law</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="definitions" title="Key definitions">
          <div className="grid md:grid-cols-2 gap-4">
            {DEFINITIONS.map((d) => (
              <div key={d.term} className="bg-white border border-forest/10 rounded-2xl p-6">
                <h3 className="font-semibold text-forest mb-2">{d.term}</h3>
                <p className="text-sm text-forest/70 leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="scope" title="Scope & sovereignty">
          <div className="space-y-6 text-forest/80 leading-relaxed max-w-3xl">
            <p>
              <strong className="text-forest">Attachment principle (Articles 7–8):</strong> Any compound, process,
              application, or use whose properties or indications were first identified from Iboga or ibogaine is
              legally attached to that resource and to associated traditional knowledge — including activities
              outside Gabon's territory.
            </p>
            <p>
              <strong className="text-forest">Full sovereignty (Article 6):</strong> Gabon exercises complete
              sovereignty over Iboga, its derivatives, associated traditional knowledge, and their present and
              future applications — in respect of community interests.
            </p>
            <div className="bg-forest text-earth rounded-3xl p-8">
              <h3 className="font-serif text-2xl italic mb-4">What falls under the decree</h3>
              <ul className="space-y-2 text-sm text-earth/80">
                <li className="flex gap-3"><span className="text-gold">◆</span>Iboga in all physical forms</li>
                <li className="flex gap-3"><span className="text-gold">◆</span>Ibogaine and all identified Iboga alkaloids</li>
                <li className="flex gap-3"><span className="text-gold">◆</span>Derivatives, analogues, metabolites, and functionally similar compounds</li>
                <li className="flex gap-3"><span className="text-gold">◆</span>Substances later found in other organisms but first characterized from Iboga</li>
                <li className="flex gap-3"><span className="text-gold">◆</span>Applications and protocols based on properties first identified from Iboga</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="authorization" title="Prior authorization required">
          <p className="text-forest/80 leading-relaxed mb-8 max-w-3xl">
            Any use, exploitation, research, transformation, or commercialization of Iboga — as well as access to
            Iboga, its derivatives, partnerships, or markets — requires prior administrative authorization.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <ul className="space-y-4">
              {AUTHORIZATION.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-forest/80 leading-relaxed">
                  <span className="text-gold mt-0.5 shrink-0">◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-4">
              <div className="bg-white border border-forest/10 rounded-2xl p-6">
                <h3 className="font-semibold text-forest mb-2">Community governance</h3>
                <p className="text-sm text-forest/70 leading-relaxed">
                  Indigenous and local communities are recognized as stakeholders in governance and participate in
                  decisions on access, use, and exploitation of Iboga (Article 11).
                </p>
              </div>
              <div className="bg-white border border-forest/10 rounded-2xl p-6">
                <h3 className="font-semibold text-forest mb-2">Accredited organizations</h3>
                <p className="text-sm text-forest/70 leading-relaxed">
                  The State may accredit organizations with recognized expertise and community roots. Accredited
                  bodies may access Iboga and conduct research, transformation, and commercialization under
                  approved terms of reference (Article 14).
                </p>
              </div>
              <div className="bg-white border border-forest/10 rounded-2xl p-6">
                <h3 className="font-semibold text-forest mb-2">Minimum indicative price</h3>
                <p className="text-sm text-forest/70 leading-relaxed">
                  The State sets a minimum indicative price for Iboga in consultation with sector actors, to ensure
                  fair and equitable remuneration for producers (Article 12).
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="export" title="Export & certification">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <p className="text-forest/80 leading-relaxed">
              Export of Iboga from legal, certified farms is permitted under a national certification system
              guaranteeing traceability, environmental standards, and benefit-sharing (Article 10). Producers —
              individually, collectively, or supported by accredited operators — may access international markets
              directly, in compliance with this decree.
            </p>
            <div className="bg-gold/10 border border-gold/25 rounded-3xl p-8">
              <h3 className="font-serif text-xl italic text-forest mb-3">Certification requirements</h3>
              <ul className="space-y-2 text-sm text-forest/75">
                <li>Legal, certified farm origin</li>
                <li>National traceability system</li>
                <li>Environmental compliance</li>
                <li>Documented benefit-sharing with communities</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="benefits" title="Benefit-sharing">
          <p className="text-forest/80 leading-relaxed max-w-3xl">
            Any use, exploitation, or commercialization of Iboga, its derivatives, or associated traditional
            knowledge triggers fair and equitable benefit-sharing between the State and affected indigenous and
            local communities (Article 15). This aligns with the Nagoya Protocol and Gabon's sovereign claim over
            Iboga as a national genetic and cultural resource.
          </p>
        </Section>

        <Section id="knowledge" title="Protection of traditional knowledge">
          <p className="text-forest/80 leading-relaxed max-w-3xl">
            Traditional knowledge associated with Iboga and its derivatives is recognized as national heritage
            (Article 16). Any commercial use or exploitation of this knowledge requires prior authorization from
            the Minister of Culture and a benefit-sharing agreement.
          </p>
        </Section>

        <Section id="ip" title="Intellectual property">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-forest/80 leading-relaxed">
              <p>
                <strong className="text-forest">Patent applications (Article 17):</strong> Any patent application
                relating to Iboga, its derivatives, or associated traditional knowledge must declare the origin of
                the product. A certificate of origin issued by the Minister of Culture — after unanimous approval
                from the Interministerial Technical Commission — must accompany the application.
              </p>
              <p>
                <strong className="text-forest">State opposition (Article 18):</strong> The State reserves the
                right to oppose any intellectual property title or patent on Iboga and its derivatives when
                origin-declaration or benefit-sharing obligations are not met.
              </p>
            </div>
            <div className="bg-bone border border-forest/10 rounded-3xl p-8">
              <h3 className="font-serif text-xl italic text-forest mb-3">Retroactive review</h3>
              <p className="text-sm text-forest/70 leading-relaxed">
                The State reserves the right to examine any prior situation relating to Iboga (Article 25). This
                decree abrogates all prior contradictory provisions (Article 28).
              </p>
            </div>
          </div>
        </Section>

        <Section id="fund" title="Sovereign Iboga Fund">
          <p className="text-forest/80 leading-relaxed mb-8 max-w-3xl">
            A Sovereign Iboga Fund is established under the authority of the Minister of Culture (Articles 19–21).
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-forest uppercase tracking-widest text-xs mb-4">Mission</h3>
              <ul className="space-y-3">
                {SOVEREIGN_FUND.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-forest/80">
                    <span className="text-gold">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-forest uppercase tracking-widest text-xs mb-4">Funding sources</h3>
              <ul className="space-y-3">
                {FUND_SOURCES.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-forest/80">
                    <span className="text-gold">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="commission" title="Interministerial Technical Commission">
          <p className="text-forest/80 leading-relaxed mb-8 max-w-3xl">
            An Interministerial Technical Commission is established under the authority of the Vice-President of
            the Government (Articles 22–24). Its composition, organization, and operating rules will be set by
            subsequent regulations.
          </p>
          <ul className="grid md:grid-cols-2 gap-4">
            {COMMISSION.map((item) => (
              <li key={item} className="bg-white border border-forest/10 rounded-2xl p-5 text-sm text-forest/80 leading-relaxed flex gap-3">
                <span className="text-gold shrink-0">◆</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="alignment" title="How ibo.garden aligns">
          <div className="bg-forest text-earth rounded-[2rem] p-10 md:p-14">
            <p className="text-earth/80 leading-relaxed mb-10 max-w-3xl">
              ibo.garden is built to support implementation of Decree 0239 — not to circumvent it. Our marketplace,
              certification, and <span className="gaine-word gaine-word-sm">GAINE</span> token infrastructure are
              designed around the decree's core requirements.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {[
                ["Traceability", "On-chain records for farm origin, harvest batches, and export certification."],
                ["Benefit-sharing", "GAINE reflection and fund splits direct value to Gabonese communities and the Sovereign Iboga Fund."],
                ["Community consent", "Network partners work with indigenous and local communities as required stakeholders."],
                ["Certified export", "Listings require Decree 0239-aligned certification for legal farm-sourced Iboga."],
                ["Traditional knowledge", "Commercial use of Bwiti-associated knowledge requires authorization and benefit-sharing agreements."],
                ["Fair pricing", "Marketplace pricing respects the State's minimum indicative price framework."],
              ].map(([t, d]) => (
                <div key={t} className="border border-earth/15 rounded-2xl p-6">
                  <h3 className="font-semibold text-gold mb-2">{t}</h3>
                  <p className="text-sm text-earth/70 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/network"
                className="bg-gold text-forest px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold/90 transition-colors"
              >
                Join the Network
              </Link>
              <Link
                to="/impact"
                className="border border-earth/30 text-earth px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-earth/10 transition-colors"
              >
                See Impact in Gabon
              </Link>
            </div>
          </div>
        </Section>

        <section className="border-t border-forest/10 pt-12">
          <p className="text-xs text-forest/50 leading-relaxed max-w-3xl">
            This page is an English summary for informational purposes. It is not a legal translation. For official
            text, refer to the <em>Journal Officiel de la République Gabonaise</em>, No. 115 Quinquies, 22 May
            2026. Non-compliance with the decree is subject to sanctions under applicable law (Article 26).
          </p>
        </section>
      </section>
    </>
  );
}
