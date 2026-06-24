import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  checkDatabaseHealth,
  formatDatabaseError,
  isAdminDevWallet,
} from "@/server/services/admin.service";
import { listVerifiedHolders } from "@/server/services/journey.service";
import { listNetworkApplications, deleteNetworkApplication } from "@/server/services/network.service";
import { listReflectionPreferencesForAdmin } from "@/server/services/reflection.service";
import { listWaitlist } from "@/server/services/waitlist.service";

const adminWalletSchema = z.object({
  wallet: z.string().min(32).max(44),
});

function assertAdminWallet(wallet: string) {
  if (!isAdminDevWallet(wallet)) {
    throw new Error("Unauthorized");
  }
}

export const adminGetWaitlist = createServerFn({ method: "GET" })
  .inputValidator(adminWalletSchema.extend({ search: z.string().optional() }))
  .handler(async ({ data }) => {
    assertAdminWallet(data.wallet);

    const rows = await listWaitlist(data.search);
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

export const adminGetHolders = createServerFn({ method: "GET" })
  .inputValidator(adminWalletSchema)
  .handler(async ({ data }) => {
    assertAdminWallet(data.wallet);

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
  .inputValidator(adminWalletSchema.extend({ search: z.string().optional() }))
  .handler(async ({ data }) => {
    assertAdminWallet(data.wallet);

    const rows = await listNetworkApplications(data.search);
    return rows.map((row) => ({
      id: row.id,
      organizationName: row.organizationName,
      email: row.email,
      country: row.country,
      partnerType: row.partnerType,
      credentials: row.credentials,
      gabonFirstSourcing: Boolean(row.gabonFirstSourcing),
      southeastAfrica: Boolean(row.southeastAfrica),
      solanaWallet: row.solanaWallet,
      status: row.status,
      createdAt: row.createdAt?.toISOString() ?? null,
    }));
  });

export const adminDeleteApplication = createServerFn({ method: "POST" })
  .inputValidator(adminWalletSchema.extend({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    assertAdminWallet(data.wallet);
    await deleteNetworkApplication(data.id);
    return { ok: true as const };
  });

export const adminGetHealth = createServerFn({ method: "GET" })
  .inputValidator(adminWalletSchema)
  .handler(async ({ data }) => {
    assertAdminWallet(data.wallet);

    try {
      const health = await checkDatabaseHealth();
      return { connected: true as const, taxonomyTerms: health.taxonomyTerms };
    } catch (error) {
      return {
        connected: false as const,
        taxonomyTerms: 0,
        error: formatDatabaseError(error),
      };
    }
  });

export const adminGetReflectionPreferences = createServerFn({ method: "GET" })
  .inputValidator(adminWalletSchema)
  .handler(async ({ data }) => {
    assertAdminWallet(data.wallet);

    const rows = await listReflectionPreferencesForAdmin();
    return rows.map((row) => ({
      walletAddress: row.walletAddress,
      email: row.email,
      displayName: row.displayName,
      lastGaineBalance: row.lastGaineBalance,
      directionLabel: row.directionLabel,
      directionSlug: row.directionSlug,
      projectName: row.projectName,
      projectSlug: row.projectSlug,
      reflectionUpdatedAt: row.reflectionUpdatedAt?.toISOString() ?? null,
    }));
  });
