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
    return listWaitlist(data.search);
  });

export const adminGetHolders = createServerFn({ method: "GET" })
  .inputValidator(adminWalletSchema)
  .handler(async ({ data }) => {
    assertAdminWallet(data.wallet);
    return listVerifiedHolders();
  });

export const adminGetApplications = createServerFn({ method: "GET" })
  .inputValidator(adminWalletSchema.extend({ search: z.string().optional() }))
  .handler(async ({ data }) => {
    assertAdminWallet(data.wallet);
    return listNetworkApplications(data.search);
  });

export const adminDeleteApplication = createServerFn({ method: "POST" })
  .inputValidator(adminWalletSchema.extend({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    assertAdminWallet(data.wallet);
    return deleteNetworkApplication(data.id);
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
    return listReflectionPreferencesForAdmin();
  });
