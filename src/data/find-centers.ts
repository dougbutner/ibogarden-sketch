export type CenterCategory = "traditional" | "clinical" | "retreat";
export type CenterTier = "top" | "verified";
export type CenterRegion =
  | "gabon"
  | "mexico"
  | "caribbean"
  | "europe"
  | "asia"
  | "canada"
  | "south_america"
  | "multi";

export type FindCenter = {
  id: string;
  name: string;
  region: CenterRegion;
  regionLabel: string;
  location: string;
  category: CenterCategory;
  tier: CenterTier;
  website?: string;
  phone?: string;
  contact?: string;
  services: string;
  cost?: string;
  verification: string;
  leader?: string;
  medical?: string;
  note?: string;
};

export const FIND_REGIONS: { id: CenterRegion | "all"; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "gabon", label: "Gabon" },
  { id: "mexico", label: "Mexico" },
  { id: "caribbean", label: "Caribbean" },
  { id: "europe", label: "Europe" },
  { id: "multi", label: "Multi-location" },
  { id: "asia", label: "Asia" },
  { id: "canada", label: "Canada" },
  { id: "south_america", label: "South America" },
];

export const FIND_REGION_COUNT = FIND_REGIONS.filter((r) => r.id !== "all").length;

export const FIND_CATEGORIES: { id: CenterCategory | "all"; label: string }[] = [
  { id: "all", label: "All types" },
  { id: "traditional", label: "Traditional" },
  { id: "clinical", label: "Clinical" },
  { id: "retreat", label: "Retreat" },
];

