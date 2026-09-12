import { BirthChart, PlanetName, RASHIS, RashiDetails } from '@vedica/astrology-core';
import { RashiDrishtiEvidence, RashiDrishtiItem } from '../types/jaimini-types.js';

export const JAIMINI_SIGN_ASPECTS: Record<number, number[]> = {
  1: [5, 8, 11], // Aries (Movable) -> Leo, Scorpio, Aquarius (not Taurus)
  2: [4, 7, 10], // Taurus (Fixed) -> Cancer, Libra, Capricorn (not Aries)
  3: [6, 9, 12], // Gemini (Dual) -> Virgo, Sagittarius, Pisces
  4: [8, 11, 2], // Cancer (Movable) -> Scorpio, Aquarius, Taurus (not Leo)
  5: [7, 10, 1], // Leo (Fixed) -> Libra, Capricorn, Aries (not Cancer)
  6: [3, 9, 12], // Virgo (Dual) -> Gemini, Sagittarius, Pisces
  7: [11, 2, 5], // Libra (Movable) -> Aquarius, Taurus, Leo (not Scorpio)
  8: [10, 1, 4], // Scorpio (Fixed) -> Capricorn, Aries, Cancer (not Libra)
  9: [3, 6, 12], // Sagittarius (Dual) -> Gemini, Virgo, Pisces
  10: [2, 5, 8], // Capricorn (Movable) -> Taurus, Leo, Scorpio (not Aquarius)
  11: [1, 4, 7], // Aquarius (Fixed) -> Aries, Cancer, Libra (not Capricorn)
  12: [3, 6, 9], // Pisces (Dual) -> Gemini, Virgo, Sagittarius
};

const SIGN_TYPE_MAP: Record<number, 'MOVABLE' | 'FIXED' | 'DUAL'> = {
  1: 'MOVABLE', 2: 'FIXED', 3: 'DUAL',
  4: 'MOVABLE', 5: 'FIXED', 6: 'DUAL',
  7: 'MOVABLE', 8: 'FIXED', 9: 'DUAL',
  10: 'MOVABLE', 11: 'FIXED', 12: 'DUAL',
};

const ADJACENT_EXCLUDED_SIGN: Record<number, string> = {
  1: 'Taurus', 2: 'Aries', 3: 'None',
  4: 'Leo', 5: 'Cancer', 6: 'None',
  7: 'Scorpio', 8: 'Libra', 9: 'None',
  10: 'Aquarius', 11: 'Capricorn', 12: 'None',
};

/**
 * Calculates Jaimini Rashi Drishti (sign aspects) with structured evidence traces.
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
    const signType = SIGN_TYPE_MAP[s];
    const aspectingSignIds = JAIMINI_SIGN_ASPECTS[s] || [];
    const aspectingSigns = aspectingSignIds.map((id) => RASHIS[id - 1]);

    const occupyingPlanets = signOccupants[s] || [];

    const aspectingPlanets: PlanetName[] = [];
    for (const aspectingId of aspectingSignIds) {
      const occs = signOccupants[aspectingId] || [];
      aspectingPlanets.push(...occs);
    }

    const excludedAdj = ADJACENT_EXCLUDED_SIGN[s];
    const targetSignNames = aspectingSigns.map((as) => as.name);

    const reasoning = `${targetSign.name} is a ${signType} sign. According to Jaimini Rashi Drishti rules, it aspects ${targetSignNames.join(', ')}${excludedAdj !== 'None' ? ` (excluding adjacent sign ${excludedAdj})` : ''}. Planets casting aspect on ${targetSign.name}: ${aspectingPlanets.length > 0 ? aspectingPlanets.join(', ') : 'None'}.`;

    const reasoningHi = `${targetSign.name} एक ${signType === 'MOVABLE' ? 'चर' : signType === 'FIXED' ? 'स्थिर' : 'द्विस्वभाव'} राशि है। जैमिनी दृष्टि नियमानुसार यह ${targetSignNames.join(', ')} पर पूर्ण दृष्टि रखती है${excludedAdj !== 'None' ? ` (समीपवर्ती ${excludedAdj} राशि वर्जित)` : ''}। इस राशि पर दृष्टि डालने वाले ग्रह: ${aspectingPlanets.length > 0 ? aspectingPlanets.join(', ') : 'कोई नहीं'}।`;

    const evidence: RashiDrishtiEvidence = {
      signId: s,
      signName: targetSign.name,
      signType,
      targetSignNames,
      excludedAdjacentSignName: excludedAdj !== 'None' ? excludedAdj : undefined,
      aspectingPlanets,
      reasoning,
      reasoningHi,
    };

    results.push({
      sign: targetSign,
      signType,
      aspectingSigns,
      occupyingPlanets,
      aspectingPlanets,
      evidence,
    });
  }

  return results;
}
