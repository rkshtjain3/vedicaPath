import { BirthChart, RASHIS } from '@vedica/astrology-core';

export interface CharaDashaPeriod {
  rashiIndex: number; // 1-12
  rashiName: string;
  start: Date;
  end: Date;
  durationYears: number;
}

export interface CharaDashaResult {
  periods: CharaDashaPeriod[];
  calculationMethod: string;
}

const DIRECT_SIGNS = new Set([1, 2, 3, 7, 8, 9]); // Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius
const REVERSE_SIGNS = new Set([4, 5, 6, 10, 11, 12]); // Cancer, Leo, Virgo, Capricorn, Aquarius, Pisces

const RASHI_LORDS: Record<number, string> = {
  1: 'Mars',
  2: 'Venus',
  3: 'Mercury',
  4: 'Moon',
  5: 'Sun',
  6: 'Mercury',
  7: 'Venus',
  8: 'Mars', // Co-lord Ketu
  9: 'Jupiter',
  10: 'Saturn',
  11: 'Saturn', // Co-lord Rahu
  12: 'Jupiter',
};

function getRashiIndexFromLongitude(longitude: number): number {
  return Math.floor(((longitude % 360) + 360) % 360 / 30) + 1;
}

export function calculateCharaDasha(
  chart: BirthChart,
  birthInstant?: Date
): CharaDashaResult {
  const lagnaLongitude = chart.lagna?.longitude ?? 0;
  const lagnaSignIndex = getRashiIndexFromLongitude(lagnaLongitude);
  const startDate = birthInstant ?? new Date(chart.utcInstant?.isoString || Date.now());

  // Determine 12-sign sequence starting from Lagna
  const isLagnaDirect = DIRECT_SIGNS.has(lagnaSignIndex);
  const sequence: number[] = [];
  for (let i = 0; i < 12; i++) {
    if (isLagnaDirect) {
      const idx = ((lagnaSignIndex - 1 + i) % 12) + 1;
      sequence.push(idx);
    } else {
      const idx = ((lagnaSignIndex - 1 - i + 120) % 12) + 1;
      sequence.push(idx);
    }
  }

  // Planet sign mapping
  const planetSigns: Record<string, number> = {};
  for (const p of chart.planets) {
    planetSigns[p.planet] = getRashiIndexFromLongitude(p.longitude);
  }

  const periods: CharaDashaPeriod[] = [];
  let currentStartMs = startDate.getTime();

  for (const rashiIdx of sequence) {
    const isRashiDirect = DIRECT_SIGNS.has(rashiIdx);
    const lordName = RASHI_LORDS[rashiIdx];
    const lordSignIdx = planetSigns[lordName] || rashiIdx;

    let durationYears = 0;
    if (lordSignIdx === rashiIdx) {
      durationYears = 12;
    } else {
      if (isRashiDirect) {
        const distance = ((lordSignIdx - rashiIdx + 12) % 12);
        durationYears = distance === 0 ? 12 : distance - 1;
      } else {
        const distance = ((rashiIdx - lordSignIdx + 12) % 12);
        durationYears = distance === 0 ? 12 : distance - 1;
      }
      if (durationYears <= 0) {
        durationYears = 12;
      }
    }

    const start = new Date(currentStartMs);
    // Add duration in years (approx 365.2425 days per year)
    const endMs = currentStartMs + durationYears * 365.2425 * 24 * 60 * 60 * 1000;
    const end = new Date(endMs);
    currentStartMs = endMs;

    periods.push({
      rashiIndex: rashiIdx,
      rashiName: RASHIS[rashiIdx - 1]?.name || `Rashi ${rashiIdx}`,
      start,
      end,
      durationYears,
    });
  }

  return {
    periods,
    calculationMethod: 'Jaimini Sutra Canonical Chara Dasha System',
  };
}

