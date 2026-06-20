import {
  mysqlTable,
  bigint,
  varchar,
  text,
  datetime,
  tinyint,
  mysqlEnum,
  int,
  decimal,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const listings = mysqlTable(
  "listings",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    partnerId: bigint("partner_id", { mode: "number", unsigned: true }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    summary: varchar("summary", { length: 512 }),
    description: text("description"),
    listingCategoryId: bigint("listing_category_id", { mode: "number", unsigned: true }).notNull(),
    listingSubtypeId: bigint("listing_subtype_id", { mode: "number", unsigned: true }),
    careTypeId: bigint("care_type_id", { mode: "number", unsigned: true }),
    deliveryModeId: bigint("delivery_mode_id", { mode: "number", unsigned: true }),
    jurisdictionId: bigint("jurisdiction_id", { mode: "number", unsigned: true }),
    locationLabel: varchar("location_label", { length: 255 }),
    primaryCertId: bigint("primary_cert_id", { mode: "number", unsigned: true }),
    priceModelId: bigint("price_model_id", { mode: "number", unsigned: true }).notNull(),
    priceDisplay: varchar("price_display", { length: 64 }),
    priceCents: int("price_cents", { unsigned: true }),
    currency: varchar("currency", { length: 8 }).notNull().default("USD"),
    requiresGaine: tinyint("requires_gaine").notNull().default(0),
    minGaineBalance: decimal("min_gaine_balance", { precision: 24, scale: 8 }),
    status: mysqlEnum("status", ["draft", "submitted", "in_review", "published", "paused", "archived"]).notNull().default("draft"),
    featured: tinyint("featured").notNull().default(0),
    sortWeight: int("sort_weight").notNull().default(0),
    publishedAt: datetime("published_at"),
    expiresAt: datetime("expires_at"),
    viewCount: int("view_count", { unsigned: true }).notNull().default(0),
    inquiryCount: int("inquiry_count", { unsigned: true }).notNull().default(0),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    uniqueIndex("uq_listings_slug").on(t.slug),
    index("idx_listings_partner").on(t.partnerId),
    index("idx_listings_status").on(t.status),
    index("idx_listings_category").on(t.listingCategoryId),
  ],
);

export const listingTags = mysqlTable(
  "listing_tags",
  {
    listingId: bigint("listing_id", { mode: "number", unsigned: true }).notNull(),
    termId: bigint("term_id", { mode: "number", unsigned: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.listingId, t.termId] })],
);

export const listingMedia = mysqlTable(
  "listing_media",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    listingId: bigint("listing_id", { mode: "number", unsigned: true }).notNull(),
    mediaType: mysqlEnum("media_type", ["image", "video", "pdf"]).notNull().default("image"),
    url: varchar("url", { length: 512 }).notNull(),
    sortOrder: int("sort_order").notNull().default(0),
    altText: varchar("alt_text", { length: 255 }),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_listing_media_listing").on(t.listingId)],
);

export const listingOffers = mysqlTable(
  "listing_offers",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    listingId: bigint("listing_id", { mode: "number", unsigned: true }).notNull(),
    label: varchar("label", { length: 128 }).notNull(),
    sku: varchar("sku", { length: 64 }),
    priceCents: int("price_cents", { unsigned: true }),
    currency: varchar("currency", { length: 8 }).notNull().default("USD"),
    inventoryCount: int("inventory_count", { unsigned: true }),
    isActive: tinyint("is_active").notNull().default(1),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_listing_offers_listing").on(t.listingId)],
);

export const listingInquiries = mysqlTable(
  "listing_inquiries",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    listingId: bigint("listing_id", { mode: "number", unsigned: true }).notNull(),
    userAccountId: bigint("user_account_id", { mode: "number", unsigned: true }),
    name: varchar("name", { length: 128 }),
    email: varchar("email", { length: 255 }),
    message: text("message"),
    status: mysqlEnum("status", ["new", "contacted", "closed"]).notNull().default("new"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("idx_listing_inquiries_listing").on(t.listingId), index("idx_listing_inquiries_status").on(t.status)],
);

export const marketplaceOrders = mysqlTable(
  "marketplace_orders",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    listingId: bigint("listing_id", { mode: "number", unsigned: true }).notNull(),
    offerId: bigint("offer_id", { mode: "number", unsigned: true }),
    buyerUserId: bigint("buyer_user_id", { mode: "number", unsigned: true }).notNull(),
    sellerPartnerId: bigint("seller_partner_id", { mode: "number", unsigned: true }).notNull(),
    status: mysqlEnum("status", ["pending", "paid", "fulfilled", "refunded", "disputed"]).notNull().default("pending"),
    subtotalCents: int("subtotal_cents", { unsigned: true }).notNull(),
    currency: varchar("currency", { length: 8 }).notNull().default("USD"),
    gaineAmount: decimal("gaine_amount", { precision: 24, scale: 8 }),
    usdcAmount: decimal("usdc_amount", { precision: 24, scale: 8 }),
    solanaTxSignature: varchar("solana_tx_signature", { length: 128 }),
    reflectionDirectionId: bigint("reflection_direction_id", { mode: "number", unsigned: true }),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    paidAt: datetime("paid_at"),
    fulfilledAt: datetime("fulfilled_at"),
  },
  (t) => [
    index("idx_marketplace_orders_buyer").on(t.buyerUserId),
    index("idx_marketplace_orders_seller").on(t.sellerPartnerId),
    index("idx_marketplace_orders_status").on(t.status),
  ],
);

export const marketplaceSettlements = mysqlTable(
  "marketplace_settlements",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    orderId: bigint("order_id", { mode: "number", unsigned: true }).notNull(),
    partnerId: bigint("partner_id", { mode: "number", unsigned: true }).notNull(),
    amountCents: int("amount_cents", { unsigned: true }).notNull(),
    currency: varchar("currency", { length: 8 }).notNull().default("USDC"),
    solanaTxSignature: varchar("solana_tx_signature", { length: 128 }),
    status: mysqlEnum("status", ["pending", "sent", "confirmed", "failed"]).notNull().default("pending"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    confirmedAt: datetime("confirmed_at"),
  },
  (t) => [index("idx_marketplace_settlements_order").on(t.orderId)],
);
