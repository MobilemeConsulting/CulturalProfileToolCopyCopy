# CLAUDE.md — AHHA Cultural Profile Tool

Gids voor AI-assistenten en developers. Houd dit up-to-date bij architectuurwijzigingen.

## Wat is dit
Tool om culturele organisaties en profit-bedrijven te profileren (CSROI-dimensies) en te matchen voor sponsoring/samenwerking. Voor AHHA Vlaanderen.

## Stack
- **Vite 6** + **React 18** + **TypeScript** (strict)
- **Tailwind 4**, Radix UI / shadcn-componenten (`src/app/components/ui`)
- **react-router 7** (client-side routing)
- **Supabase** als backend (database + Auth), met **localStorage-fallback**
- **jspdf** voor PDF-export (gebrand matchrapport)
- **xlsx** voor Excel-export (profielen + match-matrix + CRM-data)
- **Recharts** voor radar charts (vergelijkingsview + matching)
- **Brevo** als SMTP/transactional-mail provider (via Supabase Auth + edge function)

## Commando's
```bash
npm run dev      # dev-server (Vite) — http://localhost:5173
npm run build    # productiebuild naar dist/  (gebruik dit om te verifiëren)
```
Er is geen lokale `tsc`; typecheck gebeurt via `npx vite build` (esbuild).

## Routes
- `/` — de publieke tool ([src/app/App.tsx](src/app/App.tsx))
- `/profiel/:id` — publieke, read-only profielpagina (deelbaar, geen login nodig)
- `/admin` — admin-dashboard (echte Supabase-Auth + admin-rol vereist)
- `/admin/accept` — invite-link afhandelen (wachtwoord instellen)

## Wachtwoorden / toegang
- **Demo laden**: geen wachtwoord.
- **Matching-tab**: verwijderd uit publieke tool (nu alleen via /admin). `PasswordProtection.tsx` en `MatchingView.tsx` staan nog in de code voor eventuele re-activatie.
- **/admin**: echte Supabase-Auth login + een **staff-rol** in `user_roles` (geen hardcoded wachtwoord). Rollen: `admin` | `bestuurder` | `lid` | `user`. **Staff = `admin` of `bestuurder`** (`is_staff()`) → mag inloggen op `/admin` en met de data werken. `admin` ziet daarbovenop de tab **Gebruikers** (gebruikers-/rollenbeheer, `is_admin()`). `lid`/`user` krijgen géén `/admin`-toegang. "Leden en bestuurders" als **contacten** (geen login) zitten in het register (tab Leden & Bestuur).

## Datamodel
Kerntype: `OrganisationProfile` in [src/app/data/types.ts](src/app/data/types.ts) — `id`, `organisationType` (`cultural`|`profit`), `meta`, `dimensions[]` (elk met `axes[]`, score 0-100), `identitySummary`, optioneel `profitData` (leadership/staff responses), `createdAt`/`updatedAt`.

## Services ([src/app/services](src/app/services))
- `supabaseClient.ts` — init client uit `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`; `null` als config ontbreekt.
- `supabaseService.ts` — profielen-CRUD + match_results. Publieke API: `isConfigured`, `getAllProfiles`, `getProfile`, `saveProfile`, `deleteProfile`, `saveBulkProfiles`, `syncProfiles`, `saveMatchResult`, `getMatchResults`. **Valt terug op localStorage** wanneer niet geconfigureerd (nooit crashen).
- `authService.ts` — Supabase Auth: `signIn`, `signOut`, `getCurrentUser`, `getRole`, `isAdmin`, `isStaff`, `onAuthChange`, `listUsers`, `inviteUser` (retourneert invite-link), `deleteUser`, `resendInvite`, `setUserRole`, `resetUserPassword`, `setPassword`. Exporteert `type Role` en `STAFF_ROLES`. `inviteUser`/`deleteUser`/`resetUserPassword` gebruiken directe `fetch` naar de edge function (niet `supabase.functions.invoke`).
- `membersService.ts` — CRUD voor het **ledenregister** (`members`-tabel): `getMembers`, `saveMember` (insert/update), `deleteMember`. Valt terug op localStorage als Supabase niet geconfigureerd is. Types `Member`, `MemberInput`, `MemberType` (`lid`|`bestuurder`).
- `reportService.ts` — `sendMatchReport` (via edge function `send-match-report`), `buildMatchReportHtml`.
- `matchStatusService.ts` — `updateMatchStatus`, `updateMatchCRM`, `MATCH_STATUSES`, `MATCH_STATUS_LABELS`.
- `googleSheets.ts.bak` — **oude** backend, bewust als referentie bewaard (niet gebruiken).

