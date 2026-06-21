export type Locale = "en" | "fr";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

const messages = {
  en: {
    nav: {
      knowledge: "Knowledge",
      marketplace: "Marketplace",
      gaine: "GAINE",
      sourceBulk: "Source Bulk",
    },
    home: {
      badge: "Gabon Decree 0239 Regulated · DeFi Money Model · Network-rooted",
      heroTitle: "Ethical Iboga sourcing.",
      heroSubtitle: "Tokenized reciprocity. Rooted in Gabon.",
      heroLead:
        "ibo.garden is a Solana powered bridge bringing compliant iboga to buyers worldwide.",
      heroLeadTail:
        "powers ethical sourcing, traceability, and reciprocal rewards under Gabon Decree 0239.",
      buyGaine: "Buy GAINE",
      exploreMarketplace: "Explore Marketplace",
      bennyConsult: "Sourcing Consultation with Benny Friedmann →",
      sacredLabel: "Tabernanthe iboga",
      sacredTitle: "The Sacred Wood",
    },
  },
  fr: {
    nav: {
      knowledge: "Savoir",
      marketplace: "Marché",
      gaine: "GAINE",
      sourceBulk: "Approvisionnement",
    },
    home: {
      badge: "Décret gabonais 0239 · Modèle DeFi · Ancré dans le réseau",
      heroTitle: "Approvisionnement éthique en iboga.",
      heroSubtitle: "Réciprocité tokenisée. Enracinée au Gabon.",
      heroLead:
        "ibo.garden est un pont alimenté par Solana qui apporte de l'iboga conforme aux acheteurs du monde entier.",
      heroLeadTail:
        "alimente un approvisionnement éthique, la traçabilité et des récompenses réciproques sous le décret gabonais 0239.",
      buyGaine: "Acheter GAINE",
      exploreMarketplace: "Explorer le marché",
      bennyConsult: "Consultation d'approvisionnement avec Benny Friedmann →",
      sacredLabel: "Tabernanthe iboga",
      sacredTitle: "Le Bois Sacré",
    },
  },
} as const;

type MessageTree = typeof messages.en;

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function t(locale: Locale, key: string): string {
  return getNestedValue(messages[locale] as Record<string, unknown>, key) ?? getNestedValue(messages.en as Record<string, unknown>, key) ?? key;
}

export type { MessageTree };
