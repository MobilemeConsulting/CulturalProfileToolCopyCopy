import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { MetadataForm } from './MetadataForm';
import { DimensionCard } from './DimensionCard';
import { IdentitySummary } from './IdentitySummary';
import type { Profile, Axis, Dimension } from '../App';
import { UserCog, Users, Save, ArrowRight, ArrowLeft, CheckCircle2, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface TwoStepProfileWizardProps {
  profile: Profile;
  onComplete: (profile: Profile) => void;
  onUpdateProfile: (profile: Profile) => void;
}

type WizardStep = 'intro' | 'metadata' | 'leadership' | 'staff' | 'summary' | 'identity';

export function TwoStepProfileWizard({ profile, onComplete, onUpdateProfile }: TwoStepProfileWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('intro');
  const [leadershipDimensions, setLeadershipDimensions] = useState<Dimension[]>(
    JSON.parse(JSON.stringify(profile.dimensions))
  );
  const [staffDimensions, setStaffDimensions] = useState<Dimension[]>(
    JSON.parse(JSON.stringify(profile.dimensions))
  );

  const isCultural = profile.organisationType === 'cultural';
  
  // Dynamic labels based on organisation type
  const labels = {
    orgType: isCultural ? 'Culturele Organisatie' : 'Profit Bedrijf',
    leadership: isCultural ? 'Directie/Leiding' : 'Bedrijfsleider',
    staff: isCultural ? 'Medewerkers/Team' : 'Personeel',
    metadataTitle: isCultural ? 'Organisatiegegevens' : 'Bedrijfsgegevens',
    metadataDesc: isCultural ? 'Vul eerst de algemene informatie over uw organisatie in' : 'Vul eerst de algemene informatie over uw bedrijf in',
  };

  const steps: WizardStep[] = ['intro', 'metadata', 'leadership', 'staff', 'summary', 'identity'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const updateMeta = (field: keyof Profile['meta'], value: string | number) => {
    onUpdateProfile({
      ...profile,
      meta: { ...profile.meta, [field]: value },
    });
  };

  const updateLeadershipDimension = (dimensionId: string, updatedAxes: Axis[]) => {
    setLeadershipDimensions((prev) =>
      prev.map((dim) => (dim.id === dimensionId ? { ...dim, axes: updatedAxes } : dim))
    );
  };

  const updateStaffDimension = (dimensionId: string, updatedAxes: Axis[]) => {
    setStaffDimensions((prev) =>
      prev.map((dim) => (dim.id === dimensionId ? { ...dim, axes: updatedAxes } : dim))
    );
  };

  const updateIdentitySummary = (
    field: keyof Profile['identitySummary'],
    value: string[]
  ) => {
    onUpdateProfile({
      ...profile,
      identitySummary: { ...profile.identitySummary, [field]: value },
    });
  };

  const combineDimensions = (): Dimension[] => {
    // Combine leadership and staff responses with weighted average
    // Leadership: 60%, Staff: 40%
    return leadershipDimensions.map((leaderDim, dimIndex) => {
      const staffDim = staffDimensions[dimIndex];
      
      const combinedAxes = leaderDim.axes.map((leaderAxis, axisIndex) => {
        const staffAxis = staffDim.axes[axisIndex];
        
        // Weighted average: 60% leadership, 40% staff
        const combinedScore = Math.round(leaderAxis.score * 0.6 + staffAxis.score * 0.4);
        
        // Combine descriptions
        const combinedDescription = [
          leaderAxis.description && `${labels.leadership}: ${leaderAxis.description}`,
          staffAxis.description && `${labels.staff}: ${staffAxis.description}`,
        ]
          .filter(Boolean)
          .join(' | ');
        
        // Combine identity words
        const combinedWords = [
          ...new Set([...leaderAxis.identityWords, ...staffAxis.identityWords]),
        ];

        return {
          ...leaderAxis,
          score: combinedScore,
          description: combinedDescription,
          identityWords: combinedWords,
        };
      });

      return {
        ...leaderDim,
        axes: combinedAxes,
      };
    });
  };

  const handleComplete = () => {
    const combinedDimensions = combineDimensions();
    
    const completedProfile: Profile = {
      ...profile,
      dimensions: combinedDimensions,
      profitData: {
        leadershipResponses: leadershipDimensions,
        staffResponses: staffDimensions,
        combinedDimensions: combinedDimensions,
      },
      updatedAt: new Date().toISOString(),
    };

    onUpdateProfile(completedProfile);
    onComplete(completedProfile);
  };

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="shadow-lg border-2 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Voortgang</span>
              <span className="font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Stap {currentStepIndex + 1} van {steps.length}</span>
              <span className="font-medium">
                {currentStep === 'intro' && 'Introductie'}
                {currentStep === 'metadata' && labels.metadataTitle}
                {currentStep === 'leadership' && labels.leadership}
                {currentStep === 'staff' && labels.staff}
                {currentStep === 'summary' && 'Samenvatting'}
                {currentStep === 'identity' && 'Identiteit'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 'intro' && (
        <Card className="shadow-xl border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-2xl flex items-center gap-3">
              <UserCog className="w-8 h-8 text-blue-600" />
              Welkom bij de {labels.orgType} Vragenlijst
            </CardTitle>
            <CardDescription className="text-base">
              Een tweestaps proces voor een compleet {isCultural ? 'organisatie' : 'bedrijfs'}profiel
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <AlertTitle className="text-blue-900">Hoe werkt het?</AlertTitle>
                <AlertDescription className="text-blue-800">
                  Voor een volledig {isCultural ? 'organisatie' : 'bedrijfs'}profiel vragen we twee perspectieven:
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-blue-300">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCog className="w-5 h-5 text-blue-600" />
                      Stap 1: {labels.leadership}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-slate-700 mb-3">
                      {isCultural 
                        ? 'De directie/leiding vult de vragenlijst in vanuit het strategische en visionaire perspectief.'
                        : 'De bedrijfsleider vult de vragenlijst in vanuit het strategische perspectief.'}
                    </p>
                    <Badge className="bg-blue-600 text-white">60% weging</Badge>
                  </CardContent>
                </Card>

                <Card className="border-2 border-indigo-300">
                  <CardHeader className="bg-indigo-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      Stap 2: {labels.staff}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-slate-700 mb-3">
                      {isCultural
                        ? 'De medewerkers/het team vult dezelfde vragenlijst in vanuit hun dagelijkse ervaring.'
                        : 'Het personeel vult dezelfde vragenlijst in vanuit hun dagelijkse ervaring.'}
                    </p>
                    <Badge className="bg-indigo-600 text-white">40% weging</Badge>
                  </CardContent>
                </Card>
              </div>

              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <AlertTitle className="text-green-900">Resultaat</AlertTitle>
                <AlertDescription className="text-green-800">
                  De antwoorden worden automatisch gecombineerd tot één profiel dat klaar is voor matching {isCultural ? 'met profit bedrijven voor sponsoring en samenwerking' : 'met culturele organisaties'}.
                </AlertDescription>
              </Alert>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">⏱️ Verwachte tijdsduur</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• {labels.metadataTitle}: 2 minuten</li>
                  <li>• Vragenlijst {labels.leadership.toLowerCase()}: 10-15 minuten</li>
                  <li>• Vragenlijst {labels.staff.toLowerCase()}: 10-15 minuten</li>
                  <li>• Identiteit & afronding: 5 minuten</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 'metadata' && (
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <AlertTitle>{labels.metadataTitle}</AlertTitle>
            <AlertDescription>
              {labels.metadataDesc}
            </AlertDescription>
          </Alert>
          
          <MetadataForm
            meta={profile.meta}
            updateMeta={updateMeta}
            organisationType={profile.organisationType}
          />
        </div>
      )}

      {currentStep === 'leadership' && (
        <div className="space-y-6">
          <Card className="shadow-lg border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center gap-2">
                <UserCog className="w-6 h-6 text-blue-600" />
                {labels.leadership} Perspectief
              </CardTitle>
              <CardDescription>
                {isCultural
                  ? 'Vul de vragenlijst in vanuit het strategische en visionaire perspectief van de directie/leiding'
                  : 'Vul de vragenlijst in vanuit het strategische en visionaire perspectief van de bedrijfsleiding'}
              </CardDescription>
            </CardHeader>
          </Card>

          {leadershipDimensions.map((dimension) => (
            <DimensionCard
              key={dimension.id}
              dimension={dimension}
              updateDimension={updateLeadershipDimension}
            />
          ))}
        </div>
      )}

      {currentStep === 'staff' && (
        <div className="space-y-6">
          <Card className="shadow-lg border-2 border-indigo-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" />
                {labels.staff} Perspectief
              </CardTitle>
              <CardDescription>
                {isCultural
                  ? 'Vul de vragenlijst in vanuit de dagelijkse werkervaring en cultuur zoals de medewerkers/het team die ervaren'
                  : 'Vul de vragenlijst in vanuit de dagelijkse werkervaring en bedrijfscultuur zoals het personeel die ervaart'}
              </CardDescription>
            </CardHeader>
          </Card>

          {staffDimensions.map((dimension) => (
            <DimensionCard
              key={dimension.id}
              dimension={dimension}
              updateDimension={updateStaffDimension}
            />
          ))}
        </div>
      )}

      {currentStep === 'summary' && (
        <div className="space-y-6">
          <Card className="shadow-xl border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-green-600" />
                Gecombineerde Resultaten
              </CardTitle>
              <CardDescription>
                Overzicht van de gecombineerde scores uit beide perspectieven
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Alert className="bg-blue-50 border-blue-200 mb-6">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <AlertTitle>Automatische Berekening</AlertTitle>
                <AlertDescription>
                  De scores worden gewogen berekend: 60% {labels.leadership.toLowerCase()} + 40% {labels.staff.toLowerCase()}
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                {combineDimensions().map((dimension) => (
                  <Card key={dimension.id} className="border-2 border-slate-200">
                    <CardHeader className="bg-slate-50">
                      <CardTitle className="text-lg">{dimension.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {dimension.axes.map((axis) => {
                        const leaderAxis = leadershipDimensions
                          .find(d => d.id === dimension.id)
                          ?.axes.find(a => a.id === axis.id);
                        const staffAxis = staffDimensions
                          .find(d => d.id === dimension.id)
                          ?.axes.find(a => a.id === axis.id);

                        return (
                          <div key={axis.id} className="mb-6 last:mb-0">
                            <h4 className="font-semibold text-slate-900 mb-3">
                              {axis.label}
                            </h4>
                            
                            <div className="grid md:grid-cols-3 gap-4 mb-3">
                              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <div className="text-xs text-blue-700 mb-1">{labels.leadership}</div>
                                <div className="text-2xl font-bold text-blue-600">
                                  {leaderAxis?.score}
                                </div>
                              </div>
                              
                              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                                <div className="text-xs text-indigo-700 mb-1">{labels.staff}</div>
                                <div className="text-2xl font-bold text-indigo-600">
                                  {staffAxis?.score}
                                </div>
                              </div>
                              
                              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <div className="text-xs text-green-700 mb-1">Gecombineerd</div>
                                <div className="text-2xl font-bold text-green-600">
                                  {axis.score}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Progress value={axis.score} className="h-2" />
                              {axis.description && (
                                <p className="text-sm text-slate-600 italic">
                                  {axis.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 'identity' && (
        <div className="space-y-6">
          <Alert className="bg-purple-50 border-purple-200">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            <AlertTitle>Laatste Stap</AlertTitle>
            <AlertDescription>
              Definieer de identiteit van uw {isCultural ? 'organisatie' : 'bedrijf'} voor betere matching
            </AlertDescription>
          </Alert>

          <IdentitySummary
            identitySummary={profile.identitySummary}
            updateIdentitySummary={updateIdentitySummary}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Vorige
            </button>

            {currentStepIndex === steps.length - 1 ? (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium"
              >
                <Save className="w-5 h-5" />
                Opslaan & Afronden
              </button>
            ) : (
              <button
                onClick={goToNextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Volgende
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
