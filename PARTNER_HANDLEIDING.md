# AHHA Vlaanderen — Technische Partnerhandleiding
## Organisatieprofiel Matching Tool

**Versie**: Juni 2026  
**Opdrachtgever**: Bart Vandesompele / Filip Clarys — AHHA Vlaanderen  
**Doel van dit document**: Technische overdracht aan een externe ontwikkelaar of partner voor verdere fine-tuning van de tool.

---

## 1. Wat doet deze tool?

De AHHA Profiel Matching Tool is een React-webapplicatie die **culturele organisaties en profit-bedrijven** helpt om hun organisatieprofiel in kaart te brengen op basis van gedeelde waarden en culturele impact. De tool berekent vervolgens een **matchingscore** tussen een culturele organisatie en een profit-bedrijf op basis van het CSROI-framework.

### Kernfunctionaliteiten
- Stapsgewijze wizard voor het aanmaken van een organisatieprofiel (cultureel of profit)
- Slidergebaseerde vragenlijsten (scores 0–100 per as)
- Voor profit-bedrijven: individuele responses per medewerker met gewogen gemiddelden (60% directie / 40% personeel)
- CSROI-score berekening (Cultural & Social Return on Investment)
- Beveiligde matching tussen profielen
- Export/import van profielen als JSON
- Opslag in browser (localStorage) met optionele Google Sheets sync

---

## 2. Technische stack

| Laag | Technologie |
|------|------------|
| Framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS |
| UI Primitives | Radix UI |
| Animaties | Motion (motion/react) |
| Grafieken | Recharts |
| Icons | Lucide React |
| Opslag | localStorage (primair) + Google Sheets (optioneel) |
| Hosting | Figma Make sandbox (kan naar elke statische host) |

### Geen backend vereist
De applicatie is volledig client-side. Er is geen server, database of authenticatiesysteem aanwezig. Alles draait in de browser.

---

## 3. Bestandsstructuur

```
src/
├── app/
│   ├── App.tsx                          # Hoofdcomponent, navigatie, profielbeheer
│   ├── components/
│   │   ├── ProfileCreationWizard.tsx    # Startpunt wizard, keuze cultureel/profit
│   │   ├── CulturalProfileForm.tsx      # Formulier voor culturele organisaties
│   │   ├── ProfitProfileFormNew.tsx     # Formulier voor profit-organisaties
│   │   ├── IndividualResponseWizard.tsx # Per-medewerker vragenlijst (profit)
│   │   ├── TwoStepProfileWizard.tsx     # Alternatieve wizard (bestaande profielen)
│   │   ├── ResponsesOverview.tsx        # Overzicht individuele responses
│   │   ├── ProfileOutput.tsx            # Profielweergave (radar chart, scores)
│   │   ├── MatchingView.tsx             # Matchingsresultaten (beveiligd)
│   │   ├── CSROIDashboard.tsx           # CSROI scores + baseline tekst
│   │   ├── PasswordProtection.tsx       # Wachtwoordscherm voor matching
│   │   ├── GoogleSheetsConfig.tsx       # UI voor Google Sheets koppeling
│   │   └── SavedProfilesManager.tsx     # Profieloverzicht, import/export
│   ├── data/
│   │   ├── profitDimensions.ts          # Vragenlijst definitie profit-organisaties
│   │   └── demoProfiles.ts              # 6 voorbeeldprofielen (3 profit, 3 cultureel)
│   ├── services/
│   │   └── googleSheets.ts              # Google Sheets API integratie
│   ├── types/
│   │   └── csroi.ts                     # CSROI types en dimensiemappings
│   └── data/
│       └── types.ts                     # Alle core TypeScript types
├── utils/
│   ├── calculateAverages.ts             # Gewogen gemiddelden (60/40 logica)
│   ├── csroiCalculations.ts             # CSROI score berekening + matching
│   ├── craftCalculations.ts             # CRaFT / ESG / NEB berekeningen
│   └── migrateProfiles.ts               # Backwards-compatibiliteit oude profielen
└── styles/
    ├── fonts.css                        # Google Fonts imports
    └── theme.css                        # Tailwind design tokens
```

---

## 4. Data model

### 4.1 OrganisationProfile (hoofdstructuur)

