import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
/**
 * Calculates D4 Chaturthamsa (Turyamsa) position from D1 sidereal longitude.
 * D4 governs fixed assets, property, home, happiness, and mother/inheritance.
 * Division size: 30° / 4 = 7°30' = 7.5°.
 *
 * Classical Rule (BPHS):
 * 1st quarter (0° - 7.5°): 1st house (Same sign)
 * 2nd quarter (7.5° - 15.0°): 4th house from sign
 * 3rd quarter (15.0° - 22.5°): 7th house from sign
 * 4th quarter (22.5° - 30.0°): 10th house from sign
 */
export function calculateChaturthamsaPosition(sourceLongitude) {
    let normalized = sourceLongitude % 360;
    if (normalized < 0)
        normalized += 360;
    const d1SignId = Math.floor(normalized / 30) + 1;
    const degInSign = normalized % 30;
    const divisionSize = 7.5; // 30 / 4
    let divIndex = Math.floor(degInSign / divisionSize);
    if (divIndex >= 4)
        divIndex = 3;
    if (divIndex < 0)
        divIndex = 0;
    const divisionNumber = divIndex + 1; // 1 to 4
    // Offset: 0 for 1st, 3 for 2nd (4th sign), 6 for 3rd (7th sign), 9 for 4th (10th sign)
    const offset = (divisionNumber - 1) * 3;
    const d4SignId = ((d1SignId + offset - 1) % 12) + 1;
    const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
    const degInD4 = Math.min(30, degInDiv * 4);
    const d4AbsoluteLongitude = (d4SignId - 1) * 30 + degInD4;
    const rashiResult = getRashiFromLongitude(d4AbsoluteLongitude);
    return {
        sign: RASHIS[d4SignId - 1],
        longitudeInSign: degInD4,
        formattedDegree: rashiResult.formattedDegree,
        absoluteLongitude: d4AbsoluteLongitude,
        sourceLongitude,
        divisionNumber,
    };
}
