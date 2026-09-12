import { BirthChart, RASHIS } from '@vedica/astrology-core';
import { TransitAnalysisOutput, TransitPosition } from './types.js';

export interface DoubleTransitLockResult {
  house: number; // 1-12
  sign: string;
  hasDoubleTransitLock: boolean;
  jupiterInfluence: string; // e.g. "POSITION", "5TH_ASPECT", "7TH_ASPECT", "9TH_ASPECT"
  saturnInfluence: string;  // e.g. "POSITION", "3RD_ASPECT", "7TH_ASPECT", "10TH_ASPECT"
  significance: string;
}

export interface DoubleTransitLockAnalysis {
  locks: DoubleTransitLockResult[];
  lockedHousesCount: number;
  summary: string;
}

function getRashiIndexFromLongitude(longitude: number): number {
  return Math.floor(((longitude % 360) + 360) % 360 / 30) + 1;
}

export function detectDoubleTransitLock(
  natalChart: BirthChart,
  transitAnalysis: TransitAnalysisOutput
): DoubleTransitLockAnalysis {
  const lagnaLongitude = natalChart.lagna?.longitude ?? 0;
  const lagnaSignIndex = getRashiIndexFromLongitude(lagnaLongitude);

  const jupiterTransit = transitAnalysis.planets.find((p: TransitPosition) => p.planet === 'Jupiter');
  const saturnTransit = transitAnalysis.planets.find((p: TransitPosition) => p.planet === 'Saturn');

  const jupiterSignIdx = jupiterTransit ? getRashiIndexFromLongitude(jupiterTransit.longitude) : 1;
  const saturnSignIdx = saturnTransit ? getRashiIndexFromLongitude(saturnTransit.longitude) : 1;

  // Houses impacted by Jupiter (1st, 5th, 7th, 9th from Jupiter sign)
  const jupiterAspectHouses: Record<number, string> = {};
  const jupOffsets: Array<[number, string]> = [
    [0, 'POSITION'],
    [4, '5TH_ASPECT'],
    [6, '7TH_ASPECT'],
    [8, '9TH_ASPECT'],
  ];
  for (const [offset, label] of jupOffsets) {
    const targetSignIdx = ((jupiterSignIdx - 1 + offset) % 12) + 1;
    const houseFromLagna = ((targetSignIdx - lagnaSignIndex + 12) % 12) + 1;
    jupiterAspectHouses[houseFromLagna] = label;
  }

  // Houses impacted by Saturn (1st, 3rd, 7th, 10th from Saturn sign)
  const saturnAspectHouses: Record<number, string> = {};
  const satOffsets: Array<[number, string]> = [
    [0, 'POSITION'],
    [2, '3RD_ASPECT'],
    [6, '7TH_ASPECT'],
    [9, '10TH_ASPECT'],
  ];
  for (const [offset, label] of satOffsets) {
    const targetSignIdx = ((saturnSignIdx - 1 + offset) % 12) + 1;
    const houseFromLagna = ((targetSignIdx - lagnaSignIndex + 12) % 12) + 1;
    saturnAspectHouses[houseFromLagna] = label;
  }

  const locks: DoubleTransitLockResult[] = [];
  let lockedCount = 0;

  for (let house = 1; house <= 12; house++) {
    const rashiIdx = ((lagnaSignIndex - 1 + (house - 1)) % 12) + 1;
    const signName = RASHIS[rashiIdx - 1]?.name || `House ${house}`;

    const jupInf = jupiterAspectHouses[house];
    const satInf = saturnAspectHouses[house];
    const isLocked = Boolean(jupInf && satInf);

    if (isLocked) {
      lockedCount++;
    }

    locks.push({
      house,
      sign: signName,
      hasDoubleTransitLock: isLocked,
      jupiterInfluence: jupInf || 'NONE',
      saturnInfluence: satInf || 'NONE',
      significance: isLocked
        ? `House ${house} receives simultaneous activation from Jupiter (${jupInf}) and Saturn (${satInf}) — Major Life Manifestation Window.`
        : 'Single or no transit aspect lock active.',
    });
  }

  return {
    locks: locks.filter((l) => l.hasDoubleTransitLock),
    lockedHousesCount: lockedCount,
    summary: `Double Transit Lock detected on ${lockedCount} house(s).`,
  };
}

