import { calculateAshtaKoota } from './ashta-koota/ashta-koota-calculator.js';
import { evaluateKujaDosha } from './kuja-dosha/kuja-dosha-evaluator.js';
function getRashiIndexFromLongitude(longitude) {
    return Math.floor(((longitude % 360) + 360) % 360 / 30) + 1;
}
function getNakshatraIndexFromLongitude(longitude) {
    return Math.floor(((longitude % 360) + 360) % 360 / (360 / 27)) + 1;
}
export function evaluateCompatibility(chartA, nameA, chartB, nameB) {
    const moonA = chartA.planets.find((p) => p.planet === 'Moon');
    const moonB = chartB.planets.find((p) => p.planet === 'Moon');
    const moonLongA = moonA?.longitude ?? 0;
    const moonLongB = moonB?.longitude ?? 0;
    const nakA = getNakshatraIndexFromLongitude(moonLongA);
    const rashiA = getRashiIndexFromLongitude(moonLongA);
    const nakB = getNakshatraIndexFromLongitude(moonLongB);
    const rashiB = getRashiIndexFromLongitude(moonLongB);
    const ashtaKoota = calculateAshtaKoota(nakA, rashiA, nakB, rashiB);
    const kujaDoshaA = evaluateKujaDosha(chartA, nameA);
    const kujaDoshaB = evaluateKujaDosha(chartB, nameB);
    // Overall compatibility score computation
    let netScore = ashtaKoota.percentage;
    if (kujaDoshaA.hasKujaDosha && !kujaDoshaB.hasKujaDosha) {
        netScore = Math.max(0, netScore - 10);
    }
    else if (!kujaDoshaA.hasKujaDosha && kujaDoshaB.hasKujaDosha) {
        netScore = Math.max(0, netScore - 10);
    }
    let summary = `${ashtaKoota.totalObtained}/36 Points (${ashtaKoota.percentage}%). Grade: ${ashtaKoota.compatibilityGrade}.`;
    if (kujaDoshaA.hasKujaDosha || kujaDoshaB.hasKujaDosha) {
        summary += ` Kuja Dosha evaluated for ${nameA} and ${nameB}.`;
    }
    let recommendation = 'Auspicious relationship pairing.';
    if (ashtaKoota.totalObtained >= 28) {
        recommendation = 'Highly recommended relationship pairing with exceptional emotional and destiny synergy.';
    }
    else if (ashtaKoota.totalObtained >= 18) {
        recommendation = 'Good baseline compatibility. Standard harmonizing practices recommended.';
    }
    else {
        recommendation = 'Below average score. Remedial harmonization recommended before major commitments.';
    }
    return {
        ashtaKoota,
        kujaDoshaPartnerA: kujaDoshaA,
        kujaDoshaPartnerB: kujaDoshaB,
        overallCompatibilityScore: netScore,
        recommendation,
        summary,
    };
}
