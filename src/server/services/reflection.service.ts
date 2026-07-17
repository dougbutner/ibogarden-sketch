import { and, desc, eq, sql } from "drizzle-orm";

import {
  REFLECTION_CATEGORY_FALLBACK,
  type ReflectionCategory,
  type ReflectionCategorySlug,
  GAINE_REFLECTION_MIN_BALANCE,
  UNREGISTERED_PROJECT_SLUG,
} from "@/data/reflection-destinations";
import { fetchGaineBalance } from "@/lib/solana.server";
import { getDb } from "@/server/db/client";
import {
  reflectionDisbursementTotals,
  reflectionDisbursements,
} from "@/server/db/schema/reflection";
import { taxonomyDomains, taxonomyTerms } from "@/server/db/schema/taxonomy";
import { userAccounts, walletProfiles } from "@/server/db/schema/users";
import { trackEvent } from "@/server/services/journey.service";
import { callDataApi, remoteDb } from "@/server/services/data-api.server";

type TermMetadata = {
  solanaWallet?: string;
};

export class ReflectionDisbursementError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ReflectionDisbursementError";
    this.status = status;
  }
}

function metadataWallet(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object") return null;
  const wallet = (metadata as TermMetadata).solanaWallet;
  return typeof wallet === "string" && wallet.length >= 32 ? wallet : null;
}

function fallbackCategory(slug: ReflectionCategorySlug): ReflectionCategory | undefined {
  return REFLECTION_CATEGORY_FALLBACK.find((category) => category.slug === slug);
}

function normalizeCustomTitle(title: string | undefined): string {
  return (title ?? "").trim();
}

function normalizeCustomWallet(wallet: string | undefined): string {
  return (wallet ?? "").trim();
}

export async function listReflectionCategories(): Promise<ReflectionCategory[]> {
  try {
    if (remoteDb()) {
      const rows = await callDataApi<
        Array<{ slug: string; label: string; metadata: unknown; sortOrder: number }>
      >("reflection.categories");
      if (rows.length === 0) return REFLECTION_CATEGORY_FALLBACK;
      return rows.map((row) => {
        const slug = row.slug as ReflectionCategorySlug;
        const fallback = fallbackCategory(slug);
        return {
          slug,
          label: row.label,
          description: fallback?.description ?? row.label,
          solanaWallet:
            slug === UNREGISTERED_PROJECT_SLUG
              ? null
              : (metadataWallet(row.metadata) ?? fallback?.solanaWallet ?? null),
        };
      });
    }

    const db = await getDb();
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
          slug === UNREGISTERED_PROJECT_SLUG
            ? null
            : (metadataWallet(row.metadata) ?? fallback?.solanaWallet ?? null),
      };
    });
  } catch {
    return REFLECTION_CATEGORY_FALLBACK;
  }
}

export async function getReflectionDestinations() {
  const categories = await listReflectionCategories();
  return { categories, projects: [] as Array<{ slug: string; name: string; description: string; solanaWallet: string }> };
}

export async function getUserReflectionPreference(userId: number) {
  const empty = {
    directionSlug: null as ReflectionCategorySlug | null,
    directionLabel: null as string | null,
    customTitle: null as string | null,
    customWallet: null as string | null,
    updatedAt: null as string | null,
  };

  try {
    if (remoteDb()) return callDataApi("reflection.getPreference", { userId });

    const db = await getDb();
    const [row] = await db
      .select({
        directionSlug: taxonomyTerms.slug,
        directionLabel: taxonomyTerms.label,
        customTitle: userAccounts.reflectionCustomTitle,
        customWallet: userAccounts.reflectionCustomWallet,
        reflectionUpdatedAt: userAccounts.reflectionUpdatedAt,
      })
      .from(userAccounts)
      .leftJoin(taxonomyTerms, eq(userAccounts.reflectionDirectionId, taxonomyTerms.id))
      .where(eq(userAccounts.id, userId))
      .limit(1);

    return {
      directionSlug: (row?.directionSlug as ReflectionCategorySlug | null) ?? null,
      directionLabel: row?.directionLabel ?? null,
      customTitle: row?.customTitle ?? null,
      customWallet: row?.customWallet ?? null,
      updatedAt: row?.reflectionUpdatedAt?.toISOString() ?? null,
    };
  } catch {
    return empty;
  }
}

