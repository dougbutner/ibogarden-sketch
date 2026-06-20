import { desc, eq, like, or } from "drizzle-orm";

import { getDb } from "@/server/db/client";
import { networkApplications } from "@/server/db/schema/partners";
import { taxonomyTerms } from "@/server/db/schema/taxonomy";
import { normalizeEmail } from "@/server/lib/crypto";
import { notifyAdminNetworkApplication } from "@/server/services/mail.service";
import { getTermIdByDomainSlug } from "@/server/services/taxonomy.service";
import { trackEvent } from "@/server/services/journey.service";

export type SubmitNetworkApplicationInput = {
  organizationName: string;
  email: string;
  country: string;
  partnerTypeSlug: string;
  credentials?: string;
  gabonFirstSourcing: boolean;
  southeastAfrica: boolean;
  solanaWallet?: string;
};

export async function submitNetworkApplication(input: SubmitNetworkApplicationInput) {
  const db = getDb();
  const partnerTypeId = await getTermIdByDomainSlug("partner_type", input.partnerTypeSlug);

  if (!partnerTypeId) {
    throw new Error("Invalid partner type");
  }

  const [result] = await db.insert(networkApplications).values({
    organizationName: input.organizationName.trim(),
    email: normalizeEmail(input.email),
    country: input.country.trim(),
    partnerTypeId,
    credentials: input.credentials?.trim() || null,
    gabonFirstSourcing: input.gabonFirstSourcing ? 1 : 0,
    southeastAfrica: input.southeastAfrica ? 1 : 0,
    solanaWallet: input.solanaWallet?.trim() || null,
    status: "pending",
  });

  const applicationId = Number(result.insertId);

  try {
    await trackEvent({
      eventType: "network_application_submit",
      eventCategory: "network",
      entityType: "network_application",
      entityId: applicationId,
      metadata: {
        partnerType: input.partnerTypeSlug,
        country: input.country,
      },
    });
  } catch (error) {
    console.error("[network] trackEvent failed after application insert:", error);
  }

  await notifyAdminNetworkApplication({
    applicationId,
    organizationName: input.organizationName.trim(),
    email: normalizeEmail(input.email),
    country: input.country.trim(),
    partnerTypeSlug: input.partnerTypeSlug,
    credentials: input.credentials?.trim() || undefined,
    gabonFirstSourcing: input.gabonFirstSourcing,
    southeastAfrica: input.southeastAfrica,
    solanaWallet: input.solanaWallet?.trim() || undefined,
  });

  return { ok: true as const, id: applicationId };
}

export async function listNetworkApplications(search?: string, limit = 100) {
  const db = getDb();
  const term = search?.trim();

  return db
    .select({
      id: networkApplications.id,
      organizationName: networkApplications.organizationName,
      email: networkApplications.email,
      country: networkApplications.country,
      partnerType: taxonomyTerms.label,
      credentials: networkApplications.credentials,
      gabonFirstSourcing: networkApplications.gabonFirstSourcing,
      southeastAfrica: networkApplications.southeastAfrica,
      solanaWallet: networkApplications.solanaWallet,
      status: networkApplications.status,
      createdAt: networkApplications.createdAt,
    })
    .from(networkApplications)
    .innerJoin(taxonomyTerms, eq(networkApplications.partnerTypeId, taxonomyTerms.id))
    .where(
      term
        ? or(
            like(networkApplications.email, `%${term}%`),
            like(networkApplications.organizationName, `%${term}%`),
            like(networkApplications.country, `%${term}%`),
          )
        : undefined,
    )
    .orderBy(desc(networkApplications.createdAt))
    .limit(limit);
}

export async function deleteNetworkApplication(id: number) {
  const db = getDb();
  await db.delete(networkApplications).where(eq(networkApplications.id, id));
  return { ok: true as const };
}
