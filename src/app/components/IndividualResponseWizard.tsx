import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { QuestionnaireStep } from './QuestionnaireStep';
import { User, Users } from 'lucide-react';
import { Dimension, IndividualResponse, RespondentRole } from '../data/types';
import { PROFIT_ROLES, RoleOption, roleLabel } from '../data/respondentRoles';

interface IndividualResponseWizardProps {
  organisationName: string;
  dimensions: Dimension[];
  // Keuzerollen voor de invuller (standaard: bedrijfsrollen).
  roles?: RoleOption[];
  defaultRole?: RespondentRole;
  onComplete: (response: IndividualResponse) => void;
  onCancel: () => void;
}

export function IndividualResponseWizard({
  organisationName,
  dimensions,
  roles = PROFIT_ROLES,
  defaultRole,
  onComplete,
  onCancel,
}: IndividualResponseWizardProps) {
  const [step, setStep] = useState<'personal' | 'questionnaire'>('personal');

  // Bij het openen de naamstap zelf in beeld brengen (anders moet de invuller
  // eerst scrollen). De vragenlijst-stap regelt dat zelf (QuestionnaireStep).
  const personalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (step === 'personal') personalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);
  const [respondentName, setRespondentName] = useState('');
  const [nameError, setNameError] = useState('');
  const [respondentRole, setRespondentRole] = useState<RespondentRole>(
    defaultRole ?? roles[roles.length - 1].value
  );
  const [currentDimensions, setCurrentDimensions] = useState<Dimension[]>(
    JSON.parse(JSON.stringify(dimensions)) // Deep copy
  );

  const handlePersonalInfoComplete = () => {
    if (!respondentName.trim()) {
      setNameError('Vul je naam of een alias in.');
      return;
    }
    setNameError('');
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
      <div ref={personalRef} className="scroll-mt-4">
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
            <Label htmlFor="respondent-name">Je naam of een alias *</Label>
            <Input
              id="respondent-name"
              placeholder="bijv. Jan Janssen of een alias"
              value={respondentName}
              onChange={(e) => { setRespondentName(e.target.value); setNameError(''); }}
            />
            <p className="text-xs text-gray-500">
              Je mag een alias gebruiken als je de vragenlijst anoniem wil invullen.
            </p>
            {nameError && <p className="text-sm text-amber-700">{nameError}</p>}
          </div>

          {/* Rol */}
          <div className="space-y-3">
            <Label>Je functie binnen de organisatie *</Label>
            <RadioGroup
              value={respondentRole}
              onValueChange={(value) => setRespondentRole(value as RespondentRole)}
            >
              {roles.map((role) => (
                <div key={role.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value={role.value} id={`role-${role.value}`} />
                  <Label
                    htmlFor={`role-${role.value}`}
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <Users className="w-4 h-4 text-teal-600" />
                    <div>
                      <div className="font-medium">{role.label}</div>
                      <div className="text-sm text-gray-500">{role.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Uitleg — de weging per rol blijft bewust intern (besluit AHHA). */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Let op:</strong> je antwoorden worden samengevoegd met die van de andere
              invullers tot één profiel van de organisatie.
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
      </div>
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
              <Users className="w-4 h-4 text-teal-600" />
              <span>{roleLabel(roles, respondentRole)}</span>
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
