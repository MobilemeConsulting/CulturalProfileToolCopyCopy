import { OrganisationProfile, IndividualResponse } from '../data/types';

/**
 * Migreert oude profit profielen naar nieuwe structuur met individuele responses
 */
export function migrateProfitProfile(oldProfile: any): OrganisationProfile {
  // Als het profiel al de nieuwe structuur heeft, return as-is
  if (oldProfile.profitData?.individualResponses) {
    return oldProfile as OrganisationProfile;
  }

  // Als het profiel de oude structuur heeft (leadershipResponses/staffResponses apart)
  if (oldProfile.profitData && !oldProfile.profitData.individualResponses) {
    // Maak dummy individuele responses op basis van de gemiddelden
    const leadershipResponse: IndividualResponse = {
      id: `migrated-leadership-${oldProfile.id}`,
      respondentName: 'Leadership Team (gemiddelde)',
      respondentRole: 'leadership',
      dimensions: oldProfile.profitData.leadershipResponses || [],
      completedAt: oldProfile.createdAt || new Date().toISOString(),
    };

    const staffResponse: IndividualResponse = {
      id: `migrated-staff-${oldProfile.id}`,
      respondentName: 'Staff Team (gemiddelde)',
      respondentRole: 'staff',
      dimensions: oldProfile.profitData.staffResponses || [],
      completedAt: oldProfile.createdAt || new Date().toISOString(),
    };

    return {
      ...oldProfile,
      profitData: {
        individualResponses: [leadershipResponse, staffResponse],
        leadershipResponses: oldProfile.profitData.leadershipResponses || [],
        staffResponses: oldProfile.profitData.staffResponses || [],
        combinedDimensions: oldProfile.profitData.combinedDimensions || oldProfile.dimensions,
      },
    };
  }

  // Anders is het waarschijnlijk een cultureel profiel of al correct
  return oldProfile as OrganisationProfile;
}

/**
 * Migreert alle profielen in een array
 */
export function migrateAllProfiles(profiles: any[]): OrganisationProfile[] {
  return profiles.map(profile => {
    if (profile.organisationType === 'profit') {
      return migrateProfitProfile(profile);
    }
    return profile as OrganisationProfile;
  });
}
