import { and, eq, asc } from "drizzle-orm";

import { getDb } from "@/server/db/client";
import { taxonomyDomains, taxonomyTerms } from "@/server/db/schema/taxonomy";
import { callDataApi, remoteDb } from "@/server/services/data-api.server";

export async function getTermIdByDomainSlug(domainSlug: string, termSlug: string) {
  if (remoteDb()) return callDataApi<number | null>("taxonomy.termId", { domainSlug, termSlug });
  const db = await getDb();

  const [domain] = await db
    .select()
    .from(taxonomyDomains)
    .where(eq(taxonomyDomains.slug, domainSlug))
    .limit(1);

  if (!domain) return null;

  const [term] = await db
    .select()
    .from(taxonomyTerms)
    .where(and(eq(taxonomyTerms.domainId, domain.id), eq(taxonomyTerms.slug, termSlug)))
    .limit(1);

  return term?.id ?? null;
}

export async function listTermsByDomainSlug(domainSlug: string) {
  if (remoteDb()) return callDataApi("taxonomy.list", { domainSlug });
  const db = await getDb();

  const [domain] = await db
    .select()
    .from(taxonomyDomains)
    .where(eq(taxonomyDomains.slug, domainSlug))
    .limit(1);

  if (!domain) return [];

  return db
    .select({
      id: taxonomyTerms.id,
      slug: taxonomyTerms.slug,
      label: taxonomyTerms.label,
      sortOrder: taxonomyTerms.sortOrder,
    })
    .from(taxonomyTerms)
    .where(and(eq(taxonomyTerms.domainId, domain.id), eq(taxonomyTerms.isActive, 1)))
    .orderBy(asc(taxonomyTerms.sortOrder));
}
