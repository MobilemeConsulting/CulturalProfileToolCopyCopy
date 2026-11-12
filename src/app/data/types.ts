export interface Axis {
  id: string;
  label: string;
  score: number;
  description: string;
  identityWords: string[];
  // Poolwoorden onder de schuifbalk (links/rechts), i.p.v. generiek Laag/Hoog.
  // Links = lage score (0), rechts = hoge score (100).
  left?: string;
  right?: string;
  // Vraagtekst uit de template (profit). `description` is dan de toelichting
  // van de invuller, zodat het toelichtingsveld leeg start (zoals bij cultuur).
  question?: string;
  // Optionele vraag boven het toelichtingsveld (bv. ESG: "Hoe kan cultuur daaraan bijdragen?").
  notePrompt?: string;
}

export interface Dimension {
  id: string;
  label: string;
  axes: Axis[];
}

// Rol van een invuller. Bedrijven: leadership (directie) of staff (ander personeel).
// Culturele organisaties: directie, bestuur, medewerker of vrijwilliger.
// Labels en de (interne) weging staan in data/respondentRoles.ts.
export type RespondentRole =
  | 'leadership'
  | 'staff'
  | 'directie'
  | 'bestuur'
  | 'medewerker'
  | 'vrijwilliger';

// Individuele response van één persoon
export interface IndividualResponse {
  id: string;
  respondentName: string; // naam of alias
  respondentRole: RespondentRole;
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

export interface CulturalProfileData {
  // Individuele responses van alle invullers
  individualResponses: IndividualResponse[];
  // Gemiddelde per rol, enkel voor rollen met minstens één invuller
  roleAverages: Partial<Record<RespondentRole, Dimension[]>>;
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
  culturalData?: CulturalProfileData;
  createdAt: string;
  updatedAt: string;
}