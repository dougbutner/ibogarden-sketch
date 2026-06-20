import { mysqlTable, bigint, varchar, text, datetime, tinyint, mysqlEnum, int, decimal, json, index, uniqueIndex } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const networkApplications = mysqlTable(
  "network_applications",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    organizationName: varchar("organization_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    country: varchar("country", { length: 128 }).notNull(),
    partnerTypeId: bigint("partner_type_id", { mode: "number", unsigned: true }).notNull(),
    credentials: text("credentials"),
    gabonFirstSourcing: tinyint("gabon_first_sourcing").notNull().default(0),
    southeastAfrica: tinyint("southeast_africa").notNull().default(0),
    solanaWallet: varchar("solana_wallet", { length: 44 }),
    status: mysqlEnum("status", ["pending", "in_review", "approved", "rejected", "withdrawn"]).notNull().default("pending"),
    reviewerNote: text("reviewer_note"),
    reviewedAt: datetime("reviewed_at"),
    reviewedBy: varchar("reviewed_by", { length: 255 }),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_network_applications_status").on(t.status), index("idx_network_applications_email").on(t.email)],
);

export const partners = mysqlTable(
  "partners",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    applicationId: bigint("application_id", { mode: "number", unsigned: true }),
    slug: varchar("slug", { length: 128 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    partnerTypeId: bigint("partner_type_id", { mode: "number", unsigned: true }).notNull(),
    description: text("description"),
    countryCode: varchar("country_code", { length: 2 }),
    solanaWallet: varchar("solana_wallet", { length: 44 }),
    contactEmail: varchar("contact_email", { length: 255 }),
    websiteUrl: varchar("website_url", { length: 512 }),
    isGabonFirst: tinyint("is_gabon_first").notNull().default(0),
    isActive: tinyint("is_active").notNull().default(1),
    featured: tinyint("featured").notNull().default(0),
    complianceStatus: mysqlEnum("compliance_status", ["pending", "verified", "suspended"]).notNull().default("pending"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("uq_partners_slug").on(t.slug), index("idx_partners_type").on(t.partnerTypeId), index("idx_partners_active").on(t.isActive)],
);

export const partnerCertifications = mysqlTable(
  "partner_certifications",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    partnerId: bigint("partner_id", { mode: "number", unsigned: true }).notNull(),
    certTermId: bigint("cert_term_id", { mode: "number", unsigned: true }).notNull(),
    verifiedAt: datetime("verified_at"),
    expiresAt: datetime("expires_at"),
    documentUrl: varchar("document_url", { length: 512 }),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("uq_partner_cert").on(t.partnerId, t.certTermId)],
);

export const facilitatorProfiles = mysqlTable(
  "facilitator_profiles",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    partnerId: bigint("partner_id", { mode: "number", unsigned: true }).notNull(),
    careTypeId: bigint("care_type_id", { mode: "number", unsigned: true }).notNull(),
    headline: varchar("headline", { length: 255 }),
    bio: text("bio"),
    languages: json("languages"),
    locationLabel: varchar("location_label", { length: 255 }),
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),
    isPublished: tinyint("is_published").notNull().default(0),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("uq_facilitator_profiles_partner").on(t.partnerId)],
);

export const farmProfiles = mysqlTable(
  "farm_profiles",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    partnerId: bigint("partner_id", { mode: "number", unsigned: true }).notNull(),
    hectares: decimal("hectares", { precision: 10, scale: 2 }),
    plantCount: int("plant_count", { unsigned: true }),
    decreeAuthorizationNumber: varchar("decree_authorization_number", { length: 128 }),
    exportCertified: tinyint("export_certified").notNull().default(0),
    traceabilityBatchPrefix: varchar("traceability_batch_prefix", { length: 64 }),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("uq_farm_profiles_partner").on(t.partnerId)],
);
