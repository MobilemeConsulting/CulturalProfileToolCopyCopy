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
        label: 'Out-of-the-box',
        score: 50,
        description: 'In welke mate is uw bedrijf bereid nieuwe paden te verkennen of samen te werken buiten de eigen sector?',
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
        label: 'Klantrelatie',
        score: 50,
        description: 'In welke mate focust uw bedrijf op de langetermijnrelatie met en de tevredenheid van de klant?',
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
        label: 'Flexibiliteit',
        score: 50,
        description: 'Hoe wendbaar reageert uw bedrijf op veranderingen en nieuwe kansen?',
        identityWords: [],
      },
      {
        id: 'digital_score',
        label: 'Digitaal',
        score: 50,
        description: 'In welke mate zet uw bedrijf in op digitale tools en digitale producten? Online communicatie telt hier niet mee.',
        identityWords: [],
      },
      {
        id: 'learning_score',
        label: 'Ontwikkeling',
        score: 50,
        description: 'Hoeveel ruimte krijgen medewerkers voor interne groei, opleiding en leren?',
        identityWords: [],
      },
      {
        id: 'collaboration_score',
        label: 'Teamcultuur',
        score: 50,
        description: 'Hoe wordt er intern samengewerkt: vooral individueel of per afdeling, of sterk in teams en over afdelingen heen?',
        identityWords: [],
      },
      {
        id: 'autonomy_score',
        label: 'Autonomie',
        score: 50,
        description: 'In welke mate kunnen medewerkers zelfstandig beslissingen nemen binnen een kader van basisregels?',
        identityWords: [],
      },
      {
        id: 'hierarchy_score',
        label: 'Organisatiestructuur',
        score: 50,
        description: 'Verloopt de besluitvorming via een vlakke structuur, of via duidelijke hiërarchische lijnen?',
        identityWords: [],
      },
      {
        id: 'communication_score',
        label: 'Openheid',
        score: 50,
        description: 'Hoe open wordt er intern gecommuniceerd over strategie, financiën en beslissingen?',
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
        label: 'Duurzaamheid (ESG)',
        score: 50,
        description: 'In welke mate werkt uw bedrijf actief aan duurzaamheid, en hoe kan cultuur daaraan bijdragen?',
        identityWords: [],
      },
      {
        id: 'social_impact_score',
        label: 'Sociale impact (ESG)',
        score: 50,
        description: 'In welke mate wil uw bedrijf een sociale impact hebben, en hoe kan cultuur daaraan bijdragen?',
        identityWords: [],
      },
      {
        id: 'community_engagement',
        label: 'Gemeenschapsvorming (ESG)',
        score: 50,
        description: 'In welke mate is uw bedrijf betrokken bij de lokale gemeenschap, en hoe kan cultuur daaraan bijdragen?',
        identityWords: [],
      },
    ],
  },
];
