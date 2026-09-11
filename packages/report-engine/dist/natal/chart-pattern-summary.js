import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
export function buildChartPatternSummary(chart) {
    const kendraPlanets = [];
    const trikonaPlanets = [];
    const dusthanaPlanets = [];
    if (chart?.planets) {
        for (const p of chart.planets) {
            if ([1, 4, 7, 10].includes(p.house))
                kendraPlanets.push(p.planet);
            if ([5, 9].includes(p.house))
                trikonaPlanets.push(p.planet);
            if ([6, 8, 12].includes(p.house))
                dusthanaPlanets.push(p.planet);
        }
    }
    const text = `Kendra houses (1, 4, 7, 10) contain ${kendraPlanets.length} planets (${kendraPlanets.join(', ') || 'None'}). Trikona houses (5, 9) contain ${trikonaPlanets.length} planets (${trikonaPlanets.join(', ') || 'None'}). Dusthana houses (6, 8, 12) contain ${dusthanaPlanets.length} planets (${dusthanaPlanets.join(', ') || 'None'}).`;
    const evidence = [
        createEvidenceItem('chart_house_distribution', 'astrology-core', 'HOUSE_DISTRIBUTION', text, 'FACTUAL', 'MEDIUM', 'GENERAL', 'PATTERNS', { kendraPlanets, trikonaPlanets, dusthanaPlanets }),
    ];
    return { text, evidence };
}
