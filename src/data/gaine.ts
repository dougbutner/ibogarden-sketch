export const GAINE_METADATA_URL =
  "https://raw.githubusercontent.com/dougbutner/Bridged-EASY-Contracts/refs/heads/main/metadata-gaine-main.json";

export const GAINE_TOKEN_IMAGE =
  "https://raw.githubusercontent.com/dougbutner/Bridged-EASY-Contracts/refs/heads/main/GAINE-token.png";

export const GAINE_WHITEPAPER_URL = GAINE_METADATA_URL;

/** GAINE token mint on Solana mainnet. Override with VITE_GAINE_MINT in env. */
export const GAINE_MINT_ADDRESS = "ibozy4AxS6TdsBDerGJN1ZKFFohEubFdHWGcyLxPLFL";

/** Paste your Solana mint here, or set VITE_GAINE_MINT in env. */
export const GAINE_CONTRACT_ADDRESS =
  (import.meta.env.VITE_GAINE_MINT as string | undefined) || GAINE_MINT_ADDRESS;

/** Project wallet that holds GAINE liquidity positions on Orca. */
export const GAINE_PROJECT_WALLET = "GAinSTufAma6Z53W1EveJPYSXh2bJySw4k2kZ1TMoLF3";

/** Minimum expected Orca Whirlpool count: used to verify the feed is complete. */
export const GAINE_MIN_EXPECTED_POOLS = 20;

export const GAINE_ORCA_URL = "https://www.orca.so";

export const SOL_MINT = "So11111111111111111111111111111111111111112";

/** Verified GAINE token page on Jupiter (chart + research). */
export const GAINE_JUPITER_TOKEN_URL = `https://jup.ag/tokens/${GAINE_CONTRACT_ADDRESS}`;

/** Direct SOL → GAINE swap on Jupiter. */
export const GAINE_JUPITER_SWAP_URL = `https://jup.ag/swap/SOL-${GAINE_CONTRACT_ADDRESS}`;

export function gainePoolOrcaUrl(poolAddress: string) {
  return `https://www.orca.so/pools/${poolAddress}`;
}

export const GAINE_MAX_SUPPLY = "999,369";
export const GAINE_LAUNCH_PRICE = "$1.00+";
export const GAINE_LAUNCH_PRICE_NOTE = "in USD, EUR, GBP, CHF, AUD, BRL and gold.";
export const GAINE_TRANSFER_FEE = "2%";
export const GAINE_TRANSFER_FEE_LABEL = "Transfer Fee Money Model";
export const GAINE_PROGRAM = "Token-2022";

export const GAINE_REFLECTION_DIRECTIONS = [
  {
    key: "Sourcing",
    desc: "Ethical Gabon farms & supply-chain traceability",
  },
  {
    key: "Conservation",
    desc: "Reforestation & smallholder working capital",
  },
  {
    key: "Gabon Communities",
    desc: "Benefit-sharing under Decree 0239",
  },
  {
    key: "Specific Project",
    desc: "USDC sent to an approved project wallet",
  },
] as const;

export const GAINE_DISCLAIMER =
  "GAINE is a reciprocating utility token, not an investment opportunity. Iboga and ibogaine carry serious health risks and may be illegal in many jurisdictions. Nothing here is medical, legal, therapeutic, or investment advice. You must be 21+ to use. Committed to Gabon Decree 0239 & Nagoya Protocol.";

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

export type GainePanelParagraph =
  | string
  | { type: "link"; text: string; href: string; suffix?: string }
  | { type: "person"; name: string; tags: Array<{ label: string; href?: string }>; bio: string };

export type GainePanel = {
  id: string;
  title: string;
  image: string;
  paragraphs: GainePanelParagraph[];
};