async function resolveDirectionId(directionSlug: ReflectionCategorySlug) {
  const db = await getDb();
  const [row] = await db
    .select({ id: taxonomyTerms.id })
    .from(taxonomyTerms)
    .innerJoin(taxonomyDomains, eq(taxonomyTerms.domainId, taxonomyDomains.id))
    .where(
      and(
        eq(taxonomyDomains.slug, "reflection_direction"),
        eq(taxonomyTerms.slug, directionSlug),
        eq(taxonomyTerms.isActive, 1),
      ),
    )
    .limit(1);
  return row?.id ?? null;
}

export async function saveUserReflectionPreference(input: {
  userId: number;
  walletAddress: string;
  directionSlug: ReflectionCategorySlug;
  customTitle?: string;
  customWallet?: string;
}) {
  const balance = await fetchGaineBalance(input.walletAddress);
  if (balance < GAINE_REFLECTION_MIN_BALANCE) {
    throw new Error(`Hold at least ${GAINE_REFLECTION_MIN_BALANCE} GAINE to direct rewards.`);
  }

  const customTitle = normalizeCustomTitle(input.customTitle);
  const customWallet = normalizeCustomWallet(input.customWallet);

  if (input.directionSlug === UNREGISTERED_PROJECT_SLUG) {
    if (!customTitle || customTitle.length > 50) {
      throw new Error("Enter a project title (1–50 characters).");
    }
    if (customWallet.length < 32 || customWallet.length > 44) {
      throw new Error("Enter a valid Solana wallet address.");
    }
  }

  if (remoteDb()) {
    return callDataApi("reflection.save", {
      ...input,
      customTitle: input.directionSlug === UNREGISTERED_PROJECT_SLUG ? customTitle : null,
      customWallet: input.directionSlug === UNREGISTERED_PROJECT_SLUG ? customWallet : null,
      balance,
    });
  }

  const db = await getDb();
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

  const isUnregistered = input.directionSlug === UNREGISTERED_PROJECT_SLUG;
  const now = new Date();
  await db
    .update(userAccounts)
    .set({
      reflectionDirectionId: directionId,
      reflectionProjectId: null,
      reflectionCustomTitle: isUnregistered ? customTitle : null,
      reflectionCustomWallet: isUnregistered ? customWallet : null,
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
      customTitle: isUnregistered ? customTitle : null,
      customWallet: isUnregistered ? customWallet : null,
    },
  });

  return getUserReflectionPreference(input.userId);
}

function destinationWalletForPreference(
  categories: ReflectionCategory[],
  directionSlug: ReflectionCategorySlug | null,
  customTitle: string | null,
  customWallet: string | null,
) {
  if (!directionSlug) {
    return {
      destinationType: "balanced" as const,
      destinationSlug: null,
      destinationWallet: null,
      customTitle: null,
    };
  }

  if (directionSlug === UNREGISTERED_PROJECT_SLUG) {
    return {
      destinationType: "unregistered" as const,
      destinationSlug: UNREGISTERED_PROJECT_SLUG,
      destinationWallet: customWallet && customWallet.length >= 32 ? customWallet : null,
      customTitle,
    };
  }

  const category = categories.find((item) => item.slug === directionSlug);
  return {
    destinationType: "category" as const,
    destinationSlug: category?.slug ?? directionSlug,
    destinationWallet: category?.solanaWallet ?? null,
    customTitle: null,
  };
}

