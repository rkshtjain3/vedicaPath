import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
import { isOddSign } from './dashamsa-calculator.js';
/**
 * Calculates D24 Chaturvimsamsa (Siddhamsa) position from D1 sidereal longitude.
 * D24 governs higher learning, academic achievement, knowledge, intellect, and memory.
 * Division size: 30° / 24 = 1.25° (1° 15').
 *
 * Classical Rule (BPHS):
 * - Odd signs (Visham Rashi): Count begins from Leo (Simha - 5).
 * - Even signs (Sama Rashi): Count begins from Cancer (Karka - 4).
 */
export function calculateChaturvimsamsaPosition(sourceLongitude) {
    let normalized = sourceLongitude % 360;
    if (normalized < 0)
        normalized += 360;
    const d1SignId = Math.floor(normalized / 30) + 1;
    const degInSign = normalized % 30;
    const divisionSize = 1.25; // 30 / 24
    let divIndex = Math.floor(degInSign / divisionSize);
    if (divIndex >= 24)
        divIndex = 23;
    if (divIndex < 0)
        divIndex = 0;
    const divisionNumber = divIndex + 1; // 1 to 24
    const startSignId = isOddSign(d1SignId) ? 5 : 4; // Leo for odd, Cancer for even
    const d24SignId = ((startSignId + divisionNumber - 2) % 12) + 1;
    const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
    const degInD24 = Math.min(30, degInDiv * 24);
    const d24AbsoluteLongitude = (d24SignId - 1) * 30 + degInD24;
    const rashiResult = getRashiFromLongitude(d24AbsoluteLongitude);
    return {
        sign: RASHIS[d24SignId - 1],
        longitudeInSign: degInD24,
        formattedDegree: rashiResult.formattedDegree,
        absoluteLongitude: d24AbsoluteLongitude,
        sourceLongitude,
        divisionNumber,
    };
}
