import React, { useEffect, useRef, useState } from 'react';
import { OrganisationProfile, Dimension, Axis } from '../data/types';
import { ArrowLeft, Download, Save } from 'lucide-react';

interface CulturalProfileFormProps {
  onComplete: (profile: OrganisationProfile) => void;
  onBack: () => void;
}

export const CulturalProfileForm: React.FC<CulturalProfileFormProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [crossoverFocus, setCrossoverFocus] = useState<'gemeenschap' | 'innovatie' | 'onderwijs'>('gemeenschap');

  // Scores opslaan — initialiseer met 50 zodat niet-aangeraakte sliders ook geldig zijn
  const culturalDimensions = [
    {
      id: 'artistic',
      label: 'Artistieke Positie',
      description: 'Hoe positioneert je organisatie zich artistiek?',
      axes: [
        { id: 'experimental_vs_traditioneel', label: 'Vernieuwing', helpText: 'Zoekt je organisatie actief naar nieuwe artistieke vormen en experimenten, of bouw je verder op beproefde, meer klassieke of gekende recepten?', left: 'Vernieuwing en experiment', right: 'Beproefde concepten' },
        { id: 'niche_vs_breed', label: 'Doelgroep', helpText: 'Richt je aanbod zich op ingewijden en liefhebbers met voorkennis, of op een breed en divers publiek?', left: 'Voorkennis', right: 'Breed publiek' }
      ]
    },
    {
      id: 'audience',
      label: 'Publiek & Gemeenschap',
      description: 'Wie bereik je en hoe?',
      axes: [
        { id: 'lokaal_vs_internationaal', label: 'Bereik', helpText: 'Komt je publiek vooral uit de eigen regio of gemeente, of trekt je organisatie bezoekers aan van buiten de regio of uit het buitenland?', left: 'Lokaal', right: 'Bovenlokaal/internationaal' },
        { id: 'participatief_vs_presentatie', label: 'Participatie', helpText: 'Neemt je publiek actief deel aan het creatieve proces, bijvoorbeeld via co-creatie of workshops, of is het vooral toeschouwer?', left: 'Participatief', right: 'Toeschouwer' }
      ]
    },
    {
      id: 'organization',
      label: 'Organisatie & Werking',
      description: 'Hoe werkt je organisatie intern?',
      axes: [
        { id: 'agile_vs_stable', label: 'Flexibiliteit', helpText: 'Hoe wendbaar reageert je organisatie op veranderingen en nieuwe kansen: vooral volgens vaste plannen en procedures, of door snel bij te sturen?', left: 'Vaste procedures', right: 'Snel bijsturen' },
        { id: 'digital_vs_analog', label: 'Digitaal', helpText: 'In welke mate zet je organisatie in op digitale tools en digitale producten of belevingen? Online communicatie telt hier niet mee.', left: 'Digitale productie', right: 'Klassieke beleving' },
        { id: 'learning_score', label: 'Ontwikkeling', helpText: 'Hoeveel ruimte krijgen medewerkers voor interne groei, opleiding en leren?', left: 'Normale vorming/ontwikkeling', right: 'Veel vorming/ontwikkeling' },
        { id: 'collaboration_score', label: 'Teamcultuur', helpText: 'Hoe wordt er intern samengewerkt: vooral individueel of per afdeling, of sterk in teams en over afdelingen heen?', left: "Individueel/silo's", right: 'Over teams en afdelingen heen' },
        { id: 'autonomy_score', label: 'Autonomie', helpText: 'In welke mate kunnen medewerkers zelfstandig beslissingen nemen binnen een kader van basisregels?', left: 'Weinig beslissingsruimte', right: 'Veel autonomie' },
        { id: 'hierarchy_score', label: 'Organisatiestructuur', helpText: 'Verloopt de besluitvorming via een vlakke structuur, of via duidelijke hiërarchische lijnen?', left: 'Vlakke besluitvorming/structuur', right: 'Getrapt, hiërarchisch' },
        { id: 'communication_score', label: 'Openheid', helpText: 'Hoe open wordt er intern gecommuniceerd over strategie, financiën en beslissingen?', left: 'Eerder gesloten', right: 'Zeer open communicatiecultuur' }
      ]
    },
    {
      id: 'identity',
      label: 'Culturele Identiteit',
      description: 'Wat is de identiteit van je organisatie?',
      axes: [
        { id: 'roots_vs_hybride', label: 'Traditie ↔ Vernieuwing', helpText: 'Bouwt je organisatie verder op gevestigde culturele tradities en waarden, of zoek je bewust naar vernieuwing, kruisbestuiving en hybride vormen?', left: 'Traditie', right: 'Vernieuwing' },
        { id: 'erfgoed_vs_future', label: 'Erfgoed ↔ Toekomstgericht', helpText: 'Ligt de focus op het bewaren en doorgeven van cultureel erfgoed, of op het verkennen van nieuwe mogelijkheden en toekomstvisie?', left: 'Erfgoed', right: 'Toekomstgericht' }
      ]
    }
  ];

  const defaultScores: {[key: string]: number} = {};
  culturalDimensions.forEach(d => d.axes.forEach(a => { defaultScores[a.id] = 50; }));

  const [scores, setScores] = useState<{[key: string]: number}>(defaultScores);
  const [descriptions, setDescriptions] = useState<{[key: string]: string}>({});
  // Houdt bij welke schuifjes de gebruiker echt aanraakte. De visuele default
  // blijft 50 (het schuifje moet ergens staan), maar een onaangeroerd schuifje
  // telt niet als beantwoord — zo kan je niet doorklikken zonder iets te plaatsen.
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  // Inline-foutmelding i.p.v. een browser-alert (die toont in een iframe de
  // storende "een ingesloten pagina zegt..."-chrome).
  const [formError, setFormError] = useState('');

  // Bij elke stapwissel het formulier zelf in beeld brengen — niet de paginatop,
  // anders moet de invuller na "Volgende" weer naar beneden scrollen.
  const formTopRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentStep]);

  const totalSteps = 1 + culturalDimensions.length; // Meta info + dimensies

  const handleScoreChange = (axisId: string, value: number) => {
    setScores(prev => ({ ...prev, [axisId]: value }));
    setTouched(prev => ({ ...prev, [axisId]: true }));
    setFormError('');
  };

  const handleDescriptionChange = (axisId: string, value: string) => {
    setDescriptions(prev => ({ ...prev, [axisId]: value }));
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!orgName || !orgType) {
        setFormError('Vul alle velden in om verder te gaan.');
        return;
      }
    } else {
      const dim = culturalDimensions[currentStep - 1];
      if (dim && dim.axes.some(a => !touched[a.id])) {
        setFormError('Beweeg elk schuifje op deze pagina voordat je verdergaat.');
        return;
      }
    }
    setFormError('');
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrevious = () => {
    setFormError('');
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    // Validatie: alle scores moeten ingevuld zijn
    const requiredAxes = culturalDimensions.flatMap(d => d.axes.map(a => a.id));
    const missingScores = requiredAxes.filter(id => !touched[id]);

    if (missingScores.length > 0) {
      setFormError('Nog niet alle vragen zijn beantwoord. Beweeg elk schuifje voordat je het profiel aanmaakt.');
      return;
    }

    // Bouw het profiel
    const dimensions: Dimension[] = culturalDimensions.map(dim => ({
      id: dim.id,
      label: dim.label,
      axes: dim.axes.map(axis => ({
        id: axis.id,
        label: axis.label,
        score: scores[axis.id] || 50,
        description: descriptions[axis.id] || '',
        identityWords: []
      }))
    }));

    const profile: OrganisationProfile = {
      id: `custom-${Date.now()}`,
      organisationType: 'cultural',
      meta: {
        orgName,
        orgType,
        year: new Date().getFullYear(),
        crossoverFocus
      },
      dimensions,
      identitySummary: {
        toneOfVoice: [],
        visualKeywords: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onComplete(profile);
  };

  const handleExport = () => {
    const dimensions: Dimension[] = culturalDimensions.map(dim => ({
      id: dim.id,
      label: dim.label,
      axes: dim.axes.map(axis => ({
        id: axis.id,
        label: axis.label,
        score: scores[axis.id] || 50,
        description: descriptions[axis.id] || '',
        identityWords: []
      }))
    }));

    const profile: OrganisationProfile = {
      id: `custom-${Date.now()}`,
      organisationType: 'cultural',
      meta: {
        orgName: orgName || 'Onbekend',
        orgType: orgType || 'Onbekend',
        year: new Date().getFullYear(),
        crossoverFocus
      },
      dimensions,
      identitySummary: {
        toneOfVoice: [],
        visualKeywords: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(profile, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${orgName || 'profiel'}-${Date.now()}.json`;
    link.click();
  };

  // Step 0: Meta informatie
  if (currentStep === 0) {
    return (
      <div ref={formTopRef} className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 scroll-mt-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug naar type selectie
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Organisatie Informatie</h2>
                <span className="text-sm text-gray-500">Stap 1 van {totalSteps}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Naam van de organisatie *
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Bijv. Theater aan Zee"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type organisatie *
                </label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">Kies een type…</option>
                  <option value="Podiumkunsten (theater/dans)">Podiumkunsten (theater/dans)</option>
                  <option value="Muziek / concerten">Muziek / concerten</option>
                  <option value="Festival">Festival</option>
                  <option value="Museum">Museum</option>
                  <option value="Erfgoed">Erfgoed</option>
                  <option value="Beeldende kunst">Beeldende kunst</option>
                  <option value="Film / audiovisueel">Film / audiovisueel</option>
                  <option value="Literatuur / letteren">Literatuur / letteren</option>
                  <option value="Bibliotheek">Bibliotheek</option>
                  <option value="Sociaal-cultureel werk">Sociaal-cultureel werk</option>
                  <option value="Kunsteducatie">Kunsteducatie</option>
                  <option value="Andere">Andere</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Crossover Focus
                </label>
                <select
                  value={crossoverFocus}
                  onChange={(e) => setCrossoverFocus(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="gemeenschap">Gemeenschap</option>
                  <option value="innovatie">Innovatie</option>
                  <option value="onderwijs">Onderwijs</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={handleNext}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Volgende
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dimensie stappen
  const dimensionIndex = currentStep - 1;
  const currentDimension = culturalDimensions[dimensionIndex];

  return (
    <div ref={formTopRef} className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 scroll-mt-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar type selectie
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{currentDimension.label}</h2>
              <span className="text-sm text-gray-500">Stap {currentStep + 1} van {totalSteps}</span>
            </div>
            <p className="text-gray-600 mb-4">{currentDimension.description}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-8">
            {currentDimension.axes.map((axis) => (
              <div key={axis.id} className="border-b border-gray-200 pb-6 last:border-0">
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  {axis.label}
                </label>
                <p className="text-sm text-gray-600 mb-4">{axis.helpText}</p>

                <div className="space-y-4">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scores[axis.id] ?? 50}
                      onChange={(e) => handleScoreChange(axis.id, parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-purple-200 via-gray-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{axis.left}</span>
                      <span>{axis.right}</span>
                    </div>
                    {!touched[axis.id] && (
                      <p className="text-xs text-amber-600 mt-1">Nog niet beantwoord — beweeg het schuifje.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toelichting (optioneel)
                    </label>
                    <textarea
                      value={descriptions[axis.id] || ''}
                      onChange={(e) => handleDescriptionChange(axis.id, e.target.value)}
                      placeholder="Licht je keuze toe..."
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formError && (
            <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {formError}
            </div>
          )}

          <div className="flex justify-between items-center gap-3 mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              className="text-gray-600 hover:text-gray-900 px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Vorige
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                <Download className="w-5 h-5" />
                Exporteren
              </button>

              {currentStep < totalSteps - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Volgende
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <Save className="w-5 h-5" />
                  Profiel Opslaan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
