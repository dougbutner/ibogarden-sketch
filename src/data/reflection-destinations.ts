import type { Locale } from "@/data/i18n";

export const GAINE_REFLECTION_MIN_BALANCE = 100;

/** Default reflection beneficiary (all registered categories except tech_innovation). */
export const REFLECTION_WALLET_DEFAULT = "RAXqakFtzCiyBPCERwQv8w3MMuuPUkZtkTFZh17vk4u";

/** Tech Innovation / protocol development wallet. */
export const REFLECTION_WALLET_TECH = "AvsecEzG9ghmzHtb9D1hvmrXomHJRJdHU5aWp4DGjTKZ";

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
    solanaWallet: REFLECTION_WALLET_DEFAULT,
  },
  {
    slug: "conservation_in_gabon",
    label: "Conservation in Gabon",
    description: "Forest protection and habitat stewardship",
    solanaWallet: REFLECTION_WALLET_DEFAULT,
  },
  {
    slug: "gabon_communities",
    label: "Gabon Communities",
    description: "Benefit-sharing under Decree 0239",
    solanaWallet: REFLECTION_WALLET_DEFAULT,
  },
  {
    slug: "healing_access",
    label: "Healing Access",
    description: "Treatment access for people who cannot afford care",
    solanaWallet: REFLECTION_WALLET_DEFAULT,
  },
  {
    slug: "tech_innovation",
    label: "Tech Innovation",
    description: "Protocol development, tooling, and ibo.garden infrastructure",
    solanaWallet: REFLECTION_WALLET_TECH,
  },
  {
    slug: "supply_chain_transparency",
    label: "Supply Chain Transparency",
    description: "Traceability, sourcing integrity, and compliant export",
    solanaWallet: REFLECTION_WALLET_DEFAULT,
  },
  {
    slug: "legal_fund",
    label: "Legal Fund",
    description: "Policy, compliance, and legal defense for the network",
    solanaWallet: REFLECTION_WALLET_DEFAULT,
  },
  {
    slug: "bwiti_house_donation",
    label: "Bwiti House Donation",
    description: "Support for Bwiti houses and ceremonial community spaces",
    solanaWallet: REFLECTION_WALLET_DEFAULT,
  },
  {
    slug: "education_fund",
    label: "Education Fund",
    description: "Learning, training, and knowledge-sharing initiatives",
    solanaWallet: REFLECTION_WALLET_DEFAULT,
  },
  {
    slug: "research_fund",
    label: "Research Fund",
    description: "Clinical and ethnobotanical ibogaine research",
    solanaWallet: REFLECTION_WALLET_DEFAULT,
  },
  {
    slug: "unregistered_project",
    label: "Unregistered Project",
    description: "Send GAINE reflections to a Solana address you specify (title + wallet)",
    solanaWallet: null,
  },
];

export const GAINE_REFLECTION_DIRECTIONS = REFLECTION_CATEGORY_FALLBACK.map((category) => ({
  slug: category.slug,
  key: category.label,
  desc: category.description,
}));

const REFLECTION_LABELS_FR: Record<
  ReflectionCategorySlug,
  { label: string; description: string }
> = {
  seeding_iboga_farms: {
    label: "Semis de fermes d'iboga",
    description: "Semis, plantation et établissement de fermes au Gabon",
  },
  conservation_in_gabon: {
    label: "Conservation au Gabon",
    description: "Protection des forêts et gestion des habitats",
  },
  gabon_communities: {
    label: "Communautés gabonaises",
    description: "Partage des bénéfices sous le décret 0239",
  },
  healing_access: {
    label: "Accès à la guérison",
    description: "Accès au traitement pour les personnes qui ne peuvent pas payer",
  },
  tech_innovation: {
    label: "Innovation technologique",
    description: "Développement de protocoles, outils et infrastructure ibo.garden",
  },
  supply_chain_transparency: {
    label: "Transparence de la chaîne d'approvisionnement",
    description: "Traçabilité, intégrité du sourcing et export conforme",
  },
  legal_fund: {
    label: "Fonds juridique",
    description: "Politique, conformité et défense juridique pour le réseau",
  },
  bwiti_house_donation: {
    label: "Don à une maison bwiti",
    description: "Soutien aux maisons bwiti et espaces cérémoniels communautaires",
  },
  education_fund: {
    label: "Fonds éducatif",
    description: "Apprentissage, formation et initiatives de partage de savoir",
  },
  research_fund: {
    label: "Fonds de recherche",
    description: "Recherche clinique et ethnobotanique sur l'ibogaïne",
  },
  unregistered_project: {
    label: "Projet non enregistré",
    description:
      "Envoyez les réflexions GAINE à une adresse Solana que vous indiquez (titre + portefeuille)",
  },
};

/** Apply locale-specific labels/descriptions to reflection categories. */
export function localizeReflectionCategories(
  categories: ReflectionCategory[],
  locale: Locale,
): ReflectionCategory[] {
  if (locale === "en") return categories;
  return categories.map((category) => {
    const fr = REFLECTION_LABELS_FR[category.slug];
    if (!fr) return category;
    return { ...category, label: fr.label, description: fr.description };
  });
}

export function getLocalizedReflectionDirections(locale: Locale) {
  const categories = localizeReflectionCategories(REFLECTION_CATEGORY_FALLBACK, locale);
  return categories.map((category) => ({
    slug: category.slug,
    key: category.label,
    desc: category.description,
  }));
}
