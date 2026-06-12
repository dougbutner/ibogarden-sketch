export type KnowledgeLink = {
  title: string;
  href: string;
  description: string;
  source?: string;
};

export type VideoPlaylist = {
  id: string;
  title: string;
  videos: KnowledgeLink[];
};

export type ArticleCategory = {
  id: string;
  title: string;
  header: string;
  articles: KnowledgeLink[];
};

export type TopicNode = {
  id: string;
  label: string;
  href: string;
  description: string;
  group: "history" | "geography" | "market" | "regulations" | "ecology" | "body" | "tradition" | "research";
};

export const VIDEO_PLAYLISTS: VideoPlaylist[] = [
  {
    id: "about-iboga",
    title: "About Iboga",
    videos: [
      {
        title: "Ibogaine: Rite of Passage (ICEERS excerpt)",
        href: "https://www.youtube.com/watch?v=3s6xiDEqsjU",
        description:
          "Excerpt of ICEERS' documentary showing a traditional Bwiti ritual in Gabon — the clearest short window into where this medicine actually comes from.",
        source: "YouTube",
      },
      {
        title: "Ibogaine: Rite of Passage (full film)",
        href: "https://topdocumentaryfilms.com/ibogaine-rite-of-passage/",
        description:
          "The full 50-minute film follows a heroin-dependent man through ibogaine treatment while cutting to a Gabonese woman's traditional initiation, contrasting Western clinic and ancestral rite.",
        source: "Top Documentary Films",
      },
      {
        title: "Iboga / Bwiti School of Life",
        href: "https://www.jameswjesso.com/iboga-bwiti-school-of-life/",
        description:
          "A podcast and webinar series in which long-time Gabon resident Tatayo explains Bwiti not as a drug experience but as an entire way of understanding life learned from iboga.",
        source: "ATTMind",
      },
      {
        title: "Iboga basic info",
        href: "https://www.iceers.org/en/basic-info/iboga-basic-info/",
        description:
          "A calm, non-commercial primer from a scientific NGO covering what iboga is, its legal status, and why its sustainability is now a global concern.",
        source: "ICEERS",
      },
    ],
  },
  {
    id: "iboga-facilitators",
    title: "Iboga Facilitators",
    videos: [
      {
        title: "GITA context-of-care guidelines",
        href: "https://www.ibogainealliance.org/guidelines/context-of-care/",
        description:
          "GITA's care-setting standards spell out what a responsible provider must have — ACLS-trained staff, emergency proximity, informed consent — making this the yardstick for judging any facilitator.",
        source: "GITA",
      },
      {
        title: "How to vet a clinic or facilitator",
        href: "https://www.innervisionibogaine.com/findingaclinic",
        description:
          "A practical, question-by-question guide to interviewing a clinic or facilitator before you commit, written to help you walk away from the wrong ones.",
        source: "InnerVision Ibogaine",
      },
      {
        title: "The Ibogaine Stories",
        href: "https://theibogainestories.com/",
        description:
          "A film project gathering the voices of the people who built ibogaine treatment — researchers, Bwiti ngangas, and recovered patients — in their own words.",
        source: "The Ibogaine Stories",
      },
    ],
  },
  {
    id: "healing-stories",
    title: "Healing Stories",
    videos: [
      {
        title: "In Waves and War",
        href: "https://ambio.life/",
        description:
          "Home of the Netflix (2025) film following three U.S. veterans through ibogaine treatment and the limits of conventional care that drove them to seek it.",
        source: "Ambio Life Sciences",
      },
      {
        title: "The Ibogaine Stories (patient testimony)",
        href: "https://theibogainestories.com/",
        description:
          "Firsthand patient testimony, including the recurring account of fear of death simply lifting after a session.",
        source: "The Ibogaine Stories",
      },
      {
        title: "We Are Bwitiful — documentary roundup",
        href: "https://wearebwitiful.com/research/",
        description:
          "A curated roundup of iboga documentaries — initiation films, the opioid-crisis investigation Cure for a Crisis, and elder-wisdom features — in one place.",
        source: "We Are Bwitiful",
      },
    ],
  },
  {
    id: "video-journeys",
    title: "Video Journeys",
    videos: [
      {
        title: "Traditional Bwiti ritual (Gabon)",
        href: "https://www.youtube.com/watch?v=3s6xiDEqsjU",
        description: "Featured excerpt of a traditional Bwiti ritual filmed in Gabon.",
        source: "YouTube",
      },
      {
        title: "We Are Bwitiful documentary index",
        href: "https://wearebwitiful.com/research/",
        description: "Curated index of iboga and Bwiti documentary films.",
        source: "We Are Bwitiful",
      },
    ],
  },
];

