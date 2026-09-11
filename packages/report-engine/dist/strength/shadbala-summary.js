import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
export function buildShadbalaSummary(shadbala) {
    if (!shadbala?.planetScores) {
        return { text: 'Shadbala data unavailable.', evidence: [] };
    }
    const adequate = [];
    const inadequate = [];
    const evidence = [];
    for (const ps of shadbala.planetScores) {
        if (ps.isAdequate) {
            adequate.push(ps.planet);
        }
        else {
            inadequate.push(ps.planet);
        }
        evidence.push(createEvidenceItem(`shadbala_detail_${ps.planet}`, 'shadbala-engine', 'SHADBALA_BREAKDOWN', `${ps.planet}: ${ps.totalShadbalaRupasa.toFixed(2)} Rupas (${ps.percentageOfRequirement.toFixed(0)}% required).`, ps.isAdequate ? 'SUPPORTIVE' : 'CHALLENGING', 'MEDIUM', 'STRENGTH', ps.planet, ps));
    }
    const text = `Shadbala adequate planets: ${adequate.join(', ') || 'None'}. Inadequate planets: ${inadequate.join(', ') || 'None'}.`;
    return { text, evidence };
}
