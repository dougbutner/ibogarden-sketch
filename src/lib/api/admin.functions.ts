import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

import { verifyAdminCredentials, checkDatabaseHealth } from "@/server/services/admin.service";
import { listVerifiedHolders } from "@/server/services/journey.service";
import { listNetworkApplications } from "@/server/services/network.service";
import { listWaitlist } from "@/server/services/waitlist.service";
import { getAdminSessionConfig, type AdminSessionData } from "@/server/lib/session";

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email(), password: z.string().min(1) }))
  .handler(async ({ data }) => {
    if (!verifyAdminCredentials(data.email, data.password)) {
      throw new Error("Invalid admin credentials");
    }

    const session = await useSession<AdminSessionData>(getAdminSessionConfig());
    await session.update({ email: data.email.trim().toLowerCase(), role: "super" });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSessionData>(getAdminSessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSessionData>(getAdminSessionConfig());
  if (!session.data?.email) return { authenticated: false as const };
  return { authenticated: true as const, email: session.data.email, role: session.data.role };
});

export const adminGetWaitlist = createServerFn({ method: "GET" })
  .inputValidator(z.object({ search: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    const session = await useSession<AdminSessionData>(getAdminSessionConfig());
    if (!session.data?.email) throw new Error("Unauthorized");

    const rows = await listWaitlist(data?.search);
    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      source: row.source,
      walletAddress: row.walletAddress,
      userAccountId: row.userAccountId,
      createdAt: row.createdAt?.toISOString() ?? null,
      linkedAt: row.linkedAt?.toISOString() ?? null,
    }));
  });

export const adminGetHolders = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSessionData>(getAdminSessionConfig());
  if (!session.data?.email) throw new Error("Unauthorized");

  const rows = await listVerifiedHolders();
  return rows.map((row) => ({
    address: row.address,
    email: row.email,
    displayName: row.displayName,
    firstGaineBalance: row.firstGaineBalance,
    lastGaineBalance: row.lastGaineBalance,
    firstVerifiedAt: row.firstVerifiedAt?.toISOString() ?? null,
    lastVerifiedAt: row.lastVerifiedAt?.toISOString() ?? null,
    holderStatus: row.holderStatus,
  }));
});

export const adminGetApplications = createServerFn({ method: "GET" })
  .inputValidator(z.object({ search: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    const session = await useSession<AdminSessionData>(getAdminSessionConfig());
    if (!session.data?.email) throw new Error("Unauthorized");

    const rows = await listNetworkApplications(data?.search);
    return rows.map((row) => ({
      id: row.id,
      organizationName: row.organizationName,
      email: row.email,
      country: row.country,
      partnerType: row.partnerType,
      gabonFirstSourcing: Boolean(row.gabonFirstSourcing),
      southeastAfrica: Boolean(row.southeastAfrica),
      solanaWallet: row.solanaWallet,
      status: row.status,
      createdAt: row.createdAt?.toISOString() ?? null,
    }));
  });

export const adminGetHealth = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSessionData>(getAdminSessionConfig());
  if (!session.data?.email) throw new Error("Unauthorized");

  try {
    const health = await checkDatabaseHealth();
    return { connected: true as const, taxonomyTerms: health.taxonomyTerms };
  } catch {
    return { connected: false as const, taxonomyTerms: 0 };
  }
});
