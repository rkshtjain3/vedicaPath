import { virupasToRupas } from '../units/shadbala-units.js';
import { PLANET_GENDER_CATEGORIES } from './ojayugma-bala.js';
/**
 * Determines Drekkana (1st: 0°-10°, 2nd: 10°-20°, 3rd: 20°-30°) from D1 longitude.
 */
export function getDrekkanaNumber(degreeInSign) {
    const normDeg = degreeInSign % 30;
    if (normDeg < 10)
        return 1;
    if (normDeg < 20)
        return 2;
    return 3;
}
/**
 * Calculates Drekkana Bala (Decan Strength).
 *
 * Classical Rule (BPHS):
 * - Male planets (Sun, Mars, Jupiter) receive 15 Virupas in the 1st Drekkana (0°-10°).
 * - Neutral planets (Mercury, Saturn) receive 15 Virupas in the 2nd Drekkana (10°-20°).
 * - Female planets (Moon, Venus) receive 15 Virupas in the 3rd Drekkana (20°-30°).
 */
export function calculateDrekkanaBala(planet, degreeInSign) {
    const drekkana = getDrekkanaNumber(degreeInSign);
    const genderCategory = PLANET_GENDER_CATEGORIES[planet] || 'NEUTRAL';
    let virupas = 0;
    if (genderCategory === 'MALE' && drekkana === 1)
        virupas = 15;
    else if (genderCategory === 'NEUTRAL' && drekkana === 2)
        virupas = 15;
    else if (genderCategory === 'FEMALE' && drekkana === 3)
        virupas = 15;
    const rupas = virupasToRupas(virupas);
    const evidence = [
        `Planet: ${planet} (${genderCategory})`,
        `Degree in Sign: ${degreeInSign.toFixed(2)}°`,
        `Drekkana: ${drekkana} (${drekkana === 1 ? '0°-10°' : drekkana === 2 ? '10°-20°' : '20°-30°'})`,
        `Drekkana Bala: ${virupas} Virupas (${rupas.toFixed(2)} Rupas)`,
    ];
    return {
        name: 'Drekkana Bala',
        subcomponentName: 'DREKKANA_BALA',
        virupas,
        rupas,
        formulaVersion: 'bphs-drekkana-v1',
        status: 'IMPLEMENTED_UNBENCHMARKED',
        inputs: {
            planet,
            degreeInSign,
            drekkana,
            genderCategory,
        },
        evidence,
    };
}
