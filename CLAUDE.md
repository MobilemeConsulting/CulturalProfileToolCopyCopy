# CLAUDE.md — AHHA Cultural Profile Tool

Gids voor AI-assistenten en developers. Houd dit up-to-date bij architectuurwijzigingen.

## Wat is dit
Tool om culturele organisaties en profit-bedrijven te profileren (CSROI-dimensies) en te matchen voor sponsoring/samenwerking. Voor AHHA Vlaanderen.

## Stack
- **Vite 6** + **React 18** + **TypeScript** (strict)
- **Tailwind 4**, Radix UI / shadcn-componenten (`src/app/components/ui`)
- **react-router 7** (client-side routing)
- **Supabase** als backend (database + Auth), met **localStorage-fallback**
- **jspdf** voor PDF-export
- **Brevo** als SMTP/transactional-mail provider (via Supabase Auth + edge function)

## Commando's
```bash
npm run dev      # dev-server (Vite) — http://localhost:5173
npm run build    # productiebuild naar dist/  (gebruik dit om te verifiëren)
```
Er is geen lokale `tsc`; typecheck gebeurt via `npx vite build` (esbuild).

## Routes
- `/` — de publieke tool ([src/app/App.tsx](src/app/App.tsx))
- `/admin` — admin-dashboard (echte Supabase-Auth + admin-rol vereist)
- `/admin/accept` — invite-link afhandelen (wachtwoord instellen)

## Wachtwoorden / toegang
- **Demo laden**: geen wachtwoord.
- **Matching-tab**: hardcoded `aHHa$2026` ([PasswordProtection.tsx](src/app/components/PasswordProtection.tsx)).
- **/admin**: echte Supabase-Auth login + rol `admin` in `user_roles` (geen hardcoded wachtwoord).

## Datamodel
Kerntype: `OrganisationProfile` in [src/app/data/types.ts](src/app/data/types.ts) — `id`, `organisationType` (`cultural`|`profit`), `meta`, `dimensions[]` (elk met `axes[]`, score 0-100), `identitySummary`, optioneel `profitData` (leadership/staff responses), `createdAt`/`updatedAt`.

## Services ([src/app/services](src/app/services))
- `supabaseClient.ts` — init client uit `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`; `null` als config ontbreekt.
- `supabaseService.ts` — profielen-CRUD + match_results. Publieke API: `isConfigured`, `getAllProfiles`, `getProfile`, `saveProfile`, `deleteProfile`, `saveBulkProfiles`, `syncProfiles`, `saveMatchResult`, `getMatchResults`. **Valt terug op localStorage** wanneer niet geconfigureerd (nooit crashen).
- `authService.ts` — Supabase Auth: `signIn`, `signOut`, `getCurrentUser`, `isAdmin`, `onAuthChange`, `listUsers`, `inviteUser` (retourneert invite-link), `deleteUser`, `resendInvite`, `setUserRole`, `setPassword`. `inviteUser`/`deleteUser` gebruiken directe `fetch` naar de edge function (niet `supabase.functions.invoke`).
- `reportService.ts` — `sendMatchReport` (via edge function `send-match-report`), `buildMatchReportHtml`.
- `matchStatusService.ts` — `updateMatchStatus`, `MATCH_STATUSES`, `MATCH_STATUS_LABELS`.
- `googleSheets.ts.bak` — **oude** backend, bewust als referentie bewaard (niet gebruiken).

## Utils ([src/app/utils](src/app/utils))
- `matching.ts` — gedeelde matchberekening: `computeMatch`, `calculateAxisMatch`, `getMatchLabel`. Match% = gemiddelde van `max(0, 100 - |c*20 - p*20|)` over 5 CSROI-dimensies.
- `csroiCalculations.ts` — mapt 8 culturele dimensies → 5 CSROI-dimensies (0-5 schaal).
- `adminStats.ts` — KPI's, match-matrix, CSROI-benchmark, perceptiekloof, datakwaliteit.
- `pdfExport.ts` — `exportProfileToPdf`, `exportMatchReportToPdf`.

## Admin ([src/app/admin](src/app/admin))
- `AdminPage.tsx` — auth-gate (login / geen-rol / dashboard).
- `AdminDashboard.tsx` — sidebar-navigatie: Overzicht, Profielen, Match-matrix, Ranking, CSROI-benchmark, Perceptiekloof, Datakwaliteit, Inzichten, Gebruikers.
- `UsersSection.tsx` — volledige gebruikers-CRUD: uitnodigen (invite-link), verwijderen (met bevestiging), opnieuw uitnodigen (resend), rollen wijzigen.
- `InsightsSection.tsx` — AI-gesprekstarter: scrapet website + vergelijkt met gemeten profiel.
- `ProfilesSection.tsx` — profielen CRUD (aanmaken, bewerken, verwijderen).
- `AdminAccept.tsx` — invite afhandelen + wachtwoord instellen.

