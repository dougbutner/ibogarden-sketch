-- ibo.garden taxonomy seed data
-- Run after schema.sql: mysql -u USER -p DATABASE < database/seeds.sql

SET NAMES utf8mb4;

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

-- Helper: domain id lookup via slug subqueries below

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

-- reflection_direction
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order) SELECT d.id, v.slug, v.label, v.sort_order FROM taxonomy_domains d
JOIN (
  SELECT 'sourcing'           AS slug, 'Sourcing'            AS label, 1 AS sort_order UNION ALL
  SELECT 'conservation',      'Conservation',                    2 UNION ALL
  SELECT 'gabon_communities', 'Gabon Communities',               3 UNION ALL
  SELECT 'specific_project',  'Specific Project',                4
) v ON d.slug = 'reflection_direction'
ON DUPLICATE KEY UPDATE label = VALUES(label);

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
