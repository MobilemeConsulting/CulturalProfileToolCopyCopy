export interface CSROIScores {
  'Culturele participatie & beleving': number;
  'Educatieve impact & leren': number;
  'Sociale impact & gemeenschap': number;
  'Economische impact & cross-over': number;
  'Innovatie & verbeelding': number;
}

export interface CSROIDimensionMapping {
  dimensionId: string;
  csroiDimension: keyof CSROIScores;
  weight: number;
}

export const CSROI_DIMENSION_MAPPINGS: CSROIDimensionMapping[] = [
  // === PROFIT DIMENSIONS ===
  
  // Innovatie & Creativiteit -> 70% Innovatie, 30% Culturele participatie
  {
    dimensionId: 'innovation_creativity',
    csroiDimension: 'Innovatie & verbeelding',
    weight: 0.7
  },
  {
    dimensionId: 'innovation_creativity',
    csroiDimension: 'Culturele participatie & beleving',
    weight: 0.3
  },
  
  // Leren & Ontwikkeling -> 80% Educatieve impact, 20% Innovatie
  {
    dimensionId: 'learning_development',
    csroiDimension: 'Educatieve impact & leren',
    weight: 0.8
  },
  {
    dimensionId: 'learning_development',
    csroiDimension: 'Innovatie & verbeelding',
    weight: 0.2
  },
  
  // Samenwerking & Cultuur -> 60% Sociale impact, 40% Culturele participatie
  {
    dimensionId: 'collaboration_culture',
    csroiDimension: 'Sociale impact & gemeenschap',
    weight: 0.6
  },
  {
    dimensionId: 'collaboration_culture',
    csroiDimension: 'Culturele participatie & beleving',
    weight: 0.4
  },
  
  // Autonomie & Empowerment -> 50% Innovatie, 30% Sociale impact, 20% Educatieve
  {
    dimensionId: 'autonomy_empowerment',
    csroiDimension: 'Innovatie & verbeelding',
    weight: 0.5
  },
  {
    dimensionId: 'autonomy_empowerment',
    csroiDimension: 'Sociale impact & gemeenschap',
    weight: 0.3
  },
  {
    dimensionId: 'autonomy_empowerment',
    csroiDimension: 'Educatieve impact & leren',
    weight: 0.2
  },
  
  // Hiërarchie & Besluitvorming -> Omgekeerd: lagere hiërarchie = hogere scores
  // 50% Innovatie, 30% Sociale impact, 20% Economische
  {
    dimensionId: 'hierarchy_decision',
    csroiDimension: 'Innovatie & verbeelding',
    weight: 0.5
  },
  {
    dimensionId: 'hierarchy_decision',
    csroiDimension: 'Sociale impact & gemeenschap',
    weight: 0.3
  },
  {
    dimensionId: 'hierarchy_decision',
    csroiDimension: 'Economische impact & cross-over',
    weight: 0.2
  },
  
  // Performance & Resultaten -> 70% Economische, 30% Innovatie
  {
    dimensionId: 'performance_results',
    csroiDimension: 'Economische impact & cross-over',
    weight: 0.7
  },
  {
    dimensionId: 'performance_results',
    csroiDimension: 'Innovatie & verbeelding',
    weight: 0.3
  },
  
  // Work-Life Balance -> 60% Sociale impact, 40% Educatieve impact
  {
    dimensionId: 'worklife_balance',
    csroiDimension: 'Sociale impact & gemeenschap',
    weight: 0.6
  },
  {
    dimensionId: 'worklife_balance',
    csroiDimension: 'Educatieve impact & leren',
    weight: 0.4
  },
  
  // Communicatie & Transparantie -> 50% Sociale impact, 30% Culturele participatie, 20% Economische
  {
    dimensionId: 'communication_transparency',
    csroiDimension: 'Sociale impact & gemeenschap',
    weight: 0.5
  },
  {
    dimensionId: 'communication_transparency',
    csroiDimension: 'Culturele participatie & beleving',
    weight: 0.3
  },
  {
    dimensionId: 'communication_transparency',
    csroiDimension: 'Economische impact & cross-over',
    weight: 0.2
  },

  // === CULTURAL DIMENSIONS ===
  
  // Artistic (Creativiteit & Innovatie) -> 80% Innovatie, 20% Culturele participatie
  {
    dimensionId: 'artistic',
    csroiDimension: 'Innovatie & verbeelding',
    weight: 0.8
  },
  {
    dimensionId: 'artistic',
    csroiDimension: 'Culturele participatie & beleving',
    weight: 0.2
  },
  
  // Audience (Markt & Doelgroep) -> 60% Culturele participatie, 40% Sociale impact
  {
    dimensionId: 'audience',
    csroiDimension: 'Culturele participatie & beleving',
    weight: 0.6
  },
  {
    dimensionId: 'audience',
    csroiDimension: 'Sociale impact & gemeenschap',
    weight: 0.4
  },
  
  // Organisation (Organisatie & Strategie) -> 50% Economische, 30% Sociale, 20% Innovatie
  {
    dimensionId: 'organisation',
    csroiDimension: 'Economische impact & cross-over',
    weight: 0.5
  },
  {
    dimensionId: 'organisation',
    csroiDimension: 'Sociale impact & gemeenschap',
    weight: 0.3
  },
  {
    dimensionId: 'organisation',
    csroiDimension: 'Innovatie & verbeelding',
    weight: 0.2
  },
  
  // Identity (Merkidentiteit) -> 50% Culturele participatie, 30% Educatieve, 20% Economische
  {
    dimensionId: 'identity',
    csroiDimension: 'Culturele participatie & beleving',
    weight: 0.5
  },
  {
    dimensionId: 'identity',
    csroiDimension: 'Educatieve impact & leren',
    weight: 0.3
  },
  {
    dimensionId: 'identity',
    csroiDimension: 'Economische impact & cross-over',
    weight: 0.2
  }
];

export type CSROICategory = 'Sterk' | 'In opbouw' | 'Prioriteit';

export interface CSROIDimensionScore {
  dimension: keyof CSROIScores;
  score: number;
  category: CSROICategory;
}
