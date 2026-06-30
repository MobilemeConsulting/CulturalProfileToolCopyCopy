import * as XLSX from 'xlsx';
import { OrganisationProfile } from '../data/types';
import { MatchResult } from '../services/supabaseService';
import { computeMatch } from './matching';
import { MATCH_STATUS_LABELS, MatchStatus } from '../services/matchStatusService';

// Export all profiles as Excel
export function exportProfilesToExcel(profiles: OrganisationProfile[]) {
  const data = profiles.map(p => ({
    'Naam': p.meta.orgName || '',
    'Type': p.organisationType === 'cultural' ? 'Cultureel' : 'Profit',
    'Sector': p.meta.orgType || '',
    'Jaar': p.meta.year || '',
    'Industrie': p.meta.industry || '',
    ...Object.fromEntries(
      (p.dimensions || []).map(d => [d.label, Math.round(d.axes.reduce((s, a) => s + a.score, 0) / Math.max(d.axes.length, 1))])
    ),
    'Aangemaakt': p.createdAt || '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Profielen');
  XLSX.writeFile(wb, `AHHA-profielen-${new Date().toISOString().slice(0,10)}.xlsx`);
}

// Export match matrix + CRM data as Excel (multiple sheets)
export function exportMatchDataToExcel(
  profiles: OrganisationProfile[],
  savedResults: MatchResult[]
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Match Matrix
  const cultural = profiles.filter(p => p.organisationType === 'cultural');
  const profit = profiles.filter(p => p.organisationType === 'profit');

  const matrixData = cultural.map(c => {
    const row: Record<string, any> = { 'Cultureel': c.meta.orgName };
    profit.forEach(p => {
      const { overall } = computeMatch(c.dimensions, p.dimensions);
      row[p.meta.orgName || p.id] = Math.round(overall);
    });
    return row;
  });

  const ws1 = XLSX.utils.json_to_sheet(matrixData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Match-matrix');

  // Sheet 2: Saved results with CRM data
  if (savedResults.length > 0) {
    const getName = (id: string) => profiles.find(p => p.id === id)?.meta.orgName || id;
    const crmData = savedResults.map(r => ({
      'Cultureel': getName(r.cultural_id),
      'Profit': getName(r.profit_id),
      'Match %': Math.round(r.match_score),
      'Status': MATCH_STATUS_LABELS[(r.status as MatchStatus) || 'nieuw'] || r.status || '',
      'Contactpersoon': r.contact_name || '',
      'E-mail contact': r.contact_email || '',
      'Telefoon': r.contact_phone || '',
      'Notities': r.notes || '',
      'Laatst contact': r.last_contact_at || '',
      'Volgend contact': r.next_contact_at || '',
      'Opgeslagen op': r.created_at || '',
    }));
    const ws2 = XLSX.utils.json_to_sheet(crmData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Opgeslagen matches');
  }

  XLSX.writeFile(wb, `AHHA-matches-${new Date().toISOString().slice(0,10)}.xlsx`);
}
