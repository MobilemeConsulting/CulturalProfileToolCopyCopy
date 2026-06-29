import React, { useState } from 'react';
import { OrganisationProfile, OrganisationType } from '../data/types';
import { CulturalProfileForm } from './CulturalProfileForm';
import { ProfitProfileFormNew } from './ProfitProfileFormNew';
import { Building2, Palette, Download, Upload } from 'lucide-react';

interface ProfileCreationWizardProps {
  onProfileCreated: (profile: OrganisationProfile) => void;
  onImport: (profile: OrganisationProfile) => void;
}

export const ProfileCreationWizard: React.FC<ProfileCreationWizardProps> = ({
  onProfileCreated,
  onImport
}) => {
  const [step, setStep] = useState<'select-type' | 'fill-form'>('select-type');
  const [selectedType, setSelectedType] = useState<OrganisationType | null>(null);

  const handleTypeSelection = (type: OrganisationType) => {
    setSelectedType(type);
    setStep('fill-form');
  };

  const handleBack = () => {
    setStep('select-type');
    setSelectedType(null);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const profile = JSON.parse(content) as OrganisationProfile;
        
        // Validatie
        if (!profile.id || !profile.organisationType || !profile.meta || !profile.dimensions) {
          alert('Ongeldig profiel bestand. Controleer de structuur.');
          return;
        }

        onImport(profile);
        alert(`Profiel "${profile.meta.orgName}" succesvol geïmporteerd!`);
      } catch (error) {
        alert('Fout bij het importeren van het profiel. Controleer of het bestand correct is.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  if (step === 'select-type') {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-4">
              Nieuw Organisatieprofiel
            </h1>
            <div className="w-24 h-0.5 bg-teal-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 font-light">
              Kies het type organisatie om te beginnen
            </p>
          </div>

          {/* Import optie */}
          <div className="mb-12 bg-gray-50 border border-gray-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Upload className="w-6 h-6 text-teal-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Bestaand profiel importeren</h3>
                  <p className="text-sm text-gray-600">Upload een eerder geëxporteerd profiel (JSON)</p>
                </div>
              </div>
              <label className="cursor-pointer bg-teal-600 text-white px-6 py-2 hover:bg-teal-700 transition-colors">
                Importeren
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm font-medium tracking-wider">OF MAAK EEN NIEUW PROFIEL</p>
          </div>

          {/* Type selectie */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Culturele organisatie */}
            <button
              onClick={() => handleTypeSelection('cultural')}
              className="bg-white border-2 border-gray-200 p-8 hover:border-teal-600 transition-all text-left group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 border border-teal-200 group-hover:bg-teal-50 transition-colors">
                  <Palette className="w-8 h-8 text-teal-600" />
                </div>
                <h2 className="text-2xl font-normal text-gray-900">Culturele Organisatie</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Voor musea, theaters, dansgezelschappen, concertzalen, kunstcentra, bibliotheken, etc.
              </p>
              <div className="bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Dimensies:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Artistieke Positie</li>
                  <li>• Publiek & Gemeenschap</li>
                  <li>• Organisatie & Werking</li>
                  <li>• Culturele Identiteit</li>
                </ul>
              </div>
            </button>

            {/* Profit organisatie */}
            <button
              onClick={() => handleTypeSelection('profit')}
              className="bg-white border-2 border-gray-200 p-8 hover:border-teal-600 transition-all text-left group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 border border-teal-200 group-hover:bg-teal-50 transition-colors">
                  <Building2 className="w-8 h-8 text-teal-600" />
                </div>
                <h2 className="text-2xl font-normal text-gray-900">Profit Organisatie</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Voor bedrijven die culturele sponsoring en samenwerking zoeken (CSROI dimensies).
              </p>
              <div className="bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Dimensies:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Creativiteit & Innovatie</li>
                  <li>• Markt & Doelgroep</li>
                  <li>• Proces & Structuur</li>
                  <li>• Merkidentiteit</li>
                  <li>• Duurzaamheid & Impact</li>
                </ul>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Formulier invullen
  return (
    <div>
      {selectedType === 'cultural' && (
        <CulturalProfileForm onComplete={onProfileCreated} onBack={handleBack} />
      )}
      {selectedType === 'profit' && (
        <ProfitProfileFormNew onComplete={onProfileCreated} onBack={handleBack} />
      )}
    </div>
  );
};