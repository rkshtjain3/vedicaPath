import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
import { getSignCategory } from './navamsa-calculator.js';
/**
 * Calculates D45 Akshavedamsa position from D1 sidereal longitude.
 * D45 governs all general matters, moral character, purity, ethical conduct, and auspiciousness.
 * Division size: 30° / 45 = 0° 40' (0.666667°).
 *
 * Classical Rule (BPHS):
 * - Movable signs (Chara: Aries, Cancer, Libra, Capricorn): Count begins from Aries (1).
 * - Fixed signs (Sthira: Taurus, Leo, Scorpio, Aquarius): Count begins from Leo (5).
 * - Dual signs (Dvisvabhava: Gemini, Virgo, Sagittarius, Pisces): Count begins from Sagittarius (9).
 */
export function calculateAkshavedamsaPosition(sourceLongitude) {
    let normalized = sourceLongitude % 360;
    if (normalized < 0)
        normalized += 360;
    const d1SignId = Math.floor(normalized / 30) + 1;
    const degInSign = normalized % 30;
    const divisionSize = 30 / 45; // 0.666667° (40 arcminutes)
    let divIndex = Math.floor(degInSign / divisionSize);
    if (divIndex >= 45)
        divIndex = 44;
    if (divIndex < 0)
        divIndex = 0;
    const divisionNumber = divIndex + 1; // 1 to 45
    const category = getSignCategory(d1SignId);
    let startSignId = 1; // Aries for Movable
    if (category === 'FIXED')
        startSignId = 5; // Leo for Fixed
    if (category === 'DUAL')
        startSignId = 9; // Sagittarius for Dual
    const d45SignId = ((startSignId + divisionNumber - 2) % 12) + 1;
    const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
    const degInD45 = Math.min(30, degInDiv * 45);
    const d45AbsoluteLongitude = (d45SignId - 1) * 30 + degInD45;
    const rashiResult = getRashiFromLongitude(d45AbsoluteLongitude);
    return {
        sign: RASHIS[d45SignId - 1],
        longitudeInSign: degInD45,
        formattedDegree: rashiResult.formattedDegree,
        absoluteLongitude: d45AbsoluteLongitude,
        sourceLongitude,
        divisionNumber,
    };
}
