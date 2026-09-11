import { BirthChart, PlanetName, RASHIS, RashiDetails } from '@vedica/astrology-core';
import { RashiDrishtiItem } from '../types/jaimini-types.js';

export const JAIMINI_SIGN_ASPECTS: Record<number, number[]> = {
  1: [5, 8, 11], // Aries -> Leo, Scorpio, Aquarius (not Taurus)
  2: [4, 7, 10], // Taurus -> Cancer, Libra, Capricorn (not Aries)
  3: [6, 9, 12], // Gemini -> Virgo, Sagittarius, Pisces
  4: [8, 11, 2], // Cancer -> Scorpio, Aquarius, Taurus (not Leo)
  5: [7, 10, 1], // Leo -> Libra, Capricorn, Aries (not Cancer)
  6: [3, 9, 12], // Virgo -> Gemini, Sagittarius, Pisces
  7: [11, 2, 5], // Libra -> Aquarius, Taurus, Leo (not Scorpio)
  8: [10, 1, 4], // Scorpio -> Capricorn, Aries, Cancer (not Libra)
  9: [3, 6, 12], // Sagittarius -> Gemini, Virgo, Pisces
  10: [2, 5, 8], // Capricorn -> Taurus, Leo, Scorpio (not Aquarius)
  11: [1, 4, 7], // Aquarius -> Aries, Cancer, Libra (not Capricorn)
  12: [3, 6, 9], // Pisces -> Gemini, Virgo, Sagittarius
};

/**
 * Calculates Jaimini Rashi Drishti (sign aspects) and the resulting planetary mutual aspects.
 */
export function calculateRashiDrishti(birthChart: BirthChart): RashiDrishtiItem[] {
  // Map occupants per sign
  const signOccupants: Record<number, PlanetName[]> = {};
  for (let s = 1; s <= 12; s++) {
    signOccupants[s] = [];
  }

  for (const p of birthChart.planets) {
    const signId = (p as any).rashi?.id ?? (p as any).sign?.id ?? Math.floor(p.longitude / 30) + 1;
    if (signOccupants[signId]) {
      signOccupants[signId].push(p.planet);
    }
  }

  const results: RashiDrishtiItem[] = [];

  for (let s = 1; s <= 12; s++) {
    const targetSign = RASHIS[s - 1];
    const aspectingSignIds = JAIMINI_SIGN_ASPECTS[s] || [];
    const aspectingSigns = aspectingSignIds.map((id) => RASHIS[id - 1]);

    const occupyingPlanets = signOccupants[s] || [];

    const aspectingPlanets: PlanetName[] = [];
    for (const aspectingId of aspectingSignIds) {
      const occs = signOccupants[aspectingId] || [];
      aspectingPlanets.push(...occs);
    }

    results.push({
      sign: targetSign,
      aspectingSigns,
      occupyingPlanets,
      aspectingPlanets,
    });
  }

  return results;
}