## Utils ([src/app/utils](src/app/utils))
- `matching.ts` — gedeelde matchberekening: `computeMatch`, `calculateAxisMatch`, `getMatchLabel`. Match% = gemiddelde van `max(0, 100 - |c*20 - p*20|)` over 5 CSROI-dimensies.
- `csroiCalculations.ts` — mapt 8 culturele dimensies → 5 CSROI-dimensies (0-5 schaal).
- `adminStats.ts` — KPI's, match-matrix, CSROI-benchmark, perceptiekloof, datakwaliteit.
- `pdfExport.ts` — `exportProfileToPdf`, `exportMatchReportToPdf` (gebrand, kleurgecodeerd, klantgericht).
- `excelExport.ts` — `exportProfilesToExcel`, `exportMatchDataToExcel` (multi-sheet .xlsx met CRM-data).

## Admin ([src/app/admin](src/app/admin))
- `AdminPage.tsx` — auth-gate (login / geen-rol / dashboard).
- `AdminDashboard.tsx` — sidebar-navigatie: Overzicht, Profielen, Match-matrix, Ranking, Vergelijking, CSROI-benchmark, Perceptiekloof, Datakwaliteit, Inzichten, **Leden & Bestuur**, Gebruikers. Krijgt een `role`-prop; tabs met `adminOnly` (Gebruikers) zijn enkel zichtbaar voor `admin`, de rest ziet een `bestuurder` ook. Responsive hamburger-menu op mobiel. Overzicht bevat Excel-export knoppen. Ranking heeft uitklapbare CRM per match + Excel-export.
- `CompareSection.tsx` — vergelijkingsview: twee profielen naast elkaar met radar chart overlay (Recharts) + scoretabel per CSROI-dimensie.
- `UsersSection.tsx` — volledige gebruikers-CRUD (admin-only): uitnodigen (invite-link), verwijderen (met bevestiging), opnieuw uitnodigen (resend), wachtwoord resetten, rollen wijzigen (`admin`/`bestuurder`/`lid`/`user`).
- `MembersSection.tsx` — CRUD voor het ledenregister (tab **Leden & Bestuur**, voor staff): toevoegen/bewerken/verwijderen van contacten met type `lid`|`bestuurder`, filter per type. Dit zijn contacten zonder login.
- `InsightsSection.tsx` — AI-gesprekstarter: zoekt automatisch website, jaarverslagen en CSR-rapporten op (Firecrawl search) en vergelijkt beweerde cultuur met gemeten profiel + perceptiekloof. Website-URL is optioneel (wordt automatisch gezocht op basis van organisatienaam). Toont gevonden bronnen en apart CSR-inzichten blok.
- `ProfilesSection.tsx` — profielen CRUD (aanmaken, bewerken, verwijderen) + deelbare profiellink (share-knop).
- `AdminAccept.tsx` — invite afhandelen + wachtwoord instellen.

## Supabase
Migraties in [supabase/migrations](supabase/migrations) (draai in volgorde via SQL Editor):
1. `001_initial_schema.sql` — organizations, respondents, responses, aggregated_profiles (volledig profiel als `jsonb`).
2. `002_rls_policies.sql` — permissieve anon-policies (publieke tool).
3. `003_match_results.sql` — match_results tabel.
4. `004_auth_rbac.sql` — `user_roles`, `is_admin()`, match_results admin-only. **Bevat bootstrap-SQL voor de eerste admin** (onderaan).
5. `005_admin_users_rpc.sql` — `get_admin_users()` RPC.
6. `006_match_status.sql` — `status`-kolom op match_results (mini-CRM).
7. `007_match_crm_fields.sql` — CRM-uitbreiding: `notes`, `contact_name`, `contact_email`, `contact_phone`, `last_contact_at`, `next_contact_at`.
8. `008_tighten_rls.sql` — scherpt de anon-policies uit 002 aan: anon mag profielen lezen + aanmaken/bijwerken (publieke tool), authenticated volledige CRUD; op `organizations`/`respondents`/`responses` is anon enkel SELECT.
9. `009_roles_extend.sql` — rollen verruimd naar `admin`|`bestuurder`|`lid`|`user`; `is_staff()` (admin+bestuurder); `match_results` nu staff-toegankelijk i.p.v. admin-only.
10. `010_members.sql` — `members`-tabel (ledenregister) + RLS staff-only + `updated_at`-trigger.

