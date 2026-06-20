import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  adminGetApplications,
  adminGetHealth,
  adminGetHolders,
  adminGetWaitlist,
  adminLogout,
  getAdminSession,
} from "@/lib/api/admin.functions";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const session = await getAdminSession();
    if (!session.authenticated) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminDashboard,
});

type WaitlistRow = Awaited<ReturnType<typeof adminGetWaitlist>>[number];
type HolderRow = Awaited<ReturnType<typeof adminGetHolders>>[number];
type ApplicationRow = Awaited<ReturnType<typeof adminGetApplications>>[number];

function AdminDashboard() {
  const [tab, setTab] = useState<"waitlist" | "holders" | "applications">("waitlist");
  const [search, setSearch] = useState("");
  const [waitlist, setWaitlist] = useState<WaitlistRow[]>([]);
  const [holders, setHolders] = useState<HolderRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [taxonomyTerms, setTaxonomyTerms] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [waitlistRows, holderRows, applicationRows, health] = await Promise.all([
        adminGetWaitlist({ data: { search: search || undefined } }),
        adminGetHolders(),
        adminGetApplications({ data: { search: search || undefined } }),
        adminGetHealth(),
      ]);
      setWaitlist(waitlistRows);
      setHolders(holderRows);
      setApplications(applicationRows);
      setDbConnected(health.connected);
      setTaxonomyTerms(health.taxonomyTerms);
    } catch {
      setError("Could not load admin data. Check database connection.");
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    await load();
  }

  async function handleLogout() {
    await adminLogout();
    window.location.href = "/admin/login";
  }

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-4xl italic text-forest">Admin dashboard</h1>
          <p className="text-sm text-forest/60 mt-1">Waitlist, holders, and network applications</p>
        </div>
        <div className="flex gap-3">
          <Link to="/" className="text-xs font-semibold uppercase tracking-widest text-forest/60 hover:text-gold">
            Site
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="text-xs font-semibold uppercase tracking-widest text-forest/60 hover:text-gold"
          >
            Logout
          </button>
        </div>
      </div>

      {dbConnected !== null ? (
        <p
          className={`text-xs mb-6 px-3 py-2 rounded-lg inline-block ${
            dbConnected ? "bg-gold/10 text-forest" : "bg-red-50 text-red-800"
          }`}
        >
          Database {dbConnected ? "connected" : "unavailable"}
          {dbConnected ? ` · ${taxonomyTerms} taxonomy terms` : null}
        </p>
      ) : null}

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["waitlist", "holders", "applications"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest ${
              tab === key ? "bg-forest text-earth" : "border border-forest/20 text-forest"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {tab !== "holders" ? (
        <form onSubmit={(e) => void handleSearch(e)} className="mb-4 flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === "waitlist" ? "Search email or source…" : "Search org, email, or country…"}
            className="flex-1 border border-forest/15 rounded-xl px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-forest text-earth px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
          >
            Search
          </button>
        </form>
      ) : null}

      {error ? <p className="text-sm text-red-700 mb-4">{error}</p> : null}
      {loading ? <p className="text-sm text-forest/60">Loading…</p> : null}

      {!loading && tab === "waitlist" ? (
        <div className="overflow-x-auto bg-white border border-forest/10 rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest/10 text-left text-[11px] uppercase tracking-widest text-forest/50">
                <th className="p-4">Email</th>
                <th className="p-4">Source</th>
                <th className="p-4">Wallet</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Linked</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map((row) => (
                <tr key={row.id} className="border-b border-forest/5">
                  <td className="p-4">{row.email}</td>
                  <td className="p-4">{row.source}</td>
                  <td className="p-4 font-mono text-xs">{row.walletAddress ?? "—"}</td>
                  <td className="p-4">{row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}</td>
                  <td className="p-4">{row.linkedAt ? new Date(row.linkedAt).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {waitlist.length === 0 ? <p className="p-6 text-forest/50 text-sm">No waitlist entries yet.</p> : null}
        </div>
      ) : null}

      {!loading && tab === "holders" ? (
        <div className="overflow-x-auto bg-white border border-forest/10 rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest/10 text-left text-[11px] uppercase tracking-widest text-forest/50">
                <th className="p-4">Wallet</th>
                <th className="p-4">Email</th>
                <th className="p-4">GAINE</th>
                <th className="p-4">First verified</th>
                <th className="p-4">Last verified</th>
              </tr>
            </thead>
            <tbody>
              {holders.map((row) => (
                <tr key={row.address} className="border-b border-forest/5">
                  <td className="p-4 font-mono text-xs">{row.address}</td>
                  <td className="p-4">{row.email ?? "—"}</td>
                  <td className="p-4">{row.lastGaineBalance ?? "—"}</td>
                  <td className="p-4">
                    {row.firstVerifiedAt ? new Date(row.firstVerifiedAt).toLocaleString() : "—"}
                  </td>
                  <td className="p-4">
                    {row.lastVerifiedAt ? new Date(row.lastVerifiedAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {holders.length === 0 ? <p className="p-6 text-forest/50 text-sm">No verified holders yet.</p> : null}
        </div>
      ) : null}

      {!loading && tab === "applications" ? (
        <div className="overflow-x-auto bg-white border border-forest/10 rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest/10 text-left text-[11px] uppercase tracking-widest text-forest/50">
                <th className="p-4">Organization</th>
                <th className="p-4">Email</th>
                <th className="p-4">Type</th>
                <th className="p-4">Country</th>
                <th className="p-4">Gabon-first</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((row) => (
                <tr key={row.id} className="border-b border-forest/5">
                  <td className="p-4">{row.organizationName}</td>
                  <td className="p-4">{row.email}</td>
                  <td className="p-4">{row.partnerType}</td>
                  <td className="p-4">{row.country}</td>
                  <td className="p-4">{row.gabonFirstSourcing ? "Yes" : "No"}</td>
                  <td className="p-4 capitalize">{row.status}</td>
                  <td className="p-4">{row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 ? (
            <p className="p-6 text-forest/50 text-sm">No network applications yet.</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
