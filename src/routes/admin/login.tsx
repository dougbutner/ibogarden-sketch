import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { adminLogin } from "@/lib/api/admin.functions";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("dougbutner@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminLogin({ data: { email, password } });
      await navigate({ to: "/admin" });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-6 py-24 max-w-md mx-auto">
      <h1 className="font-serif text-4xl italic text-forest mb-2">Admin</h1>
      <p className="text-sm text-forest/60 mb-8">Sign in to manage waitlist and holders.</p>

      <form onSubmit={(e) => void handleSubmit(e)} className="bg-white border border-forest/10 rounded-3xl p-8 space-y-5">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-forest/60">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-forest/15 rounded-xl px-4 py-3 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-forest/60">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-forest/15 rounded-xl px-4 py-3 text-sm"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forest text-earth py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link to="/" className="text-forest/60 hover:text-gold">
          ← Back to site
        </Link>
      </p>
    </section>
  );
}
