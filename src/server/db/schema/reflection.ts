import { mysqlTable, bigint, varchar, text, datetime, int, tinyint, uniqueIndex, index } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const impactProjects = mysqlTable(
  "impact_projects",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    slug: varchar("slug", { length: 96 }).notNull(),
    name: varchar("name", { length: 192 }).notNull(),
    description: text("description"),
    solanaWallet: varchar("solana_wallet", { length: 44 }).notNull(),
    sortOrder: int("sort_order").notNull().default(0),
    isActive: tinyint("is_active").notNull().default(1),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("uq_impact_projects_slug").on(t.slug), index("idx_impact_projects_active").on(t.isActive, t.sortOrder)],
);
