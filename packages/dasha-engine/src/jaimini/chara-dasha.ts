import { BirthChart, RASHIS } from '@vedica/astrology-core';

export interface CharaAntardashaPeriod {
  rashiIndex: number;
  rashiName: string;
  start: Date;
  end: Date;
  durationMonths: number;
}

export interface CharaDashaEvidence {
  rashiIndex: number;
  rashiName: string;
  isDirect: boolean;
  signLord: string;
  lordSignIndex: number;
  lordSignName: string;
  lordDistance: number;
  durationYears: number;
  reasoning: string;
  reasoningHi: string;
}

export interface CharaDashaPeriod {
  rashiIndex: number; // 1-12
  rashiName: string;
  start: Date;
  end: Date;
  durationYears: number;
  evidence: CharaDashaEvidence;
  antardashas?: CharaAntardashaPeriod[];
}

export interface CharaDashaResult {
  periods: CharaDashaPeriod[];
  lagnaSign: string;
  lagnaDirection: 'DIRECT' | 'REVERSE';
  calculationMethod: string;
  profileVersion: 'personal-jaimini-v1';
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
  const lagnaSignName = RASHIS[lagnaSignIndex - 1]?.name || 'Aries';
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
    const rashiName = RASHIS[rashiIdx - 1]?.name || `Rashi ${rashiIdx}`;
    const lordName = RASHI_LORDS[rashiIdx];
    const lordSignIdx = planetSigns[lordName] || rashiIdx;
    const lordSignName = RASHIS[lordSignIdx - 1]?.name || `Rashi ${lordSignIdx}`;

    let lordDistance = 0;
    let durationYears = 0;

    if (lordSignIdx === rashiIdx) {
      durationYears = 12;
      lordDistance = 0;
    } else {
      if (isRashiDirect) {
        lordDistance = ((lordSignIdx - rashiIdx + 12) % 12);
        durationYears = lordDistance === 0 ? 12 : lordDistance - 1;
      } else {
        lordDistance = ((rashiIdx - lordSignIdx + 12) % 12);
        durationYears = lordDistance === 0 ? 12 : lordDistance - 1;
      }
      if (durationYears <= 0) {
        durationYears = 12;
      }
    }

    const start = new Date(currentStartMs);
    const endMs = currentStartMs + durationYears * 365.2425 * 24 * 60 * 60 * 1000;
    const end = new Date(endMs);

    // Calculate Antardashas (sub-periods) for this Mahadasha
    // Sub-period sequence starts from the Mahadasha sign itself, direct/reverse based on sign quality
    const antardashas: CharaAntardashaPeriod[] = [];
    const subDurationMs = (endMs - currentStartMs) / 12;
    const subDurationMonths = Number((durationYears).toFixed(2));

    for (let s = 0; s < 12; s++) {
      let subSignIdx = 1;
      if (isRashiDirect) {
        subSignIdx = ((rashiIdx - 1 + s) % 12) + 1;
      } else {
        subSignIdx = ((rashiIdx - 1 - s + 120) % 12) + 1;
      }

      const subStartMs = currentStartMs + s * subDurationMs;
      const subEndMs = currentStartMs + (s + 1) * subDurationMs;

      antardashas.push({
        rashiIndex: subSignIdx,
        rashiName: RASHIS[subSignIdx - 1]?.name || `Rashi ${subSignIdx}`,
        start: new Date(subStartMs),
        end: new Date(subEndMs),
        durationMonths: subDurationMonths,
      });
    }

    currentStartMs = endMs;

    const reasoning = `${rashiName} is a ${isRashiDirect ? 'Direct (Pratyak)' : 'Reverse (Paravritta)'} sign. Its lord ${lordName} is in ${lordSignName} (distance ${lordDistance} signs). Calculated duration: ${durationYears} years.`;
    const reasoningHi = `${rashiName} एक ${isRashiDirect ? 'प्रत्यक्ष' : 'अप्रत्यक्ष'} राशि है। इसका स्वामी ${lordName} ${lordSignName} में ${lordDistance} भाव दूर स्थित है। कुल अवधि: ${durationYears} वर्ष।`;

    const evidence: CharaDashaEvidence = {
      rashiIndex: rashiIdx,
      rashiName,
      isDirect: isRashiDirect,
      signLord: lordName,
      lordSignIndex: lordSignIdx,
      lordSignName,
      lordDistance,
      durationYears,
      reasoning,
      reasoningHi,
    };

    periods.push({
      rashiIndex: rashiIdx,
      rashiName,
      start,
      end,
      durationYears,
      evidence,
      antardashas,
    });
  }

  return {
    periods,
    lagnaSign: lagnaSignName,
    lagnaDirection: isLagnaDirect ? 'DIRECT' : 'REVERSE',
    calculationMethod: 'K.N. Rao Jaimini Chara Dasha System with Sub-Periods',
    profileVersion: 'personal-jaimini-v1',
  };
}
