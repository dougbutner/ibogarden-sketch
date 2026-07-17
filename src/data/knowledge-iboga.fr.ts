/** French overlays for knowledge catalogs. Keys: category/playlist/trunk ids; articles/videos by href. */
export type KnowledgeFrOverlay = {
  topicRoot?: { label?: string; tagline?: string; description?: string };
  topicMap?: Record<
    string,
    {
      label?: string;
      tagline?: string;
      description?: string;
      leaves?: Record<string, { label?: string; description?: string }>;
    }
  >;
  playlists?: Record<
    string,
    {
      title?: string;
      featuredTitle?: string;
      videos?: Record<string, { title?: string; description?: string }>;
    }
  >;
  categories?: Record<
    string,
    {
      title?: string;
      header?: string;
      articles?: Record<string, { title?: string; description?: string }>;
    }
  >;
};

export const KNOWLEDGE_FR_OVERLAY: KnowledgeFrOverlay = {
  topicRoot: {
    label: "Iboga",
    tagline: "La racine au centre de tout ici.",
    description:
      "Tabernanthe iboga : plante, rite, molécule et marchandise. Cinq façons dont les humains la tiennent : tradition, racines, médecine, échange économique et droit.",
  },
  topicMap: {
    tradition: {
      label: "Tradition",
      tagline: "Là où le rite a commencé",
      description:
        "Les Babongo, l'initiation bwiti, et l'histoire transmise bien avant que la science occidentale ne nomme l'alcaloïde.",
      leaves: {
        "early-bwiti": {
          label: "Bwiti ancien",
          description:
            "L'argument selon lequel le bwiti a commencé avant même la découverte de l'iboga, comme étude de la vie par les Babongo dans les forêts du sud du Gabon.",
        },
        "bwiti-rites": {
          label: "Rites d'initiation",
          description:
            "Comment le rite est passé des Babongo forestiers aux Fang qui ont fait connaître le bwiti à travers le Gabon et au-delà.",
        },
        "missoko-bwiti": {
          label: "Missoko Bwiti",
          description:
            "La branche Missoko dite préserver le bwiti tel qu'il était avant l'influence française et chrétienne, racontée par des initiés.",
        },
      },
    },
    roots: {
      label: "Racines",
      tagline: "Là où vit la plante",
      description:
        "Le bassin du Congo : iboga sauvage, pression de conservation, et pourquoi une espèce clé peut disparaître en silence.",
      leaves: {
        geography: {
          label: "Géographie",
          description:
            "Où l'arbuste pousse réellement à travers le bassin du Congo, et pourquoi les communautés n'ont historiquement pas eu besoin de le cultiver.",
        },
        ecology: {
          label: "Écologie",
          description:
            "Pourquoi une plante que l'UICN dit de préoccupation mineure pourrait être discrètement en difficulté, vu le peu de données biologiques réelles.",
        },
        sustainability: {
          label: "Durabilité",
          description:
            "La suspension d'export gabonaise de 2019, le braconnage, et pourquoi Blessings of the Forest affirme que la récolte sauvage ne peut satisfaire la demande mondiale.",
        },
      },
    },
    medicine: {
      label: "Médecine",
      tagline: "Ce qu'elle fait dans le corps",
      description:
        "Pharmacologie, risque cardiaque, et les essais phares qui font passer l'ibogaïne de l'anecdote underground vers la preuve.",
      leaves: {
        pharmacology: {
          label: "Pharmacologie",
          description:
            "Ce que fait la molécule une fois dans le corps, et pourquoi le métabolisme individuel rend une dose sûre pour certains et dangereuse pour d'autres.",
        },
        research: {
          label: "Recherche phare",
          description:
            "L'étude de Stanford qui a mis l'ibogaïne sur la carte : 30 vétérans avec lésions cérébrales, fortes baisses de PTSD, dépression et handicap, sans événement cardiaque grave avec magnésium.",
        },
        "clinical-guidelines": {
          label: "Guidelines cliniques",
          description:
            "Les guidelines cliniques GITA pour la désintoxication assistée par ibogaïne : le playbook de sécurité librement licencié de la communauté.",
        },
      },
    },
    economic: {
      label: "Économique",
      tagline: "Commerce et réciprocité",
      description:
        "Marchés, cliniques, partage des bénéfices Nagoya, et l'économie GAINE : qui profite et qui est dû.",
      leaves: {
        "market-ng": {
          label: "Marché et commerce",
          description:
            "L'histoire du premier export d'iboga légal conforme à Nagoya et la ruée mondiale pour profiter d'une racine qui pourrait soulager la crise des opioïdes.",
        },
        "market-academic": {
          label: "Économie des prestataires",
          description:
            "Comment un réseau mondial de cliniques offshore a construit sa propre gouvernance de sécurité par essais et erreurs — et comment le capital d'investissement le remodelise.",
        },
        "nagoya-trade": {
          label: "Modèle équitable",
          description:
            "Comment Blessings of the Forest est devenu le premier groupe à appliquer Nagoya à un psychédélique, en renvoyant les revenus des cliniques vers les villages agricoles gabonais.",
        },
      },
    },
    legal: {
      label: "Juridique",
      tagline: "Droit et politique",
      description:
        "Le statut de trésor national du Gabon, le protocole de Nagoya, les interdictions d'export, et les évolutions rapides de 2026 aux États-Unis et ailleurs.",
      leaves: {
        "reg-nagoya": {
          label: "Protocole de Nagoya",
          description:
            "Pourquoi le protocole de Nagoya pourrait forcer l'industrie psychédélique à partager les profits avec les communautés gabonaises qui ont gardé l'iboga depuis des millénaires.",
        },
        "reg-gabon": {
          label: "Droit gabonais",
          description:
            "Le Gabon s'apprête à étendre la protection de trésor national à l'ibogaïne elle-même, des jours après que les États-Unis ont priorisé la recherche sur l'ibogaïne.",
        },
        "reg-texas": {
          label: "États-Unis / Texas",
          description:
            "Le Texas lance ses propres essais d'ibogaïne à 50 M$ après qu'aucune société pharmaceutique n'ait accepté ses conditions : un aperçu de la difficulté de la commercialisation.",
        },
      },
    },
  },
  playlists: {
    "healing-stories": {
      title: "Histoires de guérison",
      featuredTitle: "Parcours de guérison",
      videos: {
        "https://ambio.life/": {
          title: "In Waves and War",
          description:
            "Accueil du film Netflix (2025) suivant trois vétérans américains à travers un traitement à l'ibogaïne et les limites des soins conventionnels.",
        },
        "https://wearebwitiful.com/research/": {
          title: "We Are Bwitiful : panorama documentaire",
          description:
            "Une sélection de documentaires sur l'iboga : films d'initiation, l'enquête Cure for a Crisis, et des portraits d'aînés — en un seul endroit.",
        },
      },
    },
    "about-iboga": {
      title: "L'iboga au Gabon",
      featuredTitle: "L'iboga au Gabon",
      videos: {
        "https://www.youtube.com/watch?v=vt0E8N4FRFY": {
          title: "Ibogaine: Rite of Passage",
          description:
            "Extrait du documentaire ICEERS montrant un rituel bwiti traditionnel au Gabon : la fenêtre la plus claire sur l'origine de cette médecine.",
        },
        "https://www.youtube.com/watch?v=GSs-BVy2MC0": {
          title: "À propos de l'iboga",
          description:
            "Une introduction à l'iboga : plante, tradition, et pourquoi cela compte maintenant.",
        },
        "https://www.youtube.com/watch?v=rzj-Bp4fo9A": {
          title: "Iboga : évolution de la culture",
          description:
            "Un documentaire sur la façon dont l'iboga a façonné la culture bwiti et continue d'évoluer quand la tradition rencontre un public mondial.",
        },
        "https://topdocumentaryfilms.com/ibogaine-rite-of-passage/": {
          title: "Ibogaine: Rite of Passage (film complet)",
          description:
            "Le film complet de 50 minutes suit un homme dépendant à l'héroïne à travers un traitement à l'ibogaïne, en parallèle d'une initiation traditionnelle gabonaise.",
        },
        "https://www.youtube.com/watch?v=REofdD1cWFY": {
          title: "École de vie Iboga / Bwiti",
          description:
            "Série où Tatayo, résident de longue date au Gabon, explique le bwiti non comme une expérience de drogue mais comme une façon de comprendre la vie apprise de l'iboga.",
        },
        "https://www.iceers.org/en/basic-info/iboga-basic-info/": {
          title: "Informations de base sur l'iboga",
          description:
            "Une introduction calme et non commerciale d'une ONG scientifique : ce qu'est l'iboga, son statut légal, et pourquoi sa durabilité est désormais une préoccupation mondiale.",
        },
      },
    },
    "iboga-facilitators": {
      title: "Facilitateurs iboga",
      featuredTitle: "Bwiti House",
      videos: {
        "https://www.ibogainealliance.org/guidelines/context-of-care/": {
          title: "Guidelines GITA sur le contexte de soin",
          description:
            "Les standards GITA détaillent ce qu'un prestataire responsable doit avoir : personnel ACLS, proximité d'urgence, consentement éclairé.",
        },
        "https://www.innervisionibogaine.com/findingaclinic": {
          title: "Comment évaluer une clinique ou un facilitateur",
          description:
            "Un guide pratique question par question pour interroger une clinique ou un facilitateur avant de vous engager.",
        },
      },
    },
    "video-journeys": {
      title: "Parcours vidéo",
      videos: {
        "https://www.youtube.com/watch?v=vt0E8N4FRFY": {
          title: "Rituel bwiti traditionnel (Gabon)",
          description: "Extrait mis en avant d'un rituel bwiti traditionnel filmé au Gabon.",
        },
        "https://wearebwitiful.com/research/": {
          title: "Index documentaire We Are Bwitiful",
          description: "Index sélectionné de films documentaires sur l'iboga et le bwiti.",
        },
      },
    },
  },
  categories: {
    medical: {
      title: "Articles médicaux",
      header: "Connaître les risques de complications.",
      articles: {
        "https://onlinelibrary.wiley.com/doi/10.1111/add.15448": {
          title: "Knuijver et al. 2022 : sécurité clinique lors du sevrage aux opioïdes",
          description:
            "Première étude clinique rigoureuse sur la sécurité : sur 14 patients dépendants aux opioïdes ayant reçu de l'ibogaïne, la moitié présentait un QTc supérieur à 500 ms ; elle confirme que le risque cardiaque existe même à dose modérée et qu'il est réversible.",
        },
        "https://onlinelibrary.wiley.com/doi/10.1111/add.70319": {
          title: "Brunt et al. 2026 : complications cardiovasculaires",
          description:
            "Revue de 2026 expliquant pourquoi les arythmies rares mais mortelles de l'ibogaïne (torsades de pointes) peuvent frapper des cœurs sains, et comment la génétique CYP2D6 peut déterminer les personnes à risque.",
        },
        "https://www.mdpi.com/1420-3049/31/3/545": {
          title: "Molecules 2026 : revue exploratoire",
          description:
            "Une revue exploratoire de 2026 qui met en balance le véritable potentiel anti-addiction de l'ibogaïne et ses dangers cardiaques, et explique pourquoi l'usage hors clinique laisse le bilan de sécurité incomplet.",
        },
        "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5334404/": {
          title: "Koenig et al. : étude de cardiomyocytes humains",
          description:
            "Données de laboratoire sur des cellules cardiaques humaines montrant que l'ibogaïne et la noribogaïne retardent la repolarisation : le mécanisme de l'allongement du QT, dont les effets peuvent apparaître plusieurs jours après la prise.",
        },
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC11102648/": {
          title: "PK/PD chez des patients souffrant de troubles liés à l'usage d'opioïdes",
          description:
            "La pharmacologie du danger : un métabolisme CYP2D6 plus lent augmente l'exposition à l'ibogaïne et allonge l'intervalle QT, avec les critères d'exclusion utilisés par les cliniques.",
        },
        "https://www.sciencedirect.com/science/article/abs/pii/S0736467919305700": {
          title: "Grogan et al. : rapport de cas aux urgences",
          description:
            "Le rapport d'une femme ayant fait une crise convulsive puis des torsades de pointes après l'ibogaïne : une image directe de ce que peut être une crise en première ligne.",
        },
        "https://www.tandfonline.com/doi/full/10.1080/17425255.2021.1944099": {
          title: "Revue sur la toxicité et le potentiel thérapeutique",
          description:
            "Une évaluation bénéfices-risques défendant l'urgence d'essais bien contrôlés, rédigée au moment où les essais formels commençaient enfin à être autorisés.",
        },
        "https://www.nature.com/articles/s41467-024-51856-y": {
          title: "Analogues oxa-iboga sans risque cardiaque",
          description:
            "Une avancée prometteuse : des analogues oxa-iboga conçus en laboratoire ont réduit l'usage d'opioïdes chez l'animal sans risque cardiaque, ouvrant la voie à une génération plus sûre.",
        },
        "https://ibogaineguidelines.com/": {
          title: "Lignes directrices cliniques de la GITA",
          description:
            "Les lignes directrices complètes de la GITA pour la désintoxication assistée par l'ibogaïne : le protocole de sécurité synthétisé et librement licencié par la communauté.",
        },
        "https://www.tabularasaretreat.com/ibogaine-safety-need-know/": {
          title: "Liste de contrôle de sécurité et de dépistage pour l'ibogaïne",
          description:
            "Une explication accessible de ce qu'implique un véritable dépistage, avec un principe à retenir : si une clinique n'exige pas vos antécédents médicaux complets, partez.",
        },
        "https://theibogainstitute.org/ibogaine-therapy-health-requirements/": {
          title: "Exigences de santé avant traitement",
          description:
            "Une liste destinée aux patients des dépistages et contre-indications absolues ; elle montre clairement qu'un rapide questionnaire ne peut suffire à vous déclarer apte.",
        },
        "https://www.politifact.com/factchecks/2026/apr/22/joe-rogan/ibogaine-opioid-addiction-psychedelic-withdrawal/":
          {
            title: "PolitiFact : vérification de l'affirmation « 80 % guéris »",
            description:
              "Vérification de l'affirmation virale selon laquelle 80 % des personnes seraient guéries en une dose : utile pour distinguer l'espoir des preuves.",
          },
        "https://www.pbs.org/newshour/politics/trump-signs-order-to-speed-review-of-psychedelics": {
          title: "PBS : décret sur l'examen des psychédéliques",
          description:
            "Un reportage rappelant que plus de 30 décès sont associés à l'ibogaïne dans la littérature, ce qui replace l'enthousiasme politique dans sa réalité sécuritaire.",
        },
        "https://time.com/article/2026/04/21/trump-psychedelics-executive-order-what-to-know/": {
          title: "TIME : explication du décret sur les psychédéliques",
          description:
            "Explication concise du risque d'arythmie fatale qui a interrompu la recherche américaine dans les années 1990, et de la raison pour laquelle les données proviennent encore surtout de petites études étrangères.",
        },
      },
    },
    healing: {
      title: "Articles sur l'expérience de guérison",
      header: "Récits de transformation.",
      articles: {
        "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2018.00529/full":
          {
            title: "Mash et al. : série clinique de 191 cas",
            description:
              "Une série clinique de 191 personnes contenant les récits des patients eux-mêmes sur leur passage de la dépendance vers la sobriété après une dose unique.",
          },
        "https://podcasts.apple.com/us/podcast/one-reporters-life-altering-psychedelic-trip/id1200361736?i=1000760921425":
          {
            title: "NYT The Daily : le voyage à l'ibogaïne d'un journaliste",
            description:
              "Un journaliste politique du New York Times raconte son voyage au Mexique pour prendre lui-même de l'ibogaïne et la façon dont cette expérience a changé sa vie.",
          },
        "https://qc.rollingstone.com/en/culture/he-took-a-psychedelic-to-cure-his-addiction-it-was-his-last-trip/":
          {
            title: "Rolling Stone : l'addiction et un dernier voyage",
            description:
              "Un contrepoids nécessaire : l'histoire d'un homme parti à Cancún pour vaincre son addiction et qui y est mort, rappel de ce qui est en jeu.",
          },
        "https://www.aol.com/articles/combat-veteran-recounts-healing-journey-190922662.html": {
          title: "Le vétéran marin Jay Kopelman",
          description:
            "Le lieutenant-colonel des Marines Jay Kopelman raconte comment, après l'échec des outils de la VA face à son traumatisme crânien et son PTSD, une retraite d'ibogaïne l'a ramené à lui-même.",
        },
        "https://www.aol.com/combat-veterans-took-psychedelic-drug-101312889.html": {
          title: "USA TODAY : reportage sur les vétérans de Stanford",
          description:
            "Le reportage de USA TODAY sur les vétérans de Stanford, notamment sur la manière dont une clinique mexicaine communautaire et une association ont rendu l'étude possible.",
        },
        "https://ambio.life/": {
          title: "Ambio Life Sciences",
          description:
            "La clinique derrière In Waves and War, qui présente les parcours de guérison de vétérans parallèlement à son modèle de soins.",
        },
        "https://theibogainestories.com/": {
          title: "The Ibogaine Stories",
          description:
            "Des voix de patients et de praticiens du monde de l'ibogaïne, y compris des personnes rétablies devenues défenseurs et soignants.",
        },
        "https://theibogainstitute.org/ibogaine-detox-patient-experience/": {
          title: "Expérience documentée d'une patiente en désintoxication",
          description:
            "Le cas documenté d'une femme ayant 19 ans d'antécédents d'opioïdes et restée abstinente 18 mois après un seul programme de quatre jours.",
        },
        "https://vetsolutions.org/research/stanford-university-neuroimaging-study/": {
          title: "VETS : étude de neuroimagerie de Stanford",
          description:
            "L'association de vétérans qui a financé les bénéficiaires de la subvention de Stanford, avec les récits personnels derrière les données.",
        },
        "https://markets.financialcontent.com/sgvtribune/article/kisspr-2024-11-8-new-study-sheds-light-on-the-transformative-power-of-ibogaine-for-addiction-recovery":
          {
            title: "Étude 2024 sur le pouvoir transformateur de l'ibogaïne",
            description:
              "Présentation d'une étude de 2024 montrant comment les expériences d'ibogaïne se répercutent sur les dimensions personnelle, sociale et écologique de la vie.",
          },
        "https://theibogainstitute.org/success-stories/": {
          title: "The Ibogaine Institute : récits de réussite",
          description:
            "Une collection de récits de résultats de patients concernant l'addiction, les traumatismes et les troubles neurologiques : à lire comme des témoignages, non comme des garanties.",
        },
        "https://www.nationalgeographic.com/animals/article/ibogaine-pschedelic-drug-root-fair-trade-gabon":
          {
            title: "National Geographic : de la racine au patient",
            description:
              "Un reportage qui suit la racine depuis la forêt gabonaise jusqu'aux personnes qu'elle finit par aider à l'étranger.",
          },
      },
    },
    places: {
      title: "Lieux",
      header: "Où les gens rencontrent la médecine.",
      articles: {
        "https://www.ibogainealliance.org/": {
          title: "Global Ibogaine Therapy Alliance",
          description:
            "La Global Ibogaine Therapy Alliance : les normes de ses membres constituent la qualification de référence à rechercher dans tout établissement.",
        },
        "https://healingmaps.com/ibogaine-treatment-centers/": {
          title: "HealingMaps : centres d'ibogaïne",
          description:
            "Un annuaire régulièrement mis à jour de centres spécialisés dans l'ibogaïne, indiquant ceux qui ont fermé ou ne sont plus actifs.",
        },
        "https://recovery.com/therapies/ibogaine-treatment/": {
          title: "Recovery.com : annuaire des thérapies à l'ibogaïne",
          description:
            "Un annuaire de traitements sélectionnés, avec tarifs transparents en paiement direct et rappel répété que l'usage sans supervision peut être mortel.",
        },
        "https://depressionhealth.net/articles/top-ibogaine-treatment-centers-for-addiction.html": {
          title: "Meilleurs centres de traitement à l'ibogaïne (évaluation classée)",
          description:
            "Une évaluation classée des cliniques selon leur gouvernance médicale, leur surveillance cardiaque et leurs contre-indications publiées, avec méthodologie exposée.",
        },
        "https://www.innervisionibogaine.com/findingaclinic": {
          title: "Comment évaluer et choisir une clinique",
          description:
            "Guide d'auto-évaluation permettant d'interroger tout établissement sur les fondamentaux de la sécurité avant de réserver.",
        },
        "https://www.lucid.news/offshore-ibogaine-clinics-in-mexico-portugal-and-brazil/": {
          title: "Lucid News : portrait des cliniques offshore",
          description:
            "Journalisme indépendant sur des cliniques réelles (Beond, Transcend, Ambio, Tabula Rasa et d'autres) et leur adaptation aux patients de l'ère du fentanyl.",
        },
        "https://ambio.life/": {
          title: "Ambio Life Sciences (Mexique)",
          description:
            "Des cliniques de Basse-Californie animées par des médecins et des thérapeutes ; le site derrière les traitements menés en collaboration avec Stanford.",
        },
        "https://www.tabularasaretreat.com/": {
          title: "Tabula Rasa Retreat (Portugal)",
          description:
            "Une retraite sous supervision médicale et dotée de personnel ACLS dans le Portugal rural, associant l'ibogaïne à un vaste suivi post-traitement.",
        },
        "https://beondibogaine.com/": {
          title: "Beōnd Ibogaine (Cancún)",
          description:
            "Une clinique de Cancún déclarant plus de 3 000 patients et une surveillance cardiaque de niveau hospitalier, avec un ratio de quatre membres du personnel par patient.",
        },
        "https://recovery.com/tabula-rasa-retreat/": {
          title: "Recovery.com : profil de Tabula Rasa",
          description:
            "Un profil indépendant de Tabula Rasa avec tarifs, avis et affirmations de sélection médicale vérifiés.",
        },
        "https://recovery.com/beond-ibogaine-treatment-cancun-mexico/": {
          title: "Recovery.com : profil de Beōnd",
          description:
            "Un profil indépendant de Beōnd détaillant son dépistage, son environnement et son modèle de traitement.",
        },
        "https://www.ibogainealliance.org/guidelines/context-of-care/": {
          title: "Lignes directrices GITA sur le contexte de soin",
          description:
            "Les lignes directrices sur le contexte de soin auxquelles comparer tout lieu : proximité des urgences, personnel formé et équipement requis.",
        },
      },
    },
    tradition: {
      title: "Tradition",
      header: "Racines culturelles et spirituelles.",
      articles: {
        "https://journals.co.za/doi/10.10520/ejc-jiss_v2_n1_a1": {
          title: "L'esprit saint de l'iboga : le bwiti gabonais",
          description:
            "Une étude évaluée par les pairs présentant le bwiti comme une tradition initiée par les Babongo et peut-être la première religion pratiquée par l'humanité.",
        },
        "https://www.researchgate.net/publication/365964412_The_Holy_Spirit_of_Iboga_and_a_Contemporary_Perspective_on_Africa's_Spiritual_Renaissance_Focus_on_Gabonese_Bwiti_Tradition":
          {
            title: "L'esprit saint de l'iboga (article complet)",
            description:
              "L'étude complète retrace la diffusion et les divisions du bwiti, de Disumba à Misoko, et montre comment ce changement a donné plus de place aux femmes et aux initiés juniors.",
          },
        "https://www.kanaga-at.com/en/trip-info/gabon-en/the-mysterious-bwiti-initiation-rites/": {
          title: "Aperçu des rites d'initiation bwiti",
          description:
            "Présentation accessible de la transmission du rite, des Babongo vivant en forêt aux Fang qui l'ont largement fait connaître.",
        },
        "https://www.roothealing.com/post/the-early-bwiti": {
          title: "Les premières racines du bwiti (Babongo)",
          description:
            "L'argument selon lequel le bwiti a commencé avant même la découverte de l'iboga, comme étude de la vie par les Babongo.",
        },
        "https://www.roothealing.com/missoko-bwiti": {
          title: "Tradition Missoko Bwiti",
          description:
            "Une plongée dans le Missoko Bwiti, la lignée préservée des colonisateurs, et dans la formation de plusieurs décennies de ses chamans.",
        },
        "https://www.mamaaline.com/about-bwiti.html": {
          title: "À propos du bwiti : carte des lignées",
          description:
            "Une carte des lignées montrant comment la cérémonie de l'iboga a circulé chez les Apindji, Mitsogo, Fang et d'autres peuples, chacun y ajoutant son fil.",
        },
        "https://kumakonda.com/bwiti-gabon-iboga-travel/": {
          title: "La nuit du bwiti au Gabon",
          description:
            "Description évocatrice d'une cérémonie bwiti durant toute la nuit : musique, masques et transe reliant les vivants aux ancêtres.",
        },
        "https://www.bwitiinitiations.com/resources/bwiti-initiations-nyanghou": {
          title: "Branches bwiti et transmission",
          description:
            "Questions-réponses d'un praticien distinguant les grandes branches (Dissoumba, Ndea, Missoko) et expliquant pourquoi l'iboga guérit plus pleinement au sein de la tradition.",
        },
        "https://www.ibogarebirth.com/missoko-bwiti": {
          title: "Missoko Bwiti : pourquoi la structure compte",
          description:
            "Pourquoi la structure du bwiti importe : sans contexte, les révélations de l'iboga peuvent être mal comprises ; la tradition existe pour les rendre utilisables.",
        },
        "https://www.bwitihouse.com/the-power-of-iboga": {
          title: "Le pouvoir de l'iboga : un chaman de 10e génération",
          description:
            "La vision d'un chaman Missoko de 10e génération : le bwiti comme compréhension de la vie elle-même, et l'iboga comme porteur d'esprits masculin et féminin.",
        },
        "https://www.tabularasaretreat.com/ibogaine/bwiti-and-iboga/": {
          title: "Bwiti et iboga : introduction respectueuse",
          description:
            "L'introduction respectueuse d'une clinique à la relation entre le bwiti et l'iboga, pour celles et ceux dont le traitement occidental éveille un intérêt plus profond.",
        },
        "https://en.wikipedia.org/wiki/Ibogaine": {
          title: "Ibogaïne : historique documenté",
          description:
            "Le dossier historique documenté : découverte par des tribus de cueilleurs, transmission au bwiti, puis entrée dans la science occidentale.",
        },
      },
    },
    conservation: {
      title: "Conservation",
      header: "Protéger la plante et les forêts.",
      articles: {
        "https://www.iceers.org/en/basic-info/iboga-basic-info/": {
          title: "ICEERS : légalité et interdiction d'exportation",
          description:
            "L'iboga, trésor national déclaré du Gabon, l'interdiction d'exporter de 2019 et les raisons pour lesquelles la durabilité bioculturelle est désormais urgente.",
        },
        "https://chacruna.net/iboga_conservation/": {
          title: "Chacruna : état de conservation de l'iboga",
          description:
            "Un regard lucide sur l'iboga, espèce clé culturelle menacée par le braconnage malgré le peu de données scientifiques sur sa population réelle.",
        },
        "https://www.nationalgeographic.com/animals/article/ibogaine-pschedelic-drug-root-fair-trade-gabon":
          {
            title: "National Geographic : racine issue du commerce équitable",
            description:
              "Comment la première exportation légale sous le protocole de Nagoya visait à financer les campagnes gabonaises et protéger la plante plutôt qu'à l'épuiser.",
          },
        "https://awake.net/is-iboga-endangered/": {
          title: "L'iboga est-il menacé ?",
          description:
            "L'histoire de la suspension des exportations de 2019 et de la décennie de mobilisation qui l'a précédée, menée par Blessings of the Forest.",
        },
        "https://www.ambio.life/blog/iboga-crossroads-of-jungle-and-laboratory": {
          title: "L'iboga à la croisée de la jungle et du laboratoire",
          description:
            "Comment la demande mondiale, la déforestation et le braconnage compriment l'habitat sauvage de l'iboga alors que 75 à 100 cliniques en dépendent.",
        },
        "https://www.law.georgetown.edu/international-law-journal/blog/the-promise-of-nagoya-indigenous-reciprocity-in-the-psychedelic-renaissance/":
          {
            title: "Nagoya et la réciprocité autochtone",
            description:
              "L'argument juridique en faveur de Nagoya afin que les communautés bwiti bénéficient de la commercialisation de l'iboga plutôt que d'en être exclues.",
          },
        "https://www.etheridgefoundation.org/educational-blog/what-is-ibogaine": {
          title: "Blessings of the Forest et Nagoya",
          description:
            "Comment Blessings of the Forest est devenu le premier groupe à appliquer Nagoya à un psychédélique, en reversant les revenus des cliniques aux villages agricoles.",
        },
        "https://jonathandickinson.substack.com/p/gabon-to-restructure-iboga-and-ibogaine": {
          title: "Réforme de la législation gabonaise de 2026",
          description:
            "Les détails de la réforme gabonaise de 2026 visant à renforcer le droit sur l'iboga et l'ibogaïne : lutte contre le braconnage, partage des avantages et réponse à l'intérêt américain croissant.",
        },
        "https://ibogaineclinic.com/ibogaine-treatment-gabon/": {
          title: "Empreinte génétique et traçabilité des exportations",
          description:
            "Un aperçu de 2026 de l'empreinte génétique permettant de relier l'écorce exportée à son village et de combattre le marché noir.",
        },
        "https://en.wikipedia.org/wiki/Ibogaine": {
          title: "Ibogaïne : aire de répartition et obstacles réglementaires",
          description:
            "Contexte sur l'aire de répartition de l'iboga en Afrique centrale et les obstacles réglementaires qui déterminent ses possibilités d'approvisionnement.",
        },
      },
    },
    research: {
      title: "Recherche",
      header: "Science et essais cliniques.",
      articles: {
        "https://www.nature.com/articles/s41591-023-02705-w": {
          title: "Nature Medicine : magnésium-ibogaïne chez des vétérans avec traumatisme crânien",
          description:
            "L'étude phare Stanford/Nature Medicine : 30 vétérans, du magnésium pour protéger le cœur et d'importantes améliorations durables du PTSD et de la dépression.",
        },
        "https://news.stanford.edu/stories/2024/05/ibogaine-ptsd": {
          title: "Rapport Stanford : ibogaïne et PTSD",
          description:
            "L'explication accessible de Stanford sur l'importance de ces résultats pour les blessures invisibles du service militaire.",
        },
        "https://clinicaltrials.gov/study/NCT04313712": {
          title: "Essai MISTIC (NCT04313712)",
          description:
            "L'enregistrement officiel de l'essai MISTIC : la source primaire du protocole à l'origine des grands titres.",
        },
        "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2018.00529/full":
          {
            title: "Mash et al. : étude de désintoxication chez 191 patients",
            description:
              "L'étude de désintoxication chez 191 patients qui a fait passer les preuves sur l'ibogaïne au-delà de l'anecdote tout en signalant honnêtement ses limites méthodologiques.",
          },
        "https://www.mdpi.com/1420-3049/31/3/545": {
          title: "Molecules 2026 : revue exploratoire",
          description:
            "Une revue de 2026 présentant l'ibogaïne comme une réinitialisation de l'addiction à cibles multiples et appelant à des études rigoureuses et standardisées.",
        },
        "https://onlinelibrary.wiley.com/doi/10.1111/add.15448": {
          title: "Knuijver 2022 : étude de sécurité contrôlée",
          description:
            "L'étude de sécurité contrôlée qui a quantifié le risque de QT : lecture essentielle pour quiconque finance de futurs essais chez l'humain.",
        },
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC11102648/": {
          title: "PK/PD : concentrations plasmatiques et effets cardiaques",
          description:
            "Les données pharmacocinétiques et pharmacodynamiques liant concentrations plasmatiques, métabolisme et effets cardiaques : la science du dosage.",
        },
        "https://www.nature.com/articles/s41467-024-51856-y": {
          title: "Analogues oxa-iboga : une génération plus sûre",
          description:
            "Preuve de concept que des molécules inspirées de l'iboga peuvent conserver le bénéfice tout en éliminant le risque cardiaque : une piste à financer.",
        },
        "https://www.uth.edu/news/story/uthealth-houston-in-collaboration-with-utmb-health-awarded-50-million-by-the-state-of-texas-to-lead-ibogaine-clinical-trials":
          {
            title: "Consortium IMPACT du Texas : 50 M$",
            description:
              "Le consortium texan IMPACT de 50 M$ : le plus grand investissement public dans la recherche sur l'ibogaïne à ce jour, explicitement orienté vers l'autorisation de la FDA.",
          },
        "https://onlinelibrary.wiley.com/doi/10.1111/add.70319": {
          title: "Brunt 2026 : synthèse de la littérature cardiovasculaire",
          description:
            "Une synthèse 2026 de la littérature cardiovasculaire : les questions de sécurité auxquelles tout programme de recherche sérieux doit répondre.",
        },
        "https://link.springer.com/article/10.1057/s41285-025-00220-1": {
          title: "Ethnographie de la sous-culture mondiale de l'ibogaïne",
          description:
            "Une ethnographie de la sous-culture mondiale de l'ibogaïne et de la manière dont son savoir populaire sur la sécurité s'est formé là où la recherche officielle ne s'aventurait pas.",
        },
        "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2026.1840956/full":
          {
            title: "Série de cas de microdosage d'iboga (2026)",
            description:
              "Une série de cas de juin 2026 sur le microdosage d'iboga (écorce de racine entière, 4 jours sur 7) pour les lésions cérébrales, où deux patients sur trois ont atteint une rémission complète : génératrice d'hypothèses, pas une preuve.",
          },
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC9375667/": {
          title: "Rapport de cas de microdosage : dépression bipolaire",
          description:
            "Un rapport de cas publié sur le microdosage dans la dépression bipolaire : un rare examen évalué par les pairs de doses sous-perceptuelles, avec ses réserves clairement formulées.",
        },
        "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2025.1744383/full":
          {
            title: "GDNF, neuroplasticité et circuits de récompense communs",
            description:
              "Un article de 2025 avançant que l'ibogaïne agit sur le dysfonctionnement partagé des circuits de récompense via le GDNF et la neuroplasticité, dans l'addiction, le TOC et le PTSD.",
          },
        "https://www.whitehouse.gov/fact-sheets/2026/04/fact-sheet-president-donald-j-trump-is-accelerating-medical-treatments-for-serious-mental-illness/":
          {
            title: "Maison-Blanche : fiche sur la recherche sur l'ibogaïne",
            description:
              "Le document fédéral primaire : une contribution ARPA-H de 50 M$ pour la recherche des États et une voie Right-to-Try qui cite explicitement l'ibogaïne.",
          },
        "https://petrieflom.law.harvard.edu/2026/04/18/a-new-executive-order-on-psychedelics-q-a-with-i-glenn-cohen-and-mason-marks/":
          {
            title: "Harvard : questions-réponses sur le décret",
            description:
              "Des juristes de Harvard expliquent ce que le décret change réellement — et ce qu'il ne change résolument pas.",
          },
      },
    },
    economic: {
      title: "Économique",
      header: "Commerce, cliniques et réciprocité.",
      articles: {
        "https://www.nationalgeographic.com/animals/article/ibogaine-pschedelic-drug-root-fair-trade-gabon":
          {
            title: "National Geographic : racine issue du commerce équitable",
            description:
              "Comment la première exportation légale sous le protocole de Nagoya visait à financer les campagnes gabonaises et à protéger la plante plutôt qu'à l'épuiser.",
          },
        "https://link.springer.com/article/10.1057/s41285-025-00220-1": {
          title: "Ethnographie de la sous-culture mondiale de l'ibogaïne",
          description:
            "Une ethnographie de la sous-culture mondiale de l'ibogaïne et de la manière dont son savoir populaire sur la sécurité s'est formé là où la recherche officielle ne s'aventurait pas.",
        },
        "https://www.etheridgefoundation.org/educational-blog/what-is-ibogaine": {
          title: "Blessings of the Forest et Nagoya",
          description:
            "Comment Blessings of the Forest est devenu le premier groupe à appliquer Nagoya à un psychédélique, en reversant les revenus des cliniques aux villages agricoles.",
        },
      },
    },
    legal: {
      title: "Statut légal et politique",
      header: "Droit, politique et souveraineté.",
      articles: {
        "https://www.law.georgetown.edu/international-law-journal/blog/the-promise-of-nagoya-indigenous-reciprocity-in-the-psychedelic-renaissance/":
          {
            title: "Nagoya et la réciprocité autochtone",
            description:
              "L'argument juridique en faveur de Nagoya afin que les communautés bwiti bénéficient de la commercialisation de l'iboga plutôt que d'en être exclues.",
          },
        "https://jonathandickinson.substack.com/p/gabon-to-restructure-iboga-and-ibogaine": {
          title: "Réforme de la législation gabonaise de 2026",
          description:
            "Les détails de la réforme gabonaise de 2026 visant à renforcer le droit sur l'iboga et l'ibogaïne : lutte contre le braconnage, partage des avantages et réponse à l'intérêt américain croissant.",
        },
        "https://www.texastribune.org/2026/03/31/texas-ibogaine-research-clinical-trials-psychedelics/":
          {
            title: "Essais cliniques d'ibogaïne au Texas : 50 M$",
            description:
              "Le Texas lance son propre programme de recherche après que les sociétés pharmaceutiques n'ont pas satisfait aux conditions de partenariat de l'État sur le développement de l'ibogaïne vers la FDA.",
          },
        "https://www.cbsnews.com/news/trump-administration-executive-order-psychedelic-drug-ibogaine/":
          {
            title: "CBS : décret sur la recherche psychédélique",
            description:
              "Le décret de Trump assouplit les limites de la recherche sur les psychédéliques et ouvre une voie Right-to-Try aux patients gravement malades.",
          },
        "https://www.cnbc.com/2026/04/20/trump-psychedelics-executive-order-cannabis-reform.html": {
          title: "CNBC : le décret légitime le secteur, sans changer les statuts",
          description:
            "Pourquoi le décret légitime le domaine sans modifier le statut juridique des substances, le risque cardiaque restant l'obstacle central pour l'ibogaïne.",
        },
        "https://www.statnews.com/2026/05/06/psychedelics-executive-order-ibogaine-trump-research-funding-scheduling/":
          {
            title: "STAT : le domaine est-il prêt ?",
            description:
              "L'évaluation franche d'un chercheur sur les psychédéliques : une bonne initiative, mais le domaine est-il prêt pour cette nouvelle impulsion fédérale ?",
          },
      },
    },
    preparation: {
      title: "Préparation et intégration",
      header: "Avant et après la cérémonie.",
      articles: {
        "https://theibogainstitute.org/ibogaine-therapy-health-requirements/": {
          title: "Exigences de santé et contre-indications",
          description:
            "Les dépistages et contre-indications absolues qui déterminent l'admissibilité.",
        },
        "https://www.ibogainealliance.org/guidelines/context-of-care/": {
          title: "Lignes directrices GITA sur le contexte de soin",
          description: "Le cadre de référence des soins pour une préparation et un suivi sûrs.",
        },
        "https://www.tabularasaretreat.com/ibogaine-safety-need-know/": {
          title: "À quoi ressemble une évaluation pré-traitement approfondie",
          description: "À quoi ressemble concrètement une évaluation pré-traitement approfondie.",
        },
      },
    },
    lineage: {
      title: "Les personnes et la lignée",
      header: "Gardiens, aînés et porteurs.",
      articles: {
        "https://en.wikipedia.org/wiki/Ibogaine": {
          title: "Ibogaïne : de Lotsof aux essais actuels",
          description:
            "Le fil documenté qui relie la découverte de Lotsof dans les années 1960 aux essais actuels.",
        },
        "https://theibogainestories.com/": {
          title: "The Ibogaine Stories",
          description:
            "Des voix vivantes — chercheurs, soignants et patients rétablis — réunies dans un même projet.",
        },
        "https://www.bwitihouse.com/the-power-of-iboga": {
          title: "Le point de vue d'un chaman traditionnel",
          description:
            "Le point de vue d'un chaman traditionnel, qui ancre la lignée au Gabon plutôt qu'au laboratoire.",
        },
      },
    },
  },
};
