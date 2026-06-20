import { and, desc, eq, sql } from "drizzle-orm";

import {
  IMPACT_PROJECT_FALLBACK,
  REFLECTION_CATEGORY_FALLBACK,
  type ImpactProject,
  type ReflectionCategory,
  type ReflectionCategorySlug,
  GAINE_REFLECTION_MIN_BALANCE,
} from "@/data/reflection-destinations";
import { fetchGaineBalance } from "@/lib/solana.server";
import { getDb } from "@/server/db/client";
import { impactProjects } from "@/server/db/schema/reflection";
import { taxonomyDomains, taxonomyTerms } from "@/server/db/schema/taxonomy";
import { userAccounts, walletProfiles } from "@/server/db/schema/users";
import { trackEvent } from "@/server/services/journey.service";

type TermMetadata = {
  solanaWallet?: string;
};

function metadataWallet(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object") return null;
  const wallet = (metadata as TermMetadata).solanaWallet;
  return typeof wallet === "string" && wallet.length >= 32 ? wallet : null;
}

function fallbackCategory(slug: ReflectionCategorySlug): ReflectionCategory | undefined {
  return REFLECTION_CATEGORY_FALLBACK.find((category) => category.slug === slug);
}

export async function listReflectionCategories(): Promise<ReflectionCategory[]> {
  try {
    const db = getDb();
    const rows = await db
      .select({
        slug: taxonomyTerms.slug,
        label: taxonomyTerms.label,
        metadata: taxonomyTerms.metadata,
        sortOrder: taxonomyTerms.sortOrder,
      })
      .from(taxonomyTerms)
      .innerJoin(taxonomyDomains, eq(taxonomyTerms.domainId, taxonomyDomains.id))
      .where(and(eq(taxonomyDomains.slug, "reflection_direction"), eq(taxonomyTerms.isActive, 1)))
      .orderBy(taxonomyTerms.sortOrder);

    if (rows.length === 0) return REFLECTION_CATEGORY_FALLBACK;

    return rows.map((row) => {
      const slug = row.slug as ReflectionCategorySlug;
      const fallback = fallbackCategory(slug);
      return {
        slug,
        label: row.label,
        description: fallback?.description ?? row.label,
        solanaWallet:
          slug === "specific_project" ? null : metadataWallet(row.metadata) ?? fallback?.solanaWallet ?? null,
      };
    });
  } catch {
    return REFLECTION_CATEGORY_FALLBACK;
  }
}

export async function listImpactProjects(): Promise<ImpactProject[]> {
  try {
    const db = getDb();
    const rows = await db
      .select({
        slug: impactProjects.slug,
        name: impactProjects.name,
        description: impactProjects.description,
        solanaWallet: impactProjects.solanaWallet,
      })
      .from(impactProjects)
      .where(eq(impactProjects.isActive, 1))
      .orderBy(impactProjects.sortOrder);

    if (rows.length === 0) return IMPACT_PROJECT_FALLBACK;

    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      description: row.description ?? "",
      solanaWallet: row.solanaWallet,
    }));
  } catch {
    return IMPACT_PROJECT_FALLBACK;
  }
}

export async function getReflectionDestinations() {
  const [categories, projects] = await Promise.all([listReflectionCategories(), listImpactProjects()]);
  return { categories, projects };
}

export async function getUserReflectionPreference(userId: number) {
  const empty = {
    directionSlug: null as ReflectionCategorySlug | null,
    directionLabel: null as string | null,
    projectSlug: null as string | null,
    projectName: null as string | null,
    updatedAt: null as string | null,
  };

  try {
    const db = getDb();
    const [row] = await db
      .select({
        directionSlug: taxonomyTerms.slug,
        directionLabel: taxonomyTerms.label,
        projectSlug: impactProjects.slug,
        projectName: impactProjects.name,
        reflectionUpdatedAt: userAccounts.reflectionUpdatedAt,
      })
      .from(userAccounts)
      .leftJoin(taxonomyTerms, eq(userAccounts.reflectionDirectionId, taxonomyTerms.id))
      .leftJoin(impactProjects, eq(userAccounts.reflectionProjectId, impactProjects.id))
      .where(eq(userAccounts.id, userId))
      .limit(1);

    return {
      directionSlug: (row?.directionSlug as ReflectionCategorySlug | null) ?? null,
      directionLabel: row?.directionLabel ?? null,
      projectSlug: row?.projectSlug ?? null,
      projectName: row?.projectName ?? null,
      updatedAt: row?.reflectionUpdatedAt?.toISOString() ?? null,
    };
  } catch {
    return empty;
  }
}

async function resolveDirectionId(directionSlug: ReflectionCategorySlug) {
  const db = getDb();
  const [row] = await db
    .select({ id: taxonomyTerms.id })
    .from(taxonomyTerms)
    .innerJoin(taxonomyDomains, eq(taxonomyTerms.domainId, taxonomyDomains.id))
    .where(and(eq(taxonomyDomains.slug, "reflection_direction"), eq(taxonomyTerms.slug, directionSlug)))
    .limit(1);
  return row?.id ?? null;
}

async function resolveProjectId(projectSlug: string) {
  const db = getDb();
  const [row] = await db
    .select({ id: impactProjects.id })
    .from(impactProjects)
    .where(and(eq(impactProjects.slug, projectSlug), eq(impactProjects.isActive, 1)))
    .limit(1);
  return row?.id ?? null;
}