**Eerste admin bootstrappen** (na user aanmaken in Auth → Users):
```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = '<email>'
on conflict (user_id) do update set role = 'admin';
```

Edge functions in [supabase/functions](supabase/functions):
- `invite-user` — gebruikersbeheer (admin-only). Ondersteunt `action: 'invite'` (default), `action: 'delete'`, en `action: 'reset-password'`. Invite gebruikt `generateLink` (recovery voor bestaande users, invite voor nieuwe); retourneert invite-link (24u geldig). Delete verwijdert user uit Auth + `user_roles`. Reset-password stelt wachtwoord direct in via Admin API. **Deploy apart naar Supabase** (niet via Vercel!).
- `send-match-report` — mailt matchrapport via Brevo API. Secrets: `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`.
- `culture-compare` — zoekt automatisch website + jaarverslagen + CSR-rapporten (Firecrawl search), scrapet de inhoud, en vergelijkt beweerde cultuur met gemeten profiel/gaps via Claude Sonnet → gesprekstarter met CSR-inzichten. Website-URL is optioneel in de payload (wordt automatisch gezocht). Secrets: `ANTHROPIC_API_KEY`, `FIRECRAWL_API_KEY`. (Admin-tab "Inzichten".)
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
- **Repo is PUBLIC** (sinds 2026-11-04). Reden: de Vercel-account (team "MobileMe consulting", Hobby) is op GitHub-vlak gekoppeld aan een **ander** account (`Leagl-bv`, voor de LEAGL-website), terwijl de committer `MobilemeConsulting` is. Op een private Hobby-repo blokkeert Vercel dan elke deploy ("not a member of the team"). Een public repo deployt ongeacht de committer — vandaar deze keuze. Er staan geen secrets in de code (`.env` is gitignored; sleutels zitten in Supabase/Vercel-env).
- [vercel.json](vercel.json) bevat SPA-rewrite (nodig voor `/admin`-routes, anders 404).
- Zet in Vercel → Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (Vite bakt ze in tijdens build → **redeploy** na wijziging).

