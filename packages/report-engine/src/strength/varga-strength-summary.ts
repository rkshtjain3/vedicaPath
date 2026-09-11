import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
import { ReportEvidence } from '../types/evidence-types.js';

export function buildVargaStrengthSummary(vargaComparison: any): { text: string; evidence: ReportEvidence[] } {
  if (!vargaComparison?.comparisonMap) {
    return { text: 'Varga strength comparison data unavailable.', evidence: [] };
  }

  const vargottamaPlanets: string[] = [];
  const evidence: ReportEvidence[] = [];

  for (const [planet, comp] of Object.entries(vargaComparison.comparisonMap) as any) {
    if (comp?.isVargottama) {
      vargottamaPlanets.push(planet);
      evidence.push(
        createEvidenceItem(
          `varga_vargottama_${planet}`,
          'divisional-chart-engine',
          'VARGOTTAMA_FACT',
          `${planet} is Vargottama (same sign in D1 Rashi and D9 Navamsa).`,
          'SUPPORTIVE',
          'HIGH',
          'STRENGTH',
          planet,
          comp
        )
      );
    }
  }

  const text = vargottamaPlanets.length > 0
    ? `Vargottama planets (D1 & D9 sign identity): ${vargottamaPlanets.join(', ')}.`
    : 'No planets are Vargottama between D1 Rashi and D9 Navamsa.';

  return { text, evidence };
}
