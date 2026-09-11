import {
  NAKSHATRA_NAMES,
} from '../vimshottari/canonical-vimshottari.js';
import { MS_PER_JULIAN_YEAR } from '../vimshottari/dasha-calculator.js';
import {
  TOTAL_YOGINI_YEARS,
  YOGINI_CYCLE,
  YoginiMetadata,
  YoginiName,
  getStartingYoginiFromNakshatra,
} from './canonical-yogini.js';
import {
  CurrentYoginiDashaResult,
  StartingYoginiBalance,
  YoginiPeriod,
  YoginiDashaResult,
} from './yogini-types.js';

/**
 * Calculates starting Yogini Dasha balance at birth from Moon longitude.
 */
export function calculateBirthYoginiBalance(
  moonLongitude: number
): StartingYoginiBalance {
  const normalizedMoon = ((moonLongitude % 360) + 360) % 360;
  const nakshatraSpan = 360 / 27; // 13.333333333333334 degrees

  const nakshatraIndex = Math.min(
    26,
    Math.floor(normalizedMoon / nakshatraSpan)
  );
  const positionInNakshatraDegree =
    normalizedMoon - nakshatraIndex * nakshatraSpan;

  const progressPercentage = (positionInNakshatraDegree / nakshatraSpan) * 100;
  const remainingPercentage = 100 - progressPercentage;

  const nakshatraName = NAKSHATRA_NAMES[nakshatraIndex];
  const startingYogini = getStartingYoginiFromNakshatra(nakshatraIndex);
  const fullMahadashaYears = startingYogini.years;

  const balanceYearsAtBirth =
    fullMahadashaYears * (remainingPercentage / 100);
  const balanceDaysAtBirth = balanceYearsAtBirth * 365.25;

  return {
    moonLongitude: normalizedMoon,
    nakshatraIndex,
    nakshatraName,
    startingYogini,
    positionInNakshatraDegree,
    progressPercentage,
    remainingPercentage,
    fullMahadashaYears,
    balanceYearsAtBirth,
    balanceDaysAtBirth,
  };
}

/**
 * Helper to get canonical index of a Yogini in YOGINI_CYCLE (0..7)
 */
export function getYoginiIndex(yogini: YoginiName): number {
  return YOGINI_CYCLE.findIndex((y) => y.name === yogini);
}

/**
 * Generates Antardashas for a Yogini Mahadasha.
 * In Yogini Dasha, each Mahadasha of M years contains 8 Antardashas starting from itself,
 * where each Antardasha duration = (M * A) / 36 years.
 */
export function generateYoginiAntardashas(
  mahadashaYogini: YoginiMetadata,
  fullMahadashaYears: number,
  mahadashaStart: Date,
  mahadashaEnd: Date
): YoginiPeriod[] {
  const antardashas: YoginiPeriod[] = [];
  const startIndex = getYoginiIndex(mahadashaYogini.name);

  // Virtual start of full Mahadasha (in case mahadashaStart is balance start)
  const fullMahadashaMs = fullMahadashaYears * MS_PER_JULIAN_YEAR;
  const virtualStartMs = mahadashaEnd.getTime() - fullMahadashaMs;

  let currentStartMs = virtualStartMs;

  for (let i = 0; i < 8; i++) {
    const antarConfig = YOGINI_CYCLE[(startIndex + i) % 8];
    const durationYears =
      (fullMahadashaYears * antarConfig.years) / TOTAL_YOGINI_YEARS;
    const durationMs = durationYears * MS_PER_JULIAN_YEAR;

    const periodStartMs = currentStartMs;
    const periodEndMs = currentStartMs + durationMs;

    // Only include Antardashas that overlap with actual Mahadasha window [mahadashaStart, mahadashaEnd]
    if (
      periodEndMs > mahadashaStart.getTime() &&
      periodStartMs < mahadashaEnd.getTime()
    ) {
      const actualStart = new Date(
        Math.max(periodStartMs, mahadashaStart.getTime())
      );
      const actualEnd = new Date(
        Math.min(periodEndMs, mahadashaEnd.getTime())
      );
      const actualDurationYears =
        (actualEnd.getTime() - actualStart.getTime()) / MS_PER_JULIAN_YEAR;

      antardashas.push({
        level: 'ANTARDASHA',
        yogini: antarConfig.name,
        hindiName: antarConfig.hindiName,
        sanskritName: antarConfig.sanskritName,
        lord: antarConfig.lord,
        nature: antarConfig.nature,
        deity: antarConfig.deity,
        significations: antarConfig.significations,
        start: actualStart,
        end: actualEnd,
        parentYogini: mahadashaYogini.name,
        calculationMetadata: {
          durationYears: actualDurationYears,
          durationDays: actualDurationYears * 365.25,
          durationBasis: 'Julian Year (365.25 days)',
        },
      });
    }

    currentStartMs += durationMs;
  }

  return antardashas;
}

