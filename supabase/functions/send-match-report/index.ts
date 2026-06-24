// Supabase Edge Function: send-match-report
// Verstuurt een matchrapport-mail (admin-only) via de Brevo transactional email API.
//
// Vereiste secrets (zet via `supabase secrets set`):
//   BREVO_API_KEY        - Brevo API key (v3)
//   BREVO_SENDER_EMAIL   - Geverifieerd afzender-e-mailadres in Brevo
// Standaard beschikbaar in Edge Functions:
//   SUPABASE_URL, SUPABASE_ANON_KEY
//
// Deploy:
//   supabase functions deploy send-match-report

import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const authHeader = req.headers.get('Authorization') ?? '';

    // 1. Verifieer dat de aanroeper een ingelogde admin is.
    const caller = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
    } = await caller.auth.getUser();

    if (!user) {
      return json({ error: 'Niet ingelogd' }, 401);
    }

    const { data: roleRow } = await caller
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (roleRow?.role !== 'admin') {
      return json({ error: 'Geen admin-rechten' }, 403);
    }

    // 2. Lees payload.
    const { toEmail, toName, subject, html } = await req.json();
    if (!toEmail || !subject || !html) {
      return json({ error: 'toEmail, subject en html zijn verplicht' }, 400);
    }

    // 3. Verstuur via Brevo.
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': Deno.env.get('BREVO_API_KEY')!,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: Deno.env.get('BREVO_SENDER_EMAIL'), name: 'AHHA' },
        to: [{ email: toEmail, name: toName }],
        subject,
        htmlContent: html,
      }),
    });

    if (!brevoResponse.ok) {
      const text = await brevoResponse.text();
      return json({ error: `Brevo-fout (${brevoResponse.status}): ${text}` }, brevoResponse.status);
    }

    return json({ success: true }, 200);
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
