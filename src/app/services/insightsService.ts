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

export async function generateConversationStarter(
  args: ConversationStarterArgs
): Promise<{ output: string | null; error: string | null }> {
  if (!supabase) return { output: null, error: 'Supabase is niet geconfigureerd.' };
  const { data, error } = await supabase.functions.invoke('culture-compare', { body: args });
  if (error) return { output: null, error: error.message };
  if (data?.error) return { output: null, error: data.error };
  return { output: data?.output ?? '', error: null };
}
