import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AdminGate } from "@/components/admin/admin-gate";
import { AdminApplicationsPanel } from "@/components/admin/admin-applications-panel";
import { useAdminWallet } from "@/components/admin/admin-wallet-context";
import {
  adminGetApplications,
  adminGetHealth,
  adminGetHolders,
  adminGetReflectionPreferences,
  adminGetWaitlist,
} from "@/lib/api/admin.functions";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <AdminGate>
      <AdminDashboard />
    </AdminGate>
  );
}

type WaitlistRow = Awaited<ReturnType<typeof adminGetWaitlist>>[number];
type HolderRow = Awaited<ReturnType<typeof adminGetHolders>>[number];
type ApplicationRow = Awaited<ReturnType<typeof adminGetApplications>>[number];
type ReflectionRow = Awaited<ReturnType<typeof adminGetReflectionPreferences>>[number];

function AdminDashboard() {
  const wallet = useAdminWallet();
  const [tab, setTab] = useState<"waitlist" | "holders" | "applications" | "reflections">("waitlist");
  const [search, setSearch] = useState("");
  const [waitlist, setWaitlist] = useState<WaitlistRow[]>([]);
  const [holders, setHolders] = useState<HolderRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [reflections, setReflections] = useState<ReflectionRow[]>([]);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [taxonomyTerms, setTaxonomyTerms] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [waitlistRows, holderRows, applicationRows, reflectionRows, health] = await Promise.all([
        adminGetWaitlist({ data: { wallet, search: search || undefined } }),
        adminGetHolders({ data: { wallet } }),
        adminGetApplications({ data: { wallet, search: search || undefined } }),
        adminGetReflectionPreferences({ data: { wallet } }),
        adminGetHealth({ data: { wallet } }),
      ]);
      setWaitlist(waitlistRows);
      setHolders(holderRows);
      setApplications(applicationRows);
      setReflections(reflectionRows);
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
  }, [wallet]);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    await load();
  }

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-4xl italic text-forest">Admin dashboard</h1>
          <p className="text-sm text-forest/60 mt-1">Waitlist, holders, applications, and reward directions</p>
        </div>
        <Link to="/" className="text-xs font-semibold uppercase tracking-widest text-forest/60 hover:text-gold">
          Site
        </Link>
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
        {(["waitlist", "holders", "applications", "reflections"] as const).map((key) => (
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
        <AdminApplicationsPanel applications={applications} wallet={wallet} onChanged={() => void load()} />
      ) : null}

      {!loading && tab === "reflections" ? (
        <div className="overflow-x-auto bg-white border border-forest/10 rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest/10 text-left text-[11px] uppercase tracking-widest text-forest/50">
                <th className="p-4">Wallet</th>
                <th className="p-4">Email</th>
                <th className="p-4">GAINE</th>
                <th className="p-4">Direction</th>
                <th className="p-4">Project</th>
                <th className="p-4">Saved</th>
              </tr>
            </thead>
            <tbody>
              {reflections.map((row) => (
                <tr key={`${row.walletAddress}-${row.reflectionUpdatedAt}`} className="border-b border-forest/5">
                  <td className="p-4 font-mono text-xs">{row.walletAddress ?? "—"}</td>
                  <td className="p-4">{row.email ?? "—"}</td>
                  <td className="p-4">{row.lastGaineBalance ?? "—"}</td>
                  <td className="p-4">{row.directionLabel ?? row.directionSlug ?? "—"}</td>
                  <td className="p-4">{row.projectName ?? "—"}</td>
                  <td className="p-4">
                    {row.reflectionUpdatedAt ? new Date(row.reflectionUpdatedAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reflections.length === 0 ? (
            <p className="p-6 text-forest/50 text-sm">No saved reward directions yet.</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
