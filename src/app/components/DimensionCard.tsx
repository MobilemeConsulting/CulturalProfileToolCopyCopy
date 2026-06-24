import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { X, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Dimension, Axis } from '../App';

interface DimensionCardProps {
  dimension: Dimension;
  updateDimension: (dimensionId: string, axes: Axis[]) => void;
}

export function DimensionCard({ dimension, updateDimension }: DimensionCardProps) {
  const [newWords, setNewWords] = useState<{ [axisId: string]: string }>({});

  const updateAxis = (axisIndex: number, field: keyof Axis, value: any) => {
    const updatedAxes = [...dimension.axes];
    updatedAxes[axisIndex] = { ...updatedAxes[axisIndex], [field]: value };
    updateDimension(dimension.id, updatedAxes);
  };

  const addIdentityWord = (axisIndex: number) => {
    const axisId = dimension.axes[axisIndex].id;
    const word = newWords[axisId]?.trim();
    if (!word) return;

    const updatedAxes = [...dimension.axes];
    const currentWords = updatedAxes[axisIndex].identityWords;
    if (!currentWords.includes(word)) {
      updatedAxes[axisIndex] = {
        ...updatedAxes[axisIndex],
        identityWords: [...currentWords, word],
      };
      updateDimension(dimension.id, updatedAxes);
      setNewWords({ ...newWords, [axisId]: '' });
    }
  };

  const removeIdentityWord = (axisIndex: number, wordIndex: number) => {
    const updatedAxes = [...dimension.axes];
    const currentWords = [...updatedAxes[axisIndex].identityWords];
    currentWords.splice(wordIndex, 1);
    updatedAxes[axisIndex] = {
      ...updatedAxes[axisIndex],
      identityWords: currentWords,
    };
    updateDimension(dimension.id, updatedAxes);
  };

  const getScoreColor = (score: number) => {
    if (score < 33) return 'text-blue-600';
    if (score < 67) return 'text-purple-600';
    return 'text-pink-600';
  };

  const getGradient = () => {
    const gradients = [
      'from-purple-50 to-purple-100',
      'from-blue-50 to-blue-100',
      'from-pink-50 to-pink-100',
      'from-orange-50 to-orange-100',
    ];
    const index = ['artistic', 'audience', 'organisation', 'identity'].indexOf(dimension.id);
    return gradients[index] || gradients[0];
  };

  const getBackgroundImage = () => {
    const images = {
      artistic: 'https://images.unsplash.com/photo-1526126720918-adea7e49be03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhYnN0cmFjdCUyMHBhaW50aW5nJTIwdmlicmFudHxlbnwxfHx8fDE3NzE2ODUxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      audience: 'https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBmZXN0aXZhbCUyMGNyb3dkfGVufDF8fHx8MTc3MTYxMDM0OHww&ixlib=rb-4.1.0&q=80&w=1080',
      organisation: 'https://images.unsplash.com/photo-1763630730215-d97346f23065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGFydGlzdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzE2MTU5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      identity: 'https://images.unsplash.com/photo-1701318226666-6b5b02d3df4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBzY3VscHR1cmUlMjBtdXNldW18ZW58MXx8fHwxNzcxNjQ3NDcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    };
    return images[dimension.id as keyof typeof images] || images.artistic;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('${getBackgroundImage()}')`,
        }}
      ></div>
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()}/95`}></div>
      
      <Card className="relative bg-transparent border-0">
        <CardHeader className="relative">
          <CardTitle className="text-2xl">{dimension.label}</CardTitle>
          <CardDescription className="text-slate-700 font-medium">
            Bepaal uw positie op deze dimensie met behulp van de sliders
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
          {dimension.axes.map((axis, axisIndex) => (
            <div key={axis.id} className="p-4 bg-white rounded-lg border border-slate-200">
              {/* Axis Label and Score */}
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold text-slate-700">
                  {axis.label}
                </Label>
                <span className={`text-2xl font-bold ${getScoreColor(axis.score)}`}>
                  {axis.score}
                </span>
              </div>

              {/* Slider */}
              <div className="mb-6">
                <Slider
                  value={[axis.score]}
                  onValueChange={([value]) => updateAxis(axisIndex, 'score', value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>{axis.label.split('↔')[0]?.trim() || axis.label}</span>
                  <span>{axis.label.split('↔')[1]?.trim() || ''}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <Label htmlFor={`desc-${axis.id}`} className="text-sm mb-2">
                  Beschrijving
                </Label>
                <Textarea
                  id={`desc-${axis.id}`}
                  placeholder="Beschrijf de positie van uw organisatie op deze as..."
                  value={axis.description}
                  onChange={(e) => updateAxis(axisIndex, 'description', e.target.value)}
                  className="min-h-[80px] border-slate-300"
                />
              </div>

              {/* Identity Words */}
              <div>
                <Label className="text-sm mb-2">Identiteitswoorden</Label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {axis.identityWords.map((word, wordIndex) => (
                    <Badge
                      key={wordIndex}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200"
                    >
                      {word}
                      <button
                        onClick={() => removeIdentityWord(axisIndex, wordIndex)}
                        className="ml-1 hover:bg-purple-300 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Voeg een identiteitswoord toe..."
                    value={newWords[axis.id] || ''}
                    onChange={(e) =>
                      setNewWords({ ...newWords, [axis.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addIdentityWord(axisIndex);
                      }
                    }}
                    className="flex-1 border-slate-300"
                  />
                  <button
                    onClick={() => addIdentityWord(axisIndex)}
                    className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Toevoegen
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
