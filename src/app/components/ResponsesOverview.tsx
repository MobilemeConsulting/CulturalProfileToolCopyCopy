import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { IndividualResponse } from '../data/types';
import { PROFIT_ROLES, RoleOption, roleLabel } from '../data/respondentRoles';
import { Users, Trash2, Plus, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface ResponsesOverviewProps {
  responses: IndividualResponse[];
  // Rollen waaruit de invullers kiezen (standaard: bedrijfsrollen).
  roles?: RoleOption[];
  onAddResponse: () => void;
  onDeleteResponse: (id: string) => void;
}

// De weging per rol wordt bewust niet getoond (besluit AHHA, 12-11-2026).
export function ResponsesOverview({
  responses,
  roles = PROFIT_ROLES,
  onAddResponse,
  onDeleteResponse,
}: ResponsesOverviewProps) {
  // Inline bevestiging i.p.v. confirm() (in een iframe-embed toont de browser
  // daar "een ingesloten pagina zegt…" bij).
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const countFor = (role: RoleOption['value']) =>
    responses.filter((r) => r.respondentRole === role).length;
  const rolesPresent = roles.filter((r) => countFor(r.value) > 0).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invullers
            </CardTitle>
            <CardDescription>
              Overzicht van iedereen die de vragenlijst heeft ingevuld
            </CardDescription>
          </div>
          <Button onClick={onAddResponse}>
            <Plus className="w-4 h-4 mr-2" />
            Invuller toevoegen
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Aantallen per rol */}
        <div className={`grid grid-cols-2 ${roles.length > 2 ? 'sm:grid-cols-5' : 'sm:grid-cols-3'} gap-4 mb-6`}>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{responses.length}</div>
            <div className="text-sm text-gray-600">Totaal</div>
          </div>
          {roles.map((role) => (
            <div key={role.value} className="bg-teal-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-teal-900">{countFor(role.value)}</div>
              <div className="text-sm text-teal-700">{role.label}</div>
            </div>
          ))}
        </div>

        {/* Lijst van invullers */}
        {responses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Nog niemand heeft de vragenlijst ingevuld
            </h3>
            <p className="text-gray-600 mb-4">
              Voeg de eerste persoon toe die de vragenlijst invult
            </p>
            <Button onClick={onAddResponse}>
              <Plus className="w-4 h-4 mr-2" />
              Eerste invuller toevoegen
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {responses.map((response) => (
              <div key={response.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white font-semibold">
                      {response.respondentName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{response.respondentName}</div>
                      <div className="text-sm text-gray-500">
                        Ingevuld op{' '}
                        {format(new Date(response.completedAt), 'dd MMM yyyy HH:mm', { locale: nl })}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                      <Users className="w-3 h-3 mr-1" />
                      {roleLabel(roles, response.respondentRole)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPendingDelete(response.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    aria-label={`Antwoorden van ${response.respondentName} verwijderen`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {pendingDelete === response.id && (
                  <div className="mt-3 flex items-center justify-between gap-3 flex-wrap rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <span className="text-sm text-red-800">
                      De antwoorden van {response.respondentName} verwijderen?
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPendingDelete(null)}>
                        Annuleren
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          onDeleteResponse(response.id);
                          setPendingDelete(null);
                        }}
                      >
                        Verwijderen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tip als maar één rol vertegenwoordigd is */}
        {responses.length > 0 && rolesPresent === 1 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Tip:</strong> het profiel wordt vollediger als mensen met verschillende
              functies de vragenlijst invullen.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
