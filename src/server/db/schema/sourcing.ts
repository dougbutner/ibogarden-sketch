import { mysqlTable, bigint, varchar, text, datetime, mysqlEnum, json, index } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const consultationRequests = mysqlTable(
  "consultation_requests",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }),
    name: varchar("name", { length: 128 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    organization: varchar("organization", { length: 255 }),
    interestArea: varchar("interest_area", { length: 128 }).notNull(),
    goals: text("goals"),
    status: mysqlEnum("status", ["new", "contacted", "scheduled", "closed"]).notNull().default("new"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_consultation_requests_status").on(t.status)],
);

export const bulkQuoteRequests = mysqlTable(
  "bulk_quote_requests",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }),
    name: varchar("name", { length: 128 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }),
    productType: varchar("product_type", { length: 128 }).notNull(),
    quantity: varchar("quantity", { length: 128 }),
    country: varchar("country", { length: 128 }).notNull(),
    complianceNotes: text("compliance_notes"),
    status: mysqlEnum("status", ["new", "matched", "quoted", "closed"]).notNull().default("new"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_bulk_quote_requests_status").on(t.status)],
);

export const facilitatorMatchRequests = mysqlTable(
  "facilitator_match_requests",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }),
    name: varchar("name", { length: 128 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    careTypeId: bigint("care_type_id", { mode: "number", unsigned: true }),
    languages: json("languages"),
    jurisdictionId: bigint("jurisdiction_id", { mode: "number", unsigned: true }),
    notes: text("notes"),
    status: mysqlEnum("status", ["new", "matched", "closed"]).notNull().default("new"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_facilitator_match_requests_status").on(t.status)],
);
