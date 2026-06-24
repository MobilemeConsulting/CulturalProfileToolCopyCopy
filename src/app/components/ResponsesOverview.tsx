import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { IndividualResponse } from '../data/types';
import { Briefcase, Users, Trash2, Plus, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface ResponsesOverviewProps {
  responses: IndividualResponse[];
  onAddResponse: () => void;
  onDeleteResponse: (id: string) => void;
}

export function ResponsesOverview({
  responses,
  onAddResponse,
  onDeleteResponse,
}: ResponsesOverviewProps) {
  const leadershipResponses = responses.filter(r => r.respondentRole === 'leadership');
  const staffResponses = responses.filter(r => r.respondentRole === 'staff');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Individuele responses
            </CardTitle>
            <CardDescription>
              Overzicht van alle personen die de vragenlijst hebben ingevuld
            </CardDescription>
          </div>
          <Button onClick={onAddResponse}>
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe response
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistieken */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{responses.length}</div>
            <div className="text-sm text-gray-600">Totaal responses</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-900">{leadershipResponses.length}</div>
            <div className="text-sm text-purple-700 flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              Directie (60%)
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{staffResponses.length}</div>
            <div className="text-sm text-blue-700 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Personeel (40%)
            </div>
          </div>
        </div>

        {/* Lijst van responses */}
        {responses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Nog geen responses
            </h3>
            <p className="text-gray-600 mb-4">
              Voeg de eerste persoon toe die de vragenlijst invult
            </p>
            <Button onClick={onAddResponse}>
              <Plus className="w-4 h-4 mr-2" />
              Eerste response toevoegen
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {responses.map((response) => (
              <div
                key={response.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white font-semibold">
                    {response.respondentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {response.respondentName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Ingevuld op{' '}
                      {format(new Date(response.completedAt), 'dd MMM yyyy HH:mm', {
                        locale: nl,
                      })}
                    </div>
                  </div>
                  <Badge
                    variant={response.respondentRole === 'leadership' ? 'default' : 'secondary'}
                    className={
                      response.respondentRole === 'leadership'
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }
                  >
                    {response.respondentRole === 'leadership' ? (
                      <>
                        <Briefcase className="w-3 h-3 mr-1" />
                        Directie
                      </>
                    ) : (
                      <>
                        <Users className="w-3 h-3 mr-1" />
                        Personeel
                      </>
                    )}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Weet je zeker dat je de response van ${response.respondentName} wilt verwijderen?`)) {
                      onDeleteResponse(response.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Waarschuwing als er alleen maar één type is */}
        {responses.length > 0 && (leadershipResponses.length === 0 || staffResponses.length === 0) && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Let op:</strong> Voor een volledig profiel is het aan te raden om responses
              van zowel directie als ander personeel te hebben.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