/** Verified Iboga/Ibogaine specialists — global directory (2026). */
export const FIND_CENTERS: FindCenter[] = [
  // Gabon
  {
    id: "bwiti-house",
    name: "Bwiti House",
    region: "gabon",
    regionLabel: "Gabon",
    location: "Libreville & Moughenda's Village",
    category: "traditional",
    tier: "top",
    website: "https://www.bwitihouse.com/",
    contact: "WhatsApp on site",
    leader: "Moughenda Mikala (10th-generation Bwiti shaman; 35+ years)",
    services:
      "10–14 day Missoko Bwiti Iboga retreats; rites of passage; initiations; provider training. 50+ certified providers across 22+ countries.",
    medical: "Pre-treatment EKG/liver panel; hospital 10–15 min away (cardiac ICU)",
    cost: "Premium (not publicly listed)",
    verification:
      "54+ Trustpilot reviews (2026); Ministerial endorsement (Gabon Minister of Tourism); operating since 1990",
  },
  {
    id: "bwiti-life",
    name: "Bwiti Life",
    region: "gabon",
    regionLabel: "Gabon",
    location: "Private Island, Gabon (15-min boat from Libreville)",
    category: "retreat",
    tier: "top",
    website: "https://www.bwitilife.com/",
    contact: "Website contact form",
    services:
      "Luxury Iboga retreats combining shamanic guidance and medical monitoring; gourmet meals; luxury suites; beach access; Bwiti music ceremonies; Pygmy rituals.",
    medical: "In-house U.S. MD; vitals monitoring (BP, O₂, pulse, temperature) throughout journey",
    cost: "Premium luxury",
    verification:
      "Official site active; trained by Moughenda Mikala (Bwiti House network); only Gabon center with dual shamanic + U.S. medical model on-site",
  },

  // Mexico
  {
    id: "mindscape-retreat",
    name: "MindScape Retreat",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Cozumel, Quintana Roo",
    category: "clinical",
    tier: "top",
    website: "https://www.mindscaperetreat.com/",
    phone: "+1 786-761-7729",
    services:
      "Medically supervised Ibogaine HCL + TA protocols; 900+ patients; 62% addiction remission; dual-protocol (first in world).",
    cost: "$6,500–$14,500",
    verification: "64 reviews; board-certified MD clinical director; ECG monitoring; 24/7 physician oversight",
  },
  {
    id: "beond-ibogaine",
    name: "Beōnd Ibogaine Treatment",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Cancun, Quintana Roo",
    category: "clinical",
    tier: "top",
    website: "https://beondibogaine.com/",
    contact: "Multiple platforms",
    services:
      '5-phase "Insight Oriented Ibogaine" protocol; 8+ MDs; 19+ ICU-certified RNs; remote prep → on-site dosing → long-term coaching.',
    cost: "$8,000–$15,500",
    verification:
      "112 reviews; founded by Tom Feegel/Talia Eisenberg; FDA-approved researchers; exemplary safety/ethics model",
  },
  {
    id: "transcend-clinic",
    name: "Transcend Clinic",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Cancun / Tulum, Quintana Roo",
    category: "clinical",
    tier: "verified",
    website: "https://transcendibogaine.com/",
    phone: "+1 (760) 621-6203",
    services:
      "Specialized ibogaine for substance use, PTSD, TBI; individual 1:1 sessions; 20+ years experience; bilingual physicians.",
    cost: "$7,500–$13,750+",
    verification:
      "14 reviews; acquired Clear Sky protocols (4,800 patients, zero fatalities); FDA-approved founder (Jon Vinnik)",
  },
  {
    id: "david-dardashti",
    name: "Ibogaine by David Dardashti",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Playa del Carmen, Quintana Roo (admin: Sweetwater, FL)",
    category: "clinical",
    tier: "verified",
    website: "https://ibogaineclinic.com/",
    phone: "(800) 818-4511",
    services:
      "Clinical ibogaine treatment; 15+ years; 3,000+ individuals treated; tailored protocols; holistic approaches; scholarships available. Sept 2025 expansion: Playa del Carmen opioid-specialization; second clinic for trauma and depression.",
    cost: "~$11,500 all-inclusive",
    verification: "Operational 2026; Yelp reviews (80 photos); founded 2004; second-location expansion announced Sept 2025",
    note: "Mixed reviews (positive & critical) — due diligence advised",
  },
  {
    id: "experience-ibogaine",
    name: "Experience Ibogaine Treatment Center",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Tijuana, Baja California",
    category: "clinical",
    tier: "verified",
    website: "https://www.experienceibogaine.com/",
    contact: "Contact via site",
    services:
      "Ibogaine + 5-MeO-DMT; customized care; 10+ years; Dr. Paul Casillas; ocean-view facility. Specializes in heroin/opioid/fentanyl addiction.",
    verification: "3 reviews; active website",
  },
  {
    id: "casa-santa-isabel",
    name: "Casa Santa Isabel",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Rosarito Beach, Baja California",
    category: "clinical",
    tier: "verified",
    website: "https://mx.casasantaisabel.com/",
    contact: "Contact via site",
    services:
      "Full-spectrum ibogaine; licensed clinic; all-inclusive retreat; holistic integration. Patients stay on-site (no hospital transfers).",
    cost: "~$8,000+",
    verification: "3 reviews; licensed facility; Sofia (psychologist) leads clinical approach",
  },
  {
    id: "ibogaquest",
    name: "IbogaQuest",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Tepoztlán, Mexico",
    category: "retreat",
    tier: "verified",
    website: "https://ibogaquest.com/",
    contact: "Contact via site",
    services:
      "Flood-dose ibogaine (36 hours); intimate posada-style home; max 7 participants/month; Monday–Monday program.",
    verification: "Active website; explicitly focused on ibogaine; home-like therapeutic environment",
  },
  {
    id: "new-roots-ibogaine",
    name: "New Roots Ibogaine",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Tijuana, Baja California",
    category: "clinical",
    tier: "verified",
    contact: "Contact via HealingMaps listing",
    services: "Substance abuse withdrawal management; ibogaine-focused.",
    verification: "5+ reviews; active listings; ibogaine specialist",
  },
  {
    id: "ambio-life-sciences",
    name: "Ambio Life Sciences",
    region: "mexico",
    regionLabel: "Mexico",
    location: "6 locations, Baja California; Malta opening 2026",
    category: "clinical",
    tier: "top",
    website: "https://ambio.life/",
    contact: "Contact via site",
    services:
      "World-class integrative ibogaine; 4,000+ patients; 50+ years combined expertise; somatic therapists; physician-led; 5-MeO-DMT protocols available.",
    medical: "Advanced life support equipment; boutique resort design",
    verification:
      "Netflix documentary \"In Waves and War\" (Nov 2025) featuring veterans; expanding to Malta 2026",
  },
  {
    id: "sayulita-wellness-retreat",
    name: "Sayulita Wellness Retreat",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Puerto Vallarta / San Francisco, Nayarit",
    category: "clinical",
    tier: "verified",
    website: "https://sayulitawellnessretreat.com/ibogaine-treatment/",
    contact: "Contact via site",
    services:
      "Medically supervised ibogaine; multi-phase protocol; 5+ years; 800+ alumni; addiction, burnout, and spiritual growth.",
    cost: "$7,997–$15,000+",
    verification: "Official ibogaine platform launch May 2026; PRWeb verified",
  },
  {
    id: "awakening-in-the-dream",
    name: "Awakening in the Dream",
    region: "mexico",
    regionLabel: "Mexico",
    location: "San Miguel de Allende, Guanajuato",
    category: "clinical",
    tier: "top",
    website: "https://www.awakeninginthedream.com/",
    contact: "Contact via site",
    leader: "Rocky, Asha & Delani Caravelli (family operation); Dr. Chavez (MD) on staff",
    services:
      "Integrative ibogaine therapy; individual + family-based treatment; practitioner training; holistic container-based approach.",
    medical: "All staff ibogaine-experienced; MD on staff",
    verification:
      "Operating since 2006 (19 years); longest-operating center in Mexico; first holistic ibogaine healing center model",
  },
  {
    id: "genesis-ibogaine-institute",
    name: "Genesis Ibogaine Institute",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Rosarito Beach, Baja California",
    category: "clinical",
    tier: "verified",
    website: "https://genesisibogaineinstitute.com/",
    contact: "Contact via site",
    services:
      "4,000+ treated since 2010; addiction + psychological disorders; pre-treatment prep + post-integration; family healing focus.",
    verification:
      "Operating since 2010; 90% success rate reported; pre-clinical research on Parkinson's integration",
  },
  {
    id: "viraha-wellness-center",
    name: "Viraha Wellness Center",
    region: "mexico",
    regionLabel: "Mexico",
    location: "San José del Cabo, Baja California Sur",
    category: "clinical",
    tier: "verified",
    website: "https://virahawellnesscenter.com/",
    contact: "Contact via site",
    services:
      "Individualized protocols; single or multiple sessions; complementary therapies (Access Bars, Tomatis Method); concierge-style care.",
    medical: "Board-certified physicians + nurses + therapists; state-accredited medical sanctuary",
    verification: "Licensed medical/mental health team; evidence-based modalities",
  },
  {
    id: "pangea-biomedics",
    name: "Pangea Biomedics",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Puerto Vallarta, Mexico",
    category: "clinical",
    tier: "top",
    website: "https://www.pangeabiomedics.com/",
    contact: "Contact via site",
    leader: "Clare Wilkins (ibogaine pioneer; 400+ treated)",
    services:
      "Slow-dose ibogaine (low-dose, go-slow approach); incremental dosing over weeks; dual-spectrum alkaloids + HCL; 3–8 week programs.",
    cost: "Varies by program length",
    verification:
      "19+ years operational (founded 2006); Horizons/MAPS conference thought leader; specialized low-dose approach; 400+ treated with safety record",
  },
  {
    id: "basse-ibogaine-clinic",
    name: "Bassé Ibogaine Clinic",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Playa del Carmen, Quintana Roo",
    category: "clinical",
    tier: "verified",
    contact: "Referenced via HealingMaps / recovery.com",
    services: "Professional clinical team; evidence-based approach; multi-modal therapies.",
    verification: "Listed on recovery.com and HealingMaps; professional staff designation",
  },
  {
    id: "casa-renacimiento",
    name: "Casa Renacimiento",
    region: "mexico",
    regionLabel: "Mexico",
    location: "Tijuana, Baja California",
    category: "clinical",
    tier: "verified",
    contact: "Contact via Placidway",
    services: "Addiction treatment; personalized care; holistic therapies; supportive recovery environment.",
    verification: "Listed on Placidway top clinics 2026; personalized approach",
  },

  // Caribbean
  {
    id: "avante-ibogaine",
    name: "Avante Ibogaine Institute",
    region: "caribbean",
    regionLabel: "Bahamas",
    location: "Nassau, Bahamas",
    category: "clinical",
    tier: "top",
    website: "https://avanteibogaine.com/",
    contact: "Contact via site",
    services:
      "1–2 week clinical ibogaine; beach setting; addiction, alcoholism, depression, PTSD, mTBI, GAD, OCD.",
    cost: "Premium (luxury)",
    verification:
      "13+ years established; board-certified physicians; physicians + clinicians + addiction specialists; 180 miles off SE Florida",
  },
  {
    id: "sanctuary-tulum",
    name: "Sanctuary Tulum",
    region: "caribbean",
    regionLabel: "Mexico (Caribbean coast)",
    location: "Tulum, Quintana Roo",
    category: "retreat",
    tier: "top",
    website: "https://www.sanctuarytulum.com/",
    services:
      "Ibogaine + ultra-luxury integrated therapies (HBOT, red light, stem cell, IV therapies, brain repair protocols); private oceanfront suites; bespoke one-on-one care.",
    cost: "Ultra-luxury (premium)",
    medical: "Advanced medical licensing; 100% organic diet; 15-year safety record",
    verification: "Partnership with IbogaineTreatmentCo (Sept 2025); ultra-luxury integrated model",
  },

  // Europe
  {
    id: "tabula-rasa",
    name: "Tabula Rasa Retreat",
    region: "europe",
    regionLabel: "Portugal",
    location: "Alentejo Region (Quinta da Fé)",
    category: "clinical",
    tier: "top",
    website: "https://www.tabularasaretreat.com/",
    services:
      "Medically supervised ibogaine; home-like environment; executive programs; dual-diagnosis (addiction + mental health); breathwork, bodywork, massage, meditation, yoga, reiki, equine therapy.",
    cost: "€5,000–€7,000+/week",
    verification:
      "48 reviews; Europe's leading ibogaine clinic; ACLS-trained medical staff; clientele UK/N. Europe/UAE/USA",
  },
  {
    id: "madera-sagrada",
    name: "Madera Sagrada",
    region: "europe",
    regionLabel: "Spain",
    location: "Órgiva, Andalusia",
    category: "retreat",
    tier: "verified",
    contact: "Contact via retreat directories",
    services: "Ibogaine ceremonies; meditation; hiking; yoga; ECG monitoring during detox.",
    cost: "~€6,000",
    verification: "Listed across multiple retreat databases; committed to guest safety; drug detox + psycho-spiritual focus",
  },
  {
    id: "root-healing",
    name: "Root Healing Iboga Retreats",
    region: "multi",
    regionLabel: "Multi-location",
    location: "USA, Portugal, Thailand, Europe",
    category: "traditional",
    tier: "top",
    website: "https://roothealing.com/",
    services:
      "Traditional Missoko Bwiti ceremonies; trauma-informed depth-oriented psychology; plant medicine integration; Iboga + Ibogaine.",
    cost: "Varies by location/program",
    verification:
      "82 Trustpilot reviews; Moughenda-trained providers (Alessandro, Gajanan); 4.7/5 TrustScore; intensive apprenticeship-based training",
  },

  // Asia
  {
    id: "ibogaine-thailand",
    name: "Ibogaine Thailand",
    region: "asia",
    regionLabel: "Thailand",
    location: "Northern Thailand",
    category: "clinical",
    tier: "top",
    website: "https://www.ibogaine-thailand.net/",
    services:
      "Discreet ibogaine therapy; shamanic wisdom + herbal medicine integration; trauma-informed; depth-oriented psychology; spiritual growth.",
    cost: "Varies",
    verification: "10+ years trusted provider; explicitly ibogaine-focused; select cases only (not general detox center)",
  },

  // Canada
  {
    id: "rooted-waters",
    name: "Rooted Waters",
    region: "canada",
    regionLabel: "Canada",
    location: "Salt Spring Island, BC",
    category: "retreat",
    tier: "verified",
    contact: "Referenced on HealingMaps / recovery.com",
    services: "Iboga ceremonies; psychedelic therapy; immersive retreats; healing through nature integration.",
    verification: "Listed on recovery.com; active operations; nature-integrated iboga facilitation",
  },

  // South America
  {
    id: "bienstar-brc",
    name: "Bienstar / BRC Saúde Mental E Terapias Assistidas",
    region: "south_america",
    regionLabel: "Brazil",
    location: "São Paulo, Brazil",
    category: "clinical",
    tier: "top",
    contact: "Contact via Bienstar Wellness Corp.",
    leader: "Dr. Bruno Rasmussen (ibogaine pioneer since 1994)",
    services:
      "Ibogaine treatment for substance use disorder; psychedelic-assisted psychotherapy; integrative mental health. Numinus partner network.",
    verification:
      "Acquired 2022 by Bienstar; $1.25M seed funding; Brazil's largest market entry; regulatory compliant; network expansion planned",
  },
];

export const FIND_CENTER_COUNT = FIND_CENTERS.length;

export const FIND_TOP_TIER_COUNT = FIND_CENTERS.filter((c) => c.tier === "top").length;