export const GAINE_INFO_PANELS: GainePanel[] = [
  {
    id: "what",
    title: "What",
    image: "gaine-token",
    paragraphs: [
      "A **network financial system** living **spirit of Iboga** in a token.",
      "Smart liquidity bonding with **100% of supply** placed at ranges from $1 per GAINE to $10M per GAINE.",
      "This formula creates **full backing at $1** in USD, EUR, GBP, CHF, AUD, BRL and physical gold, with the token price able to grow above a dollar.",
      "**25%** goes to Ibogabon for operations, salaries, and investment in sustainable, regulated production and export of Tabernanthe Iboga. **25%** goes to market making, pairing GAINE with more assets that will generate more revenue, explained in the next section.",
      "The remaining **50%** goes to holder-directed initiatives within our network, or, if undirected, to our current impact or investment focus.",
    ],
  },
  {
    id: "how",
    title: "How",
    image: "iboga-root",
    paragraphs: [
      "**Numbers, not narrative.**",
      "GAINE operates a money changing service that runs **24/7, 365**.",
      "We have something the markets want: **liquidity**.",
      "Arbitrage bots will always pay our **2% fee** to use our liquidity if they can make money. They'll even pay us hundreds of dollars in a single transaction to make a few pennies themselves.",
      "This model is not an experiment: it's an evolution of the most successful stable-bonded token launched by the architect of GAINE in May 2025.",
      {
        type: "link",
        text: "That project",
        href: "https://www.flex.town",
        suffix:
          " grew to the #1 community token by volume in under one year on a top-50 DeFi chain, and has continued to generate profit every hour of every day and dominate in volume.",
      },
    ],
  },
  {
    id: "why",
    title: "Why",
    image: "gabon-farm",
    paragraphs: [
      "**Impact with interest** for investors.",
      "You know the **power Iboga has to heal**: whether from the videos on this site, or a personal story of a family member who broke their addiction ripping apart relationships.",
      "You hold GAINE because:",
      "1. You **trust (and verify)** it's going up in price.",
      "2. You feel good you're helping to bring the **medicine the world needs** to the masses the entire time you hold, with no extra effort.",
    ],
  },
  {
    id: "who",
    title: "Who",
    image: "iboga-root",
    paragraphs: [
      {
        type: "person",
        name: "Benny Friedmann",
        tags: [{ label: "Ibogabon" }],
        bio: "Has spent years on the ground in Gabon, and his network extends to dozens of farmers, as well as generational shaman like Moughenda Mikala. His past experience in hedge funds, and fun open personality makes him the perfect connector Gabon needs. Benny has been in many Iboga ceremonies and sourcing relationships on the ground.",
      },
      {
        type: "person",
        name: "Douglas Butner",
        tags: [
          { label: "EASY", href: "https://www.flex.town" },
          { label: "cXc.world", href: "https://cxc.world" },
          { label: "Aquarius Academy", href: "https://aquarius.academy" },
        ],
        bio: "Is the tokenomic innovator at the cutting edge of crypto, designing swap pools before Uniswap existed for his crypto music app launched in 2018. In 2025 Douglas perfected the \"Pure Liquid\" token design, and created the first reflection (interest to wallet) token that allowed users to pick what rewards they got for holding. Douglas has microdosed iboga hundreds of times, but has yet to visit Gabon for a flood dose in ceremony.",
      },
      {
        type: "person",
        name: "Amaka Zazzy",
        tags: [{ label: "Wellness 4 the People" }],
        bio: "Is a registered nurse specializing in psychoactive alchemies to heal rapidly and allow for better absorption of many types of medicine. Amaka has healed hundreds with her medicine, and recently developed the first white-chocolate Iboga microdose bars, with plans to study the effects and draft a bill for the USA to legalize all plant medicine in raw form called The Eden Act. Amaka was born in California to Nigerian (Ibo) parents.",
      },
    ],
  },
  {
    id: "when",
    title: "When",
    image: "gabon-farm",
    paragraphs: [
      "**Now.**",
      {
        type: "link",
        text: "The Play: You buy GAINE early, close to 1 USD here",
        href: GAINE_ORCA_URL,
        suffix: ".",
      },
      "The closer to **$1 per GAINE** you get in, the more gains you see.",
      "The whole time you hold it, the dollars backing your tokens provide the liquidity that makes profit in the pool: profit flows to **impact you choose** on this page.",
      "GAINE builds on this market understanding to create a **New Earth finance model**. For the first time, you have the ability to provide lasting impact **without your assets leaving your hand**.",
    ],
  },
];
