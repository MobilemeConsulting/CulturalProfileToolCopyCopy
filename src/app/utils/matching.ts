// Gedeelde matching-logica.
// Geëxtraheerd uit MatchingView zodat zowel de publieke matching als de admin-
// ranking dezelfde berekening gebruiken (geen dubbele logica).

import { computeCSROIScores } from './csroiCalculations';
import { CSROIScores } from '../types/csroi';
import type { Dimension } from '../App';

export interface DimensionMatch {
  dimension: keyof CSROIScores;
  culturalScore: number; // 0-100
  profitScore: number; // 0-100
  matchScore: number; // 0-100
}

export interface MatchOutcome {
  overall: number; // 0-100
  dimensionMatches: DimensionMatch[];
}

// Match per as: CSROI-scores staan op 0-5; omgerekend naar 0-100 is de match
// hoe dicht beide scores bij elkaar liggen.
export function calculateAxisMatch(score1: number, score2: number): number {
  const difference = Math.abs(score1 * 20 - score2 * 20);
  return Math.max(0, 100 - difference);
}

// Bereken de match tussen een cultureel en een profit profiel over de 5 CSROI-
// dimensies. Totale match = gemiddelde van de dimensie-matches.
export function computeMatch(
  culturalDimensions: Dimension[],
  profitDimensions: Dimension[]
): MatchOutcome {
  const culturalCSROI = computeCSROIScores(culturalDimensions);
  const profitCSROI = computeCSROIScores(profitDimensions);

  const dimensions = Object.keys(culturalCSROI) as Array<keyof CSROIScores>;

  const dimensionMatches: DimensionMatch[] = dimensions.map((dimension) => {
    const culturalScore = culturalCSROI[dimension];
    const profitScore = profitCSROI[dimension];
    return {
      dimension,
      culturalScore: culturalScore * 20,
      profitScore: profitScore * 20,
      matchScore: calculateAxisMatch(culturalScore, profitScore),
    };
  });

  const overall =
    dimensionMatches.reduce((sum, d) => sum + d.matchScore, 0) / dimensionMatches.length;

  return { overall, dimensionMatches };
}

export function getMatchLabel(score: number): string {
  if (score >= 80) return 'Uitstekende match';
  if (score >= 60) return 'Goede match';
  if (score >= 40) return 'Redelijke match';
  return 'Beperkte match';
}
