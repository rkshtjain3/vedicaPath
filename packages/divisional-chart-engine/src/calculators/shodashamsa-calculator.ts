import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
import { DivisionalPosition } from '../types/divisional-types.js';
import { getSignCategory } from './navamsa-calculator.js';

/**
 * Calculates D16 Shodashamsa (Kalamsa) position from D1 sidereal longitude.
 * D16 governs vehicles, conveyances, general happiness, luxury, and comforts.
 * Division size: 30° / 16 = 1.875° (1° 52' 30").
 * 
 * Classical Rule (BPHS):
 * - Movable signs (Chara: Aries, Cancer, Libra, Capricorn): Count begins from Aries (1).
 * - Fixed signs (Sthira: Taurus, Leo, Scorpio, Aquarius): Count begins from Leo (5).
 * - Dual signs (Dvisvabhava: Gemini, Virgo, Sagittarius, Pisces): Count begins from Sagittarius (9).
 */
export function calculateShodashamsaPosition(sourceLongitude: number): DivisionalPosition {
  let normalized = sourceLongitude % 360;
  if (normalized < 0) normalized += 360;
  const d1SignId = Math.floor(normalized / 30) + 1;
  const degInSign = normalized % 30;

  const divisionSize = 30 / 16; // 1.875°
  let divIndex = Math.floor(degInSign / divisionSize);
  if (divIndex >= 16) divIndex = 15;
  if (divIndex < 0) divIndex = 0;
  const divisionNumber = divIndex + 1; // 1 to 16

  const category = getSignCategory(d1SignId);
  let startSignId = 1; // Aries
  if (category === 'FIXED') startSignId = 5; // Leo
  if (category === 'DUAL') startSignId = 9; // Sagittarius

  const d16SignId = ((startSignId + divisionNumber - 2) % 12) + 1;

  const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
  const degInD16 = Math.min(30, degInDiv * 16);
  const d16AbsoluteLongitude = (d16SignId - 1) * 30 + degInD16;

  const rashiResult = getRashiFromLongitude(d16AbsoluteLongitude);

  return {
    sign: RASHIS[d16SignId - 1],
    longitudeInSign: degInD16,
    formattedDegree: rashiResult.formattedDegree,
    absoluteLongitude: d16AbsoluteLongitude,
    sourceLongitude,
    divisionNumber,
  };
}