export const TOPIC_NODES: TopicNode[] = [
  {
    id: "history",
    label: "History",
    href: "https://en.wikipedia.org/wiki/Ibogaine",
    description:
      "From 19th-century documentation to 1901 isolation, the Lambarène stimulant era, and the addiction discovery — the whole arc in one node.",
    group: "history",
  },
  {
    id: "history-bwiti",
    label: "Bwiti Origins",
    href: "https://journals.co.za/doi/10.10520/ejc-jiss_v2_n1_a1",
    description:
      "A scholarly account of Bwiti as possibly humanity's oldest religion, pioneered by the Babongo and formalized by the Mitsogo.",
    group: "history",
  },
  {
    id: "geography",
    label: "Geography",
    href: "https://www.iceers.org/en/basic-info/iboga-basic-info/",
    description:
      "Where the shrub actually grows across the Congo Basin, and why communities historically never had to cultivate it.",
    group: "geography",
  },
  {
    id: "market-ng",
    label: "Market & Trade",
    href: "https://www.nationalgeographic.com/animals/article/ibogaine-pschedelic-drug-root-fair-trade-gabon",
    description:
      "The story of the first legal, Nagoya-compliant iboga export and the global scramble to profit from a root that could ease the opioid crisis.",
    group: "market",
  },
  {
    id: "market-academic",
    label: "Provider Economy",
    href: "https://link.springer.com/article/10.1057/s41285-025-00220-1",
    description:
      "How a worldwide network of off-shore clinics built its own safety governance through trial and error — and how investment capital is now reshaping it.",
    group: "market",
  },
  {
    id: "reg-nagoya",
    label: "Nagoya Protocol",
    href: "https://www.law.georgetown.edu/international-law-journal/blog/the-promise-of-nagoya-indigenous-reciprocity-in-the-psychedelic-renaissance/",
    description:
      "Why the Nagoya Protocol could force the psychedelic industry to share profits with the Gabonese communities that have stewarded iboga for millennia.",
    group: "regulations",
  },
  {
    id: "reg-gabon",
    label: "Gabon Law (2026)",
    href: "https://jonathandickinson.substack.com/p/gabon-to-restructure-iboga-and-ibogaine",
    description:
      "Gabon moving to extend its national treasure protection to ibogaine itself, days after the U.S. made ibogaine research a priority.",
    group: "regulations",
  },
  {
    id: "reg-texas",
    label: "US / Texas Trials",
    href: "https://www.texastribune.org/2026/03/31/texas-ibogaine-research-clinical-trials-psychedelics/",
    description:
      "Texas launching its own $50M ibogaine trials after no drug company would meet its terms — a snapshot of how hard commercialization really is.",
    group: "regulations",
  },
  {
    id: "ecology",
    label: "Ecology",
    href: "https://chacruna.net/iboga_conservation/",
    description:
      "Why a plant the IUCN calls least concern may quietly be in trouble, given how little real biological data on it exists.",
    group: "ecology",
  },
  {
    id: "pharmacology",
    label: "Pharmacology",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11102648/",
    description:
      "What the molecule does once inside you, and why individual metabolism makes one dose safe for some and dangerous for others.",
    group: "body",
  },
  {
    id: "tradition",
    label: "Bwiti Tradition",
    href: "https://www.roothealing.com/missoko-bwiti",
    description:
      "The Missoko branch said to preserve Bwiti as it was before French and Christian influence, told by people initiated into it.",
    group: "tradition",
  },
  {
    id: "research",
    label: "Flagship Research",
    href: "https://www.nature.com/articles/s41591-023-02705-w",
    description:
      "The Stanford study that put ibogaine on the map: 30 veterans with brain injuries, large drops in PTSD, depression and disability, no serious cardiac events with magnesium.",
    group: "research",
  },
];

