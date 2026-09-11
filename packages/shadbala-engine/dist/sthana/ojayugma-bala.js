import { virupasToRupas } from '../units/shadbala-units.js';
export const PLANET_GENDER_CATEGORIES = {
    Sun: 'MALE',
    Mars: 'MALE',
    Jupiter: 'MALE',
    Moon: 'FEMALE',
    Venus: 'FEMALE',
    Mercury: 'NEUTRAL',
    Saturn: 'NEUTRAL',
    Rahu: 'NEUTRAL',
    Ketu: 'NEUTRAL',
};
/**
 * Calculates Ojayugmarasyamsa Bala (Odd/Even Sign Strength).
 *
 * Classical Methodology:
 * - Male planets (Sun, Mars, Jupiter) & Neutral planets (Mercury, Saturn) receive 15 Virupas for placement in Odd signs (1, 3, 5, 7, 9, 11) in D1 and D9.
 * - Female planets (Moon, Venus) receive 15 Virupas for placement in Even signs (2, 4, 6, 8, 10, 12) in D1 and D9.
 * Maximum score: 30 Virupas (15 from D1 + 15 from D9).
 */
export function calculateOjayugmaBala(planet, d1Sign, d9Sign) {
    const genderCategory = PLANET_GENDER_CATEGORIES[planet] || 'NEUTRAL';
    const isOddSign = (signId) => signId % 2 === 1;
    // D1 check
    const d1IsOdd = isOddSign(d1Sign.id);
    const d1GetsPoints = genderCategory === 'MALE' || genderCategory === 'NEUTRAL' ? d1IsOdd : !d1IsOdd;
    const d1Virupas = d1GetsPoints ? 15 : 0;
    // D9 check
    let d9Virupas = 0;
    let d9IsOdd;
    if (d9Sign) {
        d9IsOdd = isOddSign(d9Sign.id);
        const d9GetsPoints = genderCategory === 'MALE' || genderCategory === 'NEUTRAL' ? d9IsOdd : !d9IsOdd;
        d9Virupas = d9GetsPoints ? 15 : 0;
    }
    const totalVirupas = d1Virupas + d9Virupas;
    const totalRupas = virupasToRupas(totalVirupas);
    const evidence = [
        `Planet: ${planet} (${genderCategory})`,
        `D1 Sign: ${d1Sign.name} (Sign #${d1Sign.id}, ${d1IsOdd ? 'Odd' : 'Even'}) -> ${d1Virupas} Virupas`,
        d9Sign
            ? `D9 Sign: ${d9Sign.name} (Sign #${d9Sign.id}, ${d9IsOdd ? 'Odd' : 'Even'}) -> ${d9Virupas} Virupas`
            : `D9 Sign: Not provided`,
        `Total Ojayugma Bala: ${totalVirupas} Virupas (${totalRupas.toFixed(2)} Rupas)`,
    ];
    return {
        name: 'Ojayugma Bala',
        subcomponentName: 'OJAYUGMA_BALA',
        virupas: totalVirupas,
        rupas: totalRupas,
        formulaVersion: 'bphs-ojayugma-v1',
        status: 'IMPLEMENTED_UNBENCHMARKED',
        inputs: {
            planet,
            genderCategory,
            d1SignId: d1Sign.id,
            d1SignName: d1Sign.name,
            d1IsOdd,
            d9SignId: d9Sign?.id,
            d9SignName: d9Sign?.name,
            d9IsOdd,
            d1Virupas,
            d9Virupas,
        },
        evidence,
    };
}
