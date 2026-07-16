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
  websiteUrl: string; // kan leeg zijn — edge function zoekt dan automatisch
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
  csrInzichten: string[];
  gesprekstarters: string[];
}

export async function generateConversationStarter(
  args: ConversationStarterArgs
): Promise<{ structured: ConversationStarterResult | null; raw: string; error: string | null; resolvedUrl?: string; extraSources?: string[] }> {
  if (!supabase) return { structured: null, raw: '', error: 'Supabase is niet geconfigureerd.' };
  try {
    const { data, error } = await supabase.functions.invoke('culture-compare', { body: args });
    if (error) {
      // Probeer de echte foutboodschap uit de function-response te halen
      // (anders is error.message generiek zoals "non-2xx status code").
      let msg = error.message;
      try {
        const ctx = (error as { context?: { json?: () => Promise<{ error?: string }> } }).context;
        if (ctx?.json) {
          const body = await ctx.json();
          if (body?.error) msg = body.error;
        }
      } catch {
        /* houd generieke message */
      }
      return { structured: null, raw: '', error: msg };
    }
    if (data?.error) return { structured: null, raw: '', error: data.error };
    return {
      structured: (data?.structured ?? null) as ConversationStarterResult | null,
      raw: data?.raw ?? '',
      error: null,
      resolvedUrl: data?.resolvedUrl,
      extraSources: data?.extraSources,
    };
  } catch (e) {
    return {
      structured: null,
      raw: '',
      error: e instanceof Error ? e.message : 'Onbekende fout bij het aanroepen van culture-compare.',
    };
  }
}
