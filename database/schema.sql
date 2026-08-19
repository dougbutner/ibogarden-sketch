-- ibo.garden MariaDB schema + reference data
-- Canonical source of truth. Update this file whenever the data model changes.
--
-- Fresh database:
--   mysql -u USER -p DATABASE < database/schema.sql
--
-- Charset: utf8mb4 · Engine: InnoDB
-- Seeds at the bottom are idempotent (ON DUPLICATE KEY UPDATE).

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- Layer 1: Taxonomy
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS taxonomy_domains (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug          VARCHAR(64)     NOT NULL,
  label         VARCHAR(128)    NOT NULL,
  description   TEXT            NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_taxonomy_domains_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS taxonomy_terms (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  domain_id     BIGINT UNSIGNED NOT NULL,
  slug          VARCHAR(96)     NOT NULL,
  label         VARCHAR(192)    NOT NULL,
  parent_id     BIGINT UNSIGNED NULL,
  sort_order    INT             NOT NULL DEFAULT 0,
  metadata      JSON            NULL,
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_taxonomy_terms_domain_slug (domain_id, slug),
  KEY idx_taxonomy_terms_parent (parent_id),
  CONSTRAINT fk_taxonomy_terms_domain
    FOREIGN KEY (domain_id) REFERENCES taxonomy_domains (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_taxonomy_terms_parent
    FOREIGN KEY (parent_id) REFERENCES taxonomy_terms (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Layer 2: Identity & auth
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_accounts (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email                   VARCHAR(255)    NULL,
  display_name            VARCHAR(128)    NULL,
  avatar_url              VARCHAR(512)    NULL,
  primary_wallet_id       BIGINT UNSIGNED NULL,
  holder_status           ENUM('none','active','lapsed') NOT NULL DEFAULT 'none',
  reflection_direction_id BIGINT UNSIGNED NULL,
  reflection_project_id   BIGINT UNSIGNED NULL,
  -- Custom beneficiary when direction is unregistered_project (100+ GAINE only; enforced in app)
  reflection_custom_title  VARCHAR(50)     NULL,
  reflection_custom_wallet VARCHAR(44)     NULL,
  reflection_updated_at   DATETIME        NULL,
  country_code            CHAR(2)         NULL,
  timezone                VARCHAR(64)     NULL,
  marketing_opt_in        TINYINT(1)      NOT NULL DEFAULT 0,
  created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at            DATETIME        NULL,
  last_login_at           DATETIME        NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_accounts_email (email),
  KEY idx_user_accounts_holder_status (holder_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wallet_profiles (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  address             VARCHAR(44)     NOT NULL,
  user_account_id     BIGINT UNSIGNED NULL,
  wallet_provider     VARCHAR(32)     NULL,
  first_gaine_balance DECIMAL(24,8)   NULL,
  peak_gaine_balance  DECIMAL(24,8)   NULL,
  last_gaine_balance  DECIMAL(24,8)   NULL,
  first_verified_at   DATETIME        NULL,
  last_verified_at    DATETIME        NULL,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wallet_profiles_address (address),
  KEY idx_wallet_profiles_user (user_account_id),
  CONSTRAINT fk_wallet_profiles_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE user_accounts
  ADD CONSTRAINT fk_user_accounts_primary_wallet
    FOREIGN KEY (primary_wallet_id) REFERENCES wallet_profiles (id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE user_accounts
  ADD CONSTRAINT fk_user_accounts_reflection_direction
    FOREIGN KEY (reflection_direction_id) REFERENCES taxonomy_terms (id)
    ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS impact_projects (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug          VARCHAR(96)     NOT NULL,
  name          VARCHAR(192)    NOT NULL,
  description   TEXT            NULL,
  solana_wallet VARCHAR(44)     NOT NULL,
  sort_order    INT             NOT NULL DEFAULT 0,
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_impact_projects_slug (slug),
  KEY idx_impact_projects_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE user_accounts
  ADD CONSTRAINT fk_user_accounts_reflection_project
    FOREIGN KEY (reflection_project_id) REFERENCES impact_projects (id)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- GAINE reflection disbursements: each GAINE send attributed to a holder + fund option
CREATE TABLE IF NOT EXISTS reflection_disbursements (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_account_id         BIGINT UNSIGNED NOT NULL,
  reflection_direction_id BIGINT UNSIGNED NOT NULL,
  holder_wallet           VARCHAR(44)     NOT NULL,
  destination_wallet      VARCHAR(44)     NOT NULL,
  custom_title            VARCHAR(50)     NULL,
  amount_gaine             DECIMAL(24,8)   NOT NULL,
  solana_tx_signature     VARCHAR(128)    NOT NULL,
  created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reflection_disbursements_tx (solana_tx_signature),
  KEY idx_reflection_disbursements_user (user_account_id),
  KEY idx_reflection_disbursements_direction (reflection_direction_id),
  KEY idx_reflection_disbursements_dest (destination_wallet),
  KEY idx_reflection_disbursements_created (created_at),
  CONSTRAINT fk_reflection_disbursements_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_reflection_disbursements_direction
    FOREIGN KEY (reflection_direction_id) REFERENCES taxonomy_terms (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Running totals per fund option (direction + destination wallet)
CREATE TABLE IF NOT EXISTS reflection_disbursement_totals (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  reflection_direction_id BIGINT UNSIGNED NOT NULL,
  destination_wallet      VARCHAR(44)     NOT NULL,
  custom_title            VARCHAR(50)     NULL,
  total_amount_gaine       DECIMAL(24,8)   NOT NULL DEFAULT 0,
  send_count              INT UNSIGNED    NOT NULL DEFAULT 0,
  updated_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reflection_disbursement_totals_fund (reflection_direction_id, destination_wallet),
  KEY idx_reflection_disbursement_totals_direction (reflection_direction_id),
  CONSTRAINT fk_reflection_disbursement_totals_direction
    FOREIGN KEY (reflection_direction_id) REFERENCES taxonomy_terms (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS oauth_identities (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_account_id   BIGINT UNSIGNED NOT NULL,
  provider          VARCHAR(32)     NOT NULL,
  provider_user_id  VARCHAR(255)    NOT NULL,
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_oauth_provider_user (provider, provider_user_id),
  KEY idx_oauth_user (user_account_id),
  CONSTRAINT fk_oauth_identities_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_sessions (
  id                CHAR(36)        NOT NULL,
  user_account_id   BIGINT UNSIGNED NOT NULL,
  expires_at        DATETIME        NOT NULL,
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_sessions_user (user_account_id),
  KEY idx_user_sessions_expires (expires_at),
  CONSTRAINT fk_user_sessions_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_sessions (
  id          CHAR(36)    NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  expires_at  DATETIME    NOT NULL,
  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_admin_sessions_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_waitlist (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email           VARCHAR(255)    NOT NULL,
  wallet_address  VARCHAR(44)     NULL,
  user_account_id BIGINT UNSIGNED NULL,
  source          VARCHAR(64)     NOT NULL DEFAULT 'community_page',
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  linked_at       DATETIME        NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_community_waitlist_email (email),
  KEY idx_community_waitlist_user (user_account_id),
  CONSTRAINT fk_community_waitlist_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Layer 3: User journey & analytics
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS anonymous_sessions (
  id                  CHAR(36)        NOT NULL,
  first_path          VARCHAR(512)    NULL,
  first_referrer      VARCHAR(512)    NULL,
  utm_source          VARCHAR(128)    NULL,
  utm_medium          VARCHAR(128)    NULL,
  utm_campaign        VARCHAR(128)    NULL,
  ref_code            VARCHAR(64)     NULL,
  converted_user_id   BIGINT UNSIGNED NULL,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_anonymous_sessions_converted (converted_user_id),
  CONSTRAINT fk_anonymous_sessions_user
    FOREIGN KEY (converted_user_id) REFERENCES user_accounts (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_events (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_account_id       BIGINT UNSIGNED NULL,
  anonymous_session_id  CHAR(36)        NULL,
  session_id            CHAR(36)        NULL,
  event_type            VARCHAR(64)     NOT NULL,
  event_category        VARCHAR(32)     NOT NULL,
  path                  VARCHAR(512)    NULL,
  referrer              VARCHAR(512)    NULL,
  utm_source            VARCHAR(128)    NULL,
  utm_medium            VARCHAR(128)    NULL,
  utm_campaign          VARCHAR(128)    NULL,
  ref_code              VARCHAR(64)     NULL,
  entity_type           VARCHAR(32)     NULL,
  entity_id             BIGINT UNSIGNED NULL,
  metadata              JSON            NULL,
  wallet_address        VARCHAR(44)     NULL,
  gaine_balance_snapshot DECIMAL(24,8)  NULL,
  ip_hash               CHAR(64)        NULL,
  user_agent            VARCHAR(512)    NULL,
  created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_events_user (user_account_id),
  KEY idx_user_events_type (event_type),
  KEY idx_user_events_category (event_category),
  KEY idx_user_events_created (created_at),
  KEY idx_user_events_entity (entity_type, entity_id),
  CONSTRAINT fk_user_events_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_user_events_anonymous
    FOREIGN KEY (anonymous_session_id) REFERENCES anonymous_sessions (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_journey_stats (
  user_account_id       BIGINT UNSIGNED NOT NULL,
  first_seen_at         DATETIME        NULL,
  first_login_at        DATETIME        NULL,
  first_holder_at       DATETIME        NULL,
  total_sessions        INT UNSIGNED    NOT NULL DEFAULT 0,
  total_page_views      INT UNSIGNED    NOT NULL DEFAULT 0,
  pages_visited         JSON            NULL,
  first_utm_source      VARCHAR(128)    NULL,
  learn_articles_read   INT UNSIGNED    NOT NULL DEFAULT 0,
  listings_viewed       INT UNSIGNED    NOT NULL DEFAULT 0,
  listings_inquired     INT UNSIGNED    NOT NULL DEFAULT 0,
  share_actions         INT UNSIGNED    NOT NULL DEFAULT 0,
  gaine_peak_balance    DECIMAL(24,8)   NULL,
  gaine_current_balance DECIMAL(24,8)   NULL,
  last_event_at         DATETIME        NULL,
  journey_stage         ENUM('visitor','waitlist','registered','holder','inquirer','partner') NOT NULL DEFAULT 'visitor',
  updated_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_account_id),
  CONSTRAINT fk_user_journey_stats_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Layer 4: Partners & network
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS network_applications (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_name     VARCHAR(255)    NOT NULL,
  email                 VARCHAR(255)    NOT NULL,
  country               VARCHAR(128)    NOT NULL,
  partner_type_id       BIGINT UNSIGNED NOT NULL,
  credentials           TEXT            NULL,
  gabon_first_sourcing  TINYINT(1)      NOT NULL DEFAULT 0,
  southeast_africa      TINYINT(1)      NOT NULL DEFAULT 0,
  solana_wallet         VARCHAR(44)     NULL,
  status                ENUM('pending','in_review','approved','rejected','withdrawn') NOT NULL DEFAULT 'pending',
  reviewer_note         TEXT            NULL,
  reviewed_at           DATETIME        NULL,
  reviewed_by           VARCHAR(255)    NULL,
  created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_network_applications_status (status),
  KEY idx_network_applications_email (email),
  CONSTRAINT fk_network_applications_partner_type
    FOREIGN KEY (partner_type_id) REFERENCES taxonomy_terms (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS partners (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  application_id      BIGINT UNSIGNED NULL,
  slug                VARCHAR(128)    NOT NULL,
  display_name        VARCHAR(255)    NOT NULL,
  partner_type_id     BIGINT UNSIGNED NOT NULL,
  description         TEXT            NULL,
  country_code        CHAR(2)         NULL,
  solana_wallet       VARCHAR(44)     NULL,
  contact_email       VARCHAR(255)    NULL,
  website_url         VARCHAR(512)    NULL,
  is_gabon_first      TINYINT(1)      NOT NULL DEFAULT 0,
  is_active           TINYINT(1)      NOT NULL DEFAULT 1,
  featured            TINYINT(1)      NOT NULL DEFAULT 0,
  compliance_status   ENUM('pending','verified','suspended') NOT NULL DEFAULT 'pending',
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_partners_slug (slug),
  KEY idx_partners_type (partner_type_id),
  KEY idx_partners_active (is_active),
  CONSTRAINT fk_partners_application
    FOREIGN KEY (application_id) REFERENCES network_applications (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_partners_type
    FOREIGN KEY (partner_type_id) REFERENCES taxonomy_terms (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS partner_certifications (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  partner_id      BIGINT UNSIGNED NOT NULL,
  cert_term_id    BIGINT UNSIGNED NOT NULL,
  verified_at     DATETIME        NULL,
  expires_at      DATETIME        NULL,
  document_url    VARCHAR(512)    NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_partner_cert (partner_id, cert_term_id),
  CONSTRAINT fk_partner_certifications_partner
    FOREIGN KEY (partner_id) REFERENCES partners (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_partner_certifications_term
    FOREIGN KEY (cert_term_id) REFERENCES taxonomy_terms (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS facilitator_profiles (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  partner_id      BIGINT UNSIGNED NOT NULL,
  care_type_id    BIGINT UNSIGNED NOT NULL,
  headline        VARCHAR(255)    NULL,
  bio             TEXT            NULL,
  languages       JSON            NULL,
  location_label  VARCHAR(255)    NULL,
  latitude        DECIMAL(10,7)   NULL,
  longitude       DECIMAL(10,7)   NULL,
  is_published    TINYINT(1)      NOT NULL DEFAULT 0,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_facilitator_profiles_partner (partner_id),
  CONSTRAINT fk_facilitator_profiles_partner
    FOREIGN KEY (partner_id) REFERENCES partners (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_facilitator_profiles_care_type
    FOREIGN KEY (care_type_id) REFERENCES taxonomy_terms (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS farm_profiles (
  id                          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  partner_id                  BIGINT UNSIGNED NOT NULL,
  hectares                    DECIMAL(10,2)   NULL,
  plant_count                 INT UNSIGNED    NULL,
  decree_authorization_number VARCHAR(128)    NULL,
  export_certified            TINYINT(1)      NOT NULL DEFAULT 0,
  traceability_batch_prefix   VARCHAR(64)     NULL,
  created_at                  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_farm_profiles_partner (partner_id),
  CONSTRAINT fk_farm_profiles_partner
    FOREIGN KEY (partner_id) REFERENCES partners (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Layer 5: Marketplace
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS listings (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  partner_id          BIGINT UNSIGNED NOT NULL,
  slug                VARCHAR(160)    NOT NULL,
  title               VARCHAR(255)    NOT NULL,
  summary             VARCHAR(512)    NULL,
  description         TEXT            NULL,
  listing_category_id BIGINT UNSIGNED NOT NULL,
  listing_subtype_id  BIGINT UNSIGNED NULL,
  care_type_id        BIGINT UNSIGNED NULL,
  delivery_mode_id    BIGINT UNSIGNED NULL,
  jurisdiction_id     BIGINT UNSIGNED NULL,
  location_label      VARCHAR(255)    NULL,
  primary_cert_id     BIGINT UNSIGNED NULL,
  price_model_id      BIGINT UNSIGNED NOT NULL,
  price_display       VARCHAR(64)     NULL,
  price_cents         INT UNSIGNED    NULL,
  currency            VARCHAR(8)      NOT NULL DEFAULT 'USD',
  requires_gaine      TINYINT(1)      NOT NULL DEFAULT 0,
  min_gaine_balance   DECIMAL(24,8)   NULL,
  status              ENUM('draft','submitted','in_review','published','paused','archived') NOT NULL DEFAULT 'draft',
  featured            TINYINT(1)      NOT NULL DEFAULT 0,
  sort_weight         INT             NOT NULL DEFAULT 0,
  published_at        DATETIME        NULL,
  expires_at          DATETIME        NULL,
  view_count          INT UNSIGNED    NOT NULL DEFAULT 0,
  inquiry_count       INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_listings_slug (slug),
  KEY idx_listings_partner (partner_id),
  KEY idx_listings_status (status),
  KEY idx_listings_category (listing_category_id),
  CONSTRAINT fk_listings_partner
    FOREIGN KEY (partner_id) REFERENCES partners (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_listings_category
    FOREIGN KEY (listing_category_id) REFERENCES taxonomy_terms (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_listings_subtype
    FOREIGN KEY (listing_subtype_id) REFERENCES taxonomy_terms (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_listings_care_type
    FOREIGN KEY (care_type_id) REFERENCES taxonomy_terms (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_listings_delivery_mode
    FOREIGN KEY (delivery_mode_id) REFERENCES taxonomy_terms (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_listings_jurisdiction
    FOREIGN KEY (jurisdiction_id) REFERENCES taxonomy_terms (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_listings_primary_cert
    FOREIGN KEY (primary_cert_id) REFERENCES taxonomy_terms (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_listings_price_model
    FOREIGN KEY (price_model_id) REFERENCES taxonomy_terms (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS listing_tags (
  listing_id    BIGINT UNSIGNED NOT NULL,
  term_id       BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (listing_id, term_id),
  CONSTRAINT fk_listing_tags_listing
    FOREIGN KEY (listing_id) REFERENCES listings (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_listing_tags_term
    FOREIGN KEY (term_id) REFERENCES taxonomy_terms (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS listing_media (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id  BIGINT UNSIGNED NOT NULL,
  media_type  ENUM('image','video','pdf') NOT NULL DEFAULT 'image',
  url         VARCHAR(512)    NOT NULL,
  sort_order  INT             NOT NULL DEFAULT 0,
  alt_text    VARCHAR(255)    NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_listing_media_listing (listing_id),
  CONSTRAINT fk_listing_media_listing
    FOREIGN KEY (listing_id) REFERENCES listings (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS listing_offers (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id      BIGINT UNSIGNED NOT NULL,
  label           VARCHAR(128)    NOT NULL,
  sku             VARCHAR(64)     NULL,
  price_cents     INT UNSIGNED    NULL,
  currency        VARCHAR(8)      NOT NULL DEFAULT 'USD',
  inventory_count INT UNSIGNED    NULL,
  is_active       TINYINT(1)      NOT NULL DEFAULT 1,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_listing_offers_listing (listing_id),
  CONSTRAINT fk_listing_offers_listing
    FOREIGN KEY (listing_id) REFERENCES listings (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS listing_inquiries (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id      BIGINT UNSIGNED NOT NULL,
  user_account_id BIGINT UNSIGNED NULL,
  name            VARCHAR(128)    NULL,
  email           VARCHAR(255)    NULL,
  message         TEXT            NULL,
  status          ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_listing_inquiries_listing (listing_id),
  KEY idx_listing_inquiries_status (status),
  CONSTRAINT fk_listing_inquiries_listing
    FOREIGN KEY (listing_id) REFERENCES listings (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_listing_inquiries_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS marketplace_orders (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id              BIGINT UNSIGNED NOT NULL,
  offer_id                BIGINT UNSIGNED NULL,
  buyer_user_id           BIGINT UNSIGNED NOT NULL,
  seller_partner_id       BIGINT UNSIGNED NOT NULL,
  status                  ENUM('pending','paid','fulfilled','refunded','disputed') NOT NULL DEFAULT 'pending',
  subtotal_cents          INT UNSIGNED    NOT NULL,
  currency                VARCHAR(8)      NOT NULL DEFAULT 'USD',
  gaine_amount            DECIMAL(24,8)   NULL,
  usdc_amount             DECIMAL(24,8)   NULL,
  solana_tx_signature     VARCHAR(128)    NULL,
  reflection_direction_id BIGINT UNSIGNED NULL,
  created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at                 DATETIME        NULL,
  fulfilled_at            DATETIME        NULL,
  PRIMARY KEY (id),
  KEY idx_marketplace_orders_buyer (buyer_user_id),
  KEY idx_marketplace_orders_seller (seller_partner_id),
  KEY idx_marketplace_orders_status (status),
  CONSTRAINT fk_marketplace_orders_listing
    FOREIGN KEY (listing_id) REFERENCES listings (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_marketplace_orders_offer
    FOREIGN KEY (offer_id) REFERENCES listing_offers (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_marketplace_orders_buyer
    FOREIGN KEY (buyer_user_id) REFERENCES user_accounts (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_marketplace_orders_seller
    FOREIGN KEY (seller_partner_id) REFERENCES partners (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_marketplace_orders_reflection
    FOREIGN KEY (reflection_direction_id) REFERENCES taxonomy_terms (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS marketplace_settlements (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id            BIGINT UNSIGNED NOT NULL,
  partner_id          BIGINT UNSIGNED NOT NULL,
  amount_cents        INT UNSIGNED    NOT NULL,
  currency            VARCHAR(8)      NOT NULL DEFAULT 'USDC',
  solana_tx_signature VARCHAR(128)    NULL,
  status              ENUM('pending','sent','confirmed','failed') NOT NULL DEFAULT 'pending',
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmed_at        DATETIME        NULL,
  PRIMARY KEY (id),
  KEY idx_marketplace_settlements_order (order_id),
  CONSTRAINT fk_marketplace_settlements_order
    FOREIGN KEY (order_id) REFERENCES marketplace_orders (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_marketplace_settlements_partner
    FOREIGN KEY (partner_id) REFERENCES partners (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Layer 6: Sourcing & match requests
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS consultation_requests (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_account_id BIGINT UNSIGNED NULL,
  name            VARCHAR(128)    NOT NULL,
  email           VARCHAR(255)    NOT NULL,
  organization    VARCHAR(255)    NULL,
  interest_area   VARCHAR(128)    NOT NULL,
  goals           TEXT            NULL,
  status          ENUM('new','contacted','scheduled','closed') NOT NULL DEFAULT 'new',
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_consultation_requests_status (status),
  CONSTRAINT fk_consultation_requests_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bulk_quote_requests (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_account_id BIGINT UNSIGNED NULL,
  name            VARCHAR(128)    NOT NULL,
  email           VARCHAR(255)    NOT NULL,
  company         VARCHAR(255)    NULL,
  product_type    VARCHAR(128)    NOT NULL,
  quantity        VARCHAR(128)    NULL,
  country         VARCHAR(128)    NOT NULL,
  compliance_notes TEXT           NULL,
  status          ENUM('new','matched','quoted','closed') NOT NULL DEFAULT 'new',
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_bulk_quote_requests_status (status),
  CONSTRAINT fk_bulk_quote_requests_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS facilitator_match_requests (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_account_id BIGINT UNSIGNED NULL,
  name            VARCHAR(128)    NOT NULL,
  email           VARCHAR(255)    NOT NULL,
  care_type_id    BIGINT UNSIGNED NULL,
  languages       JSON            NULL,
  jurisdiction_id BIGINT UNSIGNED NULL,
  notes           TEXT            NULL,
  status          ENUM('new','matched','closed') NOT NULL DEFAULT 'new',
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_facilitator_match_requests_status (status),
  CONSTRAINT fk_facilitator_match_requests_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_facilitator_match_requests_care_type
    FOREIGN KEY (care_type_id) REFERENCES taxonomy_terms (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_facilitator_match_requests_jurisdiction
    FOREIGN KEY (jurisdiction_id) REFERENCES taxonomy_terms (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Layer 7: Community
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS community_memberships (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_account_id BIGINT UNSIGNED NOT NULL,
  role            ENUM('member','moderator') NOT NULL DEFAULT 'member',
  joined_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_community_memberships_user (user_account_id),
  CONSTRAINT fk_community_memberships_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_messages (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_account_id BIGINT UNSIGNED NOT NULL,
  body            TEXT            NOT NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at      DATETIME        NULL,
  PRIMARY KEY (id),
  KEY idx_community_messages_user (user_account_id),
  KEY idx_community_messages_created (created_at),
  CONSTRAINT fk_community_messages_user
    FOREIGN KEY (user_account_id) REFERENCES user_accounts (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Layer 8: Compliance & traceability
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS compliance_documents (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  partner_id    BIGINT UNSIGNED NOT NULL,
  doc_type      ENUM('decree_auth','nagoya_abs','lab_test','export_cert','other') NOT NULL,
  file_url      VARCHAR(512)    NOT NULL,
  verified_at   DATETIME        NULL,
  expires_at    DATETIME        NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_compliance_documents_partner (partner_id),
  CONSTRAINT fk_compliance_documents_partner
    FOREIGN KEY (partner_id) REFERENCES partners (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS supply_batches (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  farm_profile_id   BIGINT UNSIGNED NOT NULL,
  batch_code        VARCHAR(64)     NOT NULL,
  harvest_date      DATE            NULL,
  quantity_kg       DECIMAL(12,3)   NULL,
  on_chain_ref      VARCHAR(128)    NULL,
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_supply_batches_code (batch_code),
  KEY idx_supply_batches_farm (farm_profile_id),
  CONSTRAINT fk_supply_batches_farm
    FOREIGN KEY (farm_profile_id) REFERENCES farm_profiles (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------
-- Reference data (taxonomy, impact projects)
-- Idempotent: safe to re-run (ON DUPLICATE KEY UPDATE).
-- ---------------------------------------------------------------------------

-- Domains
INSERT INTO taxonomy_domains (slug, label, description) VALUES
  ('listing_category',   'Listing Category',   'Top-level marketplace categories'),
  ('listing_subtype',    'Listing Subtype',    'Specific offering types within a category'),
  ('care_type',          'Care Type',          'Clinical, traditional, or retreat facilitator classification'),
  ('delivery_mode',      'Delivery Mode',      'How the offering is delivered'),
  ('certification',      'Certification',      'Trust and compliance badges'),
  ('partner_type',       'Partner Type',       'Network partner classification'),
  ('product_form',       'Product Form',       'Physical product types'),
  ('price_model',        'Price Model',        'How a listing is priced'),
  ('jurisdiction',       'Jurisdiction',       'Geographic or legal jurisdiction'),
  ('language',           'Language',           'Spoken languages'),
  ('reflection_direction','GAINE Reflection',  'Where holder 2% fees route'),
  ('user_intent',        'User Intent',        'Observed user goals in journey tracking')
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- listing_category
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order, metadata) SELECT d.id, v.slug, v.label, v.sort_order, v.metadata FROM taxonomy_domains d
JOIN (
  SELECT 'treatments'  AS slug, 'Treatments'  AS label, 1 AS sort_order, JSON_OBJECT('icon','✦') AS metadata UNION ALL
  SELECT 'ceremonies',  'Ceremonies',  2, JSON_OBJECT('icon','◉') UNION ALL
  SELECT 'training',    'Training',    3, JSON_OBJECT('icon','❋') UNION ALL
  SELECT 'products',    'Products',    4, JSON_OBJECT('icon','◈') UNION ALL
  SELECT 'donations',   'Donations',   5, JSON_OBJECT('icon','♢') UNION ALL
  SELECT 'community',   'Community',   6, JSON_OBJECT('icon','✤')
) v ON d.slug = 'listing_category'
ON DUPLICATE KEY UPDATE label = VALUES(label), sort_order = VALUES(sort_order);

-- listing_subtype
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order) SELECT d.id, v.slug, v.label, v.sort_order FROM taxonomy_domains d
JOIN (
  SELECT 'clinical_protocol'      AS slug, 'Clinical Protocol'      AS label, 1 AS sort_order UNION ALL
  SELECT 'bwiti_initiation',      'Bwiti Initiation',            2 UNION ALL
  SELECT 'facilitator_training',  'Facilitator Training',        3 UNION ALL
  SELECT 'root_bark',             'Root Bark',                   4 UNION ALL
  SELECT 'extract_ta',            'Extract / TA',                5 UNION ALL
  SELECT 'integration_coaching',  'Integration Coaching',        6 UNION ALL
  SELECT 'farm_support',          'Farm Support',                7 UNION ALL
  SELECT 'knowledge_share',       'Knowledge Share',             8
) v ON d.slug = 'listing_subtype'
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- care_type
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order) SELECT d.id, v.slug, v.label, v.sort_order FROM taxonomy_domains d
JOIN (
  SELECT 'clinical'    AS slug, 'Clinical'    AS label, 1 AS sort_order UNION ALL
  SELECT 'traditional', 'Traditional',                2 UNION ALL
  SELECT 'retreat',     'Retreat',                    3
) v ON d.slug = 'care_type'
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- delivery_mode
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order) SELECT d.id, v.slug, v.label, v.sort_order FROM taxonomy_domains d
JOIN (
  SELECT 'in_person'   AS slug, 'In Person'   AS label, 1 AS sort_order UNION ALL
  SELECT 'virtual',     'Virtual',                   2 UNION ALL
  SELECT 'hybrid',      'Hybrid',                    3 UNION ALL
  SELECT 'remote',      'Remote',                    4 UNION ALL
  SELECT 'invite_only', 'Invite Only',               5
) v ON d.slug = 'delivery_mode'
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- certification
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order, metadata) SELECT d.id, v.slug, v.label, v.sort_order, v.metadata FROM taxonomy_domains d
JOIN (
  SELECT 'gaine_certified' AS slug, 'GAINE Certified' AS label, 1 AS sort_order, JSON_OBJECT('badge','GAINE') AS metadata UNION ALL
  SELECT 'decree_0239',     'Decree 0239',         2, JSON_OBJECT('badge','Decree 0239') UNION ALL
  SELECT 'nagoya',          'Nagoya',              3, JSON_OBJECT('badge','Nagoya') UNION ALL
  SELECT 'open',            'Open',                4, JSON_OBJECT('badge','Open') UNION ALL
  SELECT 'pending',         'Pending',             5, JSON_OBJECT('badge','Pending')
) v ON d.slug = 'certification'
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- partner_type
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order) SELECT d.id, v.slug, v.label, v.sort_order FROM taxonomy_domains d
JOIN (
  SELECT 'facility'     AS slug, 'Facility'     AS label, 1 AS sort_order UNION ALL
  SELECT 'practitioner', 'Practitioner',               2 UNION ALL
  SELECT 'farm',         'Farm',                       3
) v ON d.slug = 'partner_type'
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- product_form
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order) SELECT d.id, v.slug, v.label, v.sort_order FROM taxonomy_domains d
JOIN (
  SELECT 'raw_bark'         AS slug, 'Root Bark (raw)'         AS label, 1 AS sort_order UNION ALL
  SELECT 'processed_bark',  'Root Bark (processed)',           2 UNION ALL
  SELECT 'extract',         'Extract / TA',                    3 UNION ALL
  SELECT 'seedlings',       'Seedlings & nursery stock',       4 UNION ALL
  SELECT 'farm_partnership','Farm partnership',                5 UNION ALL
  SELECT 'other',           'Other',                           6
) v ON d.slug = 'product_form'
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- price_model
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order) SELECT d.id, v.slug, v.label, v.sort_order FROM taxonomy_domains d
JOIN (
  SELECT 'fixed'     AS slug, 'Fixed Price' AS label, 1 AS sort_order UNION ALL
  SELECT 'inquiry',  'By Inquiry',              2 UNION ALL
  SELECT 'free',     'Free',                    3 UNION ALL
  SELECT 'recurring','Recurring',               4 UNION ALL
  SELECT 'donation', 'Donation',                5
) v ON d.slug = 'price_model'
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- jurisdiction
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order) SELECT d.id, v.slug, v.label, v.sort_order FROM taxonomy_domains d
JOIN (
  SELECT 'gabon'       AS slug, 'Gabon'        AS label, 1 AS sort_order UNION ALL
  SELECT 'costa_rica',  'Costa Rica',                 2 UNION ALL
  SELECT 'portugal',    'Portugal',                   3 UNION ALL
  SELECT 'mexico',      'Mexico',                     4 UNION ALL
  SELECT 'online_global','Online / Global',           5
) v ON d.slug = 'jurisdiction'
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- language
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order) SELECT d.id, v.slug, v.label, v.sort_order FROM taxonomy_domains d
JOIN (
  SELECT 'en' AS slug, 'English'    AS label, 1 AS sort_order UNION ALL
  SELECT 'es', 'Spanish',                   2 UNION ALL
  SELECT 'fr', 'French',                    3 UNION ALL
  SELECT 'pt', 'Portuguese',                4
) v ON d.slug = 'language'
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- reflection_direction (GAINE holder fee routing; 100+ GAINE to save)
-- Registered categories carry a default solanaWallet in metadata.
-- unregistered_project has no default wallet — holder supplies title + Solana address.
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order, metadata) SELECT d.id, v.slug, v.label, v.sort_order, v.metadata FROM taxonomy_domains d
JOIN (
  SELECT 'seeding_iboga_farms'       AS slug, 'Seeding Iboga Farms'       AS label, 1 AS sort_order, JSON_OBJECT('solanaWallet', 'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u') AS metadata UNION ALL
  SELECT 'conservation_in_gabon',    'Conservation in Gabon',          2, JSON_OBJECT('solanaWallet', 'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u') UNION ALL
  SELECT 'gabon_communities',        'Gabon Communities',              3, JSON_OBJECT('solanaWallet', 'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u') UNION ALL
  SELECT 'healing_access',           'Healing Access',                 4, JSON_OBJECT('solanaWallet', 'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u') UNION ALL
  SELECT 'tech_innovation',          'Tech Innovation',                5, JSON_OBJECT('solanaWallet', 'AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ') UNION ALL
  SELECT 'supply_chain_transparency','Supply Chain Transparency',      6, JSON_OBJECT('solanaWallet', 'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u') UNION ALL
  SELECT 'legal_fund',                'Legal Fund',                     7, JSON_OBJECT('solanaWallet', 'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u') UNION ALL
  SELECT 'bwiti_house_donation',     'Bwiti House Donation',           8, JSON_OBJECT('solanaWallet', 'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u') UNION ALL
  SELECT 'education_fund',           'Education Fund',                 9, JSON_OBJECT('solanaWallet', 'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u') UNION ALL
  SELECT 'research_fund',            'Research Fund',                 10, JSON_OBJECT('solanaWallet', 'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u') UNION ALL
  SELECT 'unregistered_project',     'Unregistered Project',          11, NULL
) v ON d.slug = 'reflection_direction'
ON DUPLICATE KEY UPDATE label = VALUES(label), sort_order = VALUES(sort_order), metadata = VALUES(metadata), is_active = 1;

-- Deactivate retired reflection categories (kept for FK history on existing DBs)
UPDATE taxonomy_terms t
JOIN taxonomy_domains d ON d.id = t.domain_id
SET t.is_active = 0
WHERE d.slug = 'reflection_direction'
  AND t.slug IN (
    'sourcing',
    'conservation',
    'research',
    'subsidized_healing',
    'developer_fund',
    'microdose_research',
    'specific_project'
  );

-- Curated impact_projects list retired: holders use registered categories or unregistered_project
-- (custom title + wallet on user_accounts). Soft-disable any prior seed rows.
UPDATE impact_projects SET is_active = 0;

-- user_intent
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order) SELECT d.id, v.slug, v.label, v.sort_order FROM taxonomy_domains d
JOIN (
  SELECT 'learn'              AS slug, 'Learn'              AS label, 1 AS sort_order UNION ALL
  SELECT 'source_bulk',       'Source Bulk',                    2 UNION ALL
  SELECT 'find_facilitator',  'Find Facilitator',               3 UNION ALL
  SELECT 'buy_gaine',         'Buy GAINE',                      4 UNION ALL
  SELECT 'join_community',    'Join Community',                 5 UNION ALL
  SELECT 'list_on_marketplace','List on Marketplace',           6 UNION ALL
  SELECT 'share',             'Share',                          7
) v ON d.slug = 'user_intent'
ON DUPLICATE KEY UPDATE label = VALUES(label);
