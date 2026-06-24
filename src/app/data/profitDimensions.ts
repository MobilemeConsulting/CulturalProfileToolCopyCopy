import { Dimension } from './types';

/**
 * Standaard dimensies voor profit organisaties
 * Deze worden gebruikt als template voor elke individuele response
 */
export const profitDimensions: Dimension[] = [
  {
    id: 'innovation',
    label: 'Creativiteit & Innovatie',
    axes: [
      {
        id: 'innovation_score',
        label: 'Innovatiegraad',
        score: 50,
        description: 'Hoe innovatief is uw organisatie?',
        identityWords: [],
      },
      {
        id: 'risk_taking_score',
        label: 'Risico Bereidheid',
        score: 50,
        description: 'Hoe risicogeneigd is uw bedrijf?',
        identityWords: [],
      },
    ],
  },
  {
    id: 'market',
    label: 'Markt & Doelgroep',
    axes: [
      {
        id: 'market_reach',
        label: 'Marktbereik',
        score: 50,
        description: 'Lokaal, nationaal of internationaal?',
        identityWords: [],
      },
      {
        id: 'customer_focus',
        label: 'Klantgerichtheid',
        score: 50,
        description: 'Hoe centraal staat de klant?',
        identityWords: [],
      },
    ],
  },
  {
    id: 'process',
    label: 'Proces & Structuur',
    axes: [
      {
        id: 'agility_score',
        label: 'Wendbaarheid',
        score: 50,
        description: 'Hoe flexibel en wendbaar?',
        identityWords: [],
      },
      {
        id: 'digital_score',
        label: 'Digitale Transformatie',
        score: 50,
        description: 'Hoe digitaal is uw organisatie?',
        identityWords: [],
      },
      {
        id: 'learning_score',
        label: 'Leren & Ontwikkeling',
        score: 50,
        description: 'Investering in ontwikkeling?',
        identityWords: [],
      },
      {
        id: 'collaboration_score',
        label: 'Samenwerkingscultuur',
        score: 50,
        description: 'Hoe samenwerkingsgericht?',
        identityWords: [],
      },
      {
        id: 'autonomy_score',
        label: 'Autonomie',
        score: 50,
        description: 'Hoeveel autonomie hebben teams?',
        identityWords: [],
      },
      {
        id: 'hierarchy_score',
        label: 'Besluitvormingsstructuur',
        score: 50,
        description: 'Plat of hiërarchisch?',
        identityWords: [],
      },
      {
        id: 'communication_score',
        label: 'Communicatie',
        score: 50,
        description: 'Hoe open en transparant?',
        identityWords: [],
      },
    ],
  },
  {
    id: 'identity',
    label: 'Merkidentiteit',
    axes: [
      {
        id: 'tradition_vs_modern',
        label: 'Traditie ↔ Modern',
        score: 50,
        description: 'Traditioneel of modern?',
        identityWords: [],
      },
      {
        id: 'heritage_vs_future',
        label: 'Erfgoed ↔ Toekomst',
        score: 50,
        description: 'Focus op historie of toekomst?',
        identityWords: [],
      },
    ],
  },
  {
    id: 'sustainability',
    label: 'Duurzaamheid & Impact',
    axes: [
      {
        id: 'sustainability_score',
        label: 'Duurzaamheid',
        score: 50,
        description: 'Hoe duurzaam is uw organisatie?',
        identityWords: [],
      },
      {
        id: 'social_impact_score',
        label: 'Sociale Impact',
        score: 50,
        description: 'Welke maatschappelijke impact?',
        identityWords: [],
      },
      {
        id: 'community_engagement',
        label: 'Gemeenschapsbetrokkenheid',
        score: 50,
        description: 'Betrokkenheid bij gemeenschap?',
        identityWords: [],
      },
    ],
  },
];
