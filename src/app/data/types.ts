export interface Axis {
  id: string;
  label: string;
  score: number;
  description: string;
  identityWords: string[];
  // Poolwoorden onder de schuifbalk (links/rechts), i.p.v. generiek Laag/Hoog.
  left?: string;
  right?: string;
}

export interface Dimension {
  id: string;
  label: string;
  axes: Axis[];
}

// Individuele response van één persoon
export interface IndividualResponse {
  id: string;
  respondentName: string;
  respondentRole: 'leadership' | 'staff'; // directie of ander personeel
  dimensions: Dimension[];
  completedAt: string;
}

export interface ProfitProfileData {
  // Individuele responses van alle personen
  individualResponses: IndividualResponse[];
  // Gemiddelden per groep
  leadershipResponses: Dimension[]; // Gemiddelde van alle directie responses
  staffResponses: Dimension[]; // Gemiddelde van alle personeel responses
  combinedDimensions: Dimension[]; // Gewogen gemiddelde (60% leadership, 40% staff)
}

export type OrganisationType = 'cultural' | 'profit';

export interface OrganisationProfile {
  id: string;
  organisationType: OrganisationType;
  meta: {
    orgName: string;
    orgType: string;
    year: number;
    industry?: string;
    crossoverFocus?: 'hr' | 'leiderschap' | 'innovatie' | 'reputatie' | 'gemeenschap';
  };
  dimensions: Dimension[];
  identitySummary: {
    toneOfVoice: string[];
    visualKeywords: string[];
  };
  profitData?: ProfitProfileData;
  createdAt: string;
  updatedAt: string;
}