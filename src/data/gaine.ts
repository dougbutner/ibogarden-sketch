export const GAINE_METADATA_URL =
  "https://raw.githubusercontent.com/dougbutner/Bridged-EASY-Contracts/refs/heads/main/metadata-gaine-main.json";

/** Set VITE_GAINE_MINT when the Solana mint is live for DexScreener price feeds. */
export const GAINE_MINT = import.meta.env.VITE_GAINE_MINT as string | undefined;

export const GAINE_MAX_SUPPLY = "999,369";
export const GAINE_INITIAL_PRICE = 1;

export const GAINE_ROTATING_WORDS = [
  "Iboga",
  "reciprocity",
  "changing lives",
  "healing",
  "rebirth",
  "sustainability",
  "impact",
  "philanthropy",
  "New Earth Financials",
  "community",
  "ceremony",
] as const;

export type GainePanel = {
  id: string;
  title: string;
  image: string;
  paragraphs: Array<string | { type: "link"; text: string; href: string; suffix?: string }>;
};

export const GAINE_INFO_PANELS: GainePanel[] = [
  {
    id: "backed-by-dollars",
    title: "Backed by dollars",
    image: "gaine-token",
    paragraphs: [
      "Pure liquid bonding through 100% of supply placed at ranges from $1 per GAINE to $10M per GAINE.",
      "This formula creates full backing at $1, with the token price able to grow above a dollar.",
    ],
  },
  {
    id: "numbers-not-narrative",
    title: "Numbers, not narrative",
    image: "iboga-root",
    paragraphs: [
      "GAINE is not an experiment — it's an evolution of the most successful stable-bonded token design by the same architect.",
      {
        type: "link",
        text: "That project",
        href: "https://www.flex.town",
        suffix:
          " grew to the #1 community token by volume in under one year on a top-50 DeFi chain.",
      },
    ],
  },
  {
    id: "impact-with-interest",
    title: "Impact with interest, principal that stays",
    image: "gabon-farm",
    paragraphs: [
      "You buy GAINE and keep 98% of the value. The whole time you hold it, the dollars backing your tokens stay liquid in the pool — while the 2% transfer tax from every transaction flows to impact you choose.",
      "GAINE builds on this market understanding to create a New Earth finance model. For the first time, you have the ability to provide lasting impact without your assets leaving your hand.",
    ],
  },
];
