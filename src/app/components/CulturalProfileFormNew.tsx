import React, { useEffect, useRef, useState } from 'react';
import { OrganisationProfile, IndividualResponse } from '../data/types';
import { ArrowLeft, Building2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { IndividualResponseWizard } from './IndividualResponseWizard';
import { ResponsesOverview } from './ResponsesOverview';
import { combineByRoleWeights } from '../utils/calculateAverages';
import { culturalDimensions, CULTURAL_ORG_TYPES } from '../data/culturalDimensions';
import { CULTURAL_ROLES, CULTURAL_ROLE_WEIGHTS } from '../data/respondentRoles';

interface CulturalProfileFormNewProps {
  onComplete: (profile: OrganisationProfile) => void;
  onBack: () => void;
}

type FormStep = 'organisation-info' | 'collect-responses' | 'add-response';
type CrossoverFocus = NonNullable<OrganisationProfile['meta']['crossoverFocus']>;

// Culturele organisatie met meerdere invullers (directie, bestuur, medewerker,
// vrijwilliger). Het profiel is een gewogen gemiddelde per rol; die weging staat
// in respondentRoles.ts en wordt bewust nergens in de tool getoond.
export const CulturalProfileFormNew: React.FC<CulturalProfileFormNewProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<FormStep>('organisation-info');
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [crossoverFocus, setCrossoverFocus] = useState<CrossoverFocus>('gemeenschap');
  const [individualResponses, setIndividualResponses] = useState<IndividualResponse[]>([]);
  const [formError, setFormError] = useState('');

  // Bij elke stapwissel het formulier zelf in beeld brengen. De invulstap
  // (IndividualResponseWizard) regelt dat zelf; daar is rootRef leeg.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const handleOrgInfoComplete = () => {
    if (!orgName.trim() || !orgType) {
      setFormError('Vul de naam en het type van je organisatie in.');
      return;
    }
    setFormError('');
    setStep('collect-responses');
  };

  const handleResponseComplete = (response: IndividualResponse) => {
    setIndividualResponses((prev) => [...prev, response]);
    setStep('collect-responses');
  };

  const handleDeleteResponse = (id: string) => {
    setIndividualResponses((prev) => prev.filter((r) => r.id !== id));
  };

  const handleFinalize = () => {
    if (individualResponses.length === 0) {
      setFormError('Voeg minstens één invuller toe voordat je het profiel opslaat.');
      return;
    }
    setFormError('');

    const { roleAverages, combinedDimensions } = combineByRoleWeights(
      individualResponses,
      CULTURAL_ROLE_WEIGHTS
    );

    const now = new Date().toISOString();
    const profile: OrganisationProfile = {
      id: `cultural-${Date.now()}`,
      organisationType: 'cultural',
      meta: {
        orgName: orgName.trim(),
        orgType,
        year: new Date().getFullYear(),
        crossoverFocus,
      },
      dimensions: combinedDimensions,
      identitySummary: { toneOfVoice: [], visualKeywords: [] },
      culturalData: { individualResponses, roleAverages },
      createdAt: now,
      updatedAt: now,
    };

    onComplete(profile);
  };

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
                Je organisatie
              </CardTitle>
              <CardDescription>Vul de basisgegevens van je culturele organisatie in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="org-name">Naam van de organisatie *</Label>
                <Input
                  id="org-name"
                  placeholder="bijv. Theater aan Zee"
                  value={orgName}
                  onChange={(e) => { setOrgName(e.target.value); setFormError(''); }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-type">Type organisatie *</Label>
                <select
                  id="org-type"
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  value={orgType}
                  onChange={(e) => { setOrgType(e.target.value); setFormError(''); }}
                >
                  <option value="">Kies een type…</option>
                  {CULTURAL_ORG_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crossover">Cross-over focus</Label>
                <select
                  id="crossover"
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  value={crossoverFocus}
                  onChange={(e) => setCrossoverFocus(e.target.value as CrossoverFocus)}
                >
                  <option value="gemeenschap">Gemeenschap</option>
                  <option value="innovatie">Innovatie</option>
                  <option value="hr">HR & Talent</option>
                  <option value="leiderschap">Leiderschap</option>
                  <option value="reputatie">Reputatie</option>
                </select>
                <p className="text-xs text-gray-500">
                  Op welk vlak wil je vooral samenwerken met bedrijven?
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Volgende stap</h4>
                <p className="text-sm text-blue-800">
                  Daarna kunnen meerdere mensen uit je organisatie de vragenlijst invullen:
                  directie, bestuur, medewerkers en vrijwilligers. Elke invuller geeft een naam
                  of alias op en kiest zijn of haar functie. Alle antwoorden samen vormen het
                  profiel van je organisatie.
                </p>
              </div>

              {formError && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {formError}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={handleOrgInfoComplete} size="lg">
                  Verder naar de vragenlijst
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'collect-responses') {
    return (
      <div ref={rootRef} className="min-h-screen bg-white p-8 scroll-mt-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStep('organisation-info')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug naar de organisatiegegevens
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-normal text-gray-900 mb-2">
              Antwoorden verzamelen voor {orgName}
            </h1>
            <p className="text-gray-600">
              Laat iedereen die je wil betrekken de vragenlijst invullen. Minstens één invuller is
              nodig.
            </p>
          </div>

          <div className="space-y-6">
            {formError && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {formError}
              </div>
            )}

            <ResponsesOverview
              responses={individualResponses}
              roles={CULTURAL_ROLES}
              onAddResponse={() => setStep('add-response')}
              onDeleteResponse={handleDeleteResponse}
            />

            {individualResponses.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="font-medium text-gray-900">Profiel voltooien</h3>
                      <p className="text-sm text-gray-600">
                        {individualResponses.length === 1 ? '1 invuller' : `${individualResponses.length} invullers`}.
                        Klik op voltooien om het profiel op te slaan.
                      </p>
                    </div>
                    <Button onClick={handleFinalize} size="lg" className="bg-teal-600 hover:bg-teal-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Profiel voltooien
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

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <IndividualResponseWizard
          organisationName={orgName}
          dimensions={culturalDimensions}
          roles={CULTURAL_ROLES}
          defaultRole="medewerker"
          onComplete={handleResponseComplete}
          onCancel={() => setStep('collect-responses')}
        />
      </div>
    </div>
  );
};
