import { Dimension, IndividualResponse } from '../data/types';

/**
 * Berekent het gemiddelde van meerdere responses
 */
export function calculateAverageDimensions(responses: IndividualResponse[]): Dimension[] {
  if (responses.length === 0) return [];

  // Neem de structuur van de eerste response als basis
  const template = responses[0].dimensions;
  
  return template.map(dim => ({
    id: dim.id,
    label: dim.label,
    axes: dim.axes.map(axis => {
      // Bereken gemiddelde score voor deze axis over alle responses
      const scores = responses.map(resp => {
        const respDim = resp.dimensions.find(d => d.id === dim.id);
        const respAxis = respDim?.axes.find(a => a.id === axis.id);
        return respAxis?.score || 0;
      });
      
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      
      return {
        ...axis,
        score: Math.round(averageScore), // Afgerond op hele getallen
      };
    }),
  }));
}

/**
 * Filtert responses op rol (leadership of staff)
 */
export function filterResponsesByRole(
  responses: IndividualResponse[],
  role: 'leadership' | 'staff'
): IndividualResponse[] {
  return responses.filter(r => r.respondentRole === role);
}

/**
 * Berekent gewogen gemiddelde (60% leadership, 40% staff)
 */
export function calculateWeightedAverage(
  leadershipDimensions: Dimension[],
  staffDimensions: Dimension[]
): Dimension[] {
  if (leadershipDimensions.length === 0 && staffDimensions.length === 0) return [];
  
  // Als er maar één groep is, gebruik die
  if (leadershipDimensions.length === 0) return staffDimensions;
  if (staffDimensions.length === 0) return leadershipDimensions;
  
  const LEADERSHIP_WEIGHT = 0.6;
  const STAFF_WEIGHT = 0.4;
  
  return leadershipDimensions.map((leaderDim, dimIndex) => ({
    id: leaderDim.id,
    label: leaderDim.label,
    axes: leaderDim.axes.map((leaderAxis, axisIndex) => {
      const staffAxis = staffDimensions[dimIndex]?.axes[axisIndex];
      
      const weightedScore = 
        (leaderAxis.score * LEADERSHIP_WEIGHT) + 
        ((staffAxis?.score || 0) * STAFF_WEIGHT);
      
      return {
        ...leaderAxis,
        score: Math.round(weightedScore),
      };
    }),
  }));
}

/**
 * Herberekent alle gemiddelden voor een profiel
 */
export function recalculateProfitData(individualResponses: IndividualResponse[]): {
  leadershipResponses: Dimension[];
  staffResponses: Dimension[];
  combinedDimensions: Dimension[];
} {
  const leadershipResps = filterResponsesByRole(individualResponses, 'leadership');
  const staffResps = filterResponsesByRole(individualResponses, 'staff');
  
  const leadershipResponses = calculateAverageDimensions(leadershipResps);
  const staffResponses = calculateAverageDimensions(staffResps);
  const combinedDimensions = calculateWeightedAverage(leadershipResponses, staffResponses);
  
  return {
    leadershipResponses,
    staffResponses,
    combinedDimensions,
  };
}
