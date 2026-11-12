import React, { useEffect, useRef, useState } from 'react';
import { OrganisationProfile, IndividualResponse, Dimension } from '../data/types';
import { ArrowLeft, Building2, UserPlus, Save, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { IndividualResponseWizard } from './IndividualResponseWizard';
import { ResponsesOverview } from './ResponsesOverview';
import { recalculateProfitData } from '../utils/calculateAverages';
import { profitDimensions } from '../data/profitDimensions';

interface ProfitProfileFormNewProps {
  onComplete: (profile: OrganisationProfile) => void;
  onBack: () => void;
}

type FormStep = 'organisation-info' | 'collect-responses' | 'add-response' | 'preview';

export const ProfitProfileFormNew: React.FC<ProfitProfileFormNewProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<FormStep>('organisation-info');
  
  // Organisatie metadata
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [industry, setIndustry] = useState('');
  const [year] = useState(new Date().getFullYear());
  
  // Individuele responses
  const [individualResponses, setIndividualResponses] = useState<IndividualResponse[]>([]);
  
  // Cross-over focus (optioneel)
  const [crossoverFocus, setCrossoverFocus] = useState<'hr' | 'leiderschap' | 'innovatie' | 'reputatie' | 'gemeenschap'>('hr');

  // Inline-melding i.p.v. browser-alert (die toont in de embed "een ingesloten pagina zegt...").
  const [formError, setFormError] = useState('');

  // Bij elke stapwissel het formulier zelf in beeld brengen. De invulstap
  // (IndividualResponseWizard) regelt dat zelf; daar is rootRef leeg.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const handleOrgInfoComplete = () => {
    if (!orgName.trim() || !orgType.trim()) {
      setFormError('Vul alle verplichte velden in.');
      return;
    }
    setFormError('');
    setStep('collect-responses');
  };

  const handleAddResponse = () => {
    setStep('add-response');
  };

  const handleResponseComplete = (response: IndividualResponse) => {
    setIndividualResponses(prev => [...prev, response]);
    setStep('collect-responses');
  };

  const handleDeleteResponse = (id: string) => {
    setIndividualResponses(prev => prev.filter(r => r.id !== id));
  };

  const handleFinalize = () => {
    if (individualResponses.length === 0) {
      setFormError('Voeg minstens één invuller toe voordat je het profiel opslaat.');
      return;
    }
    setFormError('');

    // Bereken gemiddelden
    const profitData = recalculateProfitData(individualResponses);

    // Maak het definitieve profiel
    const profile: OrganisationProfile = {
      id: `profit-${Date.now()}`,
      organisationType: 'profit',
      meta: {
        orgName: orgName.trim(),
        orgType: orgType.trim(),
        year,
        industry: industry.trim() || undefined,
        crossoverFocus,
      },
      dimensions: profitData.combinedDimensions,
      identitySummary: {
        toneOfVoice: [],
        visualKeywords: [],
      },
      profitData: {
        individualResponses,
        ...profitData,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onComplete(profile);
  };

  // Step 1: Organisatie informatie
  if (step === 'organisation-info') {
    return (
      <div ref={rootRef} className="min-h-screen bg-white p-8 scroll-mt-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug
          </button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-teal-600" />
                Organisatie Informatie
              </CardTitle>
              <CardDescription>
                Vul de basisgegevens van het bedrijf in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Organisatie naam */}
              <div className="space-y-2">
                <Label htmlFor="org-name">Organisatie naam *</Label>
                <Input
                  id="org-name"
                  placeholder="bijv. Acme Corporation"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>

              {/* Type bedrijf */}
              <div className="space-y-2">
                <Label htmlFor="org-type">Type bedrijf *</Label>
                <Input
                  id="org-type"
                  placeholder="bijv. Technologie bedrijf, Retail, Finance"
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                />
              </div>

              {/* Industrie */}
              <div className="space-y-2">
                <Label htmlFor="industry">Industrie (optioneel)</Label>
                <Input
                  id="industry"
                  placeholder="bijv. SaaS, E-commerce, Banking"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>

              {/* Cross-over focus */}
              <div className="space-y-2">
                <Label htmlFor="crossover">Cross-over focus</Label>
                <select
                  id="crossover"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={crossoverFocus}
                  onChange={(e) => setCrossoverFocus(e.target.value as any)}
                >
                  <option value="hr">HR & Talent</option>
                  <option value="leiderschap">Leiderschap</option>
                  <option value="innovatie">Innovatie</option>
                  <option value="reputatie">Reputatie</option>
                  <option value="gemeenschap">Gemeenschap</option>
                </select>
              </div>

              {/* Uitleg */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Volgende stap</h4>
                <p className="text-sm text-blue-800">
                  Na het invullen van deze informatie kun je meerdere personen de vragenlijst
                  laten invullen. Elke persoon vult zijn/haar naam in en geeft aan of ze tot de
                  directie of ander personeel behoren. Het eindresultaat is een gewogen gemiddelde
                  (directie 60%, personeel 40%).
                </p>
              </div>

              {formError && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {formError}
                </div>
              )}

              {/* Acties */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleOrgInfoComplete} size="lg">
                  Verder naar Vragenlijsten
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Responses verzamelen
  if (step === 'collect-responses') {
    return (
      <div ref={rootRef} className="min-h-screen bg-white p-8 scroll-mt-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStep('organisation-info')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug naar organisatie info
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-normal text-gray-900 mb-2">
              Responses verzamelen voor {orgName}
            </h1>
            <p className="text-gray-600">
              Voeg personen toe die de vragenlijst invullen. Minimaal één persoon is vereist.
            </p>
          </div>

          <div className="space-y-6">
            {formError && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {formError}
              </div>
            )}

            {/* Responses overzicht */}
            <ResponsesOverview
              responses={individualResponses}
              onAddResponse={handleAddResponse}
              onDeleteResponse={handleDeleteResponse}
            />

            {/* Finaliseren knop */}
            {individualResponses.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Profiel voltooien</h3>
                      <p className="text-sm text-gray-600">
                        {individualResponses.length} response(s) verzameld. Klik op voltooien om
                        het profiel op te slaan.
                      </p>
                    </div>
                    <Button onClick={handleFinalize} size="lg" className="bg-teal-600 hover:bg-teal-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Profiel Voltooien
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Response toevoegen
  if (step === 'add-response') {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <IndividualResponseWizard
            organisationName={orgName}
            dimensions={profitDimensions}
            onComplete={handleResponseComplete}
            onCancel={() => setStep('collect-responses')}
          />
        </div>
      </div>
    );
  }

  return null;
};
