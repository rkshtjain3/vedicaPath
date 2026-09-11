import { calculatePlanetDignity } from '@vedica/analysis-engine';
export const SHODASHAVARGA_WEIGHTS = {
    D1: 3.5,
    D2: 1.0,
    D3: 1.0,
    D4: 0.5,
    D7: 0.5,
    D9: 3.0,
    D10: 0.5,
    D12: 0.5,
    D16: 2.0,
    D20: 0.5,
    D24: 0.5,
    D27: 0.5,
    D30: 1.0,
    D40: 0.5,
    D45: 0.5,
    D60: 4.0,
};
export const SHADVARGA_WEIGHTS = {
    D1: 6.0,
    D2: 2.0,
    D3: 4.0,
    D9: 5.0,
    D12: 2.0,
    D30: 1.0,
};
export const SAPTAVARGA_WEIGHTS = {
    D1: 5.0,
    D2: 2.0,
    D3: 3.0,
    D7: 2.5,
    D9: 4.5,
    D12: 2.0,
    D30: 1.0,
};
export const DASAVARGA_WEIGHTS = {
    D1: 3.0,
    D2: 1.5,
    D3: 1.5,
    D7: 1.5,
    D9: 1.5,
    D10: 1.5,
    D12: 1.5,
    D16: 1.5,
    D30: 1.5,
    D60: 5.0,
};
const DIGNITY_RATIOS = {
    EXALTED: 1.0, // 20/20
    MOOLATRIKONA: 0.9, // 18/20
    OWN_SIGN: 0.75, // 15/20
    FRIENDLY_SIGN: 0.55, // 11/20
    NEUTRAL_SIGN: 0.35, // 7/20
    ENEMY_SIGN: 0.2, // 4/20
    DEBILITATED: 0.0, // 0/20
};
/**
 * Calculates Vimsopaka Bala (20-point divisional strength) for the 7 classical planets.
 * Supports Shodashavarga (16 vargas), Dasavarga (10), Saptavarga (7), and Shadvarga (6).
 */
export function calculateVimsopakaBala(birthChart, divisionalCharts, scheme = 'SHODASHAVARGA') {
    let weightsMap = SHODASHAVARGA_WEIGHTS;
    if (scheme === 'SHADVARGA')
        weightsMap = SHADVARGA_WEIGHTS;
    if (scheme === 'SAPTAVARGA')
        weightsMap = SAPTAVARGA_WEIGHTS;
    if (scheme === 'DASAVARGA')
        weightsMap = DASAVARGA_WEIGHTS;
    const classicalPlanets = [
        'Sun',
        'Moon',
        'Mars',
        'Mercury',
        'Jupiter',
        'Venus',
        'Saturn',
    ];
    const planetsReport = {};
    const ranking = [];
    for (const planet of classicalPlanets) {
        const vargaScores = [];
        let totalScore = 0;
        for (const [chartTypeKey, weight] of Object.entries(weightsMap)) {
            const chartType = chartTypeKey;
            if (!weight)
                continue;
            let rashiSign = null;
            let longitudeInSign = 15;
            let absLongitude = 0;
            if (chartType === 'D1') {
                const d1Pos = birthChart.planets.find((p) => p.planet === planet);
                if (d1Pos) {
                    rashiSign = d1Pos.rashi ?? d1Pos.sign;
                    longitudeInSign = d1Pos.degreesInRashi ?? (d1Pos.longitude % 30);
                    absLongitude = d1Pos.longitude ?? 0;
                }
            }
            else {
                const divChart = divisionalCharts[chartType];
                if (divChart && divChart.planets[planet]) {
                    rashiSign = divChart.planets[planet].sign;
                    longitudeInSign = divChart.planets[planet].longitudeInSign;
                    absLongitude = divChart.planets[planet].absoluteLongitude;
                }
            }
            if (!rashiSign)
                continue;
            const dummyFact = {
                planet,
                longitude: absLongitude,
                sign: rashiSign.name,
                degreeInSign: longitudeInSign,
                house: 1,
                nakshatra: '',
                pada: 1,
                retrograde: false,
            };
            const dignityResult = calculatePlanetDignity(dummyFact);
            const dignity = dignityResult.primaryDignity;
            const scoreRatio = DIGNITY_RATIOS[dignity] ?? 0.35;
            const weightedScore = Number((weight * scoreRatio).toFixed(3));
            totalScore += weightedScore;
            vargaScores.push({
                chartType,
                weight,
                sign: rashiSign,
                dignity,
                scoreRatio,
                weightedScore,
            });
        }
        const roundedScore = Number(totalScore.toFixed(2));
        const percentage = Number(((roundedScore / 20) * 100).toFixed(1));
        let grade = 'MODERATE';
        if (roundedScore >= 15)
            grade = 'EXCELLENT';
        else if (roundedScore >= 12)
            grade = 'GOOD';
        else if (roundedScore >= 8)
            grade = 'MODERATE';
        else
            grade = 'WEAK';
        planetsReport[planet] = {
            planet,
            score: roundedScore,
            percentage,
            grade,
            vargaScores,
        };
        ranking.push({ planet, score: roundedScore });
    }
    ranking.sort((a, b) => b.score - a.score);
    return {
        scheme,
        planets: planetsReport,
        ranking,
    };
}
