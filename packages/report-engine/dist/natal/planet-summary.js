import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
export function buildPlanetStructureSummary(chart, analysis, vargaComparison) {
    const exalted = [];
    const debilitated = [];
    const ownSign = [];
    const retrograde = [];
    const combust = [];
    const vargottama = [];
    const evidence = [];
    if (chart?.planets) {
        for (const p of chart.planets) {
            if (p.isRetrograde)
                retrograde.push(p.planet);
        }
    }
    if (analysis?.dignities) {
        for (const d of analysis.dignities) {
            if (d.dignity === 'EXALTED')
                exalted.push(d.planet);
            if (d.dignity === 'DEBILITATED')
                debilitated.push(d.planet);
            if (d.dignity === 'OWN_SIGN')
                ownSign.push(d.planet);
        }
    }
    if (analysis?.combustion) {
        for (const c of analysis.combustion) {
            if (c.isCombust)
                combust.push(c.planet);
        }
    }
    if (vargaComparison?.comparisonMap) {
        for (const [pName, comp] of Object.entries(vargaComparison.comparisonMap)) {
            if (comp?.isVargottama)
                vargottama.push(pName);
        }
    }
    const parts = [];
    if (exalted.length > 0)
        parts.push(`Exalted planets: ${exalted.join(', ')}.`);
    if (debilitated.length > 0)
        parts.push(`Debilitated planets: ${debilitated.join(', ')}.`);
    if (ownSign.length > 0)
        parts.push(`Own sign planets: ${ownSign.join(', ')}.`);
    if (vargottama.length > 0)
        parts.push(`Vargottama planets (D1=D9 sign): ${vargottama.join(', ')}.`);
    if (retrograde.length > 0)
        parts.push(`Retrograde planets: ${retrograde.join(', ')}.`);
    if (combust.length > 0)
        parts.push(`Combust planets: ${combust.join(', ')}.`);
    const text = parts.length > 0 ? parts.join(' ') : 'Planets occupy varied dignities across the chart.';
    evidence.push(createEvidenceItem('natal_dignities_summary', 'analysis-engine', 'DIGNITY_SUMMARY', text, 'FACTUAL', 'HIGH', 'GENERAL', 'PLANETARY_STRUCTURE', { exalted, debilitated, ownSign, retrograde, combust, vargottama }));
    return { text, evidence };
}
