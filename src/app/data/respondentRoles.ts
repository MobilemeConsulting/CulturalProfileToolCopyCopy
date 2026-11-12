import { RespondentRole } from './types';

export interface RoleOption {
  value: RespondentRole;
  label: string;
  description: string;
}

// Bedrijven: directie/management en ander personeel (weging in calculateAverages.ts).
export const PROFIT_ROLES: RoleOption[] = [
  { value: 'leadership', label: 'Directie / Management', description: 'Leidinggevende functie (CEO, directeur, manager, …)' },
  { value: 'staff', label: 'Ander personeel', description: 'Medewerker, specialist, coördinator, …' },
];

// Culturele organisaties (rollen bevestigd door AHHA, november 2026).
export const CULTURAL_ROLES: RoleOption[] = [
  { value: 'directie', label: 'Directie', description: 'Directeur, zakelijk of artistiek leider, management' },
  { value: 'bestuur', label: 'Bestuur', description: 'Lid van de raad van bestuur of de algemene vergadering' },
  { value: 'medewerker', label: 'Medewerker', description: 'Betaalde medewerker' },
  { value: 'vrijwilliger', label: 'Vrijwilliger', description: 'Vrijwillige medewerker' },
];

// Weging van de rollen in het gecombineerde cultuurprofiel. Bewust intern:
// niet tonen in de tool (besluit AHHA, 12-11-2026). Rollen zonder invullers
// vallen weg; de gewichten van de overige rollen worden herschaald.
export const CULTURAL_ROLE_WEIGHTS: Partial<Record<RespondentRole, number>> = {
  directie: 0.4,
  bestuur: 0.3,
  medewerker: 0.2,
  vrijwilliger: 0.1,
};

export function roleLabel(roles: RoleOption[], value: RespondentRole): string {
  return roles.find((r) => r.value === value)?.label ?? value;
}