### ⚠️ Vercel Hobby — committer-identiteit (belangrijke valkuil)
> ⓘ Sinds de repo **public** is (zie boven) is deze valkuil niet langer blokkerend: Hobby deployt een public repo ongeacht de committer. Onderstaande blijft relevant als de repo ooit weer private wordt.

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
VITE_MATCHING_PASSWORD=...   # optioneel; enkel nodig als de (verwijderde) Matching-tab ooit heractiveerd wordt
```
`PasswordProtection.tsx` leest het Matching-wachtwoord uit `VITE_MATCHING_PASSWORD` (niet langer hardcoded, want de repo is public).

## Meerdere invullers (cultuur én bedrijf)
- Beide flows werken met meerdere invullers: organisatiegegevens → invullers verzamelen (`ResponsesOverview`) → per invuller `IndividualResponseWizard` (naam of alias + rol + `QuestionnaireStep`).
- Cultuur: `CulturalProfileFormNew.tsx` met vragen uit `data/culturalDimensions.ts`. Rollen directie / bestuur / medewerker / vrijwilliger, weging **40/30/20/10** in `data/respondentRoles.ts` (`CULTURAL_ROLE_WEIGHTS`). Eerst gemiddelde per rol, dan gewogen over de aanwezige rollen (gewichten herschaald) via `combineByRoleWeights` in `calculateAverages.ts`. Resultaat in `profile.culturalData` (`individualResponses`, `roleAverages`).
- Bedrijf: `ProfitProfileFormNew.tsx`, rollen leadership/staff, weging 60/40 (`recalculateProfitData`).
- **De weging wordt nergens in de tool getoond** (besluit AHHA, 12-11-2026). Het profiel toont wel het aantal invullers en de score per rol, zonder percentages.
- Let op: `individualResponses` (met naam of alias) zit in het publiek leesbare profiel-JSON.

## Bekende design-keuzes
- **Slider-scores + touched-tracking** (bijgewerkt na AHHA-review): de schuifjes staan visueel nog op 50 (een schuifje moet ergens staan), maar `CulturalProfileForm.tsx` houdt via een `touched`-state bij welke schuifjes de gebruiker écht bewoog. Een onaangeroerd schuifje telt **niet** als beantwoord: `handleNext` (per stap) en `handleSubmit` eisen dat elk schuifje bewogen is, en onaangeroerde schuifjes tonen een "nog niet beantwoord"-hint. Vervang `scores[id] === undefined` dus niet terug — de validatie loopt nu op `touched`. Dezelfde regel geldt in de profit-vragenlijst (`QuestionnaireStep.tsx`).
- **Poolwoorden**: elke as heeft expliciete `left`/`right` (type `Axis`; cultureel inline in `CulturalProfileForm.tsx`, profit in `profitDimensions.ts`). **Links = lage score (0), rechts = hoge score (100)** — die richting moet overeenkomen met wat de analyse (`csroiCalculations.ts`, `craftCalculations.ts`, matching) onder een hoge score verstaat. Geen ruwe score (`X/100`) en geen "Gemiddeld" in het midden.
- **Profit: vraag en toelichting gescheiden**: in `profitDimensions.ts` staat de vraag in `question`; `description` start leeg en is de toelichting van de invuller (zoals bij cultuur). `notePrompt` zet een vraag boven het toelichtingsveld (ESG: "Hoe kan cultuur daaraan bijdragen?").
- **Aanspreekvorm**: overal **"je"**, niet "uw" (op vraag van AHHA).
- **Geen `alert()`**: in een iframe-embed toont de browser er "een ingesloten pagina zegt…" bij. Gebruik inline meldingen of `toast` (sonner).
- **Scrollen**: bij een stap- of vraagwissel brengt `scrollIntoView` het formulier of de vraagkaart in beeld — niet `window.scrollTo(0)`, want dan toont de pagina de hero en moet de invuller terug naar beneden scrollen.

## ⚠️ Gekend probleem: analyse loopt achter op de vragenlijst (nov 2026)
De berekeningen (CSROI, CRaFT, matching) zijn gebouwd voor een oudere vragenlijst. Demo-profielen gebruiken nog de oude dimensie-id's en zien er goed uit; **echte profielen niet**:
- **Cultureel**: de form gebruikt dimensie-id `organization`, de CSROI-mapping `organisation` → de 7 vragen van "Organisatie & Werking" tellen niet mee. CRaFT leest `organisation`-assen (`pionier_vs_beheerder`, `activistisch_vs_neutraal`) die niet meer bestaan → altijd 50.
- **Profit**: alleen dimensie `identity` is gemapt; `innovation`, `market`, `process` en `sustainability` (13 vragen) tellen niet mee in CSROI/matching.
- **Richting**: CSROI middelt alle assen van een dimensie zonder per-as-richting. Bij `experimental_vs_traditioneel` (artistic → Innovatie) en `participatief_vs_presentatie` (audience → Participatie) staat de "meer"-kant links (lage score), dus die scores werken omgekeerd. CRaFT gebruikt die assen ook zonder omkering.
- `getAxisScore` in `craftCalculations.ts` doet `axis?.score || 50` → een score van 0 wordt als 50 gelezen.
- De fix vraagt een per-as-polariteit + mapping voor de huidige dimensie-id's. Dat is een methodologische keuze: eerst afstemmen met AHHA (Kurt), dan pas implementeren.

## Niet aanraken (protected)
- `src/app/components/figma/ImageWithFallback.tsx`
- `pnpm-lock.yaml`
- `*.bak` bestanden = bewuste referenties.
