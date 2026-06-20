import { Link } from "@tanstack/react-router";
import { FooterLegalDisclaimer } from "@/components/footer-legal-disclaimer";
import { GAINE_TOKEN_IMAGE } from "@/data/gaine";

const TRUNK_LINKS = [
  { to: "/learn", label: "Knowledge" },
  { to: "/gaine", label: <>GAINE Token</>, gaine: true },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/source", label: "Source Consultation" },
] as const;

const BRANCH_LINKS = [
  { to: "/find", label: "Find a Facilitator" },
  { to: "/about", label: "About" },
  { to: "/network", label: "Network" },
  { to: "/impact", label: "Impact" },
  { to: "/share", label: "Share" },
  { to: "/community", label: "Community", gaineIcon: true },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-forest text-earth pt-20 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl italic mb-4">ibo<span className="text-gold">.</span>garden</h2>
            <p className="text-earth/60 max-w-sm mb-6 italic leading-relaxed">
              Ethical Iboga sourcing. Tokenized reciprocity. Rooted in Gabon.
            </p>
            <FooterLegalDisclaimer />
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-5 text-gold">Trunk</h4>
            <ul className="space-y-3 text-sm text-earth/70">
              {TRUNK_LINKS.map((item) => (
                <li key={item.to}>
                  {"external" in item && item.external ? (
                    <a href={item.to} className="hover:text-gold">
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.to} className="hover:text-gold">
                      {"gaine" in item && item.gaine ? (
                        <><span className="gaine-word gaine-word-sm">GAINE</span> Token</>
                      ) : (
                        item.label
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-5 text-gold">Roots</h4>
            <ul className="space-y-3 text-sm text-earth/70">
              {BRANCH_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex items-center gap-2 hover:text-gold">
                    {"gaineIcon" in item && item.gaineIcon ? (
                      <img src={GAINE_TOKEN_IMAGE} alt="" className="size-4 rounded-full" width={16} height={16} />
                    ) : null}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-earth/10 mb-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-earth/60 mb-6">
            <Link to="/decree" className="hover:text-gold">Gabon Decree 0239</Link>
            <a href="https://www.cbd.int/abs/" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
              Nagoya Protocol
            </a>
            <a href="#" className="hover:text-gold">Lab Testing & Quality</a>
            <a href="#" className="hover:text-gold">Whitepaper</a>
          </div>
          <p className="text-xs text-earth/50">
            <a href="#" className="hover:text-gold">Full Disclaimer & Terms of Service</a>
            {" · "}
            Committed to Gabon Decree 0239 & Nagoya Protocol
            {" · "}
            <a href="#" className="hover:text-gold">Whitepaper</a>
          </p>
        </div>

        <div className="pt-6 border-t border-earth/10 flex flex-col md:flex-row justify-between gap-4 text-[10px] text-earth/40 uppercase tracking-widest">
          <span>
            &copy; 2026 ibo.garden / iboga.market: All Rights Reserved. Content provided &ldquo;as is&rdquo; with no
            warranties.
          </span>
          <span>Committed to Gabon Decree 0239 · Nagoya Protocol</span>
        </div>
      </div>
    </footer>
  );
}
