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
      body: JSON.stringify({
        url: websiteUrl,
        formats: ['markdown'],
        onlyMainContent: true,
        blockAds: true,
        timeout: 15000, // cap de scrape zodat trage sites de call niet laten vastlopen
      }),
    });
    if (!fcResp.ok) {
      const t = await fcResp.text();
      return json({ error: `Scrapen mislukt (${fcResp.status}): ${t.slice(0, 300)}` }, 400);
    }
    const fcData = await fcResp.json();
    // 5000 tekens volstaan ruim voor missie/waarden/cultuur en houdt de Claude-call snel.
    const siteText: string = (fcData?.data?.markdown ?? '').slice(0, 5000);
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

Analyseer en antwoord met UITSLUITEND één geldig JSON-object met exact deze velden:
{
  "missie": "korte distillatie van de beweerde missie (string)",
  "waarden": ["kernwaarden uit de website"],
  "cultuur": "korte beschrijving van de beweerde bedrijfscultuur (string)",
  "aansluiting": ["punten waar website en gemeten profiel overeenkomen"],
  "afwijking": ["punten waar de beweerde cultuur afwijkt van het gemeten profiel"],
  "directieTeam": ["observaties over de directie/team-verschillen; lege array indien geen data"],
  "gesprekstarters": ["4 à 6 concrete openingsvragen of observaties voor een eerste gesprek, gericht op cultuur-cross-over met een culturele organisatie"]
}
Alle tekst in het Nederlands en BONDIG (max 1-2 zinnen per item). Geen markdown, geen uitleg buiten de JSON.`;

    // 5. Claude (Sonnet) — gestructureerde JSON-output.
    const aiResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        system:
          'Je bent een strategisch adviseur voor AHHA, die culturele organisaties en bedrijven samenbrengt rond gedeelde waarden. Je antwoordt UITSLUITEND met geldige JSON (geen markdown, geen code fences), in het Nederlands.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!aiResp.ok) {
      const t = await aiResp.text();
      return json({ error: `Claude-call mislukt (${aiResp.status}): ${t.slice(0, 300)}` }, 400);
    }
    const aiData = await aiResp.json();
    const raw: string =
      aiData?.content?.map((c: { text?: string }) => c.text ?? '').join('') ?? '';

    // Strip eventuele code fences en parse JSON; bij falen geven we de ruwe tekst terug.
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    let structured: unknown = null;
    try {
      structured = JSON.parse(cleaned);
    } catch {
      structured = null;
    }

    return json({ structured, raw }, 200);
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
