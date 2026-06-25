// Insights Service
// Roept de culture-compare edge function aan (website-distillatie + Claude-analyse).

import { supabase } from './supabaseClient';

export interface AxisSummary {
  label: string;
  score: number;
}
export interface DimensionSummary {
  label: string;
  axes: AxisSummary[];
}
export interface GapSummary {
  dimensionLabel: string;
  axisLabel: string;
  leadership: number;
  staff: number;
  diff: number;
}

export interface ConversationStarterArgs {
  orgName: string;
  websiteUrl: string;
  dimensions: DimensionSummary[];
  gaps: GapSummary[];
}

export interface ConversationStarterResult {
  missie: string;
  waarden: string[];
  cultuur: string;
  aansluiting: string[];
  afwijking: string[];
  directieTeam: string[];
  gesprekstarters: string[];
}

export async function generateConversationStarter(
  args: ConversationStarterArgs
): Promise<{ structured: ConversationStarterResult | null; raw: string; error: string | null }> {
  if (!supabase) return { structured: null, raw: '', error: 'Supabase is niet geconfigureerd.' };
  const { data, error } = await supabase.functions.invoke('culture-compare', { body: args });
  if (error) return { structured: null, raw: '', error: error.message };
  if (data?.error) return { structured: null, raw: '', error: data.error };
  return {
    structured: (data?.structured ?? null) as ConversationStarterResult | null,
    raw: data?.raw ?? '',
    error: null,
  };
}
