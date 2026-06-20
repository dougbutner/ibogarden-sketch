import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { listTermsByDomainSlug } from "@/server/services/taxonomy.service";
import { submitNetworkApplication } from "@/server/services/network.service";

export const getPartnerTypes = createServerFn({ method: "GET" }).handler(async () => {
  const types = await listTermsByDomainSlug("partner_type");
  return types.map((t) => ({ slug: t.slug, label: t.label }));
});

export const submitNetworkApplicationFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      organizationName: z.string().min(2).max(255),
      email: z.string().email(),
      country: z.string().min(2).max(128),
      partnerTypeSlug: z.enum(["facility", "practitioner", "farm"]),
      credentials: z.string().max(5000).optional(),
      gabonFirstSourcing: z.boolean(),
      southeastAfrica: z.boolean(),
      solanaWallet: z
        .string()
        .optional()
        .transform((value) => {
          const trimmed = value?.trim() ?? "";
          if (!trimmed) return undefined;
          if (trimmed.length >= 32 && trimmed.length <= 44) return trimmed;
          return undefined;
        }),
    }),
  )
  .handler(async ({ data }) => {
    try {
      return await submitNetworkApplication({
        ...data,
        solanaWallet: data.solanaWallet || undefined,
      });
    } catch (error) {
      console.error("[submitNetworkApplicationFn]", error);
      throw error;
    }
  });
