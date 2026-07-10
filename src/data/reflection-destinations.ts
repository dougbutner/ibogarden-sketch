export const GAINE_REFLECTION_MIN_BALANCE = 100;

export const REFLECTION_CATEGORY_SLUGS = [
  "seeding_iboga_farms",
  "conservation_in_gabon",
  "gabon_communities",
  "healing_access",
  "tech_innovation",
  "supply_chain_transparency",
  "legal_fund",
  "bwiti_house_donation",
  "education_fund",
  "research_fund",
  "unregistered_project",
] as const;

export type ReflectionCategorySlug = (typeof REFLECTION_CATEGORY_SLUGS)[number];

export const UNREGISTERED_PROJECT_SLUG = "unregistered_project" as const;

export type ReflectionCategory = {
  slug: ReflectionCategorySlug;
  label: string;
  description: string;
  solanaWallet: string | null;
};

/** Fallback when taxonomy / DB rows are unavailable. */
export const REFLECTION_CATEGORY_FALLBACK: ReflectionCategory[] = [
  {
    slug: "seeding_iboga_farms",
    label: "Seeding Iboga Farms",
    description: "Nursery stock, planting, and farm establishment in Gabon",
    solanaWallet: "PLACEseedFarmWa11etP1aceho1derxxxxxxx01",
  },
  {
    slug: "conservation_in_gabon",
    label: "Conservation in Gabon",
    description: "Forest protection and habitat stewardship",
    solanaWallet: "PLACEconsGabonWa11etP1aceho1derxxxxxx02",
  },
  {
    slug: "gabon_communities",
    label: "Gabon Communities",
    description: "Benefit-sharing under Decree 0239",
    solanaWallet: "PLACEgabonCmWa11etP1aceho1derxxxxxxx03",
  },
  {
    slug: "healing_access",
    label: "Healing Access",
    description: "Treatment access for people who cannot afford care",
    solanaWallet: "PLACEhealingWa11etP1aceho1derxxxxxxx04",
  },
  {
    slug: "tech_innovation",
    label: "Tech Innovation",
    description: "Protocol development, tooling, and ibo.garden infrastructure",
    solanaWallet: "AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ",
  },
  {
    slug: "supply_chain_transparency",
    label: "Supply Chain Transparency",
    description: "Traceability, sourcing integrity, and compliant export",
    solanaWallet: "PLACEsupplyWa11etP1aceho1derxxxxxxxx05",
  },
  {
    slug: "legal_fund",
    label: "Legal Fund",
    description: "Policy, compliance, and legal defense for the network",
    solanaWallet: "PLACElegalWa11etP1aceho1derxxxxxxxxx06",
  },
  {
    slug: "bwiti_house_donation",
    label: "Bwiti House Donation",
    description: "Support for Bwiti houses and ceremonial community spaces",
    solanaWallet: "PLACEbwitiWa11etP1aceho1derxxxxxxxxx07",
  },
  {
    slug: "education_fund",
    label: "Education Fund",
    description: "Learning, training, and knowledge-sharing initiatives",
    solanaWallet: "PLACEeduWa11etP1aceho1derxxxxxxxxxxx08",
  },
  {
    slug: "research_fund",
    label: "Research Fund",
    description: "Clinical and ethnobotanical ibogaine research",
    solanaWallet: "PLACEresearchWa11etP1aceho1derxxxxxx09",
  },
  {
    slug: "unregistered_project",
    label: "Unregistered Project",
    description: "Send USDC to a Solana address you specify (title + wallet)",
    solanaWallet: null,
  },
];

export const GAINE_REFLECTION_DIRECTIONS = REFLECTION_CATEGORY_FALLBACK.map((category) => ({
  slug: category.slug,
  key: category.label,
  desc: category.description,
}));
