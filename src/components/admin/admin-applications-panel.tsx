import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminDeleteApplication } from "@/lib/api/admin.functions";

export type AdminApplicationRow = {
  id: number;
  organizationName: string;
  email: string;
  country: string;
  partnerType: string;
  credentials: string | null;
  gabonFirstSourcing: boolean;
  southeastAfrica: boolean;
  solanaWallet: string | null;
  status: string;
  createdAt: string | null;
};

type AdminApplicationsPanelProps = {
  applications: AdminApplicationRow[];
  wallet: string;
  onChanged: () => void;
};

export function AdminApplicationsPanel({ applications, wallet, onChanged }: AdminApplicationsPanelProps) {
  const [selected, setSelected] = useState<AdminApplicationRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!selected) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await adminDeleteApplication({ data: { wallet, id: selected.id } });
      setConfirmDelete(false);
      setSelected(null);
      onChanged();
    } catch {
      setDeleteError("Could not delete this application.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="overflow-x-auto bg-white border border-forest/10 rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/10 text-left text-[11px] uppercase tracking-widest text-forest/50">
              <th className="p-4">Organization</th>
              <th className="p-4">Email</th>
              <th className="p-4">Type</th>
              <th className="p-4">Country</th>
              <th className="p-4">Status</th>
              <th className="p-4">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((row) => (
              <tr
                key={row.id}
                tabIndex={0}
                onClick={() => setSelected(row)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected(row);
                  }
                }}
                className="border-b border-forest/5 cursor-pointer hover:bg-bone/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              >
                <td className="p-4 font-medium text-forest">{row.organizationName}</td>
                <td className="p-4">{row.email}</td>
                <td className="p-4">{row.partnerType}</td>
                <td className="p-4">{row.country}</td>
                <td className="p-4 capitalize">{row.status}</td>
                <td className="p-4 text-forest/70">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 ? (
          <p className="p-6 text-forest/50 text-sm">No network applications yet.</p>
        ) : (
          <p className="px-4 py-3 text-xs text-forest/45 border-t border-forest/5">
            Click a row to read the full application.
          </p>
        )}
      </div>

      <Dialog open={selected !== null && !confirmDelete} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-earth border-forest/10 rounded-3xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl italic text-forest pr-8">
                  {selected.organizationName}
                </DialogTitle>
                <DialogDescription className="text-forest/60">
                  Application #{selected.id} · submitted{" "}
                  {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}
                </DialogDescription>
              </DialogHeader>

              <dl className="grid gap-5 sm:grid-cols-2 mt-2">
                <DetailField label="Email" value={selected.email} />
                <DetailField label="Country / region" value={selected.country} />
                <DetailField label="Category" value={selected.partnerType} />
                <DetailField label="Status" value={selected.status} className="capitalize" />
                <DetailField
                  label="Gabon-first sourcing"
                  value={selected.gabonFirstSourcing ? "Yes" : "No"}
                />
                <DetailField
                  label="Southeast Africa"
                  value={selected.southeastAfrica ? "Yes" : "No"}
                />
                <DetailField
                  label="Solana wallet"
                  value={selected.solanaWallet}
                  mono
                  className="sm:col-span-2"
                />
                <DetailField
                  label="Credentials / lineage / licenses"
                  value={selected.credentials || "—"}
                  className="sm:col-span-2"
                  preWrap
                />
              </dl>

              {deleteError ? <p className="text-sm text-red-700">{deleteError}</p> : null}

              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-forest/10">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-forest/60 hover:text-forest"
                >
                  Close
                </button>
                <a
                  href={buildReplyMailto(selected)}
                  className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-gold text-forest hover:bg-gold-deep transition-colors"
                >
                  Reply email
                </a>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-red-700 text-white hover:bg-red-800"
                >
                  Delete application
                </button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="bg-earth border-forest/10 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl italic text-forest">
              Delete this application?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-forest/65">
              This permanently removes the application from{" "}
              <strong className="text-forest">{selected?.organizationName}</strong> ({selected?.email}). This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              className="bg-red-700 hover:bg-red-800"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function buildReplyMailto(app: AdminApplicationRow): string {
  const subject = `ibo.garden network application — ${app.organizationName}`;
  const body = [
    `Hi,`,
    ``,
    `Thank you for your ibo.garden network application (${app.partnerType}, ${app.country}).`,
    ``,
  ].join("\n");

  const params = new URLSearchParams({ subject, body });
  return `mailto:${app.email}?${params.toString()}`;
}

function DetailField({
  label,
  value,
  mono,
  preWrap,
  className = "",
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
  preWrap?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[11px] font-semibold uppercase tracking-widest text-forest/50">{label}</dt>
      <dd
        className={`mt-1.5 text-sm text-forest ${className} ${mono ? "font-mono text-xs break-all" : ""} ${preWrap ? "whitespace-pre-wrap" : ""}`}
      >
        {value || "—"}
      </dd>
    </div>
  );
}
