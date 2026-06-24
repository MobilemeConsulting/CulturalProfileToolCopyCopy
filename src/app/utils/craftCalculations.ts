import { Dimension } from '../App';

export interface CraftScores {
  creativity: number;
  resilience: number;
  futures: number;
  transformation: number;
}

export interface ESGScores {
  environmental: number;
  social: number;
  governance: number;
}

export interface NEBScores {
  beautiful: number;
  sustainable: number;
  together: number;
}

/**
 * Helper function to get average score from a dimension
 */
function getAverageScore(dimensions: Dimension[], dimensionId: string): number {
  const dimension = dimensions.find(d => d.id === dimensionId);
  if (!dimension || dimension.axes.length === 0) return 50;
  
  const sum = dimension.axes.reduce((acc, axis) => acc + axis.score, 0);
  return sum / dimension.axes.length;
}

/**
 * Helper function to get specific axis score
 */
function getAxisScore(dimensions: Dimension[], dimensionId: string, axisId: string): number {
  const dimension = dimensions.find(d => d.id === dimensionId);
  if (!dimension) return 50;
  
  const axis = dimension.axes.find(a => a.id === axisId);
  return axis?.score || 50;
}

/**
 * Calculate CRaFT scores
 * Works with both old structure (artistic, audience, etc.) and new structure (innovation_creativity, etc.)
 */
export function calculateCraftScores(dimensions: Dimension[]): CraftScores {
  // Check if we have old or new structure
  const hasOldStructure = dimensions.some(d => d.id === 'artistic' || d.id === 'organisation' || d.id === 'identity');
  const hasNewStructure = dimensions.some(d => d.id === 'innovation_creativity' || d.id === 'learning_development');

  if (hasOldStructure) {
    // Old structure calculations
    return {
      // Creativity: Based on artistic innovation and experimental approach
      creativity: getAxisScore(dimensions, 'artistic', 'experimental_vs_traditioneel'),
      
      // Resilience: Based on organizational stability and adaptation (inverted)
      resilience: 100 - getAxisScore(dimensions, 'organisation', 'pionier_vs_beheerder'),
      
      // Futures: Based on future orientation
      futures: getAxisScore(dimensions, 'identity', 'erfgoed_vs_future'),
      
      // Transformation: Based on adaptability and activist positioning
      transformation: (
        getAxisScore(dimensions, 'organisation', 'activistisch_vs_neutraal') +
        getAxisScore(dimensions, 'identity', 'roots_vs_hybride')
      ) / 2,
    };
  } else if (hasNewStructure) {
    // New structure calculations (profit company 8-dimension model)
    return {
      // Creativity: Based on innovation score
      creativity: getAverageScore(dimensions, 'innovation_creativity'),
      
      // Resilience: Based on work-life balance and autonomy
      resilience: (
        getAverageScore(dimensions, 'worklife_balance') +
        getAverageScore(dimensions, 'autonomy_empowerment')
      ) / 2,
      
      // Futures: Based on learning & development and innovation
      futures: (
        getAverageScore(dimensions, 'learning_development') +
        getAverageScore(dimensions, 'innovation_creativity') * 0.5
      ) / 1.5,
      
      // Transformation: Based on collaboration culture and communication
      transformation: (
        getAverageScore(dimensions, 'collaboration_culture') +
        getAverageScore(dimensions, 'communication_transparency')
      ) / 2,
    };
  }

  // Fallback: return neutral scores
  return {
    creativity: 50,
    resilience: 50,
    futures: 50,
    transformation: 50,
  };
}

/**
 * Calculate ESG scores
 */
