import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/logo";

const NAV = [
  { to: "/learn", label: "Knowledge" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/gaine", label: "GAINE" },
  { to: "/source", label: "Source Bulk" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full bg-earth/85 backdrop-blur-md border-b border-forest/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
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
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="Open menu"
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden text-xs font-semibold uppercase tracking-widest text-forest"
        >
          {open ? "Close" : "Menu"}
        </button>
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
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
