import { supabase } from './supabaseClient';

export async function sendMatchReport(args: {
  toEmail: string;
  toName?: string;
  subject: string;
  html: string;
}): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: 'Supabase is niet geconfigureerd.' };
  }

  const { data, error } = await supabase.functions.invoke('send-match-report', {
    body: args,
  });

  if (error) {
    return { error: error.message };
  }
  if (data?.error) {
    return { error: data.error };
  }
  return { error: null };
}

export function buildMatchReportHtml(args: {
  culturalName: string;
  profitName: string;
  overall: number;
  dimensionMatches: { dimension: string; matchScore: number }[];
}): string {
  const { culturalName, profitName, overall, dimensionMatches } = args;

  const rows = dimensionMatches
    .map(
      (d) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;">${d.dimension}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:#111827;">${Math.round(
            d.matchScore,
          )}%</td>
        </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="nl">
  <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:24px;">
      <div style="background-color:#ffffff;border-radius:12px;padding:32px;">
        <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Matchrapport</h1>
        <p style="margin:0 0 4px;font-size:15px;color:#374151;">
          <strong>Culturele organisatie:</strong> ${culturalName}
        </p>
        <p style="margin:0 0 24px;font-size:15px;color:#374151;">
          <strong>Profit-organisatie:</strong> ${profitName}
        </p>
        <div style="text-align:center;margin:0 0 28px;">
          <div style="font-size:14px;color:#6b7280;margin-bottom:4px;">Totale match</div>
          <div style="font-size:48px;font-weight:700;color:#4f46e5;line-height:1;">${Math.round(
            overall,
          )}%</div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr>
              <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #d1d5db;color:#6b7280;font-size:12px;text-transform:uppercase;">Dimensie</th>
              <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #d1d5db;color:#6b7280;font-size:12px;text-transform:uppercase;">Match</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>`;
}
