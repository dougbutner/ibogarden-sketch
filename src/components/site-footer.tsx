import { Link } from "@tanstack/react-router";

const LAUNCH_LINKS = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/gaine", label: <>GAINE Token</>, gaine: true },
  { to: "/source", label: "Source Consultation" },
] as const;

const MORE_LINKS = [
  { to: "/about", label: "About" },
  { to: "/learn", label: "Knowledge" },
  { to: "/find", label: "Find" },
  { to: "/network", label: "Network" },
  { to: "/impact", label: "Impact" },
  { to: "/community", label: "Community" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-forest text-earth pt-20 pb-16 px-6 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl italic mb-4">ibo<span className="text-gold">.</span>garden</h2>
            <p className="text-earth/60 max-w-sm mb-6 italic leading-relaxed">
              Ethical Iboga sourcing. Tokenized reciprocity. Rooted in Gabon.
            </p>
            <div className="text-sm text-earth/50 leading-relaxed max-w-lg space-y-3">
              <p>
                <strong className="text-earth/70">Important:</strong> This is a commodity marketplace and{" "}
                <span className="gaine-word gaine-word-sm">GAINE</span> token platform for ethically sourced Iboga.
                Iboga and ibogaine carry serious health risks and are heavily regulated or prohibited in many
                jurisdictions (including Schedule I in the US). Nothing on this site is medical, therapeutic, legal,
                or investment advice.
              </p>
              <p>
                You must be 18+ (or the legal age of majority in your jurisdiction). Users are solely responsible for
                compliance with all applicable laws. All marketplace transactions are between independent parties —
                we provide the platform only.
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-5 text-gold">Launch</h4>
            <ul className="space-y-3 text-sm text-earth/70">
              {LAUNCH_LINKS.map((item) => (
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
            <h4 className="font-bold uppercase tracking-widest text-xs mb-5 text-gold">More</h4>
            <ul className="space-y-3 text-sm text-earth/70">
              {MORE_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-gold">
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
            &copy; 2026 ibo.garden / iboga.market — All Rights Reserved. Content provided &ldquo;as is&rdquo; with no
            warranties.
          </span>
          <span>Committed to Gabon Decree 0239 · Nagoya Protocol</span>
        </div>
      </div>
    </footer>
  );
}
