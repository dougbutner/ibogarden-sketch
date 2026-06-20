-- Developer Fund + Microdose Research reflection categories and projects

INSERT INTO taxonomy_terms (domain_id, slug, label, sort_order, metadata)
SELECT d.id, v.slug, v.label, v.sort_order, v.metadata
FROM taxonomy_domains d
JOIN (
  SELECT 'developer_fund' AS slug, 'Developer Fund' AS label, 6 AS sort_order,
    JSON_OBJECT('solanaWallet', 'AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ') AS metadata
  UNION ALL
  SELECT 'microdose_research', 'Microdose Research', 7,
    JSON_OBJECT('solanaWallet', 'RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u')
) v ON d.slug = 'reflection_direction'
ON DUPLICATE KEY UPDATE label = VALUES(label), sort_order = VALUES(sort_order), metadata = VALUES(metadata);

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
  )
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  solana_wallet = VALUES(solana_wallet),
  sort_order = VALUES(sort_order);
