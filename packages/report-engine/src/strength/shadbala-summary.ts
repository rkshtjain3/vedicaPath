import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
import { ReportEvidence } from '../types/evidence-types.js';

export function buildShadbalaSummary(shadbala: any): { text: string; evidence: ReportEvidence[] } {
  if (!shadbala?.planetScores) {
    return { text: 'Shadbala data unavailable.', evidence: [] };
  }

  const adequate: string[] = [];
  const inadequate: string[] = [];
  const evidence: ReportEvidence[] = [];

  for (const ps of shadbala.planetScores) {
    if (ps.isAdequate) {
      adequate.push(ps.planet);
    } else {
      inadequate.push(ps.planet);
    }

    evidence.push(
      createEvidenceItem(
        `shadbala_detail_${ps.planet}`,
        'shadbala-engine',
        'SHADBALA_BREAKDOWN',
        `${ps.planet}: ${ps.totalShadbalaRupasa.toFixed(2)} Rupas (${ps.percentageOfRequirement.toFixed(0)}% required).`,
        ps.isAdequate ? 'SUPPORTIVE' : 'CHALLENGING',
        'MEDIUM',
        'STRENGTH',
        ps.planet,
        ps
      )
    );
  }

  const text = `Shadbala adequate planets: ${adequate.join(', ') || 'None'}. Inadequate planets: ${inadequate.join(', ') || 'None'}.`;

  return { text, evidence };
}
