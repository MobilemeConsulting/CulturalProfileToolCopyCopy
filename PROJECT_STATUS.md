# AHHA Cultural Matching Tool - Project Status

**Laatste update:** 24 februari 2026  
**Status:** Demo fase met volledige profielen

---

## 📋 Project Overzicht

Interactieve tool voor culturele organisaties om hun organisatieprofiel in kaart te brengen en te matchen met bedrijfsprofielen voor sponsoring en samenwerking.

### Kern Concept
- **Dubbele database structuur**: Culturele profielen ↔ Bedrijfsprofielen
- **Twee-staps procedure**: 
  - Directie/Leiding vult eerst in (60% weging)
  - Personeel/Team vult daarna in (40% weging)
  - Scores worden automatisch gewogen gecombineerd
- **AHHA Branding**: Volledig geïntegreerd
- **CSROI-laag**: 8 culturele dimensies → 5 CSROI-dimensies

---

## 🎯 Dimensies

### Voor Culturele Organisaties (4 hoofddimensies)

1. **Artistieke Positie (Creativiteit & Innovatie)**
   - Innovatief ↔ Conservatief
   - Gespecialiseerd ↔ Breed bereik

2. **Publiek & Gemeenschap (Markt & Doelgroep)**
   - Lokaal ↔ Internationaal
   - Participatief ↔ Presentatie
   - Elite ↔ Toegankelijk

3. **Organisatie & Werking (Proces & Structuur)**
   - Agile & flexibel ↔ Stabiel & gestructureerd
   - Digitaal ↔ Analoog
   - Leren & Ontwikkeling
   - Samenwerking & Cultuur
   - Autonomie & Empowerment
   - Hiërarchie & Besluitvorming
   - Communicatie

4. **Culturele Identiteit (Merkidentiteit)**
   - Traditionele waarden ↔ Adaptief
   - Erfgoed ↔ Toekomstgericht

### Voor Profit Organisaties (5 CSROI dimensies)

1. **Creativiteit & Innovatie**
2. **Markt & Doelgroep**
3. **Proces & Structuur**
4. **Merkidentiteit**
5. **Duurzaamheid & Impact**

---

## 📊 Demo Profielen (volledig uitgewerkt)

### Culturele Organisaties

1. **Compagnie Cecilia** ✅
   - Type: **Theatergezelschap** (niet dansgezelschap!)
   - Focus: Gemeenschap
   - Profiel: Toegankelijk, eigentijds theater, regionaal verankerd
   - Status: Leadership + Staff responses compleet

2. **Ha Concerts / Noordstarfonds vzw** ✅
   - Type: Concertzaal & Muziekprogrammering
   - Focus: Gemeenschap
   - Profiel: Experimenteel, jazz-gespecialiseerd, avant-garde
   - Status: Volledig (geen leadership/staff split voor dit profiel)

### Profit Organisaties

3. **Interparking** ✅
   - Type: Parkeerbeheer & Mobiliteit
   - Profiel: Traditioneel, stabiel, digitale transitie
   - Status: Leadership + Staff responses compleet
   - **Interne perceptie gaps**: Significante verschillen (>20 punten) op innovatie en autonomie

4. **Baloise Belgium** ✅
   - Type: Verzekeringen & Banking
   - Profiel: Conservatief, compliance-gedreven, stabiliteit
   - Status: Leadership + Staff responses compleet
   - **Interne perceptie gaps**: Vooral op digitale transformatie en leren & ontwikkelen

5. **KBC Bank** ✅ **NIEUW**
   - Type: Bank & Verzekeringen
   - Profiel: Digitaal innovatief, modern, klantgericht
   - Status: Leadership + Staff responses compleet
   - **Interne perceptie gaps**: Matige verschillen op innovatie (12 punten), leren & ontwikkelen (12 punten)
   - **Profiel**: Vooruitstrevender dan Baloise, sterke digitale focus, agile teams, plattere structuur

---

## 🎨 Features Geïmplementeerd

### ✅ Basis Functionaliteit
- Volledig responsief dashboard
- Dimensie visualisaties met progress bars
- Score berekeningen (0-100 schaal)
- Identity summary (tone of voice + visual keywords)

### ✅ Matching & Vergelijking
- **MatchingView**: Toont matches tussen culturele en profit organisaties
- **Radar charts**: Visuele vergelijking van profielen
- **Match percentage**: Gebaseerd op score-overlap
- **🔒 Wachtwoord Bescherming**: Matching tab beveiligd met wachtwoord "(verwijderd — zie VITE_MATCHING_PASSWORD)"
  - Alleen toegankelijk voor geautoriseerde gebruikers
  - Sessie-gebaseerde toegang (blijft actief tijdens browser sessie)
  - Contact: Bart Vandesompele of Filip Clarys voor toegang

### ✅ Leadership vs Staff Analyse
- **Nieuwe sectie per organisatie**: "Interne Perceptieverschillen"
- **Kleurgecodeerde bars**:
  - Groen: Leadership score
  - Blauw: Staff score
  - Paars: Gewogen gecombineerde score (60/40)
- **⚠️ Oranje waarschuwingen**: Bij gaps > 20 punten
- **Verschilwaarde**: Exact verschil in puntentelling

### ✅ CSROI Mapping
- 8 culturele dimensies → 5 CSROI profit dimensies
- Automatische baseline-tekst generatie
- Klaar voor rapportage

---

## 📁 Belangrijke Bestanden