export async function saveUserReflectionPreference(input: {
  userId: number;
  walletAddress: string;
  directionSlug: ReflectionCategorySlug;
  projectSlug?: string;
}) {
  const balance = await fetchGaineBalance(input.walletAddress);
  if (balance < GAINE_REFLECTION_MIN_BALANCE) {
    throw new Error(`Hold at least ${GAINE_REFLECTION_MIN_BALANCE} GAINE to direct rewards.`);
  }

  const db = getDb();
  const [wallet] = await db
    .select({ userAccountId: walletProfiles.userAccountId })
    .from(walletProfiles)
    .where(eq(walletProfiles.address, input.walletAddress))
    .limit(1);

  if (wallet?.userAccountId !== input.userId) {
    throw new Error("Connected wallet does not match your account.");
  }

  const directionId = await resolveDirectionId(input.directionSlug);
  if (!directionId) {
    throw new Error("Unknown reflection category.");
  }

  let projectId: number | null = null;
  if (input.directionSlug === "specific_project") {
    if (!input.projectSlug) {
      throw new Error("Choose a project to direct rewards.");
    }
    projectId = await resolveProjectId(input.projectSlug);
    if (!projectId) {
      throw new Error("Unknown impact project.");
    }
  }

  const now = new Date();
  await db
    .update(userAccounts)
    .set({
      reflectionDirectionId: directionId,
      reflectionProjectId: projectId,
      reflectionUpdatedAt: now,
    })
    .where(eq(userAccounts.id, input.userId));

  await trackEvent({
    userAccountId: input.userId,
    eventType: "reflection_save",
    eventCategory: "gaine",
    walletAddress: input.walletAddress,
    gaineBalanceSnapshot: balance,
    metadata: {
      directionSlug: input.directionSlug,
      projectSlug: input.projectSlug ?? null,
    },
  });

  return getUserReflectionPreference(input.userId);
}

function destinationWalletForPreference(
  categories: ReflectionCategory[],
  projects: ImpactProject[],
  directionSlug: ReflectionCategorySlug | null,
  projectSlug: string | null,
) {
  if (!directionSlug) {
    return { destinationType: "balanced" as const, destinationSlug: null, destinationWallet: null };
  }

  if (directionSlug === "specific_project") {
    const project = projects.find((item) => item.slug === projectSlug);
    return {
      destinationType: "project" as const,
      destinationSlug: project?.slug ?? projectSlug,
      destinationWallet: project?.solanaWallet ?? null,
    };
  }

  const category = categories.find((item) => item.slug === directionSlug);
  return {
    destinationType: "category" as const,
    destinationSlug: category?.slug ?? directionSlug,
    destinationWallet: category?.solanaWallet ?? null,
  };
}

export async function listReflectionRouting() {
  const { categories, projects } = await getReflectionDestinations();

  try {
    const db = getDb();
    const rows = await db
      .select({
        holderWallet: walletProfiles.address,
        directionSlug: taxonomyTerms.slug,
        projectSlug: impactProjects.slug,
        lastGaineBalance: walletProfiles.lastGaineBalance,
        reflectionUpdatedAt: userAccounts.reflectionUpdatedAt,
      })
      .from(walletProfiles)
      .innerJoin(userAccounts, eq(walletProfiles.userAccountId, userAccounts.id))
      .leftJoin(taxonomyTerms, eq(userAccounts.reflectionDirectionId, taxonomyTerms.id))
      .leftJoin(impactProjects, eq(userAccounts.reflectionProjectId, impactProjects.id))
      .where(sql`CAST(${walletProfiles.lastGaineBalance} AS DECIMAL(24,8)) >= ${GAINE_REFLECTION_MIN_BALANCE}`)
      .orderBy(desc(userAccounts.reflectionUpdatedAt));

    const routing = rows.map((row) => {
      const directionSlug = (row.directionSlug as ReflectionCategorySlug | null) ?? null;
      const destination = destinationWalletForPreference(
        categories,
        projects,
        directionSlug,
        row.projectSlug,
      );

      return {
        holderWallet: row.holderWallet,
        gaineBalance: row.lastGaineBalance,
        updatedAt: row.reflectionUpdatedAt?.toISOString() ?? null,
        ...destination,
      };
    });

    return { categories, projects, routing };
  } catch {
    return { categories, projects, routing: [] as Array<Record<string, unknown>> };
  }
}

export async function listReflectionPreferencesForAdmin(limit = 200) {
  try {
    const db = getDb();
    return db
      .select({
        walletAddress: walletProfiles.address,
        email: userAccounts.email,
        displayName: userAccounts.displayName,
        lastGaineBalance: walletProfiles.lastGaineBalance,
        directionLabel: taxonomyTerms.label,
        directionSlug: taxonomyTerms.slug,
        projectName: impactProjects.name,
        projectSlug: impactProjects.slug,
        reflectionUpdatedAt: userAccounts.reflectionUpdatedAt,
      })
      .from(userAccounts)
      .leftJoin(walletProfiles, eq(userAccounts.primaryWalletId, walletProfiles.id))
      .leftJoin(taxonomyTerms, eq(userAccounts.reflectionDirectionId, taxonomyTerms.id))
      .leftJoin(impactProjects, eq(userAccounts.reflectionProjectId, impactProjects.id))
      .where(sql`${userAccounts.reflectionDirectionId} IS NOT NULL`)
      .orderBy(desc(userAccounts.reflectionUpdatedAt))
      .limit(limit);
  } catch {
    return [];
  }
}