```typescript
interface OrganisationProfile {
  id: string;                          // UUID
  organisationType: 'cultural' | 'profit';
  createdAt: string;                   // ISO datum
  updatedAt: string;
  meta: {
    orgName: string;
    orgType: string;                   // bv. "Theater", "Verzekeraar"
    year: number;
    industry?: string;                 // alleen profit
    crossoverFocus?: CrossoverFocus;   // 'hr' | 'leiderschap' | 'innovatie' | 'reputatie' | 'gemeenschap'
  };
  dimensions: Dimension[];             // gescoorde assen
  identitySummary: {
    toneOfVoice: string[];
    visualKeywords: string[];
  };
  profitData?: ProfitProfileData;      // alleen voor profit-organisaties
}
```

### 4.2 Dimension & Axis

```typescript
interface Dimension {
  id: string;
  label: string;
  axes: Axis[];
}

interface Axis {
  id: string;
  label: string;
  score: number;          // 0–100
  description?: string;   // toelichting van de invuller
  identityWords?: string[];
}
```

### 4.3 ProfitProfileData (individuele responses)

```typescript
interface ProfitProfileData {
  individualResponses: IndividualResponse[];   // alle individuele ingevulde formulieren
  leadershipResponses: Dimension[];            // gemiddelde van directie (role: 'leadership')
  staffResponses: Dimension[];                 // gemiddelde van personeel (role: 'staff')
  combinedDimensions: Dimension[];             // 60% directie + 40% personeel
}

interface IndividualResponse {
  respondentName: string;
  role: 'leadership' | 'staff';
  dimensions: Dimension[];
  completedAt: string;
}
```

---

## 5. Dimensies en assen

### 5.1 Culturele organisaties (4 hoofddimensies)

| ID | Label | Assen (voorbeelden) |
|----|-------|-------------------|
| `artistic` | Artistieke Positie | Artistieke focus, Repertoirekeuze |
| `audience` | Publiek & Gemeenschap | Bereik, Participatie |
| `organisation` | Organisatie & Werking | Wendbaarheid, Samenwerking |
| `identity` | Culturele Identiteit | Toon, Visuele identiteit |

> **Opgelet**: De exacte vragenlijst voor culturele organisaties staat verspreid over `CulturalProfileForm.tsx`. Er is geen centrale configuratiefile voor culturele assen — dit is een aandachtspunt voor fine-tuning (zie sectie 9).

### 5.2 Profit-organisaties (5 hoofddimensies, gedefinieerd in `profitDimensions.ts`)

| ID | Label | Assen |
|----|-------|-------|
| `innovation_creativity` | Creativiteit & Innovatie | Innovatiegraad, Risicobereidheid |
| `market_audience` | Markt & Doelgroep | Marktbereik, Klantgerichtheid |
| `process_structure` | Proces & Structuur | Wendbaarheid, Digitale transformatie, Leren, Samenwerking, Autonomie, Hiërarchie, Communicatie |
| `brand_identity` | Merkidentiteit | Traditie↔Modern, Erfgoed↔Toekomst |
| `sustainability_impact` | Duurzaamheid & Impact | Duurzaamheid, Sociale impact, Gemeenschapsbetrokkenheid |

---

## 6. CSROI-framework

CSROI staat voor *Cultural & Social Return on Investment*. Het is het matchingkader dat culturele en profit-dimensies naar een gemeenschappelijke schaal (0–5) converteert.

### 6.1 De 5 CSROI-dimensies

| # | Dimensie | Wat het meet |
|---|---------|-------------|
| 1 | Culturele participatie & beleving | Bereik, toegankelijkheid, publiekservaring |
| 2 | Educatieve impact & leren | Leeruitkomsten, kennisoverdracht |
| 3 | Sociale impact & gemeenschap | Gemeenschapsopbouw, sociale cohesie |
| 4 | Economische impact & cross-over | Economische meerwaarde, samenwerkingspotentieel |
| 5 | Innovatie & verbeelding | Vernieuwingskracht, creativiteit |

### 6.2 Berekening (csroiCalculations.ts)

```
1. Haal ruwe as-scores op (0–100)
2. Map elke as naar 1–3 CSROI-dimensies via CSROI_DIMENSION_MAPPINGS
3. Schaal naar 0–5: csroiScore = (rawScore / 100) * 5
4. Uitzondering: Hiërarchie-as is geïnverteerd: csroiScore = 5 - berekendScore
5. Gewogen gemiddelde per CSROI-dimensie (sommige assen wegen zwaarder)
```

