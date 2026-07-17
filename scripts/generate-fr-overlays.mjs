/**
 * Generates French overlays for find-centers and knowledge articles.
 * Run: node scripts/generate-fr-overlays.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const articlesEn = JSON.parse(fs.readFileSync("/tmp/articles-en.json", "utf8"));

// --- Article French translations (href -> {title, description}) ---
const ARTICLE_FR = {
  "https://onlinelibrary.wiley.com/doi/10.1111/add.15448": {
    title: "Knuijver et al. 2022 : sécurité clinique en sevrage opioïde",
    description:
      "La première étude clinique de sécurité soignée : 14 patients dépendants aux opioïdes recevant de l'ibogaïne, la moitié avec QTc > 500 ms — preuve que le risque cardiaque est réel même à dose modeste, et qu'il se normalise.",
  },
  "https://onlinelibrary.wiley.com/doi/10.1111/add.70319": {
    title: "Brunt et al. 2026 : complications cardiovasculaires",
    description:
      "Revue 2026 expliquant pourquoi les arythmies rares mais létales (Torsades de Pointes) touchent même des cœurs sains, et comment la génétique CYP2D6 peut déterminer qui est à risque.",
  },
  "https://www.mdpi.com/1420-3049/31/3/545": {
    title: "Molecules 2026 : revue scoping",
    description:
      "Revue scoping 2026 pesant la promesse anti-addiction de l'ibogaïne contre ses dangers cardiaques, et pourquoi l'usage hors clinique laisse le bilan de sécurité incomplet.",
  },
  "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5334404/": {
    title: "Koenig et al. : étude sur cardiomyocytes humains",
    description:
      "Preuves en laboratoire sur cellules cardiaques humaines montrant que l'ibogaïne et la noribogaïne retardent la repolarisation — mécanisme du allongement du QT, effets possibles des jours après la dose.",
  },
  "https://pmc.ncbi.nlm.nih.gov/articles/PMC11102648/": {
    title: "PK/PD chez patients avec trouble lié aux opioïdes",
    description:
      "Pharmacologie du danger : métabolisme CYP2D6 plus lent augmente l'exposition à l'ibogaïne et allonge le QT, plus critères d'exclusion utilisés en clinique.",
  },
  "https://www.sciencedirect.com/science/article/abs/pii/S0736467919305700": {
    title: "Grogan et al. : cas d'urgence",
    description:
      "Rapport de cas aux urgences : convulsions et Torsades après ibogaïne — image crue de ce que voient les services de crise.",
  },
  "https://www.tandfonline.com/doi/full/10.1080/17425255.2021.1944099": {
    title: "Revue toxicité et potentiel thérapeutique",
    description:
      "Évaluation bénéfice-risque arguant que des essais bien contrôlés sont urgents, rédigée alors que des essais formels étaient enfin approuvés.",
  },
  "https://www.nature.com/articles/s41467-024-51856-y": {
    title: "Analogues oxa-iboga sans risque cardiaque",
    description:
      "Analogues oxa-iboga conçus en labo perturbent la consommation d'opioïdes chez l'animal sans risque cardiaque — voie vers une génération plus sûre.",
  },
  "https://ibogaineguidelines.com/": {
    title: "Guidelines cliniques GITA",
    description:
      "Guidelines cliniques GITA pour le sevrage assisté par ibogaïne : playbook de sécurité distillé et librement licencié par la communauté.",
  },
};

// Fill remaining articles with title-prefixed French descriptions from English
for (const cat of articlesEn) {
  for (const a of cat.articles) {
    if (!ARTICLE_FR[a.href]) {
      ARTICLE_FR[a.href] = {
        title: a.title,
        description: `[FR] ${a.description}`,
      };
    }
  }
}

// Build categories overlay
const categoriesOverlay = {};
for (const cat of articlesEn) {
  categoriesOverlay[cat.id] = { articles: {} };
  for (const a of cat.articles) {
    const fr = ARTICLE_FR[a.href];
    categoriesOverlay[cat.id].articles[a.href] = fr;
  }
}

// Patch knowledge-iboga.fr.ts categories.articles sections
const frPath = path.join(ROOT, "src/data/knowledge-iboga.fr.ts");
let frContent = fs.readFileSync(frPath, "utf8");

for (const [catId, data] of Object.entries(categoriesOverlay)) {
  const articlesJson = JSON.stringify(data.articles, null, 6).replace(/^/gm, "      ");
  const re = new RegExp(`(${catId}:\\s*\\{[\\s\\S]*?articles:\\s*)\\{\\}`, "m");
  if (!re.test(frContent)) {
    console.warn("Could not patch category", catId);
    continue;
  }
  frContent = frContent.replace(re, `$1${articlesJson.slice(6)}`);
}

fs.writeFileSync(frPath, frContent);
console.log("Patched knowledge-iboga.fr.ts with", Object.keys(ARTICLE_FR).length, "article entries");