export const TOPIC_EDGES: [string, string][] = [
  ["history", "history-bwiti"],
  ["history-bwiti", "tradition"],
  ["geography", "ecology"],
  ["geography", "market-ng"],
  ["market-ng", "market-academic"],
  ["market-academic", "reg-nagoya"],
  ["reg-nagoya", "reg-gabon"],
  ["reg-gabon", "reg-texas"],
  ["ecology", "reg-nagoya"],
  ["tradition", "history-bwiti"],
  ["pharmacology", "research"],
  ["research", "reg-texas"],
  ["history", "geography"],
  ["market-ng", "ecology"],
];

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  {
    id: "medical",
    title: "Medical Articles",
    header: "Know the risks of complications.",
    articles: [
      {
        title: "Knuijver et al. 2022 — clinical safety in opioid detox",
        href: "https://onlinelibrary.wiley.com/doi/10.1111/add.15448",
        description:
          "The first careful clinical safety study: 14 opioid-dependent patients given ibogaine, half showing QTc over 500 ms — proof the heart risk is real even at a modest dose, and that it reverses.",
        source: "Addiction",
      },
      {
        title: "Brunt et al. 2026 — cardiovascular complications",
        href: "https://onlinelibrary.wiley.com/doi/10.1111/add.70319",
        description:
          "A 2026 review of why ibogaine's rare but lethal arrhythmias (Torsades de Pointes) strike even healthy hearts, and how a person's CYP2D6 genetics may decide who's at risk.",
        source: "Addiction",
      },
      {
        title: "Molecules 2026 — scoping review",
        href: "https://www.mdpi.com/1420-3049/31/3/545",
        description:
          "A 2026 scoping review weighing ibogaine's genuine anti-addiction promise against its cardiac dangers, and why use outside clinics leaves the safety record incomplete.",
        source: "Molecules",
      },
      {
        title: "Koenig et al. — human cardiomyocyte study",
        href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5334404/",
        description:
          "Lab evidence in human heart cells showing ibogaine and noribogaine delay repolarization — the mechanism behind QT prolongation, and why effects can appear days after dosing.",
        source: "PMC",
      },
      {
        title: "PK/PD in opioid use disorder patients",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11102648/",
        description:
          "The pharmacology behind the danger: how slower CYP2D6 metabolism raises ibogaine exposure and stretches the QT interval, plus the exclusion criteria clinics use to screen people out.",
        source: "PMC",
      },
      {
        title: "Grogan et al. — emergency case report",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S0736467919305700",
        description:
          "An emergency-room case report of a woman who seized and went into Torsades after ibogaine — a blunt picture of what front-line crisis looks like.",
        source: "ScienceDirect",
      },
      {
        title: "Toxicity and therapeutic potential review",
        href: "https://www.tandfonline.com/doi/full/10.1080/17425255.2021.1944099",
        description:
          "A benefit-versus-risk evaluation arguing well-controlled trials are urgently needed, written as formal trials were finally being approved.",
        source: "Tandfonline",
      },
      {
        title: "Oxa-iboga analogs without cardiac risk",
        href: "https://www.nature.com/articles/s41467-024-51856-y",
        description:
          "Promising news: lab-designed oxa-iboga analogs disrupted opioid use in animals without the cardiac risk, pointing toward a safer next generation.",
        source: "Nature Communications, 2024",
      },
      {
        title: "GITA clinical guidelines",
        href: "https://ibogaineguidelines.com/",
        description:
          "GITA's full clinical guidelines for ibogaine-assisted detox — the community's distilled, freely licensed safety playbook.",
        source: "GITA",
      },
      {
        title: "Ibogaine safety and screening checklist",
        href: "https://www.tabularasaretreat.com/ibogaine-safety-need-know/",
        description:
          "A plain-language breakdown of what real screening involves, with the line worth remembering: if a clinic isn't demanding your full medical history, walk away.",
        source: "Tabula Rasa",
      },
      {
        title: "Pre-treatment health requirements",
        href: "https://theibogainstitute.org/ibogaine-therapy-health-requirements/",
        description:
          "A patient-facing checklist of the screenings and absolute contraindications, making clear you cannot be safely cleared by a quick questionnaire.",
        source: "The Ibogaine Institute · clinic-authored",
      },
      {
        title: "PolitiFact — \"80% cured\" fact-check",
        href: "https://www.politifact.com/factchecks/2026/apr/22/joe-rogan/ibogaine-opioid-addiction-psychedelic-withdrawal/",
        description:
          "A fact-check of the viral 80% cured in one dose claim — useful for separating hope from evidence before reading anything else.",
        source: "PolitiFact",
      },
      {
        title: "PBS — psychedelic review executive order",
        href: "https://www.pbs.org/newshour/politics/trump-signs-order-to-speed-review-of-psychedelics",
        description:
          "News coverage noting ibogaine is tied to 30+ deaths in the literature, grounding the policy excitement in the safety reality.",
        source: "PBS NewsHour",
      },
      {
        title: "TIME — psychedelics executive order explainer",
        href: "https://time.com/article/2026/04/21/trump-psychedelics-executive-order-what-to-know/",
        description:
          "Concise explainer on why fatal arrhythmia risk halted U.S. research in the 1990s and why most evidence still comes from small overseas studies.",
        source: "TIME",
      },
    ],
  },
  {
    id: "healing",
    title: "Healing Experience Articles",
    header: "Firsthand experience with Iboga Tabernanthe root bark and ibogaine.",
    articles: [
      {
        title: "Mash et al. — 191-person clinical case series",
        href: "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2018.00529/full",
        description:
          "A 191-person clinical case series with patients' own elicitation narratives of moving from dependence toward sobriety after a single dose.",
        source: "Frontiers",
      },
      {
        title: "NYT The Daily — reporter's ibogaine trip",
        href: "https://podcasts.apple.com/us/podcast/one-reporters-life-altering-psychedelic-trip/id1200361736?i=1000760921425",
        description:
          "A New York Times political reporter describes traveling to Mexico to take ibogaine himself, and how the trip changed his life.",
        source: "NYT The Daily",
      },
      {
        title: "Rolling Stone — addiction and a last trip",
        href: "https://qc.rollingstone.com/en/culture/he-took-a-psychedelic-to-cure-his-addiction-it-was-his-last-trip/",
        description:
          "A necessary counterweight — the story of a man who went to Cancún to beat addiction and died, a reminder of the stakes.",
        source: "Rolling Stone",
      },
      {
        title: "Marine veteran Jay Kopelman",
        href: "https://www.aol.com/articles/combat-veteran-recounts-healing-journey-190922662.html",
        description:
          "Marine Lt. Col. Jay Kopelman recounts how, after the VA's tools failed his TBI and PTSD, an ibogaine retreat brought him back.",
        source: "Men's Journal via AOL",
      },
      {
        title: "USA TODAY — Stanford veterans reporting",
        href: "https://www.aol.com/combat-veterans-took-psychedelic-drug-101312889.html",
        description:
          "USA TODAY's reporting on the Stanford veterans, including how a grassroots Mexican clinic and a nonprofit made the study possible.",
        source: "USA TODAY via AOL",
      },
      {
        title: "Ambio Life Sciences",
        href: "https://ambio.life/",
        description:
          "The clinic behind In Waves and War, presenting veterans' healing journeys alongside its care model.",
        source: "Ambio · clinic-authored",
      },
      {
        title: "The Ibogaine Stories",
        href: "https://theibogainestories.com/",
        description:
          "Patient and practitioner voices from across the ibogaine world, including recovered people who became advocates and healers.",
        source: "The Ibogaine Stories",
      },
      {
        title: "Documented detox patient experience",
        href: "https://theibogainstitute.org/ibogaine-detox-patient-experience/",
        description:
          "A documented case of a woman with a 19-year opioid history reaching 18 months abstinent after one four-day program.",
        source: "The Ibogaine Institute · clinic-authored",
      },
      {
        title: "VETS — Stanford neuroimaging study",
        href: "https://vetsolutions.org/research/stanford-university-neuroimaging-study/",
        description:
          "The veterans' nonprofit that funded the Stanford grantees, with the personal accounts behind the data.",
        source: "VETS",
      },
      {
        title: "2024 study on transformative power of ibogaine",
        href: "https://markets.financialcontent.com/sgvtribune/article/kisspr-2024-11-8-new-study-sheds-light-on-the-transformative-power-of-ibogaine-for-addiction-recovery",
        description:
          "Coverage of a 2024 study mapping how ibogaine experiences ripple across personal, social and ecological dimensions of people's lives.",
        source: "San Gabriel Valley Tribune",
      },
      {
        title: "The Ibogaine Institute — success stories",
        href: "https://theibogainstitute.org/success-stories/",
        description:
          "A collection of patient outcome stories across addiction, trauma and neurological conditions — read as testimony, not guarantee.",
        source: "The Ibogaine Institute · clinic-authored",
      },
      {
        title: "National Geographic — root to patient",
        href: "https://www.nationalgeographic.com/animals/article/ibogaine-pschedelic-drug-root-fair-trade-gabon",
        description:
          "Feature reporting that follows the root from Gabonese forest to the people it ends up healing abroad.",
        source: "National Geographic",
      },
    ],
  },
  {
    id: "places",
    title: "Places",
    header: "Reputable Iboga facilities globally — vetted directories and verified centers.",
    articles: [
      {
        title: "Global Ibogaine Therapy Alliance",
        href: "https://www.ibogainealliance.org/",
        description:
          "The Global Ibogaine Therapy Alliance — its member standards are the baseline credential to look for in any facility.",
        source: "GITA",
      },
      {
        title: "HealingMaps — ibogaine centers",
        href: "https://healingmaps.com/ibogaine-treatment-centers/",
        description:
          "A continually updated directory of ibogaine-specific centers with notes on which have closed or gone inactive.",
        source: "HealingMaps",
      },
      {
        title: "Recovery.com — ibogaine therapy directory",
        href: "https://recovery.com/therapies/ibogaine-treatment/",
        description:
          "A vetted treatment directory with transparent cash-pay pricing and the repeated warning that unsupervised use can be deadly.",
        source: "Recovery.com",
      },
      {
        title: "Top ibogaine treatment centers (ranked review)",
        href: "https://depressionhealth.net/articles/top-ibogaine-treatment-centers-for-addiction.html",
        description:
          "A ranked review scoring clinics on medical governance, cardiac monitoring and published contraindications, with its methodology disclosed.",
        source: "Depression Health",
      },
      {
        title: "How to vet and choose a clinic",
        href: "https://www.innervisionibogaine.com/findingaclinic",
        description:
          "A self-vetting guide so you can interrogate any facility against safety fundamentals before booking.",
        source: "InnerVision Ibogaine",
      },
      {
        title: "Lucid News — offshore clinics profile",
        href: "https://www.lucid.news/offshore-ibogaine-clinics-in-mexico-portugal-and-brazil/",
        description:
          "Independent journalism profiling real clinics (Beond, Transcend, Ambio, Tabula Rasa and others) and how they're adapting to fentanyl-era patients.",
        source: "Lucid News",
      },
      {
        title: "Ambio Life Sciences (Mexico)",
        href: "https://ambio.life/",
        description:
          "Baja California clinics staffed by physicians and therapists; the site behind the Stanford-collaboration treatments.",
        source: "Ambio · clinic-authored",
      },
      {
        title: "Tabula Rasa Retreat (Portugal)",
        href: "https://www.tabularasaretreat.com/",
        description:
          "A medically supervised, ACLS-staffed retreat in rural Portugal pairing ibogaine with extensive aftercare.",
        source: "Tabula Rasa · clinic-authored",
      },
      {
        title: "Beōnd Ibogaine (Cancún)",
        href: "https://beondibogaine.com/",
        description:
          "A Cancún clinic reporting 3,000+ patients and hospital-grade cardiac monitoring, with a 4-to-1 staff ratio.",
        source: "Beōnd · clinic-authored",
      },
      {
        title: "Recovery.com — Tabula Rasa profile",
        href: "https://recovery.com/tabula-rasa-retreat/",
        description:
          "An independent profile of Tabula Rasa with verified pricing, reviews and its medical-vetting claims.",
        source: "Recovery.com",
      },
      {
        title: "Recovery.com — Beōnd profile",
        href: "https://recovery.com/beond-ibogaine-treatment-cancun-mexico/",
        description:
          "An independent profile of Beōnd detailing its screening, environment and treatment model.",
        source: "Recovery.com",
      },
      {
        title: "GITA context-of-care guidelines",
        href: "https://www.ibogainealliance.org/guidelines/context-of-care/",
        description:
          "The care-context guidelines to hold any place to — emergency proximity, trained staff, and equipment requirements.",
        source: "GITA",
      },
    ],
  },
  {
    id: "tradition",
    title: "Tradition",
    header: "Meet the Babongo tribe and learn about the history of Iboga.",
    articles: [
      {
        title: "Holy Spirit of Iboga — Gabonese Bwiti",
        href: "https://journals.co.za/doi/10.10520/ejc-jiss_v2_n1_a1",
        description:
          "A peer-reviewed study presenting Bwiti as pioneered by the Babongo and possibly the first religion practiced by humanity.",
        source: "Academic",
      },
      {
        title: "The Holy Spirit of Iboga (full paper)",
        href: "https://www.researchgate.net/publication/365964412_The_Holy_Spirit_of_Iboga_and_a_Contemporary_Perspective_on_Africa's_Spiritual_Renaissance_Focus_on_Gabonese_Bwiti_Tradition",
        description:
          "The fuller paper tracing how Bwiti spread and split — Disumba to Misoko — and how that shift empowered women and junior initiates.",
        source: "ResearchGate",
      },
      {
        title: "Bwiti initiation rites overview",
        href: "https://www.kanaga-at.com/en/trip-info/gabon-en/the-mysterious-bwiti-initiation-rites/",
        description:
          "An accessible overview of how the rite passed from the forest-dwelling Babongo to the Fang who made it widely known.",
        source: "Kanaga Adventure Travel",
      },
      {
        title: "The early Bwiti roots (Babongo)",
        href: "https://www.roothealing.com/post/the-early-bwiti",
        description:
          "The argument that Bwiti began before iboga was even discovered, as the Babongo's study of life itself.",
        source: "Root Healing",
      },
      {
        title: "Missoko Bwiti tradition",
        href: "https://www.roothealing.com/missoko-bwiti",
        description:
          "A deep dive into Missoko Bwiti, the lineage kept hidden from colonialists and the decades-long training of its shamans.",
        source: "Root Healing",
      },
      {
        title: "About Bwiti — lineage map",
        href: "https://www.mamaaline.com/about-bwiti.html",
        description:
          "A lineage map of how iboga ceremony moved through the Apindji, Mitsogo, Fang and other peoples, each adding its own thread.",
        source: "Mama Aline",
      },
      {
        title: "The night of the Bwiti in Gabon",
        href: "https://kumakonda.com/bwiti-gabon-iboga-travel/",
        description:
          "An evocative description of an all-night Bwiti ceremony — music, masks and trance bridging the living and the ancestors.",
        source: "Kumakonda",
      },
      {
        title: "Bwiti branches and transmission",
        href: "https://www.bwitiinitiations.com/resources/bwiti-initiations-nyanghou",
        description:
          "A practitioner Q&A distinguishing the main Bwiti branches (Dissoumba, Ndea, Missoko) and explaining why iboga heals more completely inside tradition.",
        source: "Bwiti Initiations",
      },
      {
        title: "Missoko Bwiti — why structure matters",
        href: "https://www.ibogarebirth.com/missoko-bwiti",
        description:
          "On why Bwiti structure matters — without context, iboga's revelations can be misread, so the tradition exists to make them usable.",
        source: "Iboga Rebirth",
      },
      {
        title: "The power of iboga — 10th-generation shaman",
        href: "https://www.bwitihouse.com/the-power-of-iboga",
        description:
          "A 10th-generation Missoko shaman's framing of Bwiti as understanding life itself, and of iboga as holding both male and female spirits.",
        source: "Bwiti House",
      },
      {
        title: "Bwiti and iboga — respectful primer",
        href: "https://www.tabularasaretreat.com/ibogaine/bwiti-and-iboga/",
        description:
          "A clinic's respectful primer on the Bwiti relationship to iboga, for those whose Western treatment sparks deeper interest.",
        source: "Tabula Rasa · clinic-authored",
      },
      {
        title: "Ibogaine — historical record",
        href: "https://en.wikipedia.org/wiki/Ibogaine",
        description:
          "The documented historical record — discovery by forager tribes, transmission to the Bwiti, and the move into Western science.",
        source: "Wikipedia",
      },
    ],
  },
  {
    id: "conservation",
    title: "Conservation",
    header: "There's a history surrounding Iboga you have the chance to be on the right side of.",
    articles: [
      {
        title: "ICEERS — legality and export ban",
        href: "https://www.iceers.org/en/basic-info/iboga-basic-info/",
        description:
          "Iboga as Gabon's declared national treasure, the 2019 export ban, and why bio-cultural sustainability is now a pressing concern.",
        source: "ICEERS",
      },
      {
        title: "Chacruna — iboga conservation status",
        href: "https://chacruna.net/iboga_conservation/",
        description:
          "A clear-eyed look at iboga as a cultural keystone species threatened by poaching, despite a thin scientific record on its true population.",
        source: "Chacruna",
      },
      {
        title: "National Geographic — fair-trade root",
        href: "https://www.nationalgeographic.com/animals/article/ibogaine-pschedelic-drug-root-fair-trade-gabon",
        description:
          "How the first legal export under the Nagoya Protocol aimed to fund rural Gabonese and protect the plant rather than strip it.",
        source: "National Geographic",
      },
      {
        title: "Is iboga endangered?",
        href: "https://awake.net/is-iboga-endangered/",
        description:
          "The story of the 2019 export suspension and the decade of activism behind it, led by Blessings of the Forest.",
        source: "Awake.net",
      },
      {
        title: "Iboga at the crossroads of jungle and laboratory",
        href: "https://www.ambio.life/blog/iboga-crossroads-of-jungle-and-laboratory",
        description:
          "How global demand, deforestation and poaching are squeezing iboga's wild habitat even as 75–100 clinics rely on it.",
        source: "Ambio · clinic-authored",
      },
      {
        title: "Nagoya and indigenous reciprocity",
        href: "https://www.law.georgetown.edu/international-law-journal/blog/the-promise-of-nagoya-indigenous-reciprocity-in-the-psychedelic-renaissance/",
        description:
          "The legal case for using Nagoya to ensure the Bwiti benefit from iboga's commercialization rather than being cut out of it.",
        source: "Georgetown Law",
      },
      {
        title: "Blessings of the Forest and Nagoya",
        href: "https://www.etheridgefoundation.org/educational-blog/what-is-ibogaine",
        description:
          "How Blessings of the Forest became the first group to apply Nagoya to a psychedelic, routing clinic revenue back to farming villages.",
        source: "Etheridge Foundation",
      },
      {
        title: "Gabon 2026 law restructuring",
        href: "https://jonathandickinson.substack.com/p/gabon-to-restructure-iboga-and-ibogaine",
        description:
          "Inside Gabon's 2026 move to tighten iboga/ibogaine law — anti-poaching enforcement, benefit-sharing, and a response to surging U.S. interest.",
        source: "Jonathan Dickinson",
      },
      {
        title: "Genetic fingerprinting and export traceability",
        href: "https://ibogaineclinic.com/ibogaine-treatment-gabon/",
        description:
          "A 2026 snapshot of genetic fingerprinting used to trace exported bark to its village and shut down the black market.",
        source: "Ibogaine Clinic · clinic-authored; verify claims",
      },
      {
        title: "Ibogaine — range and regulatory barriers",
        href: "https://en.wikipedia.org/wiki/Ibogaine",
        description:
          "Background on iboga's range across Central Africa and the regulatory barriers shaping how it can be sourced.",
        source: "Wikipedia",
      },
    ],
  },
  {
    id: "research",
    title: "Research",
    header:
      "Read past research, and fund research drug companies won't; micro and macrodosing research to benefit the planet through healing the individual.",
    articles: [
      {
        title: "Nature Medicine — magnesium-ibogaine in TBI veterans",
        href: "https://www.nature.com/articles/s41591-023-02705-w",
        description:
          "The landmark Stanford/Nature Medicine study — 30 veterans, magnesium to protect the heart, and large sustained gains against PTSD and depression.",
        source: "Nature Medicine",
      },
      {
        title: "Stanford Report — ibogaine and PTSD",
        href: "https://news.stanford.edu/stories/2024/05/ibogaine-ptsd",
        description:
          "Stanford's own plain-language writeup of why the result matters for the invisible wounds of military service.",
        source: "Stanford",
      },
      {
        title: "MISTIC trial (NCT04313712)",
        href: "https://clinicaltrials.gov/study/NCT04313712",
        description:
          "The official MISTIC trial registration — the primary-source record of the protocol behind the headlines.",
        source: "ClinicalTrials.gov",
      },
      {
        title: "Mash et al. — 191-patient detox study",
        href: "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2018.00529/full",
        description:
          "The 191-patient detox study that moved ibogaine evidence beyond anecdote while honestly flagging its methodological limits.",
        source: "Frontiers",
      },
      {
        title: "Molecules 2026 — scoping review",
        href: "https://www.mdpi.com/1420-3049/31/3/545",
        description:
          "A 2026 scoping review framing ibogaine as a multi-target reset for addiction and calling for rigorous, standardized study.",
        source: "Molecules",
      },
      {
        title: "Knuijver 2022 — controlled safety study",
        href: "https://onlinelibrary.wiley.com/doi/10.1111/add.15448",
        description:
          "The controlled safety study that quantified the QT risk — essential reading for anyone funding future human trials.",
        source: "Addiction",
      },
      {
        title: "PK/PD — plasma levels and cardiac effects",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11102648/",
        description:
          "The pharmacokinetic/pharmacodynamic data linking plasma levels, metabolism and cardiac effects — the dosing science.",
        source: "PMC",
      },
      {
        title: "Oxa-iboga analogs — safer next generation",
        href: "https://www.nature.com/articles/s41467-024-51856-y",
        description:
          "Proof-of-concept that iboga-inspired molecules can keep the benefit while dropping the cardiac risk — a research direction worth funding.",
        source: "Nature Communications, 2024",
      },
      {
        title: "Texas $50M IMPACT consortium",
        href: "https://www.uth.edu/news/story/uthealth-houston-in-collaboration-with-utmb-health-awarded-50-million-by-the-state-of-texas-to-lead-ibogaine-clinical-trials",
        description:
          "The $50M Texas IMPACT consortium — the largest public ibogaine research bet yet, aimed squarely at FDA approval.",
        source: "UTHealth",
      },
      {
        title: "Brunt 2026 — cardiovascular literature synthesis",
        href: "https://onlinelibrary.wiley.com/doi/10.1111/add.70319",
        description:
          "A 2026 synthesis of the cardiovascular literature — the safety questions any serious research program must answer.",
        source: "Addiction",
      },
      {
        title: "Global ibogaine subculture ethnography",
        href: "https://link.springer.com/article/10.1057/s41285-025-00220-1",
        description:
          "An ethnography of the global ibogaine subculture and how its grassroots safety knowledge formed where official research wouldn't.",
        source: "Springer",
      },
      {
        title: "Iboga microdosing case series (2026)",
        href: "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2026.1840956/full",
        description:
          "A June 2026 case series on iboga microdosing (whole root bark, 4-on/3-off) for brain injury, with two of three patients reaching full remission — hypothesis-generating, explicitly not proof.",
        source: "Frontiers · verified full-text",
      },
      {
        title: "Microdosing case report — bipolar depression",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9375667/",
        description:
          "A published microdosing case report in bipolar depression — a rare peer-reviewed look at sub-perceptual dosing, with the caveats stated plainly.",
        source: "PMC",
      },
      {
        title: "GDNF, neuroplasticity and shared reward circuits",
        href: "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2025.1744383/full",
        description:
          "A 2025 paper arguing ibogaine works on shared reward-circuit dysfunction via GDNF and neuroplasticity, cutting across addiction, OCD, PTSD.",
        source: "Frontiers",
      },
      {
        title: "White House fact sheet — ibogaine research",
        href: "https://www.whitehouse.gov/fact-sheets/2026/04/fact-sheet-president-donald-j-trump-is-accelerating-medical-treatments-for-serious-mental-illness/",
        description:
          "The primary federal document: $50M ARPA-H match for state research and a Right-to-Try pathway naming ibogaine specifically.",
        source: "White House",
      },
      {
        title: "Harvard — executive order Q&A",
        href: "https://petrieflom.law.harvard.edu/2026/04/18/a-new-executive-order-on-psychedelics-q-a-with-i-glenn-cohen-and-mason-marks/",
        description:
          "Harvard legal scholars unpack what the executive order actually changes — and what it pointedly does not.",
        source: "Petrie-Flom Center, Harvard",
      },
    ],
  },
  {
    id: "legal",
    title: "Legal Status & Policy",
    header: "Where iboga and ibogaine stand — and the fast-moving 2026 policy shifts.",
    articles: [
      {
        title: "CBS — psychedelic research executive order",
        href: "https://www.cbsnews.com/news/trump-administration-executive-order-psychedelic-drug-ibogaine/",
        description:
          "Trump's executive order easing psychedelic research limits and opening a Right-to-Try pathway for desperately ill patients.",
        source: "CBS News",
      },
      {
        title: "CNBC — order legitimizes field, changes no status",
        href: "https://www.cnbc.com/2026/04/20/trump-psychedelics-executive-order-cannabis-reform.html",
        description:
          "Why the order legitimizes the field but changes no drug's legal status, with cardiac risk still the central barrier for ibogaine.",
        source: "CNBC",
      },
      {
        title: "STAT — is the field ready?",
        href: "https://www.statnews.com/2026/05/06/psychedelics-executive-order-ibogaine-trump-research-funding-scheduling/",
        description:
          "A psychedelics researcher's candid right move, but is the field ready? assessment of the new federal push.",
        source: "STAT News",
      },
    ],
  },
  {
    id: "preparation",
    title: "Preparation & Integration",
    header: "Medical screening and post-experience integration that determine whether the window opened by treatment actually lasts.",
    articles: [
      {
        title: "Health requirements and contraindications",
        href: "https://theibogainstitute.org/ibogaine-therapy-health-requirements/",
        description:
          "The screenings and hard contraindications that decide eligibility.",
        source: "The Ibogaine Institute · clinic-authored",
      },
      {
        title: "GITA context-of-care guidelines",
        href: "https://www.ibogainealliance.org/guidelines/context-of-care/",
        description:
          "The standard-of-care backdrop for safe preparation and aftercare.",
        source: "GITA",
      },
      {
        title: "What thorough pre-treatment vetting looks like",
        href: "https://www.tabularasaretreat.com/ibogaine-safety-need-know/",
        description:
          "What thorough pre-treatment vetting looks like in practice.",
        source: "Tabula Rasa · clinic-authored",
      },
    ],
  },
  {
    id: "lineage",
    title: "The People & Lineage",
    header: "Profiles tying Tradition, Healing and Research together.",
    articles: [
      {
        title: "Ibogaine — Lotsof to today's trials",
        href: "https://en.wikipedia.org/wiki/Ibogaine",
        description:
          "The documented through-line from Lotsof's 1960s discovery to today's trials.",
        source: "Wikipedia",
      },
      {
        title: "The Ibogaine Stories",
        href: "https://theibogainestories.com/",
        description:
          "The living voices — researchers, healers and recovered patients — in one project.",
        source: "The Ibogaine Stories",
      },
      {
        title: "A traditional shaman's perspective",
        href: "https://www.bwitihouse.com/the-power-of-iboga",
        description:
          "A traditional shaman's perspective, anchoring the lineage in Gabon rather than the lab.",
        source: "Bwiti House",
      },
    ],
  },
];

export const GROUP_COLORS: Record<TopicNode["group"], string> = {
  history: "#8a6e35",
  geography: "#2d4a22",
  market: "#b66a3e",
  regulations: "#c5a059",
  ecology: "#2d4a22",
  body: "#0a2418",
  tradition: "#8a6e35",
  research: "#c5a059",
};
