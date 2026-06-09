import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-forest text-earth pt-20 pb-16 px-6 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl italic mb-4">ibo<span className="text-gold">.</span>garden</h2>
            <p className="text-earth/60 max-w-sm mb-6 italic leading-relaxed">
              Healing the world by healing the self. Rooted in reciprocity, transparency, and respect for the forest of Gabon.
            </p>
            <p className="text-[10px] text-earth/40 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} ibo.garden — Not medical advice. 18+. Check your jurisdiction.
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-5 text-gold">Navigate</h4>
            <ul className="space-y-3 text-sm text-earth/70">
              <li><Link to="/about" className="hover:text-gold">About Iboga</Link></li>
              <li><Link to="/find" className="hover:text-gold">Find a Facilitator</Link></li>
              <li><Link to="/marketplace" className="hover:text-gold">Marketplace</Link></li>
              <li><Link to="/gaine" className="hover:text-gold">GAINE Token</Link></li>
              <li><Link to="/impact" className="hover:text-gold">Impact in Gabon</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-5 text-gold">Join the Garden</h4>
            <p className="text-xs text-earth/60 mb-4">Monthly integration stories and sourcing updates.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input type="email" required placeholder="your@email" className="bg-white/5 border border-white/10 px-4 py-2 rounded-l-xl w-full text-sm focus:outline-none focus:border-gold" />
              <button className="bg-gold text-forest px-4 py-2 rounded-r-xl font-bold text-xs uppercase tracking-wider hover:bg-gold/90">Join</button>
            </form>
          </div>
        </div>
        <div className="pt-8 border-t border-earth/10 flex flex-col md:flex-row justify-between gap-4 text-[10px] text-earth/40 uppercase tracking-widest">
          <span>Nagoya Protocol Compliant · Bwiti Standard</span>
          <span>Rooted in Gabon</span>
        </div>
      </div>
    </footer>
  );
}
