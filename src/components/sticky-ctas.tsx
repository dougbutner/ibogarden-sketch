import { Link } from "@tanstack/react-router";

export function StickyCtas() {
  return (
    <div className="fixed bottom-4 inset-x-3 z-50 md:left-1/2 md:-translate-x-1/2 md:bottom-6 md:inset-x-auto md:w-auto">
      <div className="flex items-center justify-between gap-1.5 bg-forest/95 backdrop-blur-md p-1.5 rounded-2xl border border-gold/25 shadow-2xl shadow-forest/30 md:gap-2">
        <Link to="/find" className="flex-1 md:flex-none text-center py-2.5 px-3 md:px-5 text-[10px] md:text-[11px] font-semibold uppercase tracking-widest text-gold border border-gold/30 rounded-xl hover:bg-gold/10 transition-colors">
          Find Facilitator
        </Link>
        <Link to="/gaine" className="flex-1 md:flex-none text-center py-2.5 px-3 md:px-5 text-[10px] md:text-[11px] font-semibold uppercase tracking-widest bg-gold text-forest rounded-xl hover:bg-gold/90 transition-colors">
          Buy GAINE
        </Link>
        <Link to="/network" className="flex-1 md:flex-none text-center py-2.5 px-3 md:px-5 text-[10px] md:text-[11px] font-semibold uppercase tracking-widest text-earth/80 border border-earth/15 rounded-xl hover:bg-earth/5 transition-colors">
          Register
        </Link>
        <Link to="/nominate" className="flex-1 md:flex-none text-center py-2.5 px-3 md:px-5 text-[10px] md:text-[11px] font-semibold uppercase tracking-widest text-earth/80 border border-earth/15 rounded-xl hover:bg-earth/5 transition-colors">
          Donate
        </Link>
      </div>
    </div>
  );
}
