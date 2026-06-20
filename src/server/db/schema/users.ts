import { mysqlTable, bigint, varchar, text, datetime, tinyint, mysqlEnum, char, decimal, json, int, index, uniqueIndex } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const userAccounts = mysqlTable(
  "user_accounts",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    email: varchar("email", { length: 255 }),
    displayName: varchar("display_name", { length: 128 }),
    avatarUrl: varchar("avatar_url", { length: 512 }),
    primaryWalletId: bigint("primary_wallet_id", { mode: "number", unsigned: true }),
    holderStatus: mysqlEnum("holder_status", ["none", "active", "lapsed"]).notNull().default("none"),
    reflectionDirectionId: bigint("reflection_direction_id", { mode: "number", unsigned: true }),
    reflectionProjectId: bigint("reflection_project_id", { mode: "number", unsigned: true }),
    reflectionUpdatedAt: datetime("reflection_updated_at"),
    countryCode: char("country_code", { length: 2 }),
    timezone: varchar("timezone", { length: 64 }),
    marketingOptIn: tinyint("marketing_opt_in").notNull().default(0),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    lastSeenAt: datetime("last_seen_at"),
    lastLoginAt: datetime("last_login_at"),
  },
  (t) => [uniqueIndex("uq_user_accounts_email").on(t.email), index("idx_user_accounts_holder_status").on(t.holderStatus)],
);

export const walletProfiles = mysqlTable(
  "wallet_profiles",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    address: varchar("address", { length: 44 }).notNull(),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }),
    walletProvider: varchar("wallet_provider", { length: 32 }),
    firstGaineBalance: decimal("first_gaine_balance", { precision: 24, scale: 8 }),
    peakGaineBalance: decimal("peak_gaine_balance", { precision: 24, scale: 8 }),
    lastGaineBalance: decimal("last_gaine_balance", { precision: 24, scale: 8 }),
    firstVerifiedAt: datetime("first_verified_at"),
    lastVerifiedAt: datetime("last_verified_at"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("uq_wallet_profiles_address").on(t.address), index("idx_wallet_profiles_user").on(t.userAccountId)],
);

export const oauthIdentities = mysqlTable(
  "oauth_identities",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }).notNull(),
    provider: varchar("provider", { length: 32 }).notNull(),
    providerUserId: varchar("provider_user_id", { length: 255 }).notNull(),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("uq_oauth_provider_user").on(t.provider, t.providerUserId), index("idx_oauth_user").on(t.userAccountId)],
);

export const userSessions = mysqlTable(
  "user_sessions",
  {
    id: char("id", { length: 36 }).primaryKey(),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }).notNull(),
    expiresAt: datetime("expires_at").notNull(),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_user_sessions_user").on(t.userAccountId), index("idx_user_sessions_expires").on(t.expiresAt)],
);

export const adminSessions = mysqlTable(
  "admin_sessions",
  {
    id: char("id", { length: 36 }).primaryKey(),
    adminEmail: varchar("admin_email", { length: 255 }).notNull(),
    expiresAt: datetime("expires_at").notNull(),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_admin_sessions_expires").on(t.expiresAt)],
);

export const communityWaitlist = mysqlTable(
  "community_waitlist",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    email: varchar("email", { length: 255 }).notNull(),
    walletAddress: varchar("wallet_address", { length: 44 }),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }),
    source: varchar("source", { length: 64 }).notNull().default("community_page"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    linkedAt: datetime("linked_at"),
  },
  (t) => [uniqueIndex("uq_community_waitlist_email").on(t.email), index("idx_community_waitlist_user").on(t.userAccountId)],
);

export const anonymousSessions = mysqlTable(
  "anonymous_sessions",
  {
    id: char("id", { length: 36 }).primaryKey(),
    firstPath: varchar("first_path", { length: 512 }),
    firstReferrer: varchar("first_referrer", { length: 512 }),
    utmSource: varchar("utm_source", { length: 128 }),
    utmMedium: varchar("utm_medium", { length: 128 }),
    utmCampaign: varchar("utm_campaign", { length: 128 }),
    refCode: varchar("ref_code", { length: 64 }),
    convertedUserId: bigint("converted_user_id", { mode: "number", unsigned: true }),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_anonymous_sessions_converted").on(t.convertedUserId)],
);

export const userEvents = mysqlTable(
  "user_events",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }),
    anonymousSessionId: char("anonymous_session_id", { length: 36 }),
    sessionId: char("session_id", { length: 36 }),
    eventType: varchar("event_type", { length: 64 }).notNull(),
    eventCategory: varchar("event_category", { length: 32 }).notNull(),
    path: varchar("path", { length: 512 }),
    referrer: varchar("referrer", { length: 512 }),
    utmSource: varchar("utm_source", { length: 128 }),
    utmMedium: varchar("utm_medium", { length: 128 }),
    utmCampaign: varchar("utm_campaign", { length: 128 }),
    refCode: varchar("ref_code", { length: 64 }),
    entityType: varchar("entity_type", { length: 32 }),
    entityId: bigint("entity_id", { mode: "number", unsigned: true }),
    metadata: json("metadata"),
    walletAddress: varchar("wallet_address", { length: 44 }),
    gaineBalanceSnapshot: decimal("gaine_balance_snapshot", { precision: 24, scale: 8 }),
    ipHash: char("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 512 }),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("idx_user_events_user").on(t.userAccountId),
    index("idx_user_events_type").on(t.eventType),
    index("idx_user_events_category").on(t.eventCategory),
    index("idx_user_events_created").on(t.createdAt),
    index("idx_user_events_entity").on(t.entityType, t.entityId),
  ],
);

export const userJourneyStats = mysqlTable("user_journey_stats", {
  userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }).primaryKey(),
  firstSeenAt: datetime("first_seen_at"),
  firstLoginAt: datetime("first_login_at"),
  firstHolderAt: datetime("first_holder_at"),
  totalSessions: int("total_sessions", { unsigned: true }).notNull().default(0),
  totalPageViews: int("total_page_views", { unsigned: true }).notNull().default(0),
  pagesVisited: json("pages_visited"),
  firstUtmSource: varchar("first_utm_source", { length: 128 }),
  learnArticlesRead: int("learn_articles_read", { unsigned: true }).notNull().default(0),
  listingsViewed: int("listings_viewed", { unsigned: true }).notNull().default(0),
  listingsInquired: int("listings_inquired", { unsigned: true }).notNull().default(0),
  shareActions: int("share_actions", { unsigned: true }).notNull().default(0),
  gainePeakBalance: decimal("gaine_peak_balance", { precision: 24, scale: 8 }),
  gaineCurrentBalance: decimal("gaine_current_balance", { precision: 24, scale: 8 }),
  lastEventAt: datetime("last_event_at"),
  journeyStage: mysqlEnum("journey_stage", ["visitor", "waitlist", "registered", "holder", "inquirer", "partner"])
    .notNull()
    .default("visitor"),
  updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
