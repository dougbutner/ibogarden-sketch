import { mysqlTable, bigint, varchar, text, datetime, int, tinyint, decimal, uniqueIndex, index } from "drizzle-orm/mysql-core";
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

export const reflectionDisbursements = mysqlTable(
  "reflection_disbursements",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }).notNull(),
    reflectionDirectionId: bigint("reflection_direction_id", { mode: "number", unsigned: true }).notNull(),
    holderWallet: varchar("holder_wallet", { length: 44 }).notNull(),
    destinationWallet: varchar("destination_wallet", { length: 44 }).notNull(),
    customTitle: varchar("custom_title", { length: 50 }),
    amountGaine: decimal("amount_gaine", { precision: 24, scale: 8 }).notNull(),
    solanaTxSignature: varchar("solana_tx_signature", { length: 128 }).notNull(),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    uniqueIndex("uq_reflection_disbursements_tx").on(t.solanaTxSignature),
    index("idx_reflection_disbursements_user").on(t.userAccountId),
    index("idx_reflection_disbursements_direction").on(t.reflectionDirectionId),
    index("idx_reflection_disbursements_dest").on(t.destinationWallet),
    index("idx_reflection_disbursements_created").on(t.createdAt),
  ],
);

export const reflectionDisbursementTotals = mysqlTable(
  "reflection_disbursement_totals",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    reflectionDirectionId: bigint("reflection_direction_id", { mode: "number", unsigned: true }).notNull(),
    destinationWallet: varchar("destination_wallet", { length: 44 }).notNull(),
    customTitle: varchar("custom_title", { length: 50 }),
    totalAmountGaine: decimal("total_amount_gaine", { precision: 24, scale: 8 }).notNull().default("0"),
    sendCount: int("send_count", { unsigned: true }).notNull().default(0),
    updatedAt: datetime("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    uniqueIndex("uq_reflection_disbursement_totals_fund").on(t.reflectionDirectionId, t.destinationWallet),
    index("idx_reflection_disbursement_totals_direction").on(t.reflectionDirectionId),
  ],
);
