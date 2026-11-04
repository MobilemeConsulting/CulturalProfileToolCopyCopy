# AHHA Cultural Matching Tool - Gebruiksaanwijzing

**Versie:** 1.2  
**Laatst bijgewerkt:** 27 februari 2026

---

## 🎯 Wat doet deze tool?

De AHHA Cultural Matching Tool helpt culturele organisaties en bedrijven hun organisatieprofiel in kaart te brengen en passende matches te vinden voor samenwerking, sponsoring en culturele partnerschappen.

---

## 🚀 Snelstart

### 1. Een Nieuw Profiel Aanmaken

**Stap 1: Kies Type Organisatie**
- Klik op **"+ Nieuw Profiel Aanmaken"**
- Kies tussen:
  - 🎭 **Culturele Organisatie** (theater, museum, concertzaal, etc.)
  - 💼 **Profit Bedrijf** (bank, parkeerbeheer, verzekeringen, etc.)

**Stap 2: Vul Basisgegevens In**
- Organisatienaam
- Type organisatie (theater, bank, etc.)
- Jaar

**Stap 3: Beantwoord Vragen**
- Per dimensie vul je scores in via sliders (0-100)
- Optionele toelichting per vraag
- Progress tracking toont voortgang

**Stap 4: Bekijk Resultaat**
- Automatisch opgeslagen in browser
- Direct overzicht van je organisatieprofiel
- Toegang tot CSROI dashboard en culturele pitch

---

## 📊 Tabs & Functionaliteit

### Tab 1: Start
- Nieuw profiel aanmaken
- Eerder opgeslagen profielen laden
- Demo profielen bekijken (5 voorbeelden)

### Tab 2: Overzicht
**Na het aanmaken van een profiel zie je:**
- **Overzicht**: Visuele weergave van alle dimensies
- **CSROI**: Mapping naar bedrijfsdimensies
- **Culturele Pitch**: Tone of Voice en visuele keywords
- **Intake Details**: Alle ingevulde informatie
- **Responses**: Vergelijking leadership vs. personeel (alleen profit)

### Tab 3: Matching 🔒
**Wachtwoord vereist:** `(verwijderd — zie VITE_MATCHING_PASSWORD)`

- Bekijk matches tussen culturele organisaties en bedrijven
- Radar charts voor visuele vergelijking
- Match percentages gebaseerd op score-overlap
- Interne perceptieverschillen (leadership vs. staff)

**⚠️ Toegang:**  
Alleen voor geautoriseerde gebruikers. Contact Bart Vandesompele of Filip Clarys.

---

## 💾 Opslaan & Exporteren

### Automatisch Opslaan
- Profielen worden automatisch opgeslagen in je browser (localStorage)
- Blijft beschikbaar na herladen pagina

### Exporteren naar JSON
- Klik op de **Export** knop tijdens of na het invullen
- Download JSON bestand naar je computer
- Gebruik dit bestand om later te importeren

### Importeren
- Klik op **"Profiel Importeren"** in de wizard
- Upload eerder geëxporteerd JSON bestand
- Profiel wordt toegevoegd aan je overzicht

---

## 🎭 Demo Profielen

De tool bevat 5 volledig uitgewerkte demo profielen:

### Culturele Organisaties
1. **Compagnie Cecilia** - Theatergezelschap, toegankelijk & eigentijds
2. **Ha Concerts** - Concertzaal, experimenteel & jazz-gespecialiseerd

### Profit Bedrijven
3. **Interparking** - Parkeerbeheer, traditioneel maar digitaliserende
4. **Baloise Belgium** - Verzekeringen, conservatief & compliance-gedreven
5. **KBC Bank** - Bank, digitaal innovatief & modern

**Demo laden:**  
Klik op de **"Demo"** knop in de navigatie

---

## 📋 Dimensies

### Voor Culturele Organisaties

**1. Artistieke Positie**
- Innovatief ↔ Conservatief
- Gespecialiseerd ↔ Breed bereik

**2. Publiek & Gemeenschap**
- Lokaal ↔ Internationaal
- Participatief ↔ Presentatie
- Elite ↔ Toegankelijk

**3. Organisatie & Werking**
- Agile & flexibel ↔ Stabiel & gestructureerd
- Digitaal ↔ Analoog
- Leren & Ontwikkeling
- Samenwerking & Cultuur
- Autonomie & Empowerment
- Hiërarchie & Besluitvorming
- Communicatie

**4. Culturele Identiteit**
- Traditionele waarden ↔ Adaptief
- Erfgoed ↔ Toekomstgericht

### Voor Profit Organisaties

**8 Dimensies (CSROI gebaseerd):**
1. Innovatie & Creativiteit
2. Leren & Ontwikkeling
3. Samenwerking & Cultuur
4. Autonomie & Empowerment
5. Hiërarchie & Besluitvorming
6. Performance & Resultaten
7. Work-Life Balance
8. Communicatie & Transparantie

**Weging:** 60% Leadership + 40% Staff responses

---

## 🔒 Beveiliging

### Wachtwoord Matching
- **Wachtwoord:** `(verwijderd — zie VITE_MATCHING_PASSWORD)`
- Sessie-gebaseerd (blijft actief tijdens browser sessie)
- Bij nieuwe sessie opnieuw invoeren

### Data Opslag
- Profielen worden **lokaal** in je browser opgeslagen
- Geen data wordt verzonden naar externe servers
- Export naar JSON voor backup aanbevolen

---

## ❓ Veelgestelde Vragen

### Kan ik een profiel later bewerken?
Momenteel niet direct mogelijk. Alternatief:
1. Exporteer het huidige profiel als JSON
2. Maak een nieuw profiel aan met updates
3. Verwijder het oude profiel indien gewenst

### Hoe verwijder ik een profiel?
- Ga naar de "Start" tab
- Klik op de rode prullenbak bij het profiel

### Kan ik de demo profielen aanpassen?
Nee, demo profielen zijn alleen-lezen. Je kunt ze wel als inspiratie gebruiken.

### Wat als ik het wachtwoord vergeet?
Contact Bart Vandesompele of Filip Clarys voor toegang tot de matching functionaliteit.

### Werkt de tool offline?
De tool werkt offline nadat je hem één keer hebt geladen. Profielen blijven lokaal opgeslagen.

---

## 📞 Contact & Support

Voor vragen over:
- **Matching toegang:** Bart Vandesompele / Filip Clarys
- **Technische ondersteuning:** Development team
- **CSROI methodologie:** AHHA team

---

## 🔄 Toekomstige Features

**In ontwikkeling:**
- [ ] Profiel bewerking functionaliteit
- [ ] PDF rapporten genereren
- [ ] Multi-respondent systeem (Supabase)
- [ ] Excel export
- [ ] Geavanceerd matching algoritme

---

**Veel succes met het in kaart brengen van je organisatieprofiel!** 🎉