export async function listReflectionRouting() {
  const { categories, projects } = await getReflectionDestinations();

  try {
    if (remoteDb()) {
      const rows = await callDataApi<
        Array<{
          userAccountId: number;
          reflectionDirectionId: number | null;
          holderWallet: string;
          directionSlug: string | null;
          customTitle: string | null;
          customWallet: string | null;
          lastGaineBalance: string | null;
          reflectionUpdatedAt: string | null;
        }>
      >("reflection.routing");
      const routing = rows.map((row) => {
        const directionSlug = (row.directionSlug as ReflectionCategorySlug | null) ?? null;
        const destination = destinationWalletForPreference(
          categories,
          directionSlug,
          row.customTitle,
          row.customWallet,
        );
        return {
          userAccountId: row.userAccountId,
          reflectionDirectionId: row.reflectionDirectionId,
          holderWallet: row.holderWallet,
          gaineBalance: row.lastGaineBalance,
          updatedAt: row.reflectionUpdatedAt,
          ...destination,
        };
      });
      return { categories, projects, routing };
    }

    const db = await getDb();
    const rows = await db
      .select({
        userAccountId: userAccounts.id,
        reflectionDirectionId: userAccounts.reflectionDirectionId,
        holderWallet: walletProfiles.address,
        directionSlug: taxonomyTerms.slug,
        customTitle: userAccounts.reflectionCustomTitle,
        customWallet: userAccounts.reflectionCustomWallet,
        lastGaineBalance: walletProfiles.lastGaineBalance,
        reflectionUpdatedAt: userAccounts.reflectionUpdatedAt,
      })
      .from(walletProfiles)
      .innerJoin(userAccounts, eq(walletProfiles.userAccountId, userAccounts.id))
      .leftJoin(taxonomyTerms, eq(userAccounts.reflectionDirectionId, taxonomyTerms.id))
      .where(sql`CAST(${walletProfiles.lastGaineBalance} AS DECIMAL(24,8)) >= ${GAINE_REFLECTION_MIN_BALANCE}`)
      .orderBy(desc(userAccounts.reflectionUpdatedAt));

    const routing = rows.map((row) => {
      const directionSlug = (row.directionSlug as ReflectionCategorySlug | null) ?? null;
      const destination = destinationWalletForPreference(
        categories,
        directionSlug,
        row.customTitle,
        row.customWallet,
      );

      return {
        userAccountId: row.userAccountId,
        reflectionDirectionId: row.reflectionDirectionId ?? null,
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

function isPositiveGaineAmount(raw: string): boolean {
  const value = Number(raw);
  return Number.isFinite(value) && value > 0;
}

export async function recordReflectionDisbursement(input: {
  userAccountId: number;
  reflectionDirectionId: number;
  holderWallet: string;
  destinationWallet: string;
  amountGaine: string;
  solanaTxSignature: string;
  customTitle?: string | null;
  destinationType?: "category" | "unregistered";
  destinationSlug?: string | null;
}) {
  const amountGaine = String(input.amountGaine).trim();
  if (!isPositiveGaineAmount(amountGaine)) {
    throw new ReflectionDisbursementError("amountGaine must be a positive number.", 422);
  }

  const holderWallet = input.holderWallet.trim();
  const destinationWallet = input.destinationWallet.trim();
  const solanaTxSignature = input.solanaTxSignature.trim();
  const customTitle =
    input.customTitle == null || input.customTitle === ""
      ? null
      : String(input.customTitle).trim().slice(0, 50);

  if (holderWallet.length < 32 || holderWallet.length > 44) {
    throw new ReflectionDisbursementError("Invalid holderWallet.", 422);
  }
  if (destinationWallet.length < 32 || destinationWallet.length > 44) {
    throw new ReflectionDisbursementError("Invalid destinationWallet.", 422);
  }
  if (solanaTxSignature.length < 32 || solanaTxSignature.length > 128) {
    throw new ReflectionDisbursementError("Invalid solanaTxSignature.", 422);
  }

  if (remoteDb()) {
    try {
      return await callDataApi<{
        id: number;
        createdAt: string | null;
        duplicate: boolean;
      }>("reflection.recordDisbursement", {
        userAccountId: input.userAccountId,
        reflectionDirectionId: input.reflectionDirectionId,
        holderWallet,
        destinationWallet,
        amountGaine,
        solanaTxSignature,
        customTitle,
        destinationType: input.destinationType ?? null,
        destinationSlug: input.destinationSlug ?? null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to record disbursement.";
      if (/duplicate/i.test(message)) {
        throw new ReflectionDisbursementError("Duplicate solanaTxSignature.", 409);
      }
      if (/validation|invalid|unknown direction|unknown user/i.test(message)) {
        throw new ReflectionDisbursementError(message, 422);
      }
      throw err;
    }
  }

  const db = await getDb();

  const [user] = await db
    .select({ id: userAccounts.id })
    .from(userAccounts)
    .where(eq(userAccounts.id, input.userAccountId))
    .limit(1);
  if (!user) {
    throw new ReflectionDisbursementError("Unknown userAccountId.", 422);
  }

  const [direction] = await db
    .select({ id: taxonomyTerms.id })
    .from(taxonomyTerms)
    .innerJoin(taxonomyDomains, eq(taxonomyTerms.domainId, taxonomyDomains.id))
    .where(
      and(
        eq(taxonomyDomains.slug, "reflection_direction"),
        eq(taxonomyTerms.id, input.reflectionDirectionId),
      ),
    )
    .limit(1);
  if (!direction) {
    throw new ReflectionDisbursementError("Unknown reflectionDirectionId.", 422);
  }

  const [existing] = await db
    .select({ id: reflectionDisbursements.id })
    .from(reflectionDisbursements)
    .where(eq(reflectionDisbursements.solanaTxSignature, solanaTxSignature))
    .limit(1);
  if (existing) {
    throw new ReflectionDisbursementError("Duplicate solanaTxSignature.", 409);
  }

  try {
    const [inserted] = await db.insert(reflectionDisbursements).values({
      userAccountId: input.userAccountId,
      reflectionDirectionId: input.reflectionDirectionId,
      holderWallet,
      destinationWallet,
      customTitle,
      amountGaine,
      solanaTxSignature,
    });

    const [existingTotal] = await db
      .select({
        id: reflectionDisbursementTotals.id,
        totalAmountGaine: reflectionDisbursementTotals.totalAmountGaine,
        sendCount: reflectionDisbursementTotals.sendCount,
      })
      .from(reflectionDisbursementTotals)
      .where(
        and(
          eq(reflectionDisbursementTotals.reflectionDirectionId, input.reflectionDirectionId),
          eq(reflectionDisbursementTotals.destinationWallet, destinationWallet),
        ),
      )
      .limit(1);

    if (existingTotal) {
      const nextTotal = (Number(existingTotal.totalAmountGaine ?? 0) + Number(amountGaine)).toFixed(8);
      await db
        .update(reflectionDisbursementTotals)
        .set({
          totalAmountGaine: nextTotal,
          sendCount: (existingTotal.sendCount ?? 0) + 1,
          customTitle: customTitle ?? undefined,
        })
        .where(eq(reflectionDisbursementTotals.id, existingTotal.id));
    } else {
      await db.insert(reflectionDisbursementTotals).values({
        reflectionDirectionId: input.reflectionDirectionId,
        destinationWallet,
        customTitle,
        totalAmountGaine: amountGaine,
        sendCount: 1,
      });
    }

    return {
      id: Number(inserted.insertId),
      createdAt: new Date().toISOString(),
      duplicate: false,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (/duplicate|unique|ER_DUP_ENTRY/i.test(message)) {
      throw new ReflectionDisbursementError("Duplicate solanaTxSignature.", 409);
    }
    throw err;
  }
}

export async function listReflectionPreferencesForAdmin(limit = 200) {
  try {
    if (remoteDb()) return callDataApi("admin.reflections", { limit });

    const db = await getDb();
    const rows = await db
      .select({
        walletAddress: walletProfiles.address,
        email: userAccounts.email,
        displayName: userAccounts.displayName,
        lastGaineBalance: walletProfiles.lastGaineBalance,
        directionLabel: taxonomyTerms.label,
        directionSlug: taxonomyTerms.slug,
        customTitle: userAccounts.reflectionCustomTitle,
        customWallet: userAccounts.reflectionCustomWallet,
        reflectionUpdatedAt: userAccounts.reflectionUpdatedAt,
      })
      .from(userAccounts)
      .leftJoin(walletProfiles, eq(userAccounts.primaryWalletId, walletProfiles.id))
      .leftJoin(taxonomyTerms, eq(userAccounts.reflectionDirectionId, taxonomyTerms.id))
      .where(sql`${userAccounts.reflectionDirectionId} IS NOT NULL`)
      .orderBy(desc(userAccounts.reflectionUpdatedAt))
      .limit(limit);

    return rows.map((row) => ({
      ...row,
      reflectionUpdatedAt: row.reflectionUpdatedAt?.toISOString() ?? null,
    }));
  } catch {
    return [];
  }
}
