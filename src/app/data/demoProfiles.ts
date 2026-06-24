import { Profile } from '../App';

export const demoProfiles: Profile[] = [
  // Demo 1: Interparking (Profit - Innovatie focus)
  {
    id: 'demo-interparking',
    organisationType: 'profit',
    meta: {
      orgName: 'Interparking Belgium',
      orgType: 'Parkeer & Mobiliteitsoplossingen',
      year: 2026,
      crossoverFocus: 'innovatie'
    },
    dimensions: [
      {
        id: 'innovation_creativity',
        label: 'Innovatie & Creativiteit',
        axes: [
          {
            id: 'innovation_score',
            label: 'Innovatiegraad',
            score: 75,
            description: 'Management ziet hoge innovatie in smart parking tech',
            identityWords: ['digitaal', 'vooruitstrevend', 'tech-gedreven']
          }
        ]
      },
      {
        id: 'learning_development',
        label: 'Leren & Ontwikkeling',
        axes: [
          {
            id: 'learning_score',
            label: 'Leer & Ontwikkel Cultuur',
            score: 65,
            description: 'Training beschikbaar maar niet voor iedereen toegankelijk',
            identityWords: ['groei', 'ontwikkeling', 'upskilling']
          }
        ]
      },
      {
        id: 'collaboration_culture',
        label: 'Samenwerking & Cultuur',
        axes: [
          {
            id: 'collaboration_score',
            label: 'Samenwerkingsgraad',
            score: 70,
            description: 'Goede teamwork binnen afdelingen',
            identityWords: ['teamgericht', 'samen', 'verbonden']
          }
        ]
      },
      {
        id: 'autonomy_empowerment',
        label: 'Autonomie & Empowerment',
        axes: [
          {
            id: 'autonomy_score',
            label: 'Autonomieniveau',
            score: 55,
            description: 'Beperkte autonomie - veel procedures',
            identityWords: ['gestructureerd', 'duidelijk', 'procesgericht']
          }
        ]
      },
      {
        id: 'hierarchy_decision',
        label: 'Hiërarchie & Besluitvorming',
        axes: [
          {
            id: 'hierarchy_score',
            label: 'Hiërarchie (hoog = meer lagen)',
            score: 60,
            description: 'Middelmatige hiërarchie - klassieke structuur',
            identityWords: ['gelaagd', 'georganiseerd', 'helder']
          }
        ]
      },
      {
        id: 'performance_results',
        label: 'Performance & Resultaten',
        axes: [
          {
            id: 'performance_score',
            label: 'Performancedruk',
            score: 70,
            description: 'Hoge targets maar acceptabel',
            identityWords: ['resultaatgericht', 'ambitieus', 'gedreven']
          }
        ]
      },
      {
        id: 'worklife_balance',
        label: 'Work-Life Balance',
        axes: [
          {
            id: 'worklife_score',
            label: 'Work-Life Balans',
            score: 65,
            description: 'Redelijk evenwicht, soms overuren',
            identityWords: ['evenwichtig', 'flexibel', 'menselijk']
          }
        ]
      },
      {
        id: 'communication_transparency',
        label: 'Communicatie & Transparantie',
        axes: [
          {
            id: 'communication_score',
            label: 'Communicatie Openheid',
            score: 60,
            description: 'Communicatie kan beter - soms top-down',
            identityWords: ['open', 'informatief', 'verbindend']
          }
        ]
      }
    ],
    identitySummary: {
      toneOfVoice: ['innovatief', 'professioneel', 'tech-savvy', 'resultaatgericht'],
      visualKeywords: ['modern', 'digitaal', 'urbaan', 'toegankelijk', 'slim']
    },
    profitData: {
      leadershipResponses: [
        {
          id: 'innovation_creativity',
          label: 'Innovatie & Creativiteit',
          axes: [
            {
              id: 'innovation_score',
              label: 'Innovatiegraad',
              score: 85,
              description: 'Management ziet hoge innovatie in smart parking tech, digitale transformatie prioriteit',
              identityWords: ['digitaal', 'vooruitstrevend', 'tech-gedreven']
            }
          ]
        },
        {
          id: 'learning_development',
          label: 'Leren & Ontwikkeling',
          axes: [
            {
              id: 'learning_score',
              label: 'Leer & Ontwikkel Cultuur',
              score: 75,
              description: 'Leadership investeert in training programma\'s en ontwikkeling',
              identityWords: ['groei', 'ontwikkeling']
            }
          ]
        },
        {
          id: 'collaboration_culture',
          label: 'Samenwerking & Cultuur',
          axes: [
            {
              id: 'collaboration_score',
              label: 'Samenwerkingsgraad',
              score: 80,
              description: 'Management stimuleert cross-functionele samenwerking',
              identityWords: ['teamgericht', 'samen']
            }
          ]
        },
        {
          id: 'autonomy_empowerment',
          label: 'Autonomie & Empowerment',
          axes: [
            {
              id: 'autonomy_score',
              label: 'Autonomieniveau',
              score: 65,
              description: 'Management wil meer autonomie geven aan teams',
              identityWords: ['gestructureerd', 'duidelijk']
            }
          ]
        },
        {
          id: 'hierarchy_decision',
          label: 'Hiërarchie & Besluitvorming',
          axes: [
            {
              id: 'hierarchy_score',
              label: 'Hiërarchie (hoog = meer lagen)',
              score: 55,
              description: 'Leadership ziet platte organisatie met snelle besluitvorming',
              identityWords: ['gelaagd', 'georganiseerd']
            }
          ]
        },
        {
          id: 'performance_results',
          label: 'Performance & Resultaten',
          axes: [
            {
              id: 'performance_score',
              label: 'Performancedruk',
              score: 75,
              description: 'Hoge ambities maar met aandacht voor welzijn',
              identityWords: ['resultaatgericht', 'ambitieus']
            }
          ]
        },
        {
          id: 'worklife_balance',
          label: 'Work-Life Balance',
          axes: [
            {
              id: 'worklife_score',
              label: 'Work-Life Balans',
              score: 75,
              description: 'Management benadrukt belang van balans, flexibele werkuren',
              identityWords: ['evenwichtig', 'flexibel']
            }
          ]
        },
        {
          id: 'communication_transparency',
          label: 'Communicatie & Transparantie',
          axes: [
            {
              id: 'communication_score',
              label: 'Communicatie Openheid',
              score: 70,
              description: 'Leadership waardeert open communicatie en transparantie',
              identityWords: ['open', 'informatief']
            }
          ]
        }
      ],
      staffResponses: [
        {
          id: 'innovation_creativity',
          label: 'Innovatie & Creativiteit',
          axes: [
            {
              id: 'innovation_score',
              label: 'Innovatiegraad',
              score: 60,
              description: 'Personeel ziet innovatie maar voelt zich niet altijd betrokken bij nieuwe tech',
              identityWords: ['procesgericht']
            }
          ]
        },
        {
          id: 'learning_development',
          label: 'Leren & Ontwikkeling',
          axes: [
            {
              id: 'learning_score',
              label: 'Leer & Ontwikkel Cultuur',
              score: 50,
              description: 'Training beschikbaar maar niet voor iedereen even toegankelijk, focus op operations',
              identityWords: ['upskilling']
            }
          ]
        },
        {
          id: 'collaboration_culture',
          label: 'Samenwerking & Cultuur',
          axes: [
            {
              id: 'collaboration_score',
              label: 'Samenwerkingsgraad',
              score: 55,
              description: 'Goede teamwork binnen afdelingen maar silo\'s tussen afdelingen',
              identityWords: ['verbonden']
            }
          ]
        },
        {
          id: 'autonomy_empowerment',
          label: 'Autonomie & Empowerment',
          axes: [
            {
              id: 'autonomy_score',
              label: 'Autonomieniveau',
              score: 40,
              description: 'Beperkte autonomie ervaren - veel procedures en goedkeuringen nodig',
              identityWords: ['procesgericht']
            }
          ]
        },
        {
          id: 'hierarchy_decision',
          label: 'Hiërarchie & Besluitvorming',
          axes: [
            {
              id: 'hierarchy_score',
              label: 'Hiërarchie (hoog = meer lagen)',
              score: 68,
              description: 'Personeel ervaart meer hiërarchie en bureaucratie dan management denkt',
              identityWords: ['helder']
            }
          ]
        },
        {
          id: 'performance_results',
          label: 'Performance & Resultaten',
          axes: [
            {
              id: 'performance_score',
              label: 'Performancedruk',
              score: 62,
              description: 'Hoge targets voelbaar maar haalbaar met teamwork',
              identityWords: ['gedreven']
            }
          ]
        },
        {
          id: 'worklife_balance',
          label: 'Work-Life Balance',
          axes: [
            {
              id: 'worklife_score',
              label: 'Work-Life Balans',
              score: 50,
              description: 'Balans onder druk, soms overuren nodig om targets te halen',
              identityWords: ['menselijk']
            }
          ]
        },
        {
          id: 'communication_transparency',
          label: 'Communicatie & Transparantie',
          axes: [
            {
              id: 'communication_score',
              label: 'Communicatie Openheid',
              score: 45,
              description: 'Communicatie kan beter - vaak top-down, niet altijd tijdig geïnformeerd',
              identityWords: ['verbindend']
            }
          ]
        }
      ],
      combinedDimensions: []
    },
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-23T14:30:00Z'
  },

  // Demo 2: Baloise Insurance (Profit - Community focus)
  {
    id: 'demo-baloise',
    organisationType: 'profit',
    meta: {
      orgName: 'Baloise Insurance Belgium',
      orgType: 'Verzekeringen',
      year: 2026,
      crossoverFocus: 'gemeenschap'
    },
    dimensions: [
      {
        id: 'innovation_creativity',
        label: 'Innovatie & Creativiteit',
        axes: [
          {
            id: 'innovation_score',
            label: 'Innovatiegraad',
            score: 60,
            description: 'Digitale transformatie in gang, maar traditionele basis',
            identityWords: ['digitalisering', 'vernieuwend', 'evoluerend']
          }
        ]
      },
      {
        id: 'learning_development',
        label: 'Leren & Ontwikkeling',
        axes: [
          {
            id: 'learning_score',
            label: 'Leer & Ontwikkel Cultuur',
            score: 40,
            description: 'Vooral producttraining, weinig persoonlijke ontwikkeling',
            identityWords: ['kennisgedreven', 'vakgericht', 'expertise']
          }
        ]
      },
      {
        id: 'collaboration_culture',
        label: 'Samenwerking & Cultuur',
        axes: [
          {
            id: 'collaboration_score',
            label: 'Samenwerkingsgraad',
            score: 55,
            description: 'Silo\'s tussen afdelingen voelbaar',
            identityWords: ['team', 'samen', 'afdeling']
          }
        ]
      },
      {
        id: 'autonomy_empowerment',
        label: 'Autonomie & Empowerment',
        axes: [
          {
            id: 'autonomy_score',
            label: 'Autonomieniveau',
            score: 40,
            description: 'Beperkte autonomie door compliance en procedures',
            identityWords: ['gestructureerd', 'veilig', 'regelgericht']
          }
        ]
      },
      {
        id: 'hierarchy_decision',
        label: 'Hiërarchie & Besluitvorming',
        axes: [
          {
            id: 'hierarchy_score',
            label: 'Hiërarchie (hoog = meer lagen)',
            score: 100,
            description: 'Zeer hiërarchisch - veel managementlagen',
            identityWords: ['gelaagd', 'klassiek', 'formeel']
          }
        ]
      },
      {
        id: 'performance_results',
        label: 'Performance & Resultaten',
        axes: [
          {
            id: 'performance_score',
            label: 'Performancedruk',
            score: 85,
            description: 'Hoge targets, KPI-gestuurd',
            identityWords: ['doelgericht', 'meetbaar', 'ambitieus']
          }
        ]
      },
      {
        id: 'worklife_balance',
        label: 'Work-Life Balance',
        axes: [
          {
            id: 'worklife_score',
            label: 'Work-Life Balans',
            score: 55,
            description: 'Balans onder druk door targets',
            identityWords: ['professioneel', 'toegewijd', 'betrokken']
          }
        ]
      },
      {
        id: 'communication_transparency',
        label: 'Communicatie & Transparantie',
        axes: [
          {
            id: 'communication_score',
            label: 'Communicatie Openheid',
            score: 50,
            description: 'Voornamelijk top-down communicatie',
            identityWords: ['informatief', 'formeel', 'gestructureerd']
          }
        ]
      }
    ],
    identitySummary: {
      toneOfVoice: ['betrouwbaar', 'professioneel', 'vertrouwd', 'solide'],
      visualKeywords: ['corporate', 'stabiel', 'vertrouwenwekkend', 'established', 'traditioneel']
    },
    profitData: {
      leadershipResponses: [
        {
          id: 'innovation_creativity',
          label: 'Innovatie & Creativiteit',
          axes: [
            {
              id: 'innovation_score',
              label: 'Innovatiegraad',
              score: 75,
              description: 'Management ziet digitale transformatie als strategie, investeert in nieuwe systemen',
              identityWords: ['digitalisering', 'vernieuwend']
            }
          ]
        },
        {
          id: 'learning_development',
          label: 'Leren & Ontwikkeling',
          axes: [
            {
              id: 'learning_score',
              label: 'Leer & Ontwikkel Cultuur',
              score: 50,
              description: 'Leadership biedt training aan maar vooral product-gerelateerd',
              identityWords: ['kennisgedreven', 'vakgericht']
            }
          ]
        },
        {
          id: 'collaboration_culture',
          label: 'Samenwerking & Cultuur',
          axes: [
            {
              id: 'collaboration_score',
              label: 'Samenwerkingsgraad',
              score: 65,
              description: 'Management promoot samenwerking maar merkt silo\'s',
              identityWords: ['team', 'samen']
            }
          ]
        },
        {
          id: 'autonomy_empowerment',
          label: 'Autonomie & Empowerment',
          axes: [
            {
              id: 'autonomy_score',
              label: 'Autonomieniveau',
              score: 50,
              description: 'Beperkte autonomie door compliance eisen, maar leadership zoekt balans',
              identityWords: ['gestructureerd', 'veilig']
            }
          ]
        },
        {
          id: 'hierarchy_decision',
          label: 'Hiërarchie & Besluitvorming',
          axes: [
            {
              id: 'hierarchy_score',
              label: 'Hiërarchie (hoog = meer lagen)',
              score: 100,
              description: 'Zeer hiërarchische structuur nodig voor governance en risicobeheer',
              identityWords: ['gelaagd', 'klassiek', 'formeel']
            }
          ]
        },
        {
          id: 'performance_results',
          label: 'Performance & Resultaten',
          axes: [
            {
              id: 'performance_score',
              label: 'Performancedruk',
              score: 90,
              description: 'Hoge targets essentieel voor groei, KPI-gestuurd management',
              identityWords: ['doelgericht', 'meetbaar', 'ambitieus']
            }
          ]
        },
        {
          id: 'worklife_balance',
          label: 'Work-Life Balance',
          axes: [
            {
              id: 'worklife_score',
              label: 'Work-Life Balans',
              score: 65,
              description: 'Management waardeert balans maar resultaten gaan voor',
              identityWords: ['professioneel', 'toegewijd']
            }
          ]
        },
        {
          id: 'communication_transparency',
          label: 'Communicatie & Transparantie',
          axes: [
            {
              id: 'communication_score',
              label: 'Communicatie Openheid',
              score: 60,
              description: 'Leadership communiceert strategie maar vooral top-down',
              identityWords: ['informatief', 'formeel']
            }
          ]
        }
      ],
      staffResponses: [
        {
          id: 'innovation_creativity',
          label: 'Innovatie & Creativiteit',
          axes: [
            {
              id: 'innovation_score',
              label: 'Innovatiegraad',
              score: 38,
              description: 'Personeel ervaart trage verandering, veel legacy systemen',
              identityWords: ['evoluerend']
            }
          ]
        },
        {
          id: 'learning_development',
          label: 'Leren & Ontwikkeling',
          axes: [
            {
              id: 'learning_score',
              label: 'Leer & Ontwikkel Cultuur',
              score: 25,
              description: 'Weinig persoonlijke ontwikkeling, vooral producttraining',
              identityWords: ['expertise']
            }
          ]
        },
        {
          id: 'collaboration_culture',
          label: 'Samenwerking & Cultuur',
          axes: [
            {
              id: 'collaboration_score',
              label: 'Samenwerkingsgraad',
              score: 40,
              description: 'Sterke silo\'s tussen afdelingen, beperkte cross-functionele samenwerking',
              identityWords: ['afdeling']
            }
          ]
        },
        {
          id: 'autonomy_empowerment',
          label: 'Autonomie & Empowerment',
          axes: [
            {
              id: 'autonomy_score',
              label: 'Autonomieniveau',
              score: 25,
              description: 'Zeer beperkte autonomie - compliance en procedures dominant',
              identityWords: ['regelgericht']
            }
          ]
        },
        {
          id: 'hierarchy_decision',
          label: 'Hiërarchie & Besluitvorming',
          axes: [
            {
              id: 'hierarchy_score',
              label: 'Hiërarchie (hoog = meer lagen)',
              score: 100,
              description: 'Vele managementlagen, lange besluitvormingslijnen',
              identityWords: ['gelaagd']
            }
          ]
        },
        {
          id: 'performance_results',
          label: 'Performance & Resultaten',
          axes: [
            {
              id: 'performance_score',
              label: 'Performancedruk',
              score: 78,
              description: 'Zeer hoge druk op targets, KPI\'s continu gemonitord',
              identityWords: ['ambitieus']
            }
          ]
        },
        {
          id: 'worklife_balance',
          label: 'Work-Life Balance',
          axes: [
            {
              id: 'worklife_score',
              label: 'Work-Life Balans',
              score: 40,
              description: 'Balans onder sterke druk, regelmatig overuren',
              identityWords: ['betrokken']
            }
          ]
        },
        {
          id: 'communication_transparency',
          label: 'Communicatie & Transparantie',
          axes: [
            {
              id: 'communication_score',
              label: 'Communicatie Openheid',
              score: 35,
              description: 'Vooral top-down, weinig transparantie over beslissingen',
              identityWords: ['gestructureerd']
            }
          ]
        }
      ],
      combinedDimensions: []
    },
    createdAt: '2026-02-21T09:00:00Z',
    updatedAt: '2026-02-23T15:00:00Z'
  },

  // Demo 3: Compagnie Cecilia (Cultural - Theater Company)
  {
    id: 'demo-compagniececilia',
    organisationType: 'cultural',
    meta: {
      orgName: 'Compagnie Cecilia',
      orgType: 'Theatergezelschap',
      year: 2026,
      crossoverFocus: 'gemeenschap'
    },
    dimensions: [
      {
        id: 'artistic',
        label: 'Creativiteit & Innovatie',
        axes: [
          {
            id: 'experimental_vs_traditioneel',
            label: 'Innovatief ↔ Conservatief',
            score: 68, // Weighted: Directie 75 * 0.6 + Team 58 * 0.4 = 68.2
            description: 'Directie/Leiding: Vernieuwend met respect voor theatertradities, toegankelijke voorstellingen | Medewerkers/Team: Creatief binnen herkenbare kaders, balans tussen vernieuwing en herkenbaarheid',
            identityWords: ['vernieuwend', 'toegankelijk', 'expressief', 'dynamisch', 'authentiek']
          },
          {
            id: 'niche_vs_breed',
            label: 'Gespecialiseerd ↔ Breed bereik',
            score: 58, // Weighted: Directie 65 * 0.6 + Team 48 * 0.4 = 58.2
            description: 'Directie/Leiding: Brede programmering voor divers publiek, theater voor iedereen | Medewerkers/Team: Toegankelijk maar artistiek niveau behouden',
            identityWords: ['toegankelijk', 'divers', 'inclusief', 'breed publiek', 'herkenbaar']
          }
        ]
      },
      {
        id: 'audience',
        label: 'Markt & Doelgroep',
        axes: [
          {
            id: 'lokaal_vs_internationaal',
            label: 'Lokaal ↔ Internationaal',
            score: 52, // Weighted: Directie 60 * 0.6 + Team 40 * 0.4 = 52
            description: 'Directie/Leiding: Regionaal verankerd met internationale aspiraties | Medewerkers/Team: Vooral lokaal en regionaal publiek, occasionele buitenlandse optredens',
            identityWords: ['regionaal', 'lokaal', 'verankerd', 'bereikbaar', 'nabij']
          },
          {
            id: 'participatief_vs_presentatie',
            label: 'Participatief ↔ Top-down communicatie',
            score: 76, // Weighted: Directie 85 * 0.6 + Team 62 * 0.4 = 75.8
            description: 'Directie/Leiding: Dansworkshops, community projecten, amateurgezelschap, participatie kernwaarde | Medewerkers/Team: Veel interactie met publiek, open sfeer',
            identityWords: ['participatief', 'workshops', 'community', 'samen', 'inclusief']
          }
        ]
      },
      {
        id: 'organisation',
        label: 'Organisatie & Strategie',
        axes: [
          {
            id: 'activistisch_vs_neutraal',
            label: 'Activistisch ↔ Neutraal',
            score: 58, // Weighted: Directie 65 * 0.6 + Team 48 * 0.4 = 58.2
            description: 'Directie/Leiding: Sociale missie via dans, maar niet expliciet politiek | Medewerkers/Team: Focus op verbinding en welzijn door dans',
            identityWords: ['sociaal', 'verbindend', 'inclusief', 'betrokken', 'gemeenschap']
          },
          {
            id: 'pionier_vs_beheerder',
            label: 'Disruptor ↔ Stabiliteit',
            score: 54, // Weighted: Directie 60 * 0.6 + Team 45 * 0.4 = 54
            description: 'Directie/Leiding: Evenwicht tussen vernieuwing en continuïteit | Medewerkers/Team: Stabiele werking met ruimte voor experiment',
            identityWords: ['evenwichtig', 'duurzaam', 'betrouwbaar', 'vernieuwend', 'stabiel']
          }
        ]
      },
      {
        id: 'identity',
        label: 'Merkidentiteit',
        axes: [
          {
            id: 'roots_vs_hybride',
            label: 'Traditionele waarden ↔ Adaptief',
            score: 62, // Weighted: Directie 70 * 0.6 + Team 50 * 0.4 = 62
            description: 'Directie/Leiding: Eigentijds theater met wortels in traditie | Medewerkers/Team: Balans tussen klassiek en hedendaags',
            identityWords: ['eigentijds', 'gebalanceerd', 'respectvol', 'evoluerend', 'authentiek']
          },
          {
            id: 'erfgoed_vs_future',
            label: 'Erfgoed ↔ Toekomstgericht',
            score: 66, // Weighted: Directie 75 * 0.6 + Team 52 * 0.4 = 65.8
            description: 'Directie/Leiding: Toekomst ontwikkelen met respect voor verleden | Medewerkers/Team: Vooruitkijken maar met basis in traditie',
            identityWords: ['vooruitstrevend', 'respectvol', 'ontwikkelend', 'duurzaam', 'toekomstgericht']
          }
        ]
      }
    ],
    identitySummary: {
      toneOfVoice: ['toegankelijk', 'authentiek', 'verbindend', 'expressief', 'inclusief'],
      visualKeywords: ['dynamisch', 'menselijk', 'verbindend', 'kleurrijk', 'expressief', 'warm']
    },
    profitData: {
      leadershipResponses: [
        {
          id: 'artistic',
          label: 'Creativiteit & Innovatie',
          axes: [
            {
              id: 'experimental_vs_traditioneel',
              label: 'Innovatief ↔ Conservatief',
              score: 75,
              description: 'Vernieuwend met respect voor theatertradities, toegankelijke voorstellingen',
              identityWords: ['vernieuwend', 'toegankelijk', 'expressief']
            },
            {
              id: 'niche_vs_breed',
              label: 'Gespecialiseerd ↔ Breed bereik',
              score: 65,
              description: 'Brede programmering voor divers publiek, theater voor iedereen',
              identityWords: ['toegankelijk', 'divers']
            }
          ]
        },
        {
          id: 'audience',
          label: 'Markt & Doelgroep',
          axes: [
            {
              id: 'lokaal_vs_internationaal',
              label: 'Lokaal ↔ Internationaal',
              score: 60,
              description: 'Regionaal verankerd met internationale aspiraties',
              identityWords: ['regionaal', 'verankerd']
            },
            {
              id: 'participatief_vs_presentatie',
              label: 'Participatief ↔ Top-down communicatie',
              score: 85,
              description: 'Dansworkshops, community projecten, amateurgezelschap, participatie kernwaarde',
              identityWords: ['participatief', 'workshops', 'community']
            }
          ]
        },
        {
          id: 'organisation',
          label: 'Organisatie & Strategie',
          axes: [
            {
              id: 'activistisch_vs_neutraal',
              label: 'Activistisch ↔ Neutraal',
              score: 65,
              description: 'Sociale missie via dans, maar niet expliciet politiek',
              identityWords: ['sociaal', 'verbindend']
            },
            {
              id: 'pionier_vs_beheerder',
              label: 'Disruptor ↔ Stabiliteit',
              score: 60,
              description: 'Evenwicht tussen vernieuwing en continuïteit',
              identityWords: ['evenwichtig', 'duurzaam']
            }
          ]
        },
        {
          id: 'identity',
          label: 'Merkidentiteit',
          axes: [
            {
              id: 'roots_vs_hybride',
              label: 'Traditionele waarden ↔ Adaptief',
              score: 70,
              description: 'Eigentijdse dans met wortels in traditie',
              identityWords: ['eigentijds', 'gebalanceerd']
            },
            {
              id: 'erfgoed_vs_future',
              label: 'Erfgoed ↔ Toekomstgericht',
              score: 75,
              description: 'Toekomst ontwikkelen met respect voor verleden',
              identityWords: ['vooruitstrevend', 'respectvol']
            }
          ]
        }
      ],
      staffResponses: [
        {
          id: 'artistic',
          label: 'Creativiteit & Innovatie',
          axes: [
            {
              id: 'experimental_vs_traditioneel',
              label: 'Innovatief ↔ Conservatief',
              score: 58,
              description: 'Creatief binnen herkenbare kaders, balans tussen vernieuwing en herkenbaarheid',
              identityWords: ['dynamisch', 'authentiek']
            },
            {
              id: 'niche_vs_breed',
              label: 'Gespecialiseerd ↔ Breed bereik',
              score: 48,
              description: 'Toegankelijk maar artistiek niveau behouden',
              identityWords: ['inclusief', 'breed publiek', 'herkenbaar']
            }
          ]
        },
        {
          id: 'audience',
          label: 'Markt & Doelgroep',
          axes: [
            {
              id: 'lokaal_vs_internationaal',
              label: 'Lokaal ↔ Internationaal',
              score: 40,
              description: 'Vooral lokaal en regionaal publiek, occasionele buitenlandse optredens',
              identityWords: ['lokaal', 'bereikbaar', 'nabij']
            },
            {
              id: 'participatief_vs_presentatie',
              label: 'Participatief ↔ Top-down communicatie',
              score: 62,
              description: 'Veel interactie met publiek, open sfeer',
              identityWords: ['samen', 'inclusief']
            }
          ]
        },
        {
          id: 'organisation',
          label: 'Organisatie & Strategie',
          axes: [
            {
              id: 'activistisch_vs_neutraal',
              label: 'Activistisch ↔ Neutraal',
              score: 48,
              description: 'Focus op verbinding en welzijn door dans',
              identityWords: ['inclusief', 'betrokken', 'gemeenschap']
            },
            {
              id: 'pionier_vs_beheerder',
              label: 'Disruptor ↔ Stabiliteit',
              score: 45,
              description: 'Stabiele werking met ruimte voor experiment',
              identityWords: ['betrouwbaar', 'vernieuwend', 'stabiel']
            }
          ]
        },
        {
          id: 'identity',
          label: 'Merkidentiteit',
          axes: [
            {
              id: 'roots_vs_hybride',
              label: 'Traditionele waarden ↔ Adaptief',
              score: 50,
              description: 'Balans tussen klassiek toneel en hedendaagse theatervormen',
              identityWords: ['respectvol', 'evoluerend', 'authentiek']
            },
            {
              id: 'erfgoed_vs_future',
              label: 'Erfgoed ↔ Toekomstgericht',
              score: 52,
              description: 'Vooruitkijken maar met basis in theatertradities',
              identityWords: ['ontwikkelend', 'duurzaam', 'toekomstgericht']
            }
          ]
        }
      ],
      combinedDimensions: []
    },
    createdAt: '2026-02-24T09:00:00Z',
    updatedAt: '2026-02-24T14:45:00Z'
  },

  // Demo 4: Ha Concerts / Noordstarfonds (Cultural)
  {
    id: 'demo-haconcerts',
    organisationType: 'cultural',
    meta: {
      orgName: 'Ha Concerts / Noordstarfonds vzw',
      orgType: 'Concertzaal & Muziekprogrammering',
      year: 2026,
      crossoverFocus: 'gemeenschap'
    },
    dimensions: [
      {
        id: 'artistic',
        label: 'Creativiteit & Innovatie',
        axes: [
          {
            id: 'experimental_vs_traditioneel',
            label: 'Innovatief ↔ Conservatief',
            score: 88, // Weighted: Directie 95 * 0.6 + Team 75 * 0.4 = 87
            description: 'Directie/Leiding: Experimenteel programmeren is onze kernmissie, 38 coproducties per jaar | Medewerkers/Team: Innovatief maar soms beperkt door praktische uitdagingen',
            identityWords: ['experimenteel', 'vernieuwend', 'gedurfd', 'artistiek', 'avant-garde']
          },
          {
            id: 'niche_vs_breed',
            label: 'Gespecialiseerd ↔ Breed bereik',
            score: 62, // Weighted: Directie 70 * 0.6 + Team 50 * 0.4 = 62
            description: 'Directie/Leiding: Gebalanceerd tussen jazz niche en breed publiek via educatie | Medewerkers/Team: Voelt soms te breed, moeilijk om overal excellentie te bereiken',
            identityWords: ['gespecialiseerd', 'jazz', 'divers', 'toegankelijk', 'breed']
          }
        ]
      },
      {
        id: 'audience',
        label: 'Markt & Doelgroep',
        axes: [
          {
            id: 'lokaal_vs_internationaal',
            label: 'Lokaal ↔ Internationaal',
            score: 73, // Weighted: Directie 85 * 0.6 + Team 55 * 0.4 = 73
            description: 'Directie/Leiding: Internationale artiesten en netwerk, Europese partnerships | Medewerkers/Team: Vooral lokaal publiek, internationale ambities nog in ontwikkeling',
            identityWords: ['internationaal', 'Gent', 'lokaal', 'Europees', 'regionaal']
          },
          {
            id: 'participatief_vs_presentatie',
            label: 'Participatief ↔ Top-down communicatie',
            score: 91, // Weighted: Directie 95 * 0.6 + Team 85 * 0.4 = 91
            description: 'Directie/Leiding: 72 workshops, ha jam sessions, Jonge Oren - participatie is DNA | Medewerkers/Team: Community engagement dagelijks voelbaar, publiek maakt muziek mee',
            identityWords: ['participatief', 'gemeenschap', 'workshops', 'samen', 'engagement']
          }
        ]
      },
      {
        id: 'organisation',
        label: 'Organisatie & Strategie',
        axes: [
          {
            id: 'activistisch_vs_neutraal',
            label: 'Activistisch ↔ Neutraal',
            score: 74, // Weighted: Directie 80 * 0.6 + Team 65 * 0.4 = 74
            description: 'Directie/Leiding: Inclusie en diversiteit belangrijke waarden, sociale missie | Medewerkers/Team: Voelbare betrokkenheid bij diversiteit, maar geen politieke statements',
            identityWords: ['inclusief', 'divers', 'sociaal', 'toegankelijk', 'open']
          },
          {
            id: 'pionier_vs_beheerder',
            label: 'Disruptor ↔ Stabiliteit',
            score: 80, // Weighted: Directie 90 * 0.6 + Team 65 * 0.4 = 80
            description: 'Directie/Leiding: Disruptief programmeren, pionier in jazz educatie | Medewerkers/Team: Innovatief maar met basis stabiliteit door ervaring',
            identityWords: ['pionier', 'vernieuwend', 'gedurfd', 'vooruitstrevend', 'experimenteel']
          }
        ]
      },
      {
        id: 'identity',
        label: 'Merkidentiteit',
        axes: [
          {
            id: 'roots_vs_hybride',
            label: 'Traditionele waarden ↔ Adaptief',
            score: 76, // Weighted: Directie 85 * 0.6 + Team 60 * 0.4 = 75
            description: 'Directie/Leiding: Hybride - jazz traditie met moderne cross-overs en fusies | Medewerkers/Team: Balans tussen respect voor jazz en nieuwe genres',
            identityWords: ['hybride', 'fusie', 'adaptief', 'vernieuwend', 'traditioneel']
          },
          {
            id: 'erfgoed_vs_future',
            label: 'Erfgoed ↔ Toekomstgericht',
            score: 85, // Weighted: Directie 95 * 0.6 + Team 70 * 0.4 = 85
            description: 'Directie/Leiding: Toekomstgericht - jonge generatie, nieuwe geluiden, innovatieve formats | Medewerkers/Team: Sterk gericht op nieuwe generatie en toekomstige ontwikkelingen',
            identityWords: ['toekomstgericht', 'jong', 'vooruitziend', 'innovatief', 'progressief']
          }
        ]
      }
    ],
    identitySummary: {
      toneOfVoice: ['artistiek', 'experimenteel', 'gemeenschapsgericht', 'toegankelijk', 'passievol'],
      visualKeywords: ['muzikaal', 'divers', 'levendig', 'authentiek', 'gemeenschap', 'educatief']
    },
    profitData: {
      leadershipResponses: [
        {
          id: 'artistic',
          label: 'Creativiteit & Innovatie',
          axes: [
            {
              id: 'experimental_vs_traditioneel',
              label: 'Innovatief ↔ Conservatief',
              score: 95,
              description: 'Experimenteel programmeren is onze kernmissie, 38 coproducties per jaar',
              identityWords: ['experimenteel', 'vernieuwend', 'gedurfd']
            },
            {
              id: 'niche_vs_breed',
              label: 'Gespecialiseerd ↔ Breed bereik',
              score: 70,
              description: 'Gebalanceerd tussen jazz niche en breed publiek via educatie',
              identityWords: ['gespecialiseerd', 'toegankelijk']
            }
          ]
        },
        {
          id: 'audience',
          label: 'Markt & Doelgroep',
          axes: [
            {
              id: 'lokaal_vs_internationaal',
              label: 'Lokaal ↔ Internationaal',
              score: 85,
              description: 'Internationale artiesten en netwerk, Europese partnerships',
              identityWords: ['internationaal', 'Europees']
            },
            {
              id: 'participatief_vs_presentatie',
              label: 'Participatief ↔ Top-down communicatie',
              score: 95,
              description: '72 workshops, ha jam sessions, Jonge Oren - participatie is DNA',
              identityWords: ['participatief', 'gemeenschap']
            }
          ]
        },
        {
          id: 'organisation',
          label: 'Organisatie & Strategie',
          axes: [
            {
              id: 'activistisch_vs_neutraal',
              label: 'Activistisch ↔ Neutraal',
              score: 80,
              description: 'Inclusie en diversiteit belangrijke waarden, sociale missie',
              identityWords: ['inclusief', 'divers']
            },
            {
              id: 'pionier_vs_beheerder',
              label: 'Disruptor ↔ Stabiliteit',
              score: 90,
              description: 'Disruptief programmeren, pionier in jazz educatie',
              identityWords: ['pionier', 'vernieuwend']
            }
          ]
        },
        {
          id: 'identity',
          label: 'Merkidentiteit',
          axes: [
            {
              id: 'roots_vs_hybride',
              label: 'Traditionele waarden ↔ Adaptief',
              score: 85,
              description: 'Hybride - jazz traditie met moderne cross-overs en fusies',
              identityWords: ['hybride', 'fusie']
            },
            {
              id: 'erfgoed_vs_future',
              label: 'Erfgoed ↔ Toekomstgericht',
              score: 95,
              description: 'Toekomstgericht - jonge generatie, nieuwe geluiden, innovatieve formats',
              identityWords: ['toekomstgericht', 'jong']
            }
          ]
        }
      ],
      staffResponses: [
        {
          id: 'artistic',
          label: 'Creativiteit & Innovatie',
          axes: [
            {
              id: 'experimental_vs_traditioneel',
              label: 'Innovatief ↔ Conservatief',
              score: 75,
              description: 'Innovatief maar soms beperkt door praktische uitdagingen',
              identityWords: ['artistiek', 'avant-garde']
            },
            {
              id: 'niche_vs_breed',
              label: 'Gespecialiseerd ↔ Breed bereik',
              score: 50,
              description: 'Voelt soms te breed, moeilijk om overal excellentie te bereiken',
              identityWords: ['jazz', 'divers', 'breed']
            }
          ]
        },
        {
          id: 'audience',
          label: 'Markt & Doelgroep',
          axes: [
            {
              id: 'lokaal_vs_internationaal',
              label: 'Lokaal ↔ Internationaal',
              score: 55,
              description: 'Vooral lokaal publiek, internationale ambities nog in ontwikkeling',
              identityWords: ['Gent', 'lokaal', 'regionaal']
            },
            {
              id: 'participatief_vs_presentatie',
              label: 'Participatief ↔ Top-down communicatie',
              score: 85,
              description: 'Community engagement dagelijks voelbaar, publiek maakt muziek mee',
              identityWords: ['workshops', 'samen', 'engagement']
            }
          ]
        },
        {
          id: 'organisation',
          label: 'Organisatie & Strategie',
          axes: [
            {
              id: 'activistisch_vs_neutraal',
              label: 'Activistisch ↔ Neutraal',
              score: 65,
              description: 'Voelbare betrokkenheid bij diversiteit, maar geen politieke statements',
              identityWords: ['sociaal', 'toegankelijk', 'open']
            },
            {
              id: 'pionier_vs_beheerder',
              label: 'Disruptor ↔ Stabiliteit',
              score: 65,
              description: 'Innovatief maar met basis stabiliteit door ervaring',
              identityWords: ['gedurfd', 'vooruitstrevend', 'experimenteel']
            }
          ]
        },
        {
          id: 'identity',
          label: 'Merkidentiteit',
          axes: [
            {
              id: 'roots_vs_hybride',
              label: 'Traditionele waarden ↔ Adaptief',
              score: 60,
              description: 'Balans tussen respect voor jazz en nieuwe genres',
              identityWords: ['adaptief', 'vernieuwend', 'traditioneel']
            },
            {
              id: 'erfgoed_vs_future',
              label: 'Erfgoed ↔ Toekomstgericht',
              score: 70,
              description: 'Sterk gericht op nieuwe generatie en toekomstige ontwikkelingen',
              identityWords: ['innovatief', 'progressief']
            }
          ]
        }
      ],
      combinedDimensions: []
    },
    createdAt: '2026-02-22T11:00:00Z',
    updatedAt: '2026-02-24T10:30:00Z'
  },

  // Demo 5: KBC Bank (Profit - Digitaal innovatief)
  {
    id: 'demo-kbc',
    organisationType: 'profit',
    meta: {
      orgName: 'KBC Bank',
      orgType: 'Bank & Verzekeringen',
      year: 2026,
      crossoverFocus: 'innovatie'
    },
    dimensions: [
      {
        id: 'innovation_creativity',
        label: 'Innovatie & Creativiteit',
        axes: [
          {
            id: 'innovation_score',
            label: 'Innovatiegraad',
            score: 78,
            description: 'Sterke focus op digitale innovatie en fintech, mobiele banking pionier',
            identityWords: ['digitaal', 'innoverend', 'vooruitstrevend']
          }
        ]
      },
      {
        id: 'learning_development',
        label: 'Leren & Ontwikkeling',
        axes: [
          {
            id: 'learning_score',
            label: 'Leer & Ontwikkel Cultuur',
            score: 68,
            description: 'Investering in digitale skills en continuous learning programma\'s',
            identityWords: ['lerend', 'ontwikkelend', 'groei']
          }
        ]
      },
      {
        id: 'collaboration_culture',
        label: 'Samenwerking & Cultuur',
        axes: [
          {
            id: 'collaboration_score',
            label: 'Samenwerkingsgraad',
            score: 72,
            description: 'Agile teams en cross-functionele samenwerking',
            identityWords: ['samenwerkend', 'agile', 'teamgericht']
          }
        ]
      },
      {
        id: 'autonomy_empowerment',
        label: 'Autonomie & Empowerment',
        axes: [
          {
            id: 'autonomy_score',
            label: 'Autonomieniveau',
            score: 62,
            description: 'Meer autonomie dan traditionele banken, binnen compliance kaders',
            identityWords: ['ondernemend', 'verantwoordelijk', 'gedelegeerd']
          }
        ]
      },
      {
        id: 'hierarchy_decision',
        label: 'Hiërarchie & Besluitvorming',
        axes: [
          {
            id: 'hierarchy_score',
            label: 'Hiërarchie (hoog = meer lagen)',
            score: 55,
            description: 'Platter dan traditionele banken, maar nog wel gestructureerd',
            identityWords: ['toegankelijk', 'modern', 'georganiseerd']
          }
        ]
      },
      {
        id: 'performance_results',
        label: 'Performance & Resultaten',
        axes: [
          {
            id: 'performance_score',
            label: 'Performancedruk',
            score: 75,
            description: 'Hoge ambities maar met aandacht voor welzijn',
            identityWords: ['ambitieus', 'gedreven', 'doelgericht']
          }
        ]
      },
      {
        id: 'worklife_balance',
        label: 'Work-Life Balance',
        axes: [
          {
            id: 'worklife_score',
            label: 'Work-Life Balans',
            score: 70,
            description: 'Flexibel werken en work-life balans als prioriteit',
            identityWords: ['flexibel', 'evenwichtig', 'ondersteunend']
          }
        ]
      },
      {
        id: 'communication_transparency',
        label: 'Communicatie & Transparantie',
        axes: [
          {
            id: 'communication_score',
            label: 'Communicatie Openheid',
            score: 68,
            description: 'Open communicatie met ruimte voor feedback',
            identityWords: ['transparant', 'open', 'toegankelijk']
          }
        ]
      }
    ],
    identitySummary: {
      toneOfVoice: ['innovatief', 'klantgericht', 'betrouwbaar', 'modern', 'toegankelijk'],
      visualKeywords: ['digitaal', 'menselijk', 'vernieuwend', 'vertrouwd', 'toekomstgericht']
    },
    profitData: {
      leadershipResponses: [
        {
          id: 'innovation_creativity',
          label: 'Innovatie & Creativiteit',
          axes: [
            {
              id: 'innovation_score',
              label: 'Innovatiegraad',
              score: 85,
              description: 'Leadership ziet KBC als digitale voortrekker met investeringen in AI en data analytics',
              identityWords: ['digitaal', 'innoverend']
            }
          ]
        },
        {
          id: 'learning_development',
          label: 'Leren & Ontwikkeling',
          axes: [
            {
              id: 'learning_score',
              label: 'Leer & Ontwikkel Cultuur',
              score: 75,
              description: 'Uitgebreid leerplatform, budget voor opleidingen, leadership development',
              identityWords: ['lerend', 'ontwikkelend']
            }
          ]
        },
        {
          id: 'collaboration_culture',
          label: 'Samenwerking & Cultuur',
          axes: [
            {
              id: 'collaboration_score',
              label: 'Samenwerkingsgraad',
              score: 80,
              description: 'Agile mindset top-down gepromoot, tribes en squads model',
              identityWords: ['samenwerkend', 'agile']
            }
          ]
        },
        {
          id: 'autonomy_empowerment',
          label: 'Autonomie & Empowerment',
          axes: [
            {
              id: 'autonomy_score',
              label: 'Autonomieniveau',
              score: 70,
              description: 'Leadership stimuleert eigenaarschap binnen teams',
              identityWords: ['ondernemend', 'verantwoordelijk']
            }
          ]
        },
        {
          id: 'hierarchy_decision',
          label: 'Hiërarchie & Besluitvorming',
          axes: [
            {
              id: 'hierarchy_score',
              label: 'Hiërarchie (hoog = meer lagen)',
              score: 50,
              description: 'Bewust platter gemaakt, snelle besluitvorming belangrijk',
              identityWords: ['toegankelijk', 'modern']
            }
          ]
        },
        {
          id: 'performance_results',
          label: 'Performance & Resultaten',
          axes: [
            {
              id: 'performance_score',
              label: 'Performancedruk',
              score: 80,
              description: 'Hoge ambities maar met duurzaam groeimodel',
              identityWords: ['ambitieus', 'gedreven']
            }
          ]
        },
        {
          id: 'worklife_balance',
          label: 'Work-Life Balance',
          axes: [
            {
              id: 'worklife_score',
              label: 'Work-Life Balans',
              score: 75,
              description: 'Hybride werken als standaard, welzijn programma\'s',
              identityWords: ['flexibel', 'evenwichtig']
            }
          ]
        },
        {
          id: 'communication_transparency',
          label: 'Communicatie & Transparantie',
          axes: [
            {
              id: 'communication_score',
              label: 'Communicatie Openheid',
              score: 75,
              description: 'Transparante communicatie over strategie en resultaten',
              identityWords: ['transparant', 'open']
            }
          ]
        }
      ],
      staffResponses: [
        {
          id: 'innovation_creativity',
          label: 'Innovatie & Creativiteit',
          axes: [
            {
              id: 'innovation_score',
              label: 'Innovatiegraad',
              score: 73,
              description: 'Personeel ervaart innovatie maar merkt ook legacy systemen',
              identityWords: ['digitaal', 'vooruitstrevend']
            }
          ]
        },
        {
          id: 'learning_development',
          label: 'Leren & Ontwikkeling',
          axes: [
            {
              id: 'learning_score',
              label: 'Leer & Ontwikkel Cultuur',
              score: 63,
              description: 'Trainingen beschikbaar maar soms beperkte tijd door werkdruk',
              identityWords: ['groei', 'ontwikkeling']
            }
          ]
        },
        {
          id: 'collaboration_culture',
          label: 'Samenwerking & Cultuur',
          axes: [
            {
              id: 'collaboration_score',
              label: 'Samenwerkingsgraad',
              score: 67,
              description: 'Goede teamwork, maar soms nog silo\'s tussen business units',
              identityWords: ['teamgericht', 'samen']
            }
          ]
        },
        {
          id: 'autonomy_empowerment',
          label: 'Autonomie & Empowerment',
          axes: [
            {
              id: 'autonomy_score',
              label: 'Autonomieniveau',
              score: 57,
              description: 'Meer autonomie dan vroeger, maar nog veel approval nodig',
              identityWords: ['verantwoordelijk', 'gedelegeerd']
            }
          ]
        },
        {
          id: 'hierarchy_decision',
          label: 'Hiërarchie & Besluitvorming',
          axes: [
            {
              id: 'hierarchy_score',
              label: 'Hiërarchie (hoog = meer lagen)',
              score: 58,
              description: 'Platter geworden maar nog wel management lagen voelbaar',
              identityWords: ['georganiseerd', 'toegankelijk']
            }
          ]
        },
        {
          id: 'performance_results',
          label: 'Performance & Resultaten',
          axes: [
            {
              id: 'performance_score',
              label: 'Performancedruk',
              score: 72,
              description: 'Targets voelbaar maar redelijk haalbaar',
              identityWords: ['gedreven', 'doelgericht']
            }
          ]
        },
        {
          id: 'worklife_balance',
          label: 'Work-Life Balance',
          axes: [
            {
              id: 'worklife_score',
              label: 'Work-Life Balans',
              score: 67,
              description: 'Thuiswerken mogelijk, maar balans soms onder druk',
              identityWords: ['flexibel', 'ondersteunend']
            }
          ]
        },
        {
          id: 'communication_transparency',
          label: 'Communicatie & Transparantie',
          axes: [
            {
              id: 'communication_score',
              label: 'Communicatie Openheid',
              score: 63,
              description: 'Informatie beschikbaar maar soms te laat of te algemeen',
              identityWords: ['open', 'informatief']
            }
          ]
        }
      ],
      combinedDimensions: []
    },
    createdAt: '2026-02-24T14:00:00Z',
    updatedAt: '2026-02-24T14:30:00Z'
  },

  // Demo 6: Refibo (Profit - Sustainability & Circularity Focus)
  {
    id: 'demo-refibo',
    organisationType: 'profit',
    meta: {
      orgName: 'Refibo',
      orgType: 'Circulaire IT & Refurbished Technologie',
      year: 2026,
      industry: 'Tech & Duurzaamheid',
      crossoverFocus: 'duurzaamheid'
    },
    dimensions: [
      {
        id: 'innovation_creativity',
        label: 'Innovatie & Creativiteit',
        axes: [
          {
            id: 'innovation_score',
            label: 'Innovatiegraad',
            score: 82,
            description: 'Circulariteit als core business model, pionier in refurbished tech',
            identityWords: ['circulair', 'innovatief', 'vooruitstrevend', 'duurzaam']
          }
        ]
      },
      {
        id: 'learning_development',
        label: 'Leren & Ontwikkeling',
        axes: [
          {
            id: 'learning_score',
            label: 'Leer & Ontwikkel Cultuur',
            score: 74,
            description: 'Investering in training en groei, lerende organisatie',
            identityWords: ['groei', 'ontwikkeling', 'lerende organisatie', 'upskilling']
          }
        ]
      },
      {
        id: 'collaboration_culture',
        label: 'Samenwerking & Cultuur',
        axes: [
          {
            id: 'collaboration_score',
            label: 'Samenwerkingsgraad',
            score: 86,
            description: 'Team spirit kernwaarde, sterke samenwerking tussen teams',
            identityWords: ['samenwerkend', 'team', 'collegiaal', 'verbonden']
          }
        ]
      },
      {
        id: 'autonomy_empowerment',
        label: 'Autonomie & Empowerment',
        axes: [
          {
            id: 'autonomy_score',
            label: 'Autonomieniveau',
            score: 80,
            description: 'Vertrouwen in teams, ownership cultuur, veel vrijheid',
            identityWords: ['eigenaarschap', 'verantwoordelijk', 'zelfstandig', 'empowered']
          }
        ]
      },
      {
        id: 'hierarchy_decision',
        label: 'Hiërarchie & Besluitvorming',
        axes: [
          {
            id: 'hierarchy_score',
            label: 'Hiërarchie (hoog = meer lagen)',
            score: 28,
            description: 'Zeer platte organisatie, open deur cultuur, korte lijnen',
            identityWords: ['plat', 'toegankelijk', 'open', 'wendbaar']
          }
        ]
      },
      {
        id: 'performance_results',
        label: 'Performance & Resultaten',
        axes: [
          {
            id: 'performance_score',
            label: 'Performancedruk',
            score: 78,
            description: 'Ambitieuze doelen met focus op duurzame groei',
            identityWords: ['gedreven', 'ambitieus', 'resultaatgericht', 'duurzaam']
          }
        ]
      },
      {
        id: 'worklife_balance',
        label: 'Work-Life Balance',
        axes: [
          {
            id: 'worklife_score',
            label: 'Work-Life Balans',
            score: 72,
            description: 'Flexibel werken, balans belangrijk maar soms hectisch',
            identityWords: ['flexibel', 'evenwichtig', 'menselijk', 'dynamisch']
          }
        ]
      },
      {
        id: 'communication_transparency',
        label: 'Communicatie & Transparantie',
        axes: [
          {
            id: 'communication_score',
            label: 'Communicatie Openheid',
            score: 82,
            description: 'Transparante communicatie kernwaarde, open en direct',
            identityWords: ['transparant', 'open', 'direct', 'eerlijk']
          }
        ]
      }
    ],
    identitySummary: {
      toneOfVoice: ['innovatief', 'duurzaam', 'toegankelijk', 'gedreven', 'transparant', 'circulair'],
      visualKeywords: ['groen', 'modern', 'tech', 'circulair', 'fris', 'toekomstgericht', 'duurzaam']
    },
    profitData: {
      leadershipResponses: [
        {
          id: 'innovation_creativity',
          label: 'Innovatie & Creativiteit',
          axes: [
            {
              id: 'innovation_score',
              label: 'Innovatiegraad',
              score: 90,
              description: 'Circulariteit als core business model - we zijn pionier in refurbished tech en circulaire IT',
              identityWords: ['circulair', 'innovatief', 'vooruitstrevend']
            }
          ]
        },
        {
          id: 'learning_development',
          label: 'Leren & Ontwikkeling',
          axes: [
            {
              id: 'learning_score',
              label: 'Leer & Ontwikkel Cultuur',
              score: 80,
              description: 'Investeren in training en groei van team - everyone can learn and grow',
              identityWords: ['groei', 'ontwikkeling', 'lerende organisatie']
            }
          ]
        },
        {
          id: 'collaboration_culture',
          label: 'Samenwerking & Cultuur',
          axes: [
            {
              id: 'collaboration_score',
              label: 'Samenwerkingsgraad',
              score: 90,
              description: 'Team spirit is kernwaarde - cross-functioneel werken standaard',
              identityWords: ['samenwerkend', 'team', 'collegiaal']
            }
          ]
        },
        {
          id: 'autonomy_empowerment',
          label: 'Autonomie & Empowerment',
          axes: [
            {
              id: 'autonomy_score',
              label: 'Autonomieniveau',
              score: 85,
              description: 'Vertrouwen in teams - ownership cultuur, iedereen heeft impact',
              identityWords: ['eigenaarschap', 'verantwoordelijk', 'zelfstandig']
            }
          ]
        },
        {
          id: 'hierarchy_decision',
          label: 'Hiërarchie & Besluitvorming',
          axes: [
            {
              id: 'hierarchy_score',
              label: 'Hiërarchie (hoog = meer lagen)',
              score: 20,
              description: 'Zeer platte organisatie - open deur cultuur, snelle beslissingen',
              identityWords: ['plat', 'toegankelijk', 'open']
            }
          ]
        },
        {
          id: 'performance_results',
          label: 'Performance & Resultaten',
          axes: [
            {
              id: 'performance_score',
              label: 'Performancedruk',
              score: 82,
              description: 'Ambitieuze doelen maar met duurzaamheid als prioriteit - impact over pure growth',
              identityWords: ['gedreven', 'ambitieus', 'duurzaam']
            }
          ]
        },
        {
          id: 'worklife_balance',
          label: 'Work-Life Balance',
          axes: [
            {
              id: 'worklife_score',
              label: 'Work-Life Balans',
              score: 75,
              description: 'Flexibel werken en balans belangrijk - remote work mogelijk',
              identityWords: ['flexibel', 'evenwichtig', 'menselijk']
            }
          ]
        },
        {
          id: 'communication_transparency',
          label: 'Communicatie & Transparantie',
          axes: [
            {
              id: 'communication_score',
              label: 'Communicatie Openheid',
              score: 88,
              description: 'Transparantie is kernwaarde - open communication over alles',
              identityWords: ['transparant', 'open', 'direct']
            }
          ]
        }
      ],
      staffResponses: [
        {
          id: 'innovation_creativity',
          label: 'Innovatie & Creativiteit',
          axes: [
            {
              id: 'innovation_score',
              label: 'Innovatiegraad',
              score: 70,
              description: 'We werken innovatief en zien dagelijks nieuwe oplossingen - circulaire processen worden steeds beter',
              identityWords: ['innovatief', 'vooruitstrevend']
            }
          ]
        },
        {
          id: 'learning_development',
          label: 'Leren & Ontwikkeling',
          axes: [
            {
              id: 'learning_score',
              label: 'Leer & Ontwikkel Cultuur',
              score: 65,
              description: 'Training mogelijkheden er maar tijd voor leren is soms beperkt door drukte',
              identityWords: ['ontwikkeling']
            }
          ]
        },
        {
          id: 'collaboration_culture',
          label: 'Samenwerking & Cultuur',
          axes: [
            {
              id: 'collaboration_score',
              label: 'Samenwerkingsgraad',
              score: 80,
              description: 'Sterke teamspirit - iedereen helpt elkaar, goede sfeer',
              identityWords: ['samenwerkend', 'team', 'collegiaal']
            }
          ]
        },
        {
          id: 'autonomy_empowerment',
          label: 'Autonomie & Empowerment',
          axes: [
            {
              id: 'autonomy_score',
              label: 'Autonomieniveau',
              score: 72,
              description: 'Veel vrijheid binnen eigen verantwoordelijkheid - vertrouwen vanuit management',
              identityWords: ['verantwoordelijk', 'zelfstandig']
            }
          ]
        },
        {
          id: 'hierarchy_decision',
          label: 'Hiërarchie & Besluitvorming',
          axes: [
            {
              id: 'hierarchy_score',
              label: 'Hiërarchie (hoog = meer lagen)',
              score: 40,
              description: 'Korte lijnen naar CEO/management - laagdrempelig',
              identityWords: ['toegankelijk', 'open']
            }
          ]
        },
        {
          id: 'performance_results',
          label: 'Performance & Resultaten',
          axes: [
            {
              id: 'performance_score',
              label: 'Performancedruk',
              score: 72,
              description: 'Targets voelbaar maar haalbaar - focus op kwaliteit boven kwantiteit',
              identityWords: ['gedreven']
            }
          ]
        },
        {
          id: 'worklife_balance',
          label: 'Work-Life Balance',
          axes: [
            {
              id: 'worklife_score',
              label: 'Work-Life Balans',
              score: 68,
              description: 'Balans meestal goed maar soms hectisch - flexibiliteit wordt gewaardeerd',
              identityWords: ['flexibel', 'menselijk']
            }
          ]
        },
        {
          id: 'communication_transparency',
          label: 'Communicatie & Transparantie',
          axes: [
            {
              id: 'communication_score',
              label: 'Communicatie Openheid',
              score: 73,
              description: 'Open communicatie - soms gaat het erg snel en mis je info',
              identityWords: ['open', 'direct']
            }
          ]
        }
      ],
      combinedDimensions: []
    },
    createdAt: '2026-02-27T10:00:00Z',
    updatedAt: '2026-02-27T10:00:00Z'
  }
];

export function getDemoProfile(id: string): Profile | undefined {
  return demoProfiles.find(p => p.id === id);
}

export function getAllDemoProfiles(): Profile[] {
  return demoProfiles;
}
