import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { X, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { CulturalProfile } from '../App';

interface IdentitySummaryProps {
  identitySummary: CulturalProfile['identitySummary'];
  updateIdentitySummary: (
    field: keyof CulturalProfile['identitySummary'],
    value: string[]
  ) => void;
}

export function IdentitySummary({
  identitySummary,
  updateIdentitySummary,
}: IdentitySummaryProps) {
  const [newTone, setNewTone] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const addItem = (field: keyof CulturalProfile['identitySummary'], value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    const currentValues = identitySummary[field];
    if (!currentValues.includes(trimmedValue)) {
      updateIdentitySummary(field, [...currentValues, trimmedValue]);
    }

    if (field === 'toneOfVoice') {
      setNewTone('');
    } else {
      setNewKeyword('');
    }
  };

  const removeItem = (
    field: keyof CulturalProfile['identitySummary'],
    index: number
  ) => {
    const currentValues = [...identitySummary[field]];
    currentValues.splice(index, 1);
    updateIdentitySummary(field, currentValues);
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-600" />
          Identiteitssamenvatting
        </CardTitle>
        <CardDescription>
          Vat de kernwoorden samen die uw organisatie het best beschrijven
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Tone of Voice */}
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <Label className="text-base font-semibold text-slate-700 mb-3 block">
              Tone of Voice
            </Label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {identitySummary.toneOfVoice.map((tone, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="pl-3 pr-1 py-1.5 text-sm bg-orange-100 text-orange-800 hover:bg-orange-200"
                >
                  {tone}
                  <button
                    onClick={() => removeItem('toneOfVoice', index)}
                    className="ml-1 hover:bg-orange-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Bijv. gastvrij, onderzoekend, stedelijk..."
                value={newTone}
                onChange={(e) => setNewTone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('toneOfVoice', newTone);
                  }
                }}
                className="flex-1 border-slate-300"
              />
              <button
                onClick={() => addItem('toneOfVoice', newTone)}
                className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Toevoegen
              </button>
            </div>
          </div>

          {/* Visual Keywords */}
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <Label className="text-base font-semibold text-slate-700 mb-3 block">
              Visuele kernwoorden
            </Label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {identitySummary.visualKeywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="pl-3 pr-1 py-1.5 text-sm bg-pink-100 text-pink-800 hover:bg-pink-200"
                >
                  {keyword}
                  <button
                    onClick={() => removeItem('visualKeywords', index)}
                    className="ml-1 hover:bg-pink-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Bijv. warm licht, gelaagde typografie, architecturale lijnen..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('visualKeywords', newKeyword);
                  }
                }}
                className="flex-1 border-slate-300"
              />
              <button
                onClick={() => addItem('visualKeywords', newKeyword)}
                className="px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Toevoegen
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
