import { mysqlTable, bigint, text, datetime, mysqlEnum, uniqueIndex, index } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const communityMemberships = mysqlTable(
  "community_memberships",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }).notNull(),
    role: mysqlEnum("role", ["member", "moderator"]).notNull().default("member"),
    joinedAt: datetime("joined_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("uq_community_memberships_user").on(t.userAccountId)],
);

export const communityMessages = mysqlTable(
  "community_messages",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }).notNull(),
    body: text("body").notNull(),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    deletedAt: datetime("deleted_at"),
  },
  (t) => [index("idx_community_messages_user").on(t.userAccountId), index("idx_community_messages_created").on(t.createdAt)],
);
