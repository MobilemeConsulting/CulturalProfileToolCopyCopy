# AHHA Vlaanderen - Profiel Matching Tool

## Logo Integratie

### Het echte AHHA logo toevoegen

Het platform gebruikt momenteel een placeholder logo. Om het echte AHHA logo te integreren:

#### Optie 1: Via externe URL
Als het logo beschikbaar is op een publieke URL:

1. Open `/src/app/components/AhhaHeader.tsx`
2. Vervang de placeholder div (regel 12-15) met:

```tsx
<img 
  src="https://www.ahha.vlaanderen/path-to-logo.png" 
  alt="AHHA Vlaanderen Logo"
  className="w-12 h-12 object-contain"
/>
```

#### Optie 2: Via lokaal bestand
Als je het logo als bestand hebt:

1. Plaats het logo bestand in de `/public` folder (bijvoorbeeld: `/public/ahha-logo.png`)
2. Open `/src/app/components/AhhaHeader.tsx`
3. Vervang de placeholder div met:

```tsx
<img 
  src="/ahha-logo.png" 
  alt="AHHA Vlaanderen Logo"
  className="w-12 h-12 object-contain"
/>
```

#### Optie 3: Via Unsplash (tijdelijk)
Voor een tijdelijk logo kun je ook een afbeelding van Unsplash gebruiken via de Unsplash tool.

### Kleuren aanpassen

De huidige kleuren zijn:
- **Primary**: Purple-600 (#9333ea) tot Pink-600 (#db2777)
- **Accent**: Purple en Pink tinten

Om deze aan te passen aan AHHA branding:

1. Open `/src/styles/theme.css`
2. Pas de kleuren aan naar de AHHA huisstijl

### Contact informatie

Om contact informatie aan te vullen:

1. Open `/src/app/App.tsx`
2. Zoek de footer sectie (rond regel 660)
3. Voeg email, telefoonnummer of adres toe

## Over de Tool

Deze tool is ontwikkeld voor AHHA Vlaanderen om culturele organisaties te matchen met profit bedrijven voor samenwerkingen en sponsoring.

### Functionaliteiten:
- ✅ Profiel aanmaken voor culturele organisaties
- ✅ Twee-staps profiel voor bedrijven (leiding + personeel)
- ✅ Automatische matching algoritme
- ✅ Visuele radar charts
- ✅ Export/Import functionaliteit
- ✅ localStorage voor data persistentie
- ✅ AHHA branding en footer
- ✅ **NEB Impact CRaFT Profiel** voor culturele organisaties

## NEB Impact CRaFT Profiel

### Wat is het?

Het **NEB Impact CRaFT Profiel** is een geïntegreerde analyse-tool die automatisch wordt gegenereerd voor elke culturele organisatie. Het combineert drie krachtige frameworks:

#### 1. CRaFT (Organisatie Impact)
- **C**reativity - Innovatiekracht
- **R**esilience - Veerkracht
- **F**utures - Toekomstgerichtheid
- **T**ransformation - Transformatievermogen

#### 2. ESG (Maatschappelijke Impact)
- **E**nvironmental - Milieu impact
- **S**ocial - Sociale impact
- **G**overnance - Bestuur & transparantie

#### 3. NEB (New European Bauhaus)
- **Beautiful** - Esthetische kwaliteit
- **Sustainable** - Duurzaamheid
- **Together** - Inclusiviteit

### Hoe werkt het?

1. Culturele organisatie vult standaard profiel in
2. Systeem analyseert automatisch alle dimensies
3. CRaFT scores worden berekend op basis van de ingevulde data
4. ESG en NEB scores worden afgeleid uit organisatie karakteristieken
5. Overall Impact Score combineert alle frameworks

### Features

- 📊 **3 Radar Charts** voor visuele analyse
- 📈 **Overall Impact Score** (0-100)
- 💾 **Export naar JSON** met volledige CRaFT data
- 🎨 **Kleurgecodeerde score cards**
- 📱 **Responsive design**
- 🖨️ **Print-vriendelijk**

### Export Formaat

Het geëxporteerde CRaFT profiel bevat:
```json
{
  "organisation": "Naam",
  "overallImpactScore": 65,
  "craft": { "creativity": 70, "resilience": 60, ... },
  "esg": { "environmental": 60, "social": 70, ... },
  "neb": { "beautiful": 72, "sustainable": 63, ... }
}
```

### Documentatie

Volledige documentatie over het NEB Impact CRaFT model vind je in:
- `/NEB_IMPACT_CRAFT_DOCUMENTATIE.md`

## Technologie:
- React + TypeScript
- Tailwind CSS v4
- Recharts voor visualisatie
- localStorage voor data opslag
- Lucide React voor iconen

## Perplexity Space

Deze tool is gebaseerd op het NEB Impact CRaFT framework zoals beschreven in:
- https://www.perplexity.ai/spaces/craft-nDnRLoJsRZGhcResbuXhrA

---

© 2026 AHHA Vlaanderen

