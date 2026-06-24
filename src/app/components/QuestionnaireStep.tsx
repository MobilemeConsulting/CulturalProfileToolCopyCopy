import { useState } from 'react';
import { Dimension, Axis } from '../data/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface QuestionnaireStepProps {
  dimensions: Dimension[];
  onUpdate: (dimensions: Dimension[]) => void;
  onComplete: () => void;
  onBack: () => void;
}

export function QuestionnaireStep({
  dimensions,
  onUpdate,
  onComplete,
  onBack,
}: QuestionnaireStepProps) {
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [currentAxisIndex, setCurrentAxisIndex] = useState(0);

  const currentDimension = dimensions[currentDimensionIndex];
  const currentAxis = currentDimension?.axes[currentAxisIndex];
  
  const totalQuestions = dimensions.reduce((sum, dim) => sum + dim.axes.length, 0);
  const answeredQuestions = dimensions
    .slice(0, currentDimensionIndex)
    .reduce((sum, dim) => sum + dim.axes.length, 0) + currentAxisIndex;
  
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleScoreChange = (score: number) => {
    const newDimensions = dimensions.map((dim, dimIdx) => {
      if (dimIdx === currentDimensionIndex) {
        return {
          ...dim,
          axes: dim.axes.map((axis, axisIdx) => {
            if (axisIdx === currentAxisIndex) {
              return { ...axis, score };
            }
            return axis;
          }),
        };
      }
      return dim;
    });
    onUpdate(newDimensions);
  };

  const handleDescriptionChange = (description: string) => {
    const newDimensions = dimensions.map((dim, dimIdx) => {
      if (dimIdx === currentDimensionIndex) {
        return {
          ...dim,
          axes: dim.axes.map((axis, axisIdx) => {
            if (axisIdx === currentAxisIndex) {
              return { ...axis, description };
            }
            return axis;
          }),
        };
      }
      return dim;
    });
    onUpdate(newDimensions);
  };

  const handleNext = () => {
    // Check of er nog meer axes zijn in deze dimensie
    if (currentAxisIndex < currentDimension.axes.length - 1) {
      setCurrentAxisIndex(prev => prev + 1);
    } 
    // Check of er nog meer dimensies zijn
    else if (currentDimensionIndex < dimensions.length - 1) {
      setCurrentDimensionIndex(prev => prev + 1);
      setCurrentAxisIndex(0);
    }
    // Laatste vraag -> voltooien
    else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    // Check of we terug kunnen in deze dimensie
    if (currentAxisIndex > 0) {
      setCurrentAxisIndex(prev => prev - 1);
    }
    // Check of we terug kunnen naar vorige dimensie
    else if (currentDimensionIndex > 0) {
      setCurrentDimensionIndex(prev => prev - 1);
      setCurrentAxisIndex(dimensions[currentDimensionIndex - 1].axes.length - 1);
    }
  };

  const isFirstQuestion = currentDimensionIndex === 0 && currentAxisIndex === 0;
  const isLastQuestion = 
    currentDimensionIndex === dimensions.length - 1 && 
    currentAxisIndex === currentDimension.axes.length - 1;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Voortgang</span>
              <span className="font-medium text-gray-900">
                {answeredQuestions} / {totalQuestions} vragen
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Vragenlijst */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-teal-600 font-medium mb-2">
                {currentDimension.label}
              </div>
              <CardTitle className="text-2xl">{currentAxis.label}</CardTitle>
              <CardDescription className="mt-2">
                {currentAxis.description}
              </CardDescription>
            </div>
            <div className="bg-teal-50 px-3 py-1 rounded-full text-sm font-medium text-teal-700">
              {answeredQuestions + 1} / {totalQuestions}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Score</span>
              <span className="text-2xl font-bold text-teal-600">{currentAxis.score}</span>
            </div>
            <Slider
              value={[currentAxis.score]}
              onValueChange={([value]) => handleScoreChange(value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 - Laag</span>
              <span>50 - Gemiddeld</span>
              <span>100 - Hoog</span>
            </div>
          </div>

          {/* Optionele toelichting */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Toelichting (optioneel)
            </label>
            <Textarea
              placeholder="Voeg een toelichting toe bij deze score..."
              value={currentAxis.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigatie */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={isFirstQuestion ? onBack : handlePrevious}
          disabled={false}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {isFirstQuestion ? 'Annuleren' : 'Vorige'}
        </Button>

        <Button onClick={handleNext} size="lg" className="bg-teal-600 hover:bg-teal-700">
          {isLastQuestion ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Voltooien
            </>
          ) : (
            <>
              Volgende
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
