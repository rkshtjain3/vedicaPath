import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
import { isOddSign } from './dashamsa-calculator.js';
/**
 * Calculates D40 Khavedamsa (Chatvarimsamsa) position from D1 sidereal longitude.
 * D40 governs auspicious and inauspicious effects, paternal legacy, and ancestral virtues/debts.
 * Division size: 30° / 40 = 0.75° (0° 45').
 *
 * Classical Rule (BPHS):
 * - Odd signs (Visham Rashi): Count begins from Aries (Mesha - 1).
 * - Even signs (Sama Rashi): Count begins from Libra (Tula - 7).
 */
export function calculateKhavedamsaPosition(sourceLongitude) {
    let normalized = sourceLongitude % 360;
    if (normalized < 0)
        normalized += 360;
    const d1SignId = Math.floor(normalized / 30) + 1;
    const degInSign = normalized % 30;
    const divisionSize = 0.75; // 30 / 40
    let divIndex = Math.floor(degInSign / divisionSize);
    if (divIndex >= 40)
        divIndex = 39;
    if (divIndex < 0)
        divIndex = 0;
    const divisionNumber = divIndex + 1; // 1 to 40
    const startSignId = isOddSign(d1SignId) ? 1 : 7; // Aries for odd, Libra for even
    const d40SignId = ((startSignId + divisionNumber - 2) % 12) + 1;
    const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
    const degInD40 = Math.min(30, degInDiv * 40);
    const d40AbsoluteLongitude = (d40SignId - 1) * 30 + degInD40;
    const rashiResult = getRashiFromLongitude(d40AbsoluteLongitude);
    return {
        sign: RASHIS[d40SignId - 1],
        longitudeInSign: degInD40,
        formattedDegree: rashiResult.formattedDegree,
        absoluteLongitude: d40AbsoluteLongitude,
        sourceLongitude,
        divisionNumber,
    };
}
