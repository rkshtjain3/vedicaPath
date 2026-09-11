import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
import { DivisionalPosition } from '../types/divisional-types.js';
import { getSignCategory } from './navamsa-calculator.js';

/**
 * Calculates D20 Vimsamsa position from D1 sidereal longitude.
 * D20 governs spiritual progress, worship, mantra siddhi, meditation, and inner devotion.
 * Division size: 30° / 20 = 1.5° (1° 30').
 * 
 * Classical Rule (BPHS):
 * - Movable signs (Chara: Aries, Cancer, Libra, Capricorn): Count begins from Aries (1).
 * - Fixed signs (Sthira: Taurus, Leo, Scorpio, Aquarius): Count begins from Sagittarius (9).
 * - Dual signs (Dvisvabhava: Gemini, Virgo, Sagittarius, Pisces): Count begins from Leo (5).
 */
export function calculateVimsamsaPosition(sourceLongitude: number): DivisionalPosition {
  let normalized = sourceLongitude % 360;
  if (normalized < 0) normalized += 360;
  const d1SignId = Math.floor(normalized / 30) + 1;
  const degInSign = normalized % 30;

  const divisionSize = 1.5; // 30 / 20
  let divIndex = Math.floor(degInSign / divisionSize);
  if (divIndex >= 20) divIndex = 19;
  if (divIndex < 0) divIndex = 0;
  const divisionNumber = divIndex + 1; // 1 to 20

  const category = getSignCategory(d1SignId);
  let startSignId = 1; // Aries
  if (category === 'FIXED') startSignId = 9; // Sagittarius
  if (category === 'DUAL') startSignId = 5; // Leo

  const d20SignId = ((startSignId + divisionNumber - 2) % 12) + 1;

  const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
  const degInD20 = Math.min(30, degInDiv * 20);
  const d20AbsoluteLongitude = (d20SignId - 1) * 30 + degInD20;

  const rashiResult = getRashiFromLongitude(d20AbsoluteLongitude);

  return {
    sign: RASHIS[d20SignId - 1],
    longitudeInSign: degInD20,
    formattedDegree: rashiResult.formattedDegree,
    absoluteLongitude: d20AbsoluteLongitude,
    sourceLongitude,
    divisionNumber,
  };
}
