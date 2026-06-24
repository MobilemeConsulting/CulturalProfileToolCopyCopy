// Supabase Edge Function: invite-user
// Nodigt een nieuwe gebruiker uit (admin-only) en kent een rol toe.
// De uitnodigingsmail wordt door Supabase Auth verstuurd via de geconfigureerde
// SMTP-provider (Brevo). De service_role key blijft hier server-side.
//
// Deploy:
//   supabase functions deploy invite-user
// Vereiste secrets zijn standaard beschikbaar in Edge Functions:
//   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

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
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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
    const { email, role, redirectTo } = await req.json();
    if (!email) {
      return json({ error: 'E-mailadres ontbreekt' }, 400);
    }
    const newRole = role === 'admin' ? 'admin' : 'user';

    // 3. Nodig uit met de service_role client (server-side).
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
    });

    if (inviteError || !invited?.user) {
      return json({ error: inviteError?.message ?? 'Uitnodigen mislukt' }, 400);
    }

    // 4. Ken de rol toe.
    const { error: roleError } = await admin
      .from('user_roles')
      .upsert({ user_id: invited.user.id, role: newRole });

    if (roleError) {
      return json({ error: `Uitgenodigd, maar rol toekennen mislukte: ${roleError.message}` }, 207);
    }

    return json({ success: true, userId: invited.user.id, role: newRole }, 200);
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
