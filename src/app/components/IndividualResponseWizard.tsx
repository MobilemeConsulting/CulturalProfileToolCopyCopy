import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { QuestionnaireStep } from './QuestionnaireStep';
import { User, Briefcase, Users } from 'lucide-react';
import { Dimension, IndividualResponse } from '../data/types';

interface IndividualResponseWizardProps {
  organisationName: string;
  dimensions: Dimension[];
  onComplete: (response: IndividualResponse) => void;
  onCancel: () => void;
}

export function IndividualResponseWizard({
  organisationName,
  dimensions,
  onComplete,
  onCancel,
}: IndividualResponseWizardProps) {
  const [step, setStep] = useState<'personal' | 'questionnaire'>('personal');

  // Elke stap bovenaan openen (anders moet de invuller eerst scrollen).
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);
  const [respondentName, setRespondentName] = useState('');
  const [respondentRole, setRespondentRole] = useState<'leadership' | 'staff'>('staff');
  const [currentDimensions, setCurrentDimensions] = useState<Dimension[]>(
    JSON.parse(JSON.stringify(dimensions)) // Deep copy
  );

  const handlePersonalInfoComplete = () => {
    if (!respondentName.trim()) {
      alert('Vul alsjeblieft je naam in');
      return;
    }
    setStep('questionnaire');
  };

  const handleQuestionnaireComplete = () => {
    const response: IndividualResponse = {
      id: `resp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      respondentName: respondentName.trim(),
      respondentRole,
      dimensions: currentDimensions,
      completedAt: new Date().toISOString(),
    };
    
    onComplete(response);
  };

  if (step === 'personal') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Persoonlijke gegevens
          </CardTitle>
          <CardDescription>
            Je vult de vragenlijst in voor: <strong>{organisationName}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Naam */}
          <div className="space-y-2">
            <Label htmlFor="respondent-name">Je naam *</Label>
            <Input
              id="respondent-name"
              placeholder="bijv. Jan Janssen"
              value={respondentName}
              onChange={(e) => setRespondentName(e.target.value)}
            />
          </div>

          {/* Rol */}
          <div className="space-y-3">
            <Label>Je functie binnen de organisatie *</Label>
            <RadioGroup
              value={respondentRole}
              onValueChange={(value) => setRespondentRole(value as 'leadership' | 'staff')}
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="leadership" id="role-leadership" />
                <Label
                  htmlFor="role-leadership"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-medium">Directie / Management</div>
                    <div className="text-sm text-gray-500">
                      Leidinggevende functie (CEO, directeur, manager, etc.)
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="staff" id="role-staff" />
                <Label
                  htmlFor="role-staff"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Ander personeel</div>
                    <div className="text-sm text-gray-500">
                      Medewerker, specialist, coordinator, etc.
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Uitleg */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Let op:</strong> Je individuele antwoorden worden samengevoegd met andere
              respondenten om het uiteindelijke organisatieprofiel te maken. Directie antwoorden
              wegen voor 60%, ander personeel voor 40%.
            </p>
          </div>

          {/* Acties */}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onCancel}>
              Annuleren
            </Button>
            <Button onClick={handlePersonalInfoComplete}>
              Verder naar vragenlijst
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header met naam en rol */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Ingevuld door</div>
              <div className="font-medium">{respondentName}</div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
              {respondentRole === 'leadership' ? (
                <>
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>Directie</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Personeel</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vragenlijst */}
      <QuestionnaireStep
        dimensions={currentDimensions}
        onUpdate={setCurrentDimensions}
        onComplete={handleQuestionnaireComplete}
        onBack={onCancel}
      />
    </div>
  );
}
