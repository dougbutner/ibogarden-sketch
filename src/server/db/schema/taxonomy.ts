import { mysqlTable, bigint, varchar, text, datetime, int, json, tinyint, mysqlEnum, char, decimal, date, primaryKey, uniqueIndex, index } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const taxonomyDomains = mysqlTable(
  "taxonomy_domains",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    slug: varchar("slug", { length: 64 }).notNull(),
    label: varchar("label", { length: 128 }).notNull(),
    description: text("description"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("uq_taxonomy_domains_slug").on(t.slug)],
);

export const taxonomyTerms = mysqlTable(
  "taxonomy_terms",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    domainId: bigint("domain_id", { mode: "number", unsigned: true }).notNull(),
    slug: varchar("slug", { length: 96 }).notNull(),
    label: varchar("label", { length: 192 }).notNull(),
    parentId: bigint("parent_id", { mode: "number", unsigned: true }),
    sortOrder: int("sort_order").notNull().default(0),
    metadata: json("metadata"),
    isActive: tinyint("is_active").notNull().default(1),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    uniqueIndex("uq_taxonomy_terms_domain_slug").on(t.domainId, t.slug),
    index("idx_taxonomy_terms_parent").on(t.parentId),
  ],
);
