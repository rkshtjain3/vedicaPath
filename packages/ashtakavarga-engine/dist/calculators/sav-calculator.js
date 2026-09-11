import { RASHIS } from '@vedica/astrology-core';
import { ASHTAKAVARGA_PLANETS } from './bav-calculator.js';
/**
 * Calculates Sarvashtakavarga (SAV) by summing sign bindus across all 7 planetary BAVs.
 *
 * NOTE: Lagna is NOT an 8th BAV row in SAV summation.
 * Lagna contributes internally within each planet's 8-contributor BAV matrix.
 * SAV is strictly the sum of the seven planetary BAV sign totals.
 */
export function calculateSAV(bavMap) {
    const signPoints = {};
    let totalPoints = 0;
    for (const sign of RASHIS) {
        let signTotal = 0;
        for (const planet of ASHTAKAVARGA_PLANETS) {
            const planetBav = bavMap[planet];
            if (planetBav && planetBav.signPoints[sign.name] !== undefined) {
                signTotal += planetBav.signPoints[sign.name];
            }
        }
        signPoints[sign.name] = signTotal;
        totalPoints += signTotal;
    }
    return {
        signPoints,
        totalPoints,
        contributors: ASHTAKAVARGA_PLANETS,
    };
}
