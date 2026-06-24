import { Dimension } from '../App';
import { CSROIScores, CSROI_DIMENSION_MAPPINGS, CSROICategory } from '../types/csroi';

/**
 * Compute CSROI scores from cultural dimensions
 * Maps 8 cultural dimensions to 5 CSROI dimensions with weighted contributions
 */
export function computeCSROIScores(dimensions: Dimension[]): CSROIScores {
  const csroiSums: CSROIScores = {
    'Culturele participatie & beleving': 0,
    'Educatieve impact & leren': 0,
    'Sociale impact & gemeenschap': 0,
    'Economische impact & cross-over': 0,
    'Innovatie & verbeelding': 0
  };

  const csroiWeights: CSROIScores = {
    'Culturele participatie & beleving': 0,
    'Educatieve impact & leren': 0,
    'Sociale impact & gemeenschap': 0,
    'Economische impact & cross-over': 0,
    'Innovatie & verbeelding': 0
  };

  // For each cultural dimension, distribute its score to CSROI dimensions
  dimensions.forEach(dimension => {
    // Calculate average score for this dimension (0-5 scale)
    const avgScore = dimension.axes.reduce((sum, axis) => sum + axis.score, 0) / dimension.axes.length / 20; // Convert 0-100 to 0-5

    // Special handling for hierarchy - inverse relationship
    let actualScore = avgScore;
    if (dimension.id === 'hierarchy_decision') {
      actualScore = 5 - avgScore; // Lower hierarchy = better CSROI
    }

    // Get all mappings for this dimension
    const mappings = CSROI_DIMENSION_MAPPINGS.filter(m => m.dimensionId === dimension.id);

    mappings.forEach(mapping => {
      csroiSums[mapping.csroiDimension] += actualScore * mapping.weight;
      csroiWeights[mapping.csroiDimension] += mapping.weight;
    });
  });

  // Calculate weighted averages
  const csroiScores: CSROIScores = {
    'Culturele participatie & beleving': 0,
    'Educatieve impact & leren': 0,
    'Sociale impact & gemeenschap': 0,
    'Economische impact & cross-over': 0,
    'Innovatie & verbeelding': 0
  };

  (Object.keys(csroiScores) as Array<keyof CSROIScores>).forEach(key => {
    if (csroiWeights[key] > 0) {
      csroiScores[key] = Number((csroiSums[key] / csroiWeights[key]).toFixed(2));
    }
  });

  return csroiScores;
}

/**
 * Calculate overall CSROI index (0-5 scale)
 */
export function calculateOverallCSROI(csroiScores: CSROIScores): number {
  const scores = Object.values(csroiScores);
  const validScores = scores.filter(s => s > 0);
  
  if (validScores.length === 0) return 0;
  
  const sum = validScores.reduce((a, b) => a + b, 0);
  return Number((sum / validScores.length).toFixed(2));
}

/**
 * Categorize a CSROI score
 */
export function categorizeScore(score: number): CSROICategory {
  if (score >= 3.5) return 'Sterk';
  if (score >= 2.5) return 'In opbouw';
  return 'Prioriteit';
}

/**
 * Generate baseline text for CSROI profile
 */
export function generateBaselineText(
  csroiScores: CSROIScores,
  overallScore: number,
  orgName: string,
  crossoverFocus?: string
): string {
  // 1. Overall profile
  let level = 'middelmatig';
  if (overallScore >= 3.5) level = 'hoog';
  else if (overallScore < 2.5) level = 'laag';

  const sentence1 = `De CSROI-index van ${orgName} wordt ingeschat op ${overallScore}/5, wat wijst op een ${level} maatschappelijk-cultureel rendement.`;

  // 2. Strong dimensions
  const entries = Object.entries(csroiScores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  const topDims = entries.slice(0, 2).map(([dim]) => dim);
  let sentence2 = '';
  if (topDims.length) {
    sentence2 = ` De sterkste dimensies in dit profiel zijn vooral ${topDims.join(' en ')}, waar al veel impact wordt gerealiseerd.`;
  }

  // 3. Cross-over opportunities based on focus
  let crossOverText = '';
  switch (crossoverFocus) {
    case 'hr':
      crossOverText = 'rond medewerkersbetrokkenheid en retentie';
      break;
    case 'leiderschap':
      crossOverText = 'als leeromgeving voor leiderschap en samenwerking';
      break;
    case 'innovatie':
      crossOverText = 'als katalysator voor innovatie en strategie';
      break;
    case 'reputatie':
      crossOverText = 'in het versterken van merk, verhaal en klantbeleving';
      break;
    case 'gemeenschap':
      crossOverText = 'in de rol als bruggenbouwer met de lokale gemeenschap';
      break;
    default:
      crossOverText = 'op het snijvlak van cultuur, mensen en economie';
  }

  const sentence3 = ` De grootste kans voor verdere cross-over tussen cultuur en economie ligt volgens deze analyse ${crossOverText}.`;

  return sentence1 + sentence2 + sentence3;
}

/**
 * Get top and bottom CSROI dimensions
 */
export function getTopAndBottomDimensions(csroiScores: CSROIScores): {
  top: Array<{ dimension: string; score: number }>;
  bottom: Array<{ dimension: string; score: number }>;
} {
  const entries = Object.entries(csroiScores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  return {
    top: entries.slice(0, 2).map(([dimension, score]) => ({ dimension, score })),
    bottom: entries.slice(-2).map(([dimension, score]) => ({ dimension, score }))
  };
}
