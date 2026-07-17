import type { Locale } from "@/data/i18n";
import { pickLocale } from "@/data/i18n";
import {
  GAINE_DISCLAIMER,
  GAINE_INFO_PANELS,
  GAINE_JUPITER_TOKEN_URL,
  GAINE_LAUNCH_PRICE_NOTE,
  GAINE_ROTATING_WORDS,
  GAINE_TRANSFER_FEE_LABEL,
  type GainePanel,
} from "@/data/gaine";

const disclaimer = {
  en: GAINE_DISCLAIMER,
  fr: "GAINE est un jeton d'utilité réciproque, pas une opportunité d'investissement. L'iboga et l'ibogaïne comportent de graves risques pour la santé et peuvent être illégaux dans de nombreuses juridictions. Rien ici ne constitue un avis médical, juridique, thérapeutique ou d'investissement. Vous devez avoir 21 ans ou plus. Engagé envers le décret gabonais 0239 et le protocole de Nagoya.",
};

const launchNote = {
  en: GAINE_LAUNCH_PRICE_NOTE,
  fr: "en USD, EUR, GBP, CHF, AUD, BRL et or.",
};

const transferFeeLabel = {
  en: GAINE_TRANSFER_FEE_LABEL,
  fr: "Modèle monétaire des frais de transfert",
};

const rotatingWords = {
  en: [...GAINE_ROTATING_WORDS] as string[],
  fr: [
    "Iboga",
    "réciprocité",
    "changer des vies",
    "guérison",
    "renaissance",
    "durabilité",
    "impact",
    "philanthropie",
    "Finance Nouvelle Terre",
    "communauté",
    "cérémonie",
  ],
};