### 6.3 Matchingscore

```
Voor elk CSROI-dimensiepaar (cultureel vs. profit):
  dimensieMatch = max(0, 100 - |cultureel_score - profit_score| * 20)

Totale match = gemiddelde van alle 5 dimensiematches
```

**Kwaliteitsklassen**:
- ≥ 80% → "Uitstekend"
- ≥ 60% → "Goed"
- ≥ 40% → "Redelijk"
- < 40% → "Beperkt"

---

## 7. Gewogen gemiddelden (60/40)

Bestand: `utils/calculateAverages.ts`

```
Directie-gewicht:   60%
Personeelsgewicht:  40%

Per as:
  gewogen_score = (directie_gemiddelde × 0.6) + (personeel_gemiddelde × 0.4)
  → afgerond op heel getal
```

**Stap-voor-stap voor profit-organisaties**:
1. Groepeer `individualResponses` per `role`
2. Bereken gemiddelde scores per as binnen elke groep
3. Pas 60/40 weging toe
4. Sla op als `profitData.combinedDimensions`

---

## 8. Opslag en datapersistentie

### 8.1 localStorage (altijd actief)

| Sleutel | Inhoud |
|---------|--------|
| `cultural-profiles` | JSON array van alle profielen |
| `googleSheetsUrl` | URL van Google Apps Script |
| `googleSheetsApiKey` | Optionele API sleutel |

**Levensduur**: Blijft bewaard totdat de browser-cache gewist wordt of de gebruiker het manueel verwijdert.  
**Beperking**: Gebonden aan browser + domein. Niet gedeeld tussen apparaten.

### 8.2 Google Sheets (optioneel, via Apps Script)

- Geconfigureerd via de UI (Settings-tab) of via `.env`:
  ```
  VITE_GOOGLE_SHEETS_URL=https://script.google.com/...
  VITE_GOOGLE_SHEETS_API_KEY=optioneel
  ```
- **Huidig probleem**: CORS-fouten bij de meeste configuraties. De app valt automatisch terug op localStorage zonder foutmelding.
- Sync-logica: nieuwste `updatedAt` wint bij conflicten.

### 8.3 JSON Export/Import

Gebruikers kunnen elk profiel exporteren als `.json` bestand en later terug importeren. Dit is de meest betrouwbare manier om profielen te delen tussen apparaten.

---

## 9. Toegangsbeveiliging

### Matching-functie (wachtwoord)
- **Wachtwoord**: `(verwijderd — zie VITE_MATCHING_PASSWORD)`
- **Opgeslagen in**: `sessionStorage` (vervalt bij sluiten browser-tab)
- **Geautoriseerde gebruikers**: Bart Vandesompele, Filip Clarys
- **Locatie in code**: `App.tsx` (constante `CORRECT_PASSWORD`) + `PasswordProtection.tsx`

> ⚠️ Dit is een client-side wachtwoord — niet geschikt voor echte beveiligingsvereisten. Iedereen met toegang tot de broncode of browser devtools kan het omzeilen. Voor productiegebruik is een server-side authenticatie vereist.

---

## 10. Aandachtspunten voor fine-tuning

### 10.1 Vragenlijsten centraliseren (PRIORITEIT)

**Huidig probleem**: De vragenlijst voor culturele organisaties staat verspreid in `CulturalProfileForm.tsx` als hardcoded JSX. De profit-vragenlijst staat centraal in `data/profitDimensions.ts`.

**Aanbeveling**: Maak één centrale configuratiefile `data/culturalDimensions.ts` op het model van `profitDimensions.ts`. Dit maakt het aanpassen van vragen, labels en beschrijvingen veel eenvoudiger zonder in component-code te duiken.

### 10.2 Publieke dimensie (gevraagde feature)

Er is vraag naar een extra datalaag op basis van **publiek beschikbare informatie** (jaarverslagen, websites, persberichten). Mogelijke implementatierichtingen:

**Optie A — Handmatige invoer**  
Extra stap in de wizard: gebruiker plakt tekst/citaten uit jaarverslag. Opgeslagen als `publicContext: string` op het profiel. Geen externe API nodig.

**Optie B — URL-gebaseerde scraping via Jina AI**  
Jina AI Reader (`https://r.jina.ai/[url]`) converteert een publieke webpagina naar leesbare tekst, rechtstreeks vanuit de browser (geen CORS-probleem). Bruikbaar voor websites en online PDF's.