```
/src/app/
├── App.tsx                          # Main component met wachtwoord beveiliging
├── components/
│   ├── Dashboard.tsx                # Profiel dashboard
│   ├── MatchingView.tsx             # Matching interface met leadership/staff analyse
│   ├── PasswordProtection.tsx       # 🔒 Wachtwoord component voor matching
│   ├── ProfileRadarChart.tsx        # Radar visualisatie
│   ├── ProfileCreationWizard.tsx    # Profiel aanmaak wizard
│   ├── CulturalProfileForm.tsx      # Formulier culturele organisaties
│   ├── ProfitProfileForm.tsx        # Formulier profit bedrijven
│   └── figma/
│       └── ImageWithFallback.tsx    # Protected file
├── data/
│   ├── demoProfiles.ts              # Alle demo profielen + leadership/staff data
│   ├── csroiMapping.ts              # CSROI dimensie mapping
│   └── types.ts                     # TypeScript interfaces
└── styles/
    ├── theme.css                    # AHHA branding colors
    └── fonts.css                    # Font imports
```

---

## 🚀 Huidige Implementatie - Profiel Aanmaak Systeem

### ✅ GEÏMPLEMENTEERD: Pure Frontend Profiel Creatie

**Workflow:**
1. **Kies Type**: Cultureel of Profit organisatie
2. **Vul Meta-info in**: Naam, type, sector
3. **Beantwoord vragen**: Per dimensie met sliders (0-100)
4. **Export optie**: Download als JSON op elk moment
5. **Import optie**: Upload eerder geëxporteerd profiel
6. **Lokale opslag**: Automatisch in localStorage

**Nieuwe Componenten:**
- ✅ `ProfileCreationWizard.tsx` - Hoofdflow voor profiel aanmaak
- ✅ `CulturalProfileForm.tsx` - Formulier voor culturele organisaties
- ✅ `ProfitProfileForm.tsx` - Formulier voor profit bedrijven

**Features:**
- Stapsgewijze wizard met progressie indicatie
- Export naar JSON op elk moment tijdens invullen
- Import van eerder geëxporteerde profielen
- Validatie van alle verplichte velden
- Optionele toelichting per vraag
- Automatische opslag in localStorage

### Optie B: Supabase Integratie (Productie)
**Voor:** Professioneel, schaalbaar, veilig  
**Tegen:** Meer setup tijd, authenticatie nodig

**Database Schema:**
```sql
-- Organizations
- id, name, type, status, created_at

-- Respondents  
- id, org_id, role (leadership/staff), email, completed, invited_at

-- Responses
- id, respondent_id, dimension_id, axis_id, score, timestamp

-- Aggregated Profiles
- id, org_id, leadership_avg, staff_avg, combined_weighted, updated_at
```

**Supabase Voordelen:**
- Real-time updates wanneer respondenten invullen
- Row Level Security (teams zien alleen hun data)
- Ingebouwde authenticatie (magic links/email)
- Automatische API generatie
- Gratis tier ruim voldoende

**Workflow:**
1. Admin nodigt respondenten uit (via email)
2. Respondenten krijgen unieke link
3. Authenticatie via Supabase
4. Antwoorden worden real-time opgeslagen
5. Bij voltooiing: automatische aggregatie
6. Dashboard toont live voortgang

---

## 🎨 Branding - AHHA

### Kleuren (in /src/styles/theme.css)
- Primary: Paars/blauw gradient
- Accent kleuren voor dimensies
- Professioneel kleurenschema

### Visuele Stijl
- Modern, toegankelijk
- Data visualisaties prominent
- Ruimtelijke layout met hover effects

---

## ⚠️ Belangrijke Notities

### Protected Files
**NIET aanpassen:**
- `/src/app/components/figma/ImageWithFallback.tsx`
- `/pnpm-lock.yaml`

### Data Consistency
- **Gewogen scores**: Altijd 60% leadership + 40% staff
- **Score range**: 0-100 voor alle assen
- **Organisatie types**: 'cultural' of 'profit'

### Compagnie Cecilia Correctie
- ✅ **Gewijzigd van Dansgezelschap naar Theatergezelschap**
- Alle gerelateerde beschrijvingen aangepast (dans→theater)

---

## 🤔 Open Vragen & Beslissingen

1. **✅ OPGELOST: Vragenlijst Strategie**:
   - ✅ Pure frontend geïmplementeerd met JSON export/import
   - ✅ Directe score input via sliders (0-100)
   - ⚠️ Optioneel: Later uitbreiden met Supabase voor multi-respondent

2. **Respondenten Management** (Toekomstige uitbreiding):
   - [ ] Hoeveel personeelsleden kunnen invullen? (gemiddelde nemen)
   - [ ] Eén directielid of meerdere? (ook gemiddelde?)
   - [ ] Tijdslimiet voor invullen?
   - [ ] Multi-respondent functionaliteit toevoegen?

3. **Matching Algoritme**:
   - [ ] Huidige matching verfijnen?
   - [ ] Weging van dimensies (sommige belangrijker?)
   - [ ] Minimal viable match percentage?

4. **Export & Rapportage**:
   - ✅ JSON export geïmplementeerd
   - [ ] PDF rapporten genereren?
   - [ ] Excel export toevoegen?
   - [ ] CSROI rapportage format?

---

## 📞 Contact & Gebruik

Dit document dient als:
- **Kennisoverdracht** voor nieuwe developers
- **Status tracking** van het project
- **Referentie** voor toekomstige beslissingen
- **Context** voor AI assistants bij verdere ontwikkeling

**Versie:** 1.2  
**Laatst bijgewerkt door:** AI Assistant  
**Datum:** 27 februari 2026  
**Updates:** 
- Volledig profiel aanmaak systeem geïmplementeerd met export/import functionaliteit
- KBC Bank demo profiel toegevoegd (5e demo organisatie)
- 🔒 Wachtwoord bescherming toegevoegd aan matching functionaliteit (wachtwoord: "(verwijderd — zie VITE_MATCHING_PASSWORD)")
- Profiel aanmaak flow toont direct het organisatie overzicht na voltooiing
