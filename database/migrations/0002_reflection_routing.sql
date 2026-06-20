-- GAINE reflection routing: impact projects + holder preferences

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
  ADD COLUMN IF NOT EXISTS reflection_project_id BIGINT UNSIGNED NULL AFTER reflection_direction_id,
  ADD COLUMN IF NOT EXISTS reflection_updated_at DATETIME NULL AFTER reflection_project_id;

ALTER TABLE user_accounts
  ADD CONSTRAINT fk_user_accounts_reflection_project
    FOREIGN KEY (reflection_project_id) REFERENCES impact_projects (id)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- New reflection categories
INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order, metadata)
SELECT d.id, v.slug, v.label, v.sort_order, v.metadata
FROM taxonomy_domains d
JOIN (
  SELECT 'research' AS slug, 'Research' AS label, 4 AS sort_order,
    JSON_OBJECT('solanaWallet', 'PLACEresearchWa11etP1aceho1derxxxxxxxx4') AS metadata
  UNION ALL
  SELECT 'subsidized_healing', 'Subsidized Healing', 5,
    JSON_OBJECT('solanaWallet', 'PLACEhealingWa11etP1aceho1derxxxxxxx5')
  UNION ALL
  SELECT 'developer_fund', 'Developer Fund', 6,
    JSON_OBJECT('solanaWallet', 'AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ')
  UNION ALL
  SELECT 'microdose_research', 'Microdose Research', 7,
    JSON_OBJECT('solanaWallet', 'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u')
) v ON d.slug = 'reflection_direction'
ON DUPLICATE KEY UPDATE label = VALUES(label), sort_order = VALUES(sort_order), metadata = VALUES(metadata);

UPDATE taxonomy_terms t
JOIN taxonomy_domains d ON d.id = t.domain_id
SET t.metadata = JSON_OBJECT('solanaWallet', 'PLACEsour1ngWa11etP1aceho1derxxxxxxxxxx1')
WHERE d.slug = 'reflection_direction' AND t.slug = 'sourcing';

UPDATE taxonomy_terms t
JOIN taxonomy_domains d ON d.id = t.domain_id
SET t.metadata = JSON_OBJECT('solanaWallet', 'PLACEconsrvWa11etP1aceho1derxxxxxxxxxx2')
WHERE d.slug = 'reflection_direction' AND t.slug = 'conservation';

UPDATE taxonomy_terms t
JOIN taxonomy_domains d ON d.id = t.domain_id
SET t.metadata = JSON_OBJECT('solanaWallet', 'PLACEgabonCmWa11etP1aceho1derxxxxxxx3')
WHERE d.slug = 'reflection_direction' AND t.slug = 'gabon_communities';

UPDATE taxonomy_terms t
JOIN taxonomy_domains d ON d.id = t.domain_id
SET t.sort_order = 8
WHERE d.slug = 'reflection_direction' AND t.slug = 'specific_project';

INSERT INTO impact_projects (slug, name, description, solana_wallet, sort_order)
VALUES
  (
    'developer-fund',
    'Developer Fund',
    'Protocol development, tooling, and ibo.garden infrastructure.',
    'AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ',
    1
  ),
  (
    'microdose-research',
    'Microdose Research',
    'Microdose iboga studies, safety data, and formulation research.',
    'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u',
    2
  ),
  (
    'ibogabon-farm-network',
    'Ibogabon Farm Network',
    'Direct support for certified Gabon farms and traceable supply chains.',
    'PLACEprojFarmWa11etP1aceho1derxxxxxxxxxx1',
    3
  ),
  (
    'decree-0239-community-fund',
    'Decree 0239 Community Fund',
    'Benefit-sharing for Bwiti communities under Gabon sovereign iboga policy.',
    'PLACEproj0239Wa11etP1aceho1derxxxxxxxxxx2',
    4
  ),
  (
    'clinical-research-pilot',
    'Clinical Research Pilot',
    'Early-stage ibogaine research and safety data collection.',
    'PLACEprojResWa11etP1aceho1derxxxxxxxxxxx3',
    5
  )
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  solana_wallet = VALUES(solana_wallet),
  sort_order = VALUES(sort_order);
