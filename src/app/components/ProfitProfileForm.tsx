import React, { useState } from 'react';
import { OrganisationProfile, Dimension } from '../data/types';
import { ArrowLeft, Download, Save, Users, UserCircle } from 'lucide-react';

interface ProfitProfileFormProps {
  onComplete: (profile: OrganisationProfile) => void;
  onBack: () => void;
}

type FormPhase = 'meta' | 'choice' | 'leadership' | 'staff' | 'preview';

export const ProfitProfileForm: React.FC<ProfitProfileFormProps> = ({ onComplete, onBack }) => {
  const [currentPhase, setCurrentPhase] = useState<FormPhase>('meta');
  const [currentStep, setCurrentStep] = useState(0);
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [industry, setIndustry] = useState('');

  const profitDimensions = [
    {
      id: 'innovation',
      label: 'Creativiteit & Innovatie',
      description: 'Hoe innoverend is uw bedrijf?',
      axes: [
        { id: 'innovation_score', label: 'Innovatiegraad', helpText: 'Hoe innovatief is uw organisatie?' },
        { id: 'risk_taking_score', label: 'Risico Bereidheid', helpText: 'Hoe risicogeneigd is uw bedrijf?' }
      ]
    },
    {
      id: 'market',
      label: 'Markt & Doelgroep',
      description: 'Wie zijn uw klanten en stakeholders?',
      axes: [
        { id: 'market_reach', label: 'Marktbereik', helpText: 'Lokaal, nationaal of internationaal?' },
        { id: 'customer_focus', label: 'Klantgerichtheid', helpText: 'Hoe centraal staat de klant?' }
      ]
    },
    {
      id: 'process',
      label: 'Proces & Structuur',
      description: 'Hoe werkt uw organisatie?',
      axes: [
        { id: 'agility_score', label: 'Wendbaarheid', helpText: 'Hoe flexibel en wendbaar?' },
        { id: 'digital_score', label: 'Digitale Transformatie', helpText: 'Hoe digitaal is uw organisatie?' },
        { id: 'learning_score', label: 'Leren & Ontwikkeling', helpText: 'Investering in ontwikkeling?' },
        { id: 'collaboration_score', label: 'Samenwerkingscultuur', helpText: 'Hoe samenwerkingsgericht?' },
        { id: 'autonomy_score', label: 'Autonomie', helpText: 'Hoeveel autonomie hebben teams?' },
        { id: 'hierarchy_score', label: 'Besluitvormingsstructuur', helpText: 'Plat of hiërarchisch?' },
        { id: 'communication_score', label: 'Communicatie', helpText: 'Hoe open en transparant?' }
      ]
    },
    {
      id: 'identity',
      label: 'Merkidentiteit',
      description: 'Wat is de identiteit van uw merk?',
      axes: [
        { id: 'tradition_vs_modern', label: 'Traditie ↔ Modern', helpText: 'Traditioneel of modern?' },
        { id: 'heritage_vs_future', label: 'Erfgoed ↔ Toekomst', helpText: 'Focus op historie of toekomst?' }
      ]
    },
    {
      id: 'sustainability',
      label: 'Duurzaamheid & Impact',
      description: 'Wat is uw maatschappelijke impact?',
      axes: [
        { id: 'sustainability_score', label: 'Duurzaamheid', helpText: 'Hoe duurzaam is uw organisatie?' },
        { id: 'social_impact_score', label: 'Sociale Impact', helpText: 'Welke maatschappelijke impact?' },
        { id: 'community_engagement', label: 'Gemeenschapsbetrokkenheid', helpText: 'Betrokkenheid bij gemeenschap?' }
      ]
    }
  ];

  const defaultProfitScores: {[key: string]: number} = {};
  profitDimensions.forEach(d => d.axes.forEach(a => { defaultProfitScores[a.id] = 50; }));

  // Leadership scores (60% weging)
  const [leadershipScores, setLeadershipScores] = useState<{[key: string]: number}>(defaultProfitScores);
  const [leadershipDescriptions, setLeadershipDescriptions] = useState<{[key: string]: string}>({});

  // Staff scores (40% weging)
  const [staffScores, setStaffScores] = useState<{[key: string]: number}>(defaultProfitScores);
  const [staffDescriptions, setStaffDescriptions] = useState<{[key: string]: string}>({});

  const totalDimensionSteps = profitDimensions.length;

  const handleScoreChange = (axisId: string, value: number) => {
    if (currentPhase === 'leadership') {
      setLeadershipScores(prev => ({ ...prev, [axisId]: value }));
    } else if (currentPhase === 'staff') {
      setStaffScores(prev => ({ ...prev, [axisId]: value }));
    }
  };

  const handleDescriptionChange = (axisId: string, value: string) => {
    if (currentPhase === 'leadership') {
      setLeadershipDescriptions(prev => ({ ...prev, [axisId]: value }));
    } else if (currentPhase === 'staff') {
      setStaffDescriptions(prev => ({ ...prev, [axisId]: value }));
    }
  };

  const handleNext = () => {
    if (currentPhase === 'meta') {
      if (!orgName || !orgType) {
        alert('Vul alle verplichte velden in om verder te gaan');
        return;
      }
      // Go to choice screen
      setCurrentPhase('choice');
    } else if (currentPhase === 'choice') {
      // This is handled by the choice buttons directly
      setCurrentStep(0);
    } else if (currentPhase === 'leadership') {
      if (currentStep < totalDimensionSteps - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Validate leadership responses
        const requiredAxes = profitDimensions.flatMap(d => d.axes.map(a => a.id));
        const missingScores = requiredAxes.filter(id => leadershipScores[id] === undefined);
        
        if (missingScores.length > 0) {
          alert('Vul alle vragen in voordat u doorgaat.');
          return;
        }
        
        // Go back to choice screen so user can choose to fill staff or go to preview
        setCurrentPhase('choice');
      }
    } else if (currentPhase === 'staff') {
      if (currentStep < totalDimensionSteps - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Validate staff responses
        const requiredAxes = profitDimensions.flatMap(d => d.axes.map(a => a.id));
        const missingScores = requiredAxes.filter(id => staffScores[id] === undefined);
        
        if (missingScores.length > 0) {
          alert('Vul alle vragen in voordat u doorgaat.');
          return;
        }
        
        // Go back to choice screen
        setCurrentPhase('choice');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (currentPhase === 'leadership') {
      setCurrentPhase('choice');
    } else if (currentPhase === 'staff') {
      setCurrentPhase('choice');
    } else if (currentPhase === 'preview') {
      setCurrentPhase('choice');
    }
  };

  const handlePhaseChoice = (phase: 'leadership' | 'staff') => {
    setCurrentPhase(phase);
    setCurrentStep(0);
  };

  const calculateWeightedScore = (axisId: string): number => {
    const leadershipScore = leadershipScores[axisId] ?? 50;
    const staffScore = staffScores[axisId] ?? 50;
    return Math.round(leadershipScore * 0.6 + staffScore * 0.4);
  };

  const handleSubmit = () => {
    // Build leadership dimensions
    const leadershipDimensions: Dimension[] = profitDimensions.map(dim => ({
      id: dim.id,
      label: dim.label,
      axes: dim.axes.map(axis => ({
        id: axis.id,
        label: axis.label,
        score: leadershipScores[axis.id] || 50,
        description: leadershipDescriptions[axis.id] || '',
        identityWords: []
      }))
    }));

    // Build staff dimensions
    const staffDimensions: Dimension[] = profitDimensions.map(dim => ({
      id: dim.id,
      label: dim.label,
      axes: dim.axes.map(axis => ({
        id: axis.id,
        label: axis.label,
        score: staffScores[axis.id] || 50,
        description: staffDescriptions[axis.id] || '',
        identityWords: []
      }))
    }));

    // Build combined dimensions (60/40 weighting)
    const combinedDimensions: Dimension[] = profitDimensions.map(dim => ({
      id: dim.id,
      label: dim.label,
      axes: dim.axes.map(axis => ({
        id: axis.id,
        label: axis.label,
        score: calculateWeightedScore(axis.id),
        description: `Leadership: ${leadershipDescriptions[axis.id] || 'Geen toelichting'}. Personeel: ${staffDescriptions[axis.id] || 'Geen toelichting'}`,
        identityWords: []
      }))
    }));

    const profile: OrganisationProfile = {
      id: `custom-profit-${Date.now()}`,
      organisationType: 'profit',
      meta: {
        orgName,
        orgType,
        industry,
        year: new Date().getFullYear()
      },
      dimensions: combinedDimensions,
      identitySummary: {
        toneOfVoice: [],
        visualKeywords: []
      },
      profitData: {
        leadershipResponses: leadershipDimensions,
        staffResponses: staffDimensions,
        combinedDimensions: combinedDimensions
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onComplete(profile);
  };

  const handleExport = () => {
    const leadershipDimensions: Dimension[] = profitDimensions.map(dim => ({
      id: dim.id,
      label: dim.label,
      axes: dim.axes.map(axis => ({
        id: axis.id,
        label: axis.label,
        score: leadershipScores[axis.id] || 50,
        description: leadershipDescriptions[axis.id] || '',
        identityWords: []
      }))
    }));

    const staffDimensions: Dimension[] = profitDimensions.map(dim => ({
      id: dim.id,
      label: dim.label,
      axes: dim.axes.map(axis => ({
        id: axis.id,
        label: axis.label,
        score: staffScores[axis.id] || 50,
        description: staffDescriptions[axis.id] || '',
        identityWords: []
      }))
    }));

    const combinedDimensions: Dimension[] = profitDimensions.map(dim => ({
      id: dim.id,
      label: dim.label,
      axes: dim.axes.map(axis => ({
        id: axis.id,
        label: axis.label,
        score: calculateWeightedScore(axis.id),
        description: '',
        identityWords: []
      }))
    }));

    const profile: OrganisationProfile = {
      id: `custom-profit-${Date.now()}`,
      organisationType: 'profit',
      meta: {
        orgName: orgName || 'Onbekend',
        orgType: orgType || 'Onbekend',
        industry,
        year: new Date().getFullYear()
      },
      dimensions: combinedDimensions,
      identitySummary: {
        toneOfVoice: [],
        visualKeywords: []
      },
      profitData: {
        leadershipResponses: leadershipDimensions,
        staffResponses: staffDimensions,
        combinedDimensions: combinedDimensions
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

  // Meta information step
  if (currentPhase === 'meta') {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug
          </button>

          <div className="border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-normal text-gray-900 mb-2">Bedrijfsinformatie</h2>
              <div className="w-16 h-0.5 bg-teal-600"></div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Naam van het bedrijf *
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Bijv. Acme Corporation"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-teal-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Type bedrijf *
                </label>
                <input
                  type="text"
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  placeholder="Bijv. Technologie, Retail, Finance"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-teal-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Sector/Industrie (optioneel)
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Bijv. Software, Verzekeringen, Mobiliteit"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-teal-600 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                className="bg-teal-600 text-white px-8 py-3 hover:bg-teal-700 transition-colors"
              >
                Volgende Stap
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Choice step - Choose between leadership or staff questionnaire
  if (currentPhase === 'choice') {
    const hasLeadershipData = Object.keys(leadershipScores).length > 0;
    const hasStaffData = Object.keys(staffScores).length > 0;
    const canGoToPreview = hasLeadershipData || hasStaffData;

    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setCurrentPhase('meta')}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug naar bedrijfsinformatie
          </button>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-normal text-gray-900 mb-4">
              Kies uw rol
            </h2>
            <div className="w-24 h-0.5 bg-teal-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Voor een compleet profiel hebben we twee perspectieven nodig. 
              Kies welke enquête u wilt invullen{hasLeadershipData || hasStaffData ? ' of aanpassen' : ''}.
              {!hasLeadershipData && !hasStaffData && (
                <strong className="text-gray-900"> U kunt later ook de andere enquête invullen.</strong>
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Leadership Card */}
            <button
              onClick={() => handlePhaseChoice('leadership')}
              className={`bg-white border-2 p-8 hover:shadow-lg transition-all text-left group relative ${
                hasLeadershipData 
                  ? 'border-teal-600 bg-teal-50/30' 
                  : 'border-gray-200 hover:border-teal-600'
              }`}
            >
              {hasLeadershipData && (
                <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 text-xs font-medium">
                  ✓ Ingevuld
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 border-2 transition-colors ${
                  hasLeadershipData 
                    ? 'bg-teal-100 border-teal-300' 
                    : 'bg-teal-50 border-teal-200 group-hover:bg-teal-100'
                }`}>
                  <UserCircle className="w-10 h-10 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-normal text-gray-900 mb-1">Directie</h3>
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium">
                    60% weging
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Voor leidinggevenden, managers en directieleden die strategische beslissingen nemen.
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5"></div>
                  <span>Strategische visie op organisatie</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5"></div>
                  <span>Lange termijn doelstellingen</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5"></div>
                  <span>Organisatiecultuur en waarden</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-gray-200">
                <span className="text-teal-600 font-medium group-hover:underline">
                  {hasLeadershipData ? 'Aanpassen / Opnieuw invullen →' : 'Start Directie Enquête →'}
                </span>
              </div>
            </button>

            {/* Staff Card */}
            <button
              onClick={() => handlePhaseChoice('staff')}
              className={`bg-white border-2 p-8 hover:shadow-lg transition-all text-left group relative ${
                hasStaffData 
                  ? 'border-teal-600 bg-teal-50/30' 
                  : 'border-gray-200 hover:border-teal-600'
              }`}
            >
              {hasStaffData && (
                <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 text-xs font-medium">
                  ✓ Ingevuld
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 border-2 transition-colors ${
                  hasStaffData 
                    ? 'bg-teal-100 border-teal-300' 
                    : 'bg-teal-50 border-teal-200 group-hover:bg-teal-100'
                }`}>
                  <Users className="w-10 h-10 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-normal text-gray-900 mb-1">Personeel</h3>
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium">
                    40% weging
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Voor medewerkers die dagelijks de organisatiewaarden ervaren en in praktijk brengen.
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5"></div>
                  <span>Dagelijkse werkervaring</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5"></div>
                  <span>Praktische toepassing waarden</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-1.5"></div>
                  <span>Werkvloer perspectief</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-gray-200">
                <span className="text-teal-600 font-medium group-hover:underline">
                  {hasStaffData ? 'Aanpassen / Opnieuw invullen →' : 'Start Personeel Enquête →'}
                </span>
              </div>
            </button>
          </div>

          {/* Preview Button - Only show if at least one questionnaire is complete */}
          {canGoToPreview && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setCurrentPhase('preview')}
                className="bg-teal-600 text-white px-12 py-4 hover:bg-teal-700 transition-colors text-lg font-medium"
              >
                Bekijk Profiel Preview
              </button>
              {hasLeadershipData && hasStaffData && (
                <p className="text-sm text-green-600 mt-3 font-medium">
                  ✓ Beide enquêtes zijn ingevuld - Profiel is compleet!
                </p>
              )}
              {(hasLeadershipData && !hasStaffData) && (
                <p className="text-sm text-amber-600 mt-3">
                  Alleen directie-enquête ingevuld. Voor een compleet profiel vul ook de personeel-enquête in.
                </p>
              )}
              {(!hasLeadershipData && hasStaffData) && (
                <p className="text-sm text-amber-600 mt-3">
                  Alleen personeel-enquête ingevuld. Voor een compleet profiel vul ook de directie-enquête in.
                </p>
              )}
            </div>
          )}

          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-teal-50 border border-teal-200 p-6">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                Waarom twee perspectieven?
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Een organisatieprofiel is het meest accuraat wanneer het zowel het strategische perspectief 
                van de directie (60%) als het operationele perspectief van het personeel (40%) weerspiegelt. 
                Dit geeft een compleet en gebalanceerd beeld van uw organisatie.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preview step
  if (currentPhase === 'preview') {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setCurrentPhase('choice')}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug naar keuze
          </button>

          <div className="border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-normal text-gray-900 mb-2">Profiel Preview</h2>
              <div className="w-16 h-0.5 bg-teal-600 mb-4"></div>
              <p className="text-gray-600">
                Gewogen resultaat: <strong>60% Directie</strong> + <strong>40% Personeel</strong>
              </p>
            </div>

            <div className="space-y-8">
              {profitDimensions.map((dimension) => (
                <div key={dimension.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{dimension.label}</h3>
                  <div className="space-y-4">
                    {dimension.axes.map((axis) => {
                      const leadershipScore = leadershipScores[axis.id] ?? 50;
                      const staffScore = staffScores[axis.id] ?? 50;
                      const weightedScore = calculateWeightedScore(axis.id);

                      return (
                        <div key={axis.id} className="bg-gray-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{axis.label}</span>
                            <span className="text-2xl font-light text-teal-600">{weightedScore}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <UserCircle className="w-4 h-4" />
                              <span>Directie: {leadershipScore}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>Personeel: {staffScore}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                className="text-gray-600 hover:text-gray-900 px-6 py-3 transition-colors"
              >
                Vorige
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 hover:border-teal-600 hover:text-teal-600 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Exporteren
                </button>

                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 hover:bg-teal-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Profiel Opslaan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Questionnaire steps (leadership or staff)
  const currentDimension = profitDimensions[currentStep];
  const isLeadership = currentPhase === 'leadership';
  const currentScores = isLeadership ? leadershipScores : staffScores;
  const phaseLabel = isLeadership ? 'Directie' : 'Personeel';
  const PhaseIcon = isLeadership ? UserCircle : Users;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug
        </button>

        <div className="border border-gray-200 p-8">
          {/* Phase indicator */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <PhaseIcon className="w-6 h-6 text-teal-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{phaseLabel} Enquête</h3>
              <p className="text-sm text-gray-600">
                {isLeadership ? '60% weging in finaal profiel' : '40% weging in finaal profiel'}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-normal text-gray-900">{currentDimension.label}</h2>
              <span className="text-sm text-gray-500">
                Stap {currentStep + 1} / {totalDimensionSteps}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{currentDimension.description}</p>
            <div className="w-full bg-gray-200 h-0.5">
              <div
                className="bg-teal-600 h-0.5 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalDimensionSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {currentDimension.axes.map((axis) => (
              <div key={axis.id} className="border-b border-gray-200 pb-6 last:border-0">
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  {axis.label}
                </label>
                <p className="text-sm text-gray-600 mb-4">{axis.helpText}</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Score: {currentScores[axis.id] ?? 50}/100
                      </span>
                      <span className="text-xs text-gray-500">0 = Laag | 100 = Hoog</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentScores[axis.id] ?? 50}
                      onChange={(e) => handleScoreChange(axis.id, parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 appearance-none cursor-pointer slider-red"
                      style={{
                        background: `linear-gradient(to right, #DC2626 0%, #DC2626 ${currentScores[axis.id] ?? 50}%, #e5e5e5 ${currentScores[axis.id] ?? 50}%, #e5e5e5 100%)`
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toelichting (optioneel)
                    </label>
                    <textarea
                      value={(isLeadership ? leadershipDescriptions : staffDescriptions)[axis.id] || ''}
                      onChange={(e) => handleDescriptionChange(axis.id, e.target.value)}
                      placeholder="Licht uw keuze toe..."
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-teal-600 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              className="text-gray-600 hover:text-gray-900 px-6 py-3 transition-colors"
            >
              Vorige
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 hover:border-teal-600 hover:text-teal-600 transition-colors"
              >
                <Download className="w-5 h-5" />
                Exporteren
              </button>

              <button
                onClick={handleNext}
                className="bg-teal-600 text-white px-8 py-3 hover:bg-teal-700 transition-colors"
              >
                {currentStep < totalDimensionSteps - 1 ? 'Volgende' : 
                  (isLeadership ? 'Start Personeel Enquête' : 'Bekijk Preview')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
