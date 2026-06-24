// Admin-statistieken: pure rekenfuncties voor het admin-dashboard.
// Werken op de geladen OrganisationProfile-lijst; geen side effects.

import { OrganisationProfile } from '../data/types';
import { computeCSROIScores } from './csroiCalculations';
import { CSROIScores } from '../types/csroi';
import { computeMatch } from './matching';

export function splitByType(profiles: OrganisationProfile[]) {
  return {
    culturals: profiles.filter((p) => p.organisationType === 'cultural'),
    profits: profiles.filter((p) => p.organisationType === 'profit'),
  };
}

// --- Match-matrix (heatmap) -------------------------------------------------
export interface MatchMatrix {
  culturals: OrganisationProfile[];
  profits: OrganisationProfile[];
  matrix: number[][]; // matrix[cultureelIndex][profitIndex] = match% (0-100, afgerond)
}

export function buildMatchMatrix(profiles: OrganisationProfile[]): MatchMatrix {
  const { culturals, profits } = splitByType(profiles);
  const matrix = culturals.map((c) =>
    profits.map((p) => Math.round(computeMatch(c.dimensions, p.dimensions).overall))
  );
  return { culturals, profits, matrix };
}

// --- KPI's ------------------------------------------------------------------
export interface Kpis {
  culturalCount: number;
  profitCount: number;
  totalProfiles: number;
  pairCount: number;
  avgMatch: number;
  bestMatch: { score: number; cultural: string; profit: string } | null;
  worstMatch: { score: number; cultural: string; profit: string } | null;
}

export function computeKpis(profiles: OrganisationProfile[]): Kpis {
  const { culturals, profits } = splitByType(profiles);
  let sum = 0;
  let count = 0;
  let best: Kpis['bestMatch'] = null;
  let worst: Kpis['worstMatch'] = null;

  culturals.forEach((c) => {
    profits.forEach((p) => {
      const score = Math.round(computeMatch(c.dimensions, p.dimensions).overall);
      sum += score;
      count++;
      const entry = { score, cultural: c.meta.orgName || 'Naamloos', profit: p.meta.orgName || 'Naamloos' };
      if (!best || score > best.score) best = entry;
      if (!worst || score < worst.score) worst = entry;
    });
  });

  return {
    culturalCount: culturals.length,
    profitCount: profits.length,
    totalProfiles: profiles.length,
    pairCount: count,
    avgMatch: count ? Math.round(sum / count) : 0,
    bestMatch: best,
    worstMatch: worst,
  };
}

// --- CSROI-sectorbenchmark --------------------------------------------------
export interface BenchmarkRow {
  dimension: keyof CSROIScores;
  avg: number; // 0-100
}

export function csroiBenchmark(profiles: OrganisationProfile[]): BenchmarkRow[] {
  const { culturals } = splitByType(profiles);
  if (culturals.length === 0) return [];

  const sums = {} as Record<keyof CSROIScores, number>;
  let dims: Array<keyof CSROIScores> = [];

  culturals.forEach((c) => {
    const scores = computeCSROIScores(c.dimensions);
    dims = Object.keys(scores) as Array<keyof CSROIScores>;
    dims.forEach((d) => {
      sums[d] = (sums[d] ?? 0) + scores[d];
    });
  });

  return dims.map((dimension) => ({
    dimension,
    avg: Math.round((sums[dimension] / culturals.length) * 20), // 0-5 -> 0-100
  }));
}

// --- Perceptiekloof (directie vs team) --------------------------------------
export interface GapAxis {
  dimensionLabel: string;
  axisLabel: string;
  leadership: number;
  staff: number;
  diff: number;
}

export interface OrgGaps {
  profile: OrganisationProfile;
  gaps: GapAxis[];
}

export function perceptionGaps(profiles: OrganisationProfile[], threshold = 20): OrgGaps[] {
  const result: OrgGaps[] = [];

  profiles.forEach((profile) => {
    const lead = profile.profitData?.leadershipResponses;
    const staff = profile.profitData?.staffResponses;
    if (!lead || !staff || lead.length === 0 || staff.length === 0) return;

    const gaps: GapAxis[] = [];
    lead.forEach((leadDim, dIdx) => {
      const staffDim = staff[dIdx];
      if (!staffDim) return;
      leadDim.axes.forEach((leadAxis, aIdx) => {
        const staffAxis = staffDim.axes[aIdx];
        if (!staffAxis) return;
        const diff = Math.abs(leadAxis.score - staffAxis.score);
        if (diff > threshold) {
          gaps.push({
            dimensionLabel: leadDim.label,
            axisLabel: leadAxis.label,
            leadership: leadAxis.score,
            staff: staffAxis.score,
            diff,
          });
        }
      });
    });

    if (gaps.length > 0) {
      gaps.sort((a, b) => b.diff - a.diff);
      result.push({ profile, gaps });
    }
  });

  return result;
}

// --- Datakwaliteit ----------------------------------------------------------
export interface DataQualityItem {
  profile: OrganisationProfile;
  issues: string[];
}

export function dataQuality(profiles: OrganisationProfile[]): DataQualityItem[] {
  const items: DataQualityItem[] = [];

  profiles.forEach((profile) => {
    const issues: string[] = [];
    if (!profile.meta.orgName?.trim()) issues.push('Geen organisatienaam');
    if (!profile.meta.orgType?.trim()) issues.push('Geen organisatietype');
    if (!profile.dimensions || profile.dimensions.length === 0) issues.push('Geen dimensies');
    const noScores =
      profile.dimensions?.every((d) => d.axes.every((a) => a.score === 0)) ?? true;
    if (noScores) issues.push('Alle scores op 0 (waarschijnlijk niet ingevuld)');
    if (!profile.identitySummary?.toneOfVoice?.length) issues.push('Geen tone of voice');

    if (issues.length > 0) items.push({ profile, issues });
  });

  return items;
}