/**
 * Generates full sequence of Yogini Mahadashas (with Antardashas) starting from birth.
 * By default computes 3 full cycles (3 * 36 = 108 years).
 */
export function generateYoginiDashas(input: {
  birthInstant: Date;
  moonLongitude: number;
  cycles?: number;
}): {
  balance: StartingYoginiBalance;
  mahadashas: YoginiPeriod[];
} {
  const numCycles = input.cycles ?? 3;
  const balance = calculateBirthYoginiBalance(input.moonLongitude);
  const mahadashas: YoginiPeriod[] = [];

  const startIndex = getYoginiIndex(balance.startingYogini.name);
  let currentStartMs = input.birthInstant.getTime();

  const totalPeriods = numCycles * 8;

  for (let i = 0; i < totalPeriods; i++) {
    const yoginiConfig = YOGINI_CYCLE[(startIndex + i) % 8];
    const fullYears = yoginiConfig.years;
    const isFirst = i === 0;

    const activeYears = isFirst ? balance.balanceYearsAtBirth : fullYears;
    const durationMs = activeYears * MS_PER_JULIAN_YEAR;

    const start = new Date(currentStartMs);
    const end = new Date(currentStartMs + durationMs);

    const children = generateYoginiAntardashas(
      yoginiConfig,
      fullYears,
      start,
      end
    );

    mahadashas.push({
      level: 'MAHADASHA',
      yogini: yoginiConfig.name,
      hindiName: yoginiConfig.hindiName,
      sanskritName: yoginiConfig.sanskritName,
      lord: yoginiConfig.lord,
      nature: yoginiConfig.nature,
      deity: yoginiConfig.deity,
      significations: yoginiConfig.significations,
      start,
      end,
      children,
      calculationMetadata: {
        durationYears: activeYears,
        durationDays: activeYears * 365.25,
        durationBasis: 'Julian Year (365.25 days)',
      },
    });

    currentStartMs += durationMs;
  }

  return {
    balance,
    mahadashas,
  };
}

/**
 * Resolves current active Yogini Mahadasha and Antardasha for any instant.
 */
export function getCurrentYoginiDasha(input: {
  mahadashas: YoginiPeriod[];
  instant: Date;
}): CurrentYoginiDashaResult {
  const targetTime = input.instant.getTime();

  const activeMaha = input.mahadashas.find(
    (m) => targetTime >= m.start.getTime() && targetTime < m.end.getTime()
  );

  if (!activeMaha) {
    return { instant: input.instant };
  }

  const activeAntar = activeMaha.children?.find(
    (a) => targetTime >= a.start.getTime() && targetTime < a.end.getTime()
  );

  return {
    instant: input.instant,
    mahadasha: activeMaha,
    antardasha: activeAntar,
  };
}

/**
 * Complete Yogini Dasha calculation bundle.
 */
export function calculateYoginiDasha(input: {
  birthInstant: Date;
  moonLongitude: number;
  targetInstant?: Date;
  cycles?: number;
}): YoginiDashaResult {
  const numCycles = input.cycles ?? 3;
  const { balance, mahadashas } = generateYoginiDashas({
    birthInstant: input.birthInstant,
    moonLongitude: input.moonLongitude,
    cycles: numCycles,
  });

  const targetInstant = input.targetInstant ?? new Date();
  const current = getCurrentYoginiDasha({
    mahadashas,
    instant: targetInstant,
  });

  return {
    balance,
    mahadashas,
    current,
    totalCycles: numCycles,
  };
}
