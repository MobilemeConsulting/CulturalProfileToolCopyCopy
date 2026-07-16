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

    // Hulpfunctie: valideer URL en blokkeer interne/lokale adressen (SSRF-preventie).
    function validateUrl(url: string): URL {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Alleen http en https URLs zijn toegestaan');
      }
      const h = parsed.hostname.toLowerCase();
      if (
        h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '0.0.0.0' ||
        h.endsWith('.local') || h.endsWith('.internal') ||
        h.startsWith('10.') || h.startsWith('192.168.') ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(h) || h.startsWith('169.254.')
      ) {
        throw new Error('Interne of lokale URLs zijn niet toegestaan');
      }
      return parsed;
    }

    // Hulpfunctie: scrape een URL via Firecrawl.
    async function scrapeUrl(url: string): Promise<string> {
      const resp = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: { Authorization: `Bearer ${firecrawlKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true, blockAds: true, timeout: 15000 }),
      });
      if (!resp.ok) return '';
      const data = await resp.json();
      return (data?.data?.markdown ?? '').slice(0, 5000);
    }

    // Hulpfunctie: zoek met Firecrawl search naar relevante pagina's.
    async function searchFirecrawl(query: string, limit = 3): Promise<{ url: string; content: string }[]> {
      const resp = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: { Authorization: `Bearer ${firecrawlKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit, lang: 'nl', scrapeOptions: { formats: ['markdown'], onlyMainContent: true } }),
      });
      if (!resp.ok) return [];
      const data = await resp.json();
      return (data?.data ?? []).map((r: { url?: string; markdown?: string }) => ({
        url: r.url ?? '',
        content: (r.markdown ?? '').slice(0, 3000),
      }));
    }

    // 3a. Als geen website-URL opgegeven: automatisch zoeken via Firecrawl search.
    let resolvedUrl = websiteUrl?.trim() || '';
    if (!resolvedUrl) {
      if (!orgName) return json({ error: 'Geef een website-URL op of zorg dat de organisatienaam ingevuld is.' }, 400);
      const searchResults = await searchFirecrawl(`${orgName} officiële website`);
      if (searchResults.length > 0 && searchResults[0].url) {
        resolvedUrl = searchResults[0].url;
      } else {
        return json({ error: `Kon geen website vinden voor "${orgName}". Voer de URL handmatig in.` }, 400);
      }
    }

    // Valideer de (gevonden of ingevoerde) URL.
    try {
      validateUrl(resolvedUrl);
    } catch (e) {
      return json({ error: e instanceof Error ? e.message : 'Ongeldige URL' }, 400);
    }

    // 3b. Scrape de hoofdwebsite.
    const siteText = await scrapeUrl(resolvedUrl);
    if (!siteText.trim()) return json({ error: 'Geen tekst gevonden op de website.' }, 400);

    // 3c. Zoek naar jaarverslagen en CSR/duurzaamheidsrapporten (parallel).
    const [annualResults, csrResults] = await Promise.all([
      searchFirecrawl(`${orgName} jaarverslag OR jaarrapport`, 2),
      searchFirecrawl(`${orgName} duurzaamheidsrapport OR CSR OR maatschappelijk verantwoord ondernemen`, 2),
    ]);

    // Combineer extra bronnen tot één tekstblok (max 4000 tekens totaal).
    const extraSources: string[] = [];
    for (const r of [...annualResults, ...csrResults]) {
      if (r.content.trim()) {
        extraSources.push(`[Bron: ${r.url}]\n${r.content.slice(0, 2000)}`);
      }
    }
    const extraText = extraSources.join('\n---\n').slice(0, 4000);

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

    const extraBlock = extraText.trim()
      ? `\nEXTRA BRONNEN (jaarverslagen, CSR/duurzaamheidsrapporten):\n"""\n${extraText}\n"""\n`
      : '';

    const prompt = `Bedrijf: ${orgName}

WEBSITE-INHOUD (ruwe tekst, gedistilleerd uit hun site — ${resolvedUrl}):
"""
${siteText}
"""
${extraBlock}
GEMETEN CULTUURPROFIEL (uit onze vragenlijst, scores 0-100):
${dimText}

INTERNE PERCEPTIEVERSCHILLEN (directie vs team, >20 punten):
${gapText}

Analyseer en antwoord met UITSLUITEND één geldig JSON-object met exact deze velden:
{
  "missie": "korte distillatie van de beweerde missie (string)",
  "waarden": ["kernwaarden uit de website en eventuele rapporten"],
  "cultuur": "korte beschrijving van de beweerde bedrijfscultuur (string)",
  "aansluiting": ["punten waar website/rapporten en gemeten profiel overeenkomen"],
  "afwijking": ["punten waar de beweerde cultuur afwijkt van het gemeten profiel"],
  "directieTeam": ["observaties over de directie/team-verschillen; lege array indien geen data"],
  "csrInzichten": ["inzichten uit jaarverslagen of duurzaamheidsrapporten, indien beschikbaar; lege array indien niet gevonden"],
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
        max_tokens: 1800,
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

    return json({
      structured,
      raw,
      resolvedUrl: resolvedUrl,
      extraSources: extraSources.length > 0
        ? [...annualResults, ...csrResults].filter(r => r.content.trim()).map(r => r.url)
        : [],
    }, 200);
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
