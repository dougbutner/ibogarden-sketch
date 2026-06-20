export const GAINE_REFLECTION_MIN_BALANCE = 100;

export const REFLECTION_CATEGORY_SLUGS = [
  "sourcing",
  "conservation",
  "gabon_communities",
  "research",
  "subsidized_healing",
  "developer_fund",
  "microdose_research",
  "specific_project",
] as const;

export type ReflectionCategorySlug = (typeof REFLECTION_CATEGORY_SLUGS)[number];

export type ReflectionCategory = {
  slug: ReflectionCategorySlug;
  label: string;
  description: string;
  solanaWallet: string | null;
};

export type ImpactProject = {
  slug: string;
  name: string;
  description: string;
  solanaWallet: string;
};

/** Fallback when taxonomy / DB rows are unavailable (dev or pre-migration). */
export const REFLECTION_CATEGORY_FALLBACK: ReflectionCategory[] = [
  {
    slug: "sourcing",
    label: "Sourcing",
    description: "Ethical Gabon farms & supply-chain traceability",
    solanaWallet: "PLACEsour1ngWa11etP1aceho1derxxxxxxxxxx1",
  },
  {
    slug: "conservation",
    label: "Conservation",
    description: "Reforestation & smallholder working capital",
    solanaWallet: "PLACEconsrvWa11etP1aceho1derxxxxxxxxxx2",
  },
  {
    slug: "gabon_communities",
    label: "Gabon Communities",
    description: "Benefit-sharing under Decree 0239",
    solanaWallet: "PLACEgabonCmWa11etP1aceho1derxxxxxxx3",
  },
  {
    slug: "research",
    label: "Research",
    description: "Clinical and ethnobotanical ibogaine research",
    solanaWallet: "PLACEresearchWa11etP1aceho1derxxxxxxxx4",
  },
  {
    slug: "subsidized_healing",
    label: "Subsidized Healing",
    description: "Treatment access for holders who cannot afford care",
    solanaWallet: "PLACEhealingWa11etP1aceho1derxxxxxxx5",
  },
  {
    slug: "developer_fund",
    label: "Developer Fund",
    description: "Protocol development, tooling, and ibo.garden infrastructure",
    solanaWallet: "AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ",
  },
  {
    slug: "microdose_research",
    label: "Microdose Research",
    description: "Microdose iboga studies, safety data, and formulation research",
    solanaWallet: "RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u",
  },
  {
    slug: "specific_project",
    label: "Specific Project",
    description: "USDC sent to an approved project wallet",
    solanaWallet: null,
  },
];

export const IMPACT_PROJECT_FALLBACK: ImpactProject[] = [
  {
    slug: "developer-fund",
    name: "Developer Fund",
    description: "Protocol development, tooling, and ibo.garden infrastructure.",
    solanaWallet: "AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ",
  },
  {
    slug: "microdose-research",
    name: "Microdose Research",
    description: "Microdose iboga studies, safety data, and formulation research.",
    solanaWallet: "RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u",
  },
  {
    slug: "ibogabon-farm-network",
    name: "Ibogabon Farm Network",
    description: "Direct support for certified Gabon farms and traceable supply chains.",
    solanaWallet: "PLACEprojFarmWa11etP1aceho1derxxxxxxxxxx1",
  },
  {
    slug: "decree-0239-community-fund",
    name: "Decree 0239 Community Fund",
    description: "Benefit-sharing for Bwiti communities under Gabon sovereign iboga policy.",
    solanaWallet: "PLACEproj0239Wa11etP1aceho1derxxxxxxxxxx2",
  },
  {
    slug: "clinical-research-pilot",
    name: "Clinical Research Pilot",
    description: "Early-stage ibogaine research and safety data collection.",
    solanaWallet: "PLACEprojResWa11etP1aceho1derxxxxxxxxxxx3",
  },
];

export const GAINE_REFLECTION_DIRECTIONS = REFLECTION_CATEGORY_FALLBACK.map((category) => ({
  slug: category.slug,
  key: category.label,
  desc: category.description,
}));
