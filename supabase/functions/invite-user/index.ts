// Supabase Edge Function: invite-user
// Gebruikersbeheer (admin-only): invite, delete, resend.
// Actie bepaald door `action` veld in de body (default: 'invite').
//
// Deploy:
//   supabase functions deploy invite-user --project-ref nzerixyxmsrcpdqnqytl

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

    const body = await req.json();
    const action = body.action || 'invite';
    const admin = createClient(supabaseUrl, serviceKey);

    // ---- DELETE ----
    if (action === 'delete') {
      const { userId } = body;
      if (!userId) return json({ error: 'userId ontbreekt' }, 400);

      // Voorkom dat admin zichzelf verwijdert
      if (userId === user.id) {
        return json({ error: 'Je kunt jezelf niet verwijderen' }, 400);
      }

      // Verwijder rol uit user_roles
      await admin.from('user_roles').delete().eq('user_id', userId);

      // Verwijder gebruiker uit Supabase Auth
      const { error: delError } = await admin.auth.admin.deleteUser(userId);
      if (delError) {
        return json({ error: delError.message }, 400);
      }

      return json({ success: true }, 200);
    }

    // ---- INVITE / RESEND ----
    const { email, role, redirectTo } = body;
    if (!email) {
      return json({ error: 'E-mailadres ontbreekt' }, 400);
    }
    const newRole = role === 'admin' ? 'admin' : 'user';

    // Check of de gebruiker al bestaat (dan recovery i.p.v. invite).
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase()
    );
    const linkType = existingUser?.email_confirmed_at ? 'recovery' : 'invite';

    // Genereer link (omzeilt SMTP — stuurt GEEN mail).
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: linkType,
      email,
      options: { redirectTo },
    });

    if (linkError || !linkData?.user) {
      const msg = linkError?.message
        || (linkError ? JSON.stringify(linkError) : null)
        || 'Link genereren mislukt';
      return json({ error: msg }, 400);
    }

    // Ken de rol toe.
    const { error: roleError } = await admin
      .from('user_roles')
      .upsert({ user_id: linkData.user.id, role: newRole });

    if (roleError) {
      return json({ error: `Gebruiker aangemaakt, maar rol toekennen mislukte: ${roleError.message}` }, 207);
    }

    const inviteLink = linkData.properties?.action_link || '';

    return json({
      success: true,
      userId: linkData.user.id,
      role: newRole,
      inviteLink,
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
