# NEB Impact CRaFT Profiel - Documentatie

## Overzicht

Het **NEB Impact CRaFT Profiel** is een geïntegreerd analyse-instrument dat automatisch wordt gegenereerd voor culturele organisaties. Het combineert drie krachtige frameworks voor een holistische beoordeling van culturele impact:

## 📊 De Drie Frameworks

### 1. **CRaFT** - Organisatie Impact Dimensies

Het CRaFT model meet vier kerncompetenties van culturele organisaties:

#### **C - Creativity (Creativiteit)**
- **Wat het meet**: Innovatiekracht en creatieve experimenten
- **Berekening**: Gebaseerd op de "Innovatief ↔ Conservatief" as
- **Score 0-100**: Hoe hoger, hoe meer experimenteel en innovatief

#### **R - Resilience (Veerkracht)**
- **Wat het meet**: Organisatorische stabiliteit en aanpassingsvermogen
- **Berekening**: Gebaseerd op de "Disruptor ↔ Stabiliteit" as (omgekeerd)
- **Score 0-100**: Hoe hoger, hoe veerkrachtiger de organisatie

#### **F - Futures (Toekomstgerichtheid)**
- **Wat het meet**: Strategische toekomstvisie en vooruitziendheid
- **Berekening**: Gebaseerd op de "Erfgoed ↔ Toekomstgericht" as
- **Score 0-100**: Hoe hoger, hoe meer toekomstgericht

#### **T - Transformation (Transformatie)**
- **Wat het meet**: Transformatievermogen en maatschappelijke impact
- **Berekening**: Gemiddelde van "Activistisch ↔ Neutraal" en "Traditionele waarden ↔ Adaptief"
- **Score 0-100**: Hoe hoger, hoe meer transformatief

---

### 2. **ESG** - Maatschappelijke Impact

Het ESG model meet de duurzaamheids- en maatschappelijke impact:

#### **E - Environmental (Milieu)**
- **Wat het meet**: Milieubewustzijn en ecologische duurzaamheid
- **Berekening**: Gemiddelde van activistische houding en toekomstgerichtheid
- **Score 0-100**: Mate van ecologisch bewustzijn

#### **S - Social (Sociaal)**
- **Wat het meet**: Sociale impact en gemeenschapsbetrokkenheid
- **Berekening**: Gebaseerd op participatie en lokale verankering
- **Score 0-100**: Mate van sociale betrokkenheid

#### **G - Governance (Bestuur)**
- **Wat het meet**: Organisatiestructuur en transparantie
- **Berekening**: Gebaseerd op organisatorische stabiliteit
- **Score 0-100**: Mate van professioneel bestuur

---

### 3. **NEB** - New European Bauhaus

Het NEB model meet de kernwaarden van het New European Bauhaus initiatief:

#### **Beautiful (Schoonheid)**
- **Wat het meet**: Esthetische kwaliteit en culturele waarde
- **Berekening**: Gemiddelde van innovatie en specialisatie
- **Score 0-100**: Artistieke en culturele kwaliteit

#### **Sustainable (Duurzaam)**
- **Wat het meet**: Duurzame praktijken en langetermijnvisie
- **Berekening**: Gemiddelde van activisme en stabiliteit
- **Score 0-100**: Duurzaamheid van activiteiten

#### **Together (Samen)**
- **Wat het meet**: Inclusiviteit en gemeenschapsvorming
- **Berekening**: Gemiddelde van participatie en aanpassingsvermogen
- **Score 0-100**: Mate van inclusiviteit

---

## 🎯 Overall Impact Score

De **Overall Impact Score** is het gemiddelde van alle drie frameworks:

```
Overall Impact = (CRaFT gemiddelde + ESG gemiddelde + NEB gemiddelde) / 3
```

Deze score geeft een holistische beoordeling van de totale impact van de culturele organisatie op een schaal van 0-100.

---

## 📈 Visualisatie

Het profiel wordt gevisualiseerd met:
- **3 Radar Charts**: Eén voor elk framework (CRaFT, ESG, NEB)
- **Gedetailleerde Score Cards**: Met iconen en progress bars
- **Impact Samenvatting**: Overzicht van gemiddelde scores

---

## 💾 Export Functionaliteit

Het CRaFT profiel kan geëxporteerd worden als JSON bestand met:
- Alle CRaFT, ESG en NEB scores
- Overall Impact Score
- Originele dimensie data voor referentie
- AHHA metadata en timestamp

### Export Bestandsstructuur

```json
{
  "organisation": "Organisatie naam",
  "exportedBy": "AHHA Vlaanderen - NEB Impact CRaFT Tool",
  "exportedAt": "2026-02-21T...",
  "overallImpactScore": 65,
  "craft": {
    "creativity": 70,
    "resilience": 60,
    "futures": 75,
    "transformation": 55,
    "average": 65
  },
  "esg": {
    "environmental": 60,
    "social": 70,
    "governance": 65,
    "average": 65
  },
  "neb": {
    "beautiful": 72,
    "sustainable": 63,
    "together": 68,
    "average": 68
  },
  "rawDimensions": [...]
}
```

---

## 🔄 Automatische Berekening

Het CRaFT profiel wordt **automatisch** gegenereerd zodra een culturele organisatie:
1. Het organisatieprofiel invult
2. Alle dimensies en assen scoort
3. Naar de "Bekijk Profiel" tab navigeert

Er is **geen extra input** nodig - het systeem mapt de bestaande data intelligent naar de CRaFT, ESG en NEB frameworks.

---

## 🎨 Gebruik voor Matching

Het CRaFT profiel kan gebruikt worden om:
- **Impact te meten** van culturele organisaties
- **Matches te maken** met bedrijven die vergelijkbare ESG doelen hebben
- **Rapportages te genereren** voor stakeholders en fondsen
- **Strategische beslissingen** te ondersteunen

---

## 📚 Bronnen

- **New European Bauhaus**: https://new-european-bauhaus.europa.eu/
- **ESG Framework**: Environmental, Social, Governance rapportage standaard
- **CRaFT Model**: Creativity, Resilience, Futures, Transformation framework voor culturele sector

---

## 🔗 Contact

Voor vragen over het NEB Impact CRaFT model:
- **Website**: https://www.ahha.vlaanderen
- **Tool**: AHHA Profiel Matching Tool

---

© 2026 AHHA Vlaanderen - NEB Impact CRaFT Tool v1.0