## Supabase
Migraties in [supabase/migrations](supabase/migrations) (draai in volgorde via SQL Editor):
1. `001_initial_schema.sql` — organizations, respondents, responses, aggregated_profiles (volledig profiel als `jsonb`).
2. `002_rls_policies.sql` — permissieve anon-policies (publieke tool).
3. `003_match_results.sql` — match_results tabel.
4. `004_auth_rbac.sql` — `user_roles`, `is_admin()`, match_results admin-only. **Bevat bootstrap-SQL voor de eerste admin** (onderaan).
5. `005_admin_users_rpc.sql` — `get_admin_users()` RPC.
6. `006_match_status.sql` — `status`-kolom op match_results (mini-CRM).

**Eerste admin bootstrappen** (na user aanmaken in Auth → Users):
```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = '<email>'
on conflict (user_id) do update set role = 'admin';
```

Edge functions in [supabase/functions](supabase/functions):
- `invite-user` — gebruikersbeheer (admin-only). Ondersteunt `action: 'invite'` (default) en `action: 'delete'`. Invite gebruikt `generateLink` (stuurt géén mail; retourneert invite-link die de admin kopieert en deelt, 24u geldig). Delete verwijdert user uit Auth + `user_roles`, met zelf-verwijder-beveiliging. **Deploy apart naar Supabase** (niet via Vercel!).
- `send-match-report` — mailt matchrapport via Brevo API. Secrets: `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`.
- `culture-compare` — scrapet bedrijfswebsite (Firecrawl) + vergelijkt met gemeten profiel/gaps via Claude Sonnet → gesprekstarter. Secrets: `ANTHROPIC_API_KEY`, `FIRECRAWL_API_KEY`. (Admin-tab "Inzichten".)
```bash
supabase functions deploy invite-user --project-ref nzerixyxmsrcpdqnqytl
supabase functions deploy send-match-report --project-ref nzerixyxmsrcpdqnqytl
supabase functions deploy culture-compare --project-ref nzerixyxmsrcpdqnqytl
supabase secrets set BREVO_API_KEY=... BREVO_SENDER_EMAIL=...
```
⚠️ **Edge functions moeten apart naar Supabase gedeployed worden** — Vercel deployt alleen de frontend. Na wijzigingen aan een edge function altijd `supabase functions deploy <naam>` draaien.

Redirect-URL `<domein>/admin/accept` toevoegen in Supabase → Auth → URL Configuration.

## Deploy (Vercel)
- Gekoppeld aan GitHub repo `MobilemeConsulting/CulturalProfileToolCopyCopy`; push naar `main` = productie-deploy.
- [vercel.json](vercel.json) bevat SPA-rewrite (nodig voor `/admin`-routes, anders 404).
- Zet in Vercel → Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (Vite bakt ze in tijdens build → **redeploy** na wijziging).

### ⚠️ Vercel Hobby — committer-identiteit (belangrijke valkuil)
Op het **Hobby-plan** blokkeert Vercel elke deploy waarvan de git-**committer-e-mail niet aan de GitHub-accounteigenaar gekoppeld is** ("GitHub could not associate the committer with a GitHub user" / "Hobby teams do not support collaboration"). Dit gaat NIET over meerdere mensen — het is puur e-mail-matching.
- **Commit altijd met de GitHub-e-mail van de eigenaar.** De repo-config staat hierop ingesteld:
  ```
  git config user.name  "MobilemeConsulting"
  git config user.email "266076820+MobilemeConsulting@users.noreply.github.com"
  ```
- Default machine-e-mails (bv. `gebruiker@computernaam.local`) worden geblokkeerd.
- Geblokkeerde commits oplossen: hercommit/amend met de juiste identiteit en (force-)push.
- `SupabaseConfig.tsx` bestaat nog maar wordt **niet meer gebruikt** op de publieke startpagina (config gebeurt via env-vars).

## Env (.env, gitignored)
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Niet aanraken (protected)
- `src/app/components/figma/ImageWithFallback.tsx`
- `pnpm-lock.yaml`
- `*.bak` bestanden = bewuste referenties.
