"use client";

import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { WalletButton } from "@/components/wallet/wallet-button";
import { LOCALES, useLocale } from "@/contexts/locale-context";

const NAV = [
  { to: "/learn", labelKey: "nav.knowledge" },
  { to: "/marketplace", labelKey: "nav.marketplace" },
  { to: "/gaine", labelKey: "nav.gaine" },
  { to: "/source", labelKey: "nav.sourceBulk" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();

  return (
    <header className="sticky top-0 z-[100] w-full bg-earth/85 backdrop-blur-md border-b border-forest/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <Logo size={36} alt="" />
          <span className="font-serif text-2xl italic text-forest tracking-tight">
            ibo<span className="text-gold">.</span>garden
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-[11px] font-medium uppercase tracking-[0.18em] text-forest/70">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`hover:text-gold transition-colors${item.to === "/gaine" ? " gaine-word gaine-word-sm" : ""}`}
              activeProps={{ className: item.to === "/gaine" ? "text-gold gaine-word gaine-word-sm" : "text-gold" }}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="flex items-center rounded-full border border-forest/15 bg-bone/80 p-0.5"
            role="group"
            aria-label="Language"
          >
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                aria-pressed={locale === code}
                className={`min-w-9 px-2.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  locale === code
                    ? "bg-forest text-earth shadow-sm"
                    : "text-forest/60 hover:text-forest"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <WalletButton />
          <button
            aria-label="Open menu"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden text-xs font-semibold uppercase tracking-widest text-forest"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-forest/10 bg-earth px-6 py-4 grid grid-cols-2 gap-3 text-xs font-semibold uppercase tracking-widest text-forest/80">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`py-2 hover:text-gold${item.to === "/gaine" ? " gaine-word gaine-word-sm" : ""}`}
              activeProps={{ className: item.to === "/gaine" ? "text-gold gaine-word gaine-word-sm" : "text-gold" }}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
