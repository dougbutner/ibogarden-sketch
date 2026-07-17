"use client";

import { Link } from "@tanstack/react-router";
import { FooterLegalDisclaimer } from "@/components/footer-legal-disclaimer";
import { useLocale } from "@/contexts/locale-context";
import { GAINE_TOKEN_IMAGE } from "@/data/gaine";

export function SiteFooter() {
  const { t } = useLocale();

  const trunkLinks = [
    { to: "/learn", labelKey: "nav.knowledge" as const },
    { to: "/gaine", labelKey: "footer.gaineToken" as const, gaine: true },
    { to: "/marketplace", labelKey: "nav.marketplace" as const },
    { to: "/source", labelKey: "footer.sourceConsultation" as const },
  ];

  const branchLinks = [
    { to: "/find", labelKey: "footer.findFacilitator" as const },
    { to: "/about", labelKey: "footer.about" as const },
    { to: "/network", labelKey: "footer.network" as const },
    { to: "/impact", labelKey: "footer.impact" as const },
    { to: "/share", labelKey: "footer.share" as const },
    { to: "/community", labelKey: "footer.community" as const, gaineIcon: true },
  ];

  return (
    <footer className="bg-forest text-earth pt-20 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl italic mb-4">
              ibo<span className="text-gold">.</span>garden
            </h2>
            <p className="text-earth/60 max-w-sm mb-6 italic leading-relaxed">{t("footer.tagline")}</p>
            <FooterLegalDisclaimer />
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-5 text-gold">{t("footer.trunk")}</h4>
            <ul className="space-y-3 text-sm text-earth/70">
              {trunkLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-gold">
                    {"gaine" in item && item.gaine ? (
                      <>
                        <span className="gaine-word gaine-word-sm">GAINE</span> {t(item.labelKey)}
                      </>
                    ) : (
                      t(item.labelKey)
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-5 text-gold">{t("footer.roots")}</h4>
            <ul className="space-y-3 text-sm text-earth/70">
              {branchLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex items-center gap-2 hover:text-gold">
                    {"gaineIcon" in item && item.gaineIcon ? (
                      <img src={GAINE_TOKEN_IMAGE} alt="" className="size-4 rounded-full" width={16} height={16} />
                    ) : null}
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-earth/10 mb-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-earth/60 mb-6">
            <Link to="/decree" className="hover:text-gold">
              {t("footer.decree")}
            </Link>
            <a href="https://www.cbd.int/abs/" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
              {t("footer.nagoya")}
            </a>
            <Link
              to="/gaine"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "var(--gaine-accent)" }}
            >
              {t("footer.officialGaine")}
            </Link>
          </div>
          <p className="text-xs text-earth/50">{t("footer.committed")}</p>
        </div>

        <div className="pt-6 border-t border-earth/10 flex flex-col md:flex-row justify-between gap-4 text-[10px] text-earth/40 uppercase tracking-widest">
          <span>{t("footer.copyright")}</span>
          <span>{t("footer.committedShort")}</span>
        </div>
      </div>
    </footer>
  );
}
