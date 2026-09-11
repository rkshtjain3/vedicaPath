import { BirthChart, RASHIS } from '@vedica/astrology-core';
import {
  AshtakavargaPlanet,
  BhinnaAshtakavarga,
  PlanetaryShodhana,
  ShodhanaResult,
} from '../types/ashtakavarga-types.js';
import { ASHTAKAVARGA_PLANETS } from './bav-calculator.js';

export type RashiName =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

/**
 * Classical Rashi Gunakara (Sign Multipliers) from BPHS
 */
export const RASHI_GUNAKARA: Record<RashiName, number> = {

  Aries: 7,
  Taurus: 10,
  Gemini: 8,
  Cancer: 4,
  Leo: 10,
  Virgo: 5,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 5,
  Aquarius: 11,
  Pisces: 12,
};

/**
 * Classical Graha Gunakara (Planetary Multipliers) from BPHS
 */
export const GRAHA_GUNAKARA: Record<AshtakavargaPlanet, number> = {
  SUN: 5,
  MOON: 5,
  MARS: 8,
  MERCURY: 5,
  JUPITER: 10,
  VENUS: 7,
  SATURN: 5,
};

/**
 * Classical Trikona (Trine) Groups
 */
export const TRIKONA_GROUPS: [RashiName, RashiName, RashiName][] = [
  ['Aries', 'Leo', 'Sagittarius'], // Fire Trine (1, 5, 9)
  ['Taurus', 'Virgo', 'Capricorn'], // Earth Trine (2, 6, 10)
  ['Gemini', 'Libra', 'Aquarius'], // Air Trine (3, 7, 11)
  ['Cancer', 'Scorpio', 'Pisces'], // Water Trine (4, 8, 12)
];

/**
 * Classical Dual-Lordship Pairs for Ekadhipatya Shodhana
 */
export const DUAL_LORDSHIP_PAIRS: {
  planet: AshtakavargaPlanet;
  signs: [RashiName, RashiName];
}[] = [
  { planet: 'MARS', signs: ['Aries', 'Scorpio'] },
  { planet: 'VENUS', signs: ['Taurus', 'Libra'] },
  { planet: 'MERCURY', signs: ['Gemini', 'Virgo'] },
  { planet: 'JUPITER', signs: ['Sagittarius', 'Pisces'] },
  { planet: 'SATURN', signs: ['Capricorn', 'Aquarius'] },
];

/**
 * Performs Trikona Shodhana (Trine Reduction) on a single BAV.
 */
export function performTrikonaShodhana(
  signPoints: Record<string, number>
): Record<string, number> {
  const result: Record<string, number> = { ...signPoints };

  for (const group of TRIKONA_GROUPS) {
    const b0 = result[group[0]] ?? 0;
    const b1 = result[group[1]] ?? 0;
    const b2 = result[group[2]] ?? 0;

    const minBindu = Math.min(b0, b1, b2);

    result[group[0]] = b0 - minBindu;
    result[group[1]] = b1 - minBindu;
    result[group[2]] = b2 - minBindu;
  }

  return result;
}

/**
 * Gets the list of planets occupying each sign from a natal chart.
 */
export function getOccupiedSigns(chart: BirthChart): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const rashi of RASHIS) {
    map[rashi.name] = [];
  }

  for (const planet of chart.planets) {
    const signName = planet.sign.name;
    if (map[signName]) {
      map[signName].push(planet.planet);
    }
  }

  return map;
}


/**
 * Performs Ekadhipatya Shodhana (Dual-Lordship Reduction) on post-Trikona bindus.
 */
export function performEkadhipatyaShodhana(
  trikonaPoints: Record<string, number>,
  chart: BirthChart
): {
  ekadhipatyaPoints: Record<string, number>;
  explanation: string[];
} {
  const result: Record<string, number> = { ...trikonaPoints };
  const explanation: string[] = [];
  const occupied = getOccupiedSigns(chart);

  for (const pair of DUAL_LORDSHIP_PAIRS) {
    const [s1, s2] = pair.signs;
    const b1 = result[s1] ?? 0;
    const b2 = result[s2] ?? 0;

    const occ1 = (occupied[s1]?.length ?? 0) > 0;
    const occ2 = (occupied[s2]?.length ?? 0) > 0;

    if (occ1 && occ2) {
      // Rule 1: Both occupied -> no reduction
      explanation.push(
        `${pair.planet} (${s1} & ${s2}): Both signs occupied by planets. No Ekadhipatya reduction.`
      );
    } else if (occ1 && !occ2) {
      // Rule 2a: S1 occupied, S2 vacant
      if (b2 > b1) {
        result[s2] = b1;
        explanation.push(
          `${pair.planet}: ${s1} occupied (${b1}b), ${s2} vacant (${b2}b -> reduced to ${b1}b).`
        );
      } else {
        result[s2] = 0;
        explanation.push(
          `${pair.planet}: ${s1} occupied (${b1}b), ${s2} vacant (${b2}b -> reduced to 0).`
        );
      }
    } else if (!occ1 && occ2) {
      // Rule 2b: S2 occupied, S1 vacant
      if (b1 > b2) {
        result[s1] = b2;
        explanation.push(
          `${pair.planet}: ${s2} occupied (${b2}b), ${s1} vacant (${b1}b -> reduced to ${b2}b).`
        );
      } else {
        result[s1] = 0;
        explanation.push(
          `${pair.planet}: ${s2} occupied (${b2}b), ${s1} vacant (${b1}b -> reduced to 0).`
        );
      }
    } else {
      // Rule 3: Both vacant
      if (b1 === b2) {
        result[s1] = 0;
        result[s2] = 0;
        explanation.push(
          `${pair.planet}: Both ${s1} and ${s2} vacant with equal bindus (${b1}b -> both become 0).`
        );
      } else {
        if (b1 === 0 || b2 === 0) {
          // If one is already 0, non-zero remains unchanged
          explanation.push(
            `${pair.planet}: Both ${s1} and ${s2} vacant; one sign has 0 bindus. Retaining non-zero value.`
          );
        } else {
          // Both non-zero, reduce larger to smaller
          const minB = Math.min(b1, b2);
          result[s1] = minB;
          result[s2] = minB;
          explanation.push(
            `${pair.planet}: Both ${s1} and ${s2} vacant with unequal bindus (${b1}b vs ${b2}b -> larger reduced to ${minB}b).`
          );
        }
      }
    }
  }

  return {
    ekadhipatyaPoints: result,
    explanation,
  };
}