export function calculateESGScores(dimensions: Dimension[]): ESGScores {
  const hasOldStructure = dimensions.some(d => d.id === 'artistic' || d.id === 'organisation');
  const hasNewStructure = dimensions.some(d => d.id === 'innovation_creativity');

  if (hasOldStructure) {
    // Old structure
    return {
      // Environmental: Based on activist positioning and future orientation
      environmental: (
        getAxisScore(dimensions, 'organisation', 'activistisch_vs_neutraal') +
        getAxisScore(dimensions, 'identity', 'erfgoed_vs_future')
      ) / 2,
      
      // Social: Based on participation and local community engagement (inverted for internationaal)
      social: (
        getAxisScore(dimensions, 'audience', 'participatief_vs_presentatie') +
        (100 - getAxisScore(dimensions, 'audience', 'lokaal_vs_internationaal'))
      ) / 2,
      
      // Governance: Based on organizational structure (inverted)
      governance: 100 - getAxisScore(dimensions, 'organisation', 'pionier_vs_beheerder'),
    };
  } else if (hasNewStructure) {
    // New structure
    return {
      // Environmental: Based on innovation and sustainable practices
      environmental: (
        getAverageScore(dimensions, 'innovation_creativity') +
        getAverageScore(dimensions, 'learning_development')
      ) / 2,
      
      // Social: Based on collaboration and work-life balance
      social: (
        getAverageScore(dimensions, 'collaboration_culture') +
        getAverageScore(dimensions, 'worklife_balance')
      ) / 2,
      
      // Governance: Based on communication transparency and lower hierarchy (inverted)
      governance: (
        getAverageScore(dimensions, 'communication_transparency') +
        (100 - getAverageScore(dimensions, 'hierarchy_decision'))
      ) / 2,
    };
  }

  return {
    environmental: 50,
    social: 50,
    governance: 50,
  };
}

/**
 * Calculate NEB (New European Bauhaus) scores
 */
export function calculateNEBScores(dimensions: Dimension[]): NEBScores {
  const hasOldStructure = dimensions.some(d => d.id === 'artistic' || d.id === 'organisation');
  const hasNewStructure = dimensions.some(d => d.id === 'innovation_creativity');

  if (hasOldStructure) {
    // Old structure
    return {
      // Beautiful: Based on artistic quality and innovation
      beautiful: getAverageScore(dimensions, 'artistic'),
      
      // Sustainable: Based on resilience and environmental consciousness
      sustainable: (
        getAxisScore(dimensions, 'organisation', 'activistisch_vs_neutraal') +
        (100 - getAxisScore(dimensions, 'organisation', 'pionier_vs_beheerder'))
      ) / 2,
      
      // Together: Based on participation and inclusivity
      together: (
        getAxisScore(dimensions, 'audience', 'participatief_vs_presentatie') +
        getAxisScore(dimensions, 'identity', 'roots_vs_hybride')
      ) / 2,
    };
  } else if (hasNewStructure) {
    // New structure
    return {
      // Beautiful: Based on innovation and creativity
      beautiful: getAverageScore(dimensions, 'innovation_creativity'),
      
      // Sustainable: Based on balance and long-term thinking
      sustainable: (
        getAverageScore(dimensions, 'worklife_balance') +
        getAverageScore(dimensions, 'learning_development')
      ) / 2,
      
      // Together: Based on collaboration and communication
      together: (
        getAverageScore(dimensions, 'collaboration_culture') +
        getAverageScore(dimensions, 'communication_transparency')
      ) / 2,
    };
  }

  return {
    beautiful: 50,
    sustainable: 50,
    together: 50,
  };
}

/**
 * Calculate overall impact score (average of all CRaFT, ESG, and NEB scores)
 */
export function calculateOverallImpactScore(
  craftScores: CraftScores,
  esgScores: ESGScores,
  nebScores: NEBScores
): number {
  const craftAvg = Object.values(craftScores).reduce((a, b) => a + b, 0) / 4;
  const esgAvg = Object.values(esgScores).reduce((a, b) => a + b, 0) / 3;
  const nebAvg = Object.values(nebScores).reduce((a, b) => a + b, 0) / 3;
  
  return Math.round((craftAvg + esgAvg + nebAvg) / 3);
}

/**
 * Get individual framework averages
 */
export function getFrameworkAverages(
  craftScores: CraftScores,
  esgScores: ESGScores,
  nebScores: NEBScores
): { craft: number; esg: number; neb: number } {
  return {
    craft: Math.round(Object.values(craftScores).reduce((a, b) => a + b, 0) / 4),
    esg: Math.round(Object.values(esgScores).reduce((a, b) => a + b, 0) / 3),
    neb: Math.round(Object.values(nebScores).reduce((a, b) => a + b, 0) / 3),
  };
}
