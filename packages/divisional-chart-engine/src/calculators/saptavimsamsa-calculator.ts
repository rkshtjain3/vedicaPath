import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
import { DivisionalPosition, ElementCategory } from '../types/divisional-types.js';

export function getElementCategory(rashiId: number): ElementCategory {
  const normId = ((rashiId - 1) % 12) + 1;
  if ([1, 5, 9].includes(normId)) return 'FIRE';
  if ([2, 6, 10].includes(normId)) return 'EARTH';
  if ([3, 7, 11].includes(normId)) return 'AIR';
  return 'WATER';
}

/**
 * Calculates D27 Saptavimsamsa (Bhamsa / Nakshatramsa) position from D1 sidereal longitude.
 * D27 governs physical strength, stamina, fortitude, hidden potentials, and subconscious weaknesses.
 * Division size: 30° / 27 = 1° 06' 40" (1.111111°).
 * 
 * Classical Rule (BPHS):
 * - Fiery signs (Agni Rashi: Aries, Leo, Sagittarius): Count begins from Aries (1).
 * - Earthy signs (Prithvi Rashi: Taurus, Virgo, Capricorn): Count begins from Cancer (4).
 * - Airy signs (Vayu Rashi: Gemini, Libra, Aquarius): Count begins from Libra (7).
 * - Watery signs (Jala Rashi: Cancer, Scorpio, Pisces): Count begins from Capricorn (10).
 */
export function calculateSaptavimsamsaPosition(sourceLongitude: number): DivisionalPosition {
  let normalized = sourceLongitude % 360;
  if (normalized < 0) normalized += 360;
  const d1SignId = Math.floor(normalized / 30) + 1;
  const degInSign = normalized % 30;

  const divisionSize = 30 / 27; // 1.111111°
  let divIndex = Math.floor(degInSign / divisionSize);
  if (divIndex >= 27) divIndex = 26;
  if (divIndex < 0) divIndex = 0;
  const divisionNumber = divIndex + 1; // 1 to 27

  const element = getElementCategory(d1SignId);
  let startSignId = 1; // Aries for Fire
  if (element === 'EARTH') startSignId = 4; // Cancer
  if (element === 'AIR') startSignId = 7; // Libra
  if (element === 'WATER') startSignId = 10; // Capricorn

  const d27SignId = ((startSignId + divisionNumber - 2) % 12) + 1;

  const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
  const degInD27 = Math.min(30, degInDiv * 27);
  const d27AbsoluteLongitude = (d27SignId - 1) * 30 + degInD27;

  const rashiResult = getRashiFromLongitude(d27AbsoluteLongitude);

  return {
    sign: RASHIS[d27SignId - 1],
    longitudeInSign: degInD27,
    formattedDegree: rashiResult.formattedDegree,
    absoluteLongitude: d27AbsoluteLongitude,
    sourceLongitude,
    divisionNumber,
  };
}