const panelsFr: GainePanel[] = [
  {
    id: "what",
    title: "Quoi",
    image: "gaine-token",
    paragraphs: [
      "Un **système financier en réseau** qui incarne l'**esprit de l'iboga** dans un jeton.",
      "Obligation de liquidité intelligente avec **100 % de l'offre** placée sur des fourchettes de 1 $ à 10 M$ par GAINE.",
      "Cette formule crée une **couverture complète à 1 $** en USD, EUR, GBP, CHF, AUD, BRL et or physique, le prix du jeton pouvant monter au-dessus d'un dollar.",
      "**25 %** vont aux opérations agricoles régulées au Gabon : salaires, production durable et export conforme de Tabernanthe iboga. **25 %** vont au market making, en appariant GAINE à d'autres actifs générateurs de revenus, expliqué dans la section suivante.",
      "Les **50 %** restants vont à des initiatives dirigées par les détenteurs dans notre réseau, ou, à défaut, à notre focus d'impact ou d'investissement actuel.",
    ],
  },
  {
    id: "how",
    title: "Comment",
    image: "iboga-root",
    paragraphs: [
      "**Des chiffres, pas un récit.**",
      "GAINE opère un service de change qui tourne **24 h/24, 365 jours/an**.",
      "Nous avons ce que les marchés veulent : de la **liquidité**.",
      "Les bots d'arbitrage paieront toujours notre **frais de 2 %** pour utiliser notre liquidité s'ils peuvent gagner. Ils nous paieront même des centaines de dollars en une transaction pour gagner quelques centimes.",
      "Ce modèle n'est pas une expérience : c'est l'évolution du jeton stable-bonded le plus réussi lancé par l'architecte de GAINE en mai 2025.",
      {
        type: "link",
        text: "Ce projet",
        href: "https://www.flex.town",
        suffix:
          " est devenu le jeton communautaire n°1 en volume en moins d'un an sur une chaîne DeFi du top 50, et continue de générer du profit chaque heure et de dominer en volume.",
      },
    ],
  },
  {
    id: "why",
    title: "Pourquoi",
    image: "gabon-farm",
    paragraphs: [
      "**Impact avec intérêt** pour les investisseurs.",
      "Vous connaissez le **pouvoir de l'iboga pour guérir** : que ce soit via les vidéos de ce site, ou l'histoire personnelle d'un proche qui a brisé une addiction déchirant des relations.",
      "Vous détenez du GAINE parce que :",
      "1. Vous **faites confiance (et vérifiez)** que le prix monte.",
      "2. Vous vous sentez bien d'aider à apporter la **médecine dont le monde a besoin** aux masses pendant toute la durée de détention, sans effort supplémentaire.",
    ],
  },
  {
    id: "who",
    title: "Qui",
    image: "iboga-root",
    paragraphs: [
      {
        type: "person",
        name: "Benny Friedmann",
        tags: [],
        bio: "A passé des années sur le terrain au Gabon ; son réseau s'étend à des dizaines de fermiers et à des chamans générationnels comme Moughenda Mikala. Son expérience passée en hedge funds et sa personnalité ouverte en font le connecteur dont le Gabon a besoin. Benny a participé à de nombreuses cérémonies iboga et relations d'approvisionnement sur le terrain.",
      },
      {
        type: "person",
        name: "Douglas Butner",
        tags: [
          { label: "EASY", href: "https://www.flex.town" },
          { label: "cXc.world", href: "https://cxc.world" },
          { label: "Aquarius Academy", href: "https://aquarius.academy" },
        ],
        bio: "Est l'innovateur tokenomique à la pointe de la crypto, concepteur de pools de swap avant Uniswap pour son app de musique crypto lancée en 2018. En 2025, Douglas a perfectionné le design de jeton « Pure Liquid », et créé le premier jeton de réflexion (intérêts vers le portefeuille) permettant de choisir ses récompenses. Douglas a microdosé l'iboga des centaines de fois, mais n'a pas encore visité le Gabon pour une dose flood en cérémonie.",
      },
      {
        type: "person",
        name: "Amaka Zazzy",
        tags: [{ label: "Wellness 4 the People" }],
        bio: "Est infirmière diplômée spécialisée dans les alchimies psychoactives pour guérir rapidement et améliorer l'absorption de nombreux types de médecine. Amaka a guéri des centaines de personnes, et a récemment développé les premières barres de microdose d'iboga au chocolat blanc, avec le projet d'étudier les effets et de rédiger un projet de loi américain pour légaliser toute médecine végétale sous forme brute, appelé The Eden Act. Amaka est née en Californie de parents nigérians (Ibo).",
      },
    ],
  },
  {
    id: "when",
    title: "Quand",
    image: "gabon-farm",
    paragraphs: [
      "**Maintenant.**",
      {
        type: "link",
        text: "Le jeu : vous achetez du GAINE tôt, près de 1 USD ici",
        href: GAINE_JUPITER_TOKEN_URL,
        suffix: ".",
      },
      "Plus vous entrez près de **1 $ par GAINE**, plus vos gains sont importants.",
      "Pendant toute la détention, les dollars qui adossent vos jetons fournissent la liquidité qui génère du profit dans le pool : le profit va vers l'**impact que vous choisissez** sur cette page.",
      "GAINE s'appuie sur cette compréhension du marché pour créer un **modèle financier Nouvelle Terre**. Pour la première fois, vous pouvez fournir un impact durable **sans que vos actifs quittent votre main**.",
    ],
  },
];

const panels = {
  en: GAINE_INFO_PANELS,
  fr: panelsFr,
};

export function getGaineDisclaimer(locale: Locale) {
  return pickLocale(locale, disclaimer);
}

export function getGaineRotatingWords(locale: Locale) {
  return pickLocale(locale, rotatingWords);
}

export function getGaineInfoPanels(locale: Locale) {
  return pickLocale(locale, panels);
}

export function getGaineLaunchPriceNote(locale: Locale) {
  return pickLocale(locale, launchNote);
}

export function getGaineTransferFeeLabel(locale: Locale) {
  return pickLocale(locale, transferFeeLabel);
}