/**
 * Calculates Rashi Pinda, Graha Pinda, and Shodhya Pinda for a reduced BAV.
 */
export function calculatePindas(
  ekadhipatyaPoints: Record<string, number>,
  chart: BirthChart
): {
  rashiPinda: number;
  grahaPinda: number;
  shodhyaPinda: number;
} {
  // 1. Rashi Pinda
  let rashiPinda = 0;
  for (const rashi of RASHIS) {
    const bindus = ekadhipatyaPoints[rashi.name] ?? 0;
    const mult = RASHI_GUNAKARA[rashi.name as RashiName] ?? 7;
    rashiPinda += bindus * mult;
  }


  // 2. Graha Pinda
  let grahaPinda = 0;
  for (const p of chart.planets) {
    const planetKey = p.planet.toUpperCase() as AshtakavargaPlanet;
    const mult = GRAHA_GUNAKARA[planetKey];
    if (mult !== undefined) {
      const signBindus = ekadhipatyaPoints[p.sign.name] ?? 0;
      grahaPinda += signBindus * mult;
    }
  }

  // 3. Shodhya Pinda = Rashi Pinda + Graha Pinda
  const shodhyaPinda = rashiPinda + grahaPinda;

  return {
    rashiPinda,
    grahaPinda,
    shodhyaPinda,
  };
}

/**
 * Performs full Shodhana (Trikona, Ekadhipatya, and Shodhya Pinda) across all 7 planets.
 */
export function performFullShodhana(
  bav: Record<AshtakavargaPlanet, BhinnaAshtakavarga>,
  chart: BirthChart
): ShodhanaResult {
  const trikonaShodhana: Partial<Record<AshtakavargaPlanet, Record<string, number>>> = {};
  const ekadhipatyaShodhana: Partial<Record<AshtakavargaPlanet, Record<string, number>>> = {};
  const planetaryPindas: Partial<Record<AshtakavargaPlanet, PlanetaryShodhana>> = {};

  const savTrikona: Record<string, number> = {};
  const savEkadhipatya: Record<string, number> = {};

  for (const rashi of RASHIS) {
    savTrikona[rashi.name] = 0;
    savEkadhipatya[rashi.name] = 0;
  }

  let totalSarvaShodhyaPinda = 0;

  for (const planet of ASHTAKAVARGA_PLANETS) {
    const rawPoints = bav[planet].signPoints;
    const trikona = performTrikonaShodhana(rawPoints);
    const { ekadhipatyaPoints, explanation } = performEkadhipatyaShodhana(
      trikona,
      chart
    );
    const pindas = calculatePindas(ekadhipatyaPoints, chart);

    trikonaShodhana[planet] = trikona;
    ekadhipatyaShodhana[planet] = ekadhipatyaPoints;

    planetaryPindas[planet] = {
      planet,
      rawPoints,
      trikonaPoints: trikona,
      ekadhipatyaPoints,
      rashiPinda: pindas.rashiPinda,
      grahaPinda: pindas.grahaPinda,
      shodhyaPinda: pindas.shodhyaPinda,
      explanation,
    };

    totalSarvaShodhyaPinda += pindas.shodhyaPinda;

    for (const rashi of RASHIS) {
      savTrikona[rashi.name] += trikona[rashi.name] ?? 0;
      savEkadhipatya[rashi.name] += ekadhipatyaPoints[rashi.name] ?? 0;
    }
  }

  return {
    trikonaShodhana: trikonaShodhana as Record<AshtakavargaPlanet, Record<string, number>>,
    ekadhipatyaShodhana: ekadhipatyaShodhana as Record<AshtakavargaPlanet, Record<string, number>>,
    savTrikona,
    savEkadhipatya,
    planetaryPindas: planetaryPindas as Record<AshtakavargaPlanet, PlanetaryShodhana>,
    totalSarvaShodhyaPinda,
  };
}
