// Supabase Edge Function: culture-compare
// Scrapet de bedrijfswebsite (Firecrawl), vergelijkt de BEWEERDE cultuur met het
// GEMETEN profiel + directie/team-verschillen, en laat Claude (Sonnet) een
// gesprekstarter-document genereren. Alle keys blijven server-side.
//
// Secrets (Supabase → Edge Functions → Secrets):
//   ANTHROPIC_API_KEY   — Claude API key
//   FIRECRAWL_API_KEY   — Firecrawl API key
// Deploy: supabase functions deploy culture-compare

import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface AxisSummary {
  label: string;
  score: number;
}
interface DimensionSummary {
  label: string;
  axes: AxisSummary[];
}
interface Gap {
  dimensionLabel: string;
  axisLabel: string;
  leadership: number;
  staff: number;
  diff: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');

    if (!anthropicKey || !firecrawlKey) {
      return json({ error: 'ANTHROPIC_API_KEY of FIRECRAWL_API_KEY ontbreekt in de secrets.' }, 500);
    }

    // 1. Admin-verificatie.
    const authHeader = req.headers.get('Authorization') ?? '';
    const caller = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
    } = await caller.auth.getUser();
    if (!user) return json({ error: 'Niet ingelogd' }, 401);
    const { data: roleRow } = await caller
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    if (roleRow?.role !== 'admin') return json({ error: 'Geen admin-rechten' }, 403);

    // 2. Payload.
    const {
      orgName,
      websiteUrl,
      dimensions,
      gaps,
    }: {
      orgName: string;
      websiteUrl: string;
      dimensions: DimensionSummary[];
      gaps: Gap[];
    } = await req.json();

    if (!websiteUrl) return json({ error: 'Website-URL ontbreekt' }, 400);

    // 3. Scrape de website via Firecrawl.
    const fcResp = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: websiteUrl, formats: ['markdown'], onlyMainContent: true }),
    });
    if (!fcResp.ok) {
      const t = await fcResp.text();
      return json({ error: `Scrapen mislukt (${fcResp.status}): ${t.slice(0, 300)}` }, 400);
    }
    const fcData = await fcResp.json();
    const siteText: string = (fcData?.data?.markdown ?? '').slice(0, 8000);
    if (!siteText.trim()) return json({ error: 'Geen tekst gevonden op de website.' }, 400);

    // 4. Bouw de prompt.
    const dimText = (dimensions ?? [])
      .map(
        (d) =>
          `${d.label}:\n` + d.axes.map((a) => `  - ${a.label}: ${a.score}/100`).join('\n')
      )
      .join('\n');
    const gapText =
      gaps && gaps.length
        ? gaps
            .map(
              (g) =>
                `  - ${g.dimensionLabel} · ${g.axisLabel}: directie ${g.leadership} vs team ${g.staff} (Δ ${g.diff})`
            )
            .join('\n')
        : 'Geen significante directie/team-verschillen of geen responses beschikbaar.';

    const prompt = `Bedrijf: ${orgName}

WEBSITE-INHOUD (ruwe tekst, gedistilleerd uit hun site):
"""
${siteText}
"""

GEMETEN CULTUURPROFIEL (uit onze vragenlijst, scores 0-100):
${dimText}

INTERNE PERCEPTIEVERSCHILLEN (directie vs team, >20 punten):
${gapText}

Taak:
1. Distilleer kort de BEWEERDE missie, kernwaarden en bedrijfscultuur uit de website.
2. Vergelijk met het GEMETEN profiel: waar sluit de communicatie aan op de meting, en waar wijkt ze af?
3. Betrek de directie/team-verschillen waar relevant.
4. Geef 4 à 6 concrete GESPREKSTARTERS (observaties of openingsvragen) voor een eerste gesprek met dit bedrijf, gericht op cultuur-cross-over met een culturele organisatie.

Schrijf in het Nederlands, bondig, met duidelijke kopjes.`;

    // 5. Claude (Sonnet).
    const aiResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1600,
        system:
          'Je bent een strategisch adviseur voor AHHA, die culturele organisaties en bedrijven samenbrengt rond gedeelde waarden. Je schrijft helder, concreet en in het Nederlands.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!aiResp.ok) {
      const t = await aiResp.text();
      return json({ error: `Claude-call mislukt (${aiResp.status}): ${t.slice(0, 300)}` }, 400);
    }
    const aiData = await aiResp.json();
    const output: string =
      aiData?.content?.map((c: { text?: string }) => c.text ?? '').join('') ?? '';

    return json({ output }, 200);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Onbekende fout' }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