**Optie C — AI-geassisteerde scoringssuggesties**  
Combineer Optie B met een Claude/GPT API-call: gestripte tekst wordt geanalyseerd en het systeem stelt scores voor per CSROI-dimensie. Vereist een API-sleutel en server-side proxy (of Supabase Edge Function).

### 10.3 Supabase als cloudopslag

De app is voorbereid voor Supabase maar nog niet verbonden. Met Supabase:
- Profielen zijn beschikbaar vanaf elk apparaat
- Geen verlies bij wissen browsercache
- Mogelijkheid tot echte gebruikersauthenticatie
- Vereist: Supabase project aanmaken + koppeling configureren in de tool

### 10.4 Matching-algoritme verfijnen

Het huidige algoritme is lineair (verschil in CSROI-score = match%). Mogelijke verbeteringen:
- Gewogen assen (sommige CSROI-dimensies tellen zwaarder)
- Drempelwaarden per crossover-focus (bv. bij `hr`-focus weegt CSROI-3 "Sociale impact" zwaarder)
- Asymmetrische matching (een hoge culturele score compenseert een lage profit-score niet volledig)

### 10.5 Responsief design

De tool is gebouwd voor desktop. Mobiele weergave is functioneel maar niet geoptimaliseerd. Radar-charts en slider-inputs zijn op kleine schermen beperkt bruikbaar.

### 10.6 Authenticatie voor productie

Het huidige wachtwoord (`(verwijderd — zie VITE_MATCHING_PASSWORD)`) is client-side en niet veilig. Voor productiegebruik:
- Supabase Auth (email/wachtwoord of magic link)
- Of een eenvoudige server-side sessie

---

## 11. Demodata

6 voorgebouwde profielen in `data/demoProfiles.ts`:

| Naam | Type | Cross-over focus |
|------|------|-----------------|
| Interparking Belgium | Profit | Innovatie |
| Baloise Insurance | Profit | HR |
| KBC Bank | Profit | Reputatie |
| Refibo | Cultureel | — |
| Compagnie Cecilia | Cultureel | — |
| Ha Concerts | Cultureel | — |

Elk profiel bevat volledige dimensie-scores, leadership vs. staff variaties, en identiteitssleutelwoorden.

---

## 12. Omgevingsvariabelen

```env
# Optioneel — alleen voor Google Sheets sync
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/.../exec
VITE_GOOGLE_SHEETS_API_KEY=your-key-here
```

Aangemaakt via `.env` in de projectroot. Worden ingelezen via `import.meta.env.VITE_*`.

---

## 13. Aanpassingen stap voor stap

### Vraag toevoegen aan profit-vragenlijst
1. Open `src/app/data/profitDimensions.ts`
2. Voeg een `Axis`-object toe aan de gewenste dimensie:
   ```typescript
   {
     id: 'nieuwe_as_id',
     label: 'Label van de vraag',
     score: 50,             // standaard beginwaarde
     description: '',
     identityWords: []
   }
   ```
3. Voeg optioneel een CSROI-mapping toe in `src/app/types/csroi.ts`

### Wachtwoord wijzigen
1. Open `src/app/App.tsx`
2. Zoek: `const CORRECT_PASSWORD = '(verwijderd — zie VITE_MATCHING_PASSWORD)'`
3. Vervang de waarde

### Gewichten aanpassen (60/40)
1. Open `src/utils/calculateAverages.ts`
2. Zoek: `LEADERSHIP_WEIGHT = 0.6` en `STAFF_WEIGHT = 0.4`
3. Pas aan (som moet altijd 1 zijn)

### CSROI-mapping aanpassen
1. Open `src/app/types/csroi.ts`
2. Zoek `CSROI_DIMENSION_MAPPINGS`
3. Elke mapping bevat: `dimensionId`, `axisId`, `csroiDimension`, `weight`

---

## 14. Contactpersonen

| Naam | Rol |
|------|-----|
| Bart Vandesompele | Opdrachtgever, geautoriseerd voor matching |
| Filip Clarys | Opdrachtgever, geautoriseerd voor matching |

---

*Dit document is gegenereerd op basis van de broncode zoals aanwezig in juni 2026. Bij verdere ontwikkeling dient dit document bijgehouden te worden.*
