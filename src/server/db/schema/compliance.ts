import { mysqlTable, bigint, varchar, datetime, mysqlEnum, decimal, date, index, uniqueIndex } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const complianceDocuments = mysqlTable(
  "compliance_documents",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    partnerId: bigint("partner_id", { mode: "number", unsigned: true }).notNull(),
    docType: mysqlEnum("doc_type", ["decree_auth", "nagoya_abs", "lab_test", "export_cert", "other"]).notNull(),
    fileUrl: varchar("file_url", { length: 512 }).notNull(),
    verifiedAt: datetime("verified_at"),
    expiresAt: datetime("expires_at"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_compliance_documents_partner").on(t.partnerId)],
);

export const supplyBatches = mysqlTable(
  "supply_batches",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    farmProfileId: bigint("farm_profile_id", { mode: "number", unsigned: true }).notNull(),
    batchCode: varchar("batch_code", { length: 64 }).notNull(),
    harvestDate: date("harvest_date"),
    quantityKg: decimal("quantity_kg", { precision: 12, scale: 3 }),
    onChainRef: varchar("on_chain_ref", { length: 128 }),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("uq_supply_batches_code").on(t.batchCode), index("idx_supply_batches_farm").on(t.farmProfileId)],
);
