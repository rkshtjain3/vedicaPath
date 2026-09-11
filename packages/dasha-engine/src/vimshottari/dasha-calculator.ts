import {
  NAKSHATRA_LORDS,
  NAKSHATRA_NAMES,
  PlanetLord,
  TOTAL_VIMSHOTTARI_YEARS,
  VIMSHOTTARI_CYCLE,
} from './canonical-vimshottari.js';
import {
  CurrentDashaResult,
  DashaPeriod,
  StartingDashaBalance,
} from './vimshottari-types.js';

export const MS_PER_JULIAN_YEAR = 365.25 * 24 * 60 * 60 * 1000; // 31,557,600,000 ms

/**
 * Calculates starting Dasha balance from Moon's sidereal longitude (0 - 360).
 */
export function calculateBirthDashaBalance(
  moonLongitude: number
): StartingDashaBalance {
  const normalizedMoon = (moonLongitude % 360 + 360) % 360;
  const nakshatraSpan = 360 / 27; // 13.333333333333334 degrees

  const nakshatraIndex = Math.min(
    26,
    Math.floor(normalizedMoon / nakshatraSpan)
  );
  const positionInNakshatraDegree = normalizedMoon - nakshatraIndex * nakshatraSpan;

  const progressPercentage = (positionInNakshatraDegree / nakshatraSpan) * 100;
  const remainingPercentage = 100 - progressPercentage;

  const nakshatraLord = NAKSHATRA_LORDS[nakshatraIndex];
  const nakshatraName = NAKSHATRA_NAMES[nakshatraIndex];

  const lordConfig = VIMSHOTTARI_CYCLE.find((c) => c.lord === nakshatraLord)!;
  const fullMahadashaYears = lordConfig.years;

  const balanceYearsAtBirth = fullMahadashaYears * (remainingPercentage / 100);
  const balanceDaysAtBirth = balanceYearsAtBirth * 365.25;

  return {
    moonLongitude: normalizedMoon,
    nakshatraIndex,
    nakshatraName,
    nakshatraLord,
    positionInNakshatraDegree,
    progressPercentage,
    remainingPercentage,
    fullMahadashaYears,
    balanceYearsAtBirth,
    balanceDaysAtBirth,
  };
}

/**
 * Helper to get canonical index of a lord in VIMSHOTTARI_CYCLE (0..8)
 */
export function getLordIndex(lord: PlanetLord): number {
  return VIMSHOTTARI_CYCLE.findIndex((c) => c.lord === lord);
}

/**
 * Generates Pratyantardashas for an Antardasha period.
 */
export function generatePratyantardashas(
  antardashaLord: PlanetLord,
  antardashaDurationYears: number,
  antardashaStart: Date
): DashaPeriod[] {
  const pratyantardashas: DashaPeriod[] = [];
  const startIndex = getLordIndex(antardashaLord);

  let currentStartMs = antardashaStart.getTime();

  for (let i = 0; i < 9; i++) {
    const lordConfig = VIMSHOTTARI_CYCLE[(startIndex + i) % 9];
    const durationYears = (antardashaDurationYears * lordConfig.years) / TOTAL_VIMSHOTTARI_YEARS;
    const durationMs = durationYears * MS_PER_JULIAN_YEAR;

    const start = new Date(currentStartMs);
    const end = new Date(currentStartMs + durationMs);

    pratyantardashas.push({
      level: 'PRATYANTARDASHA',
      lord: lordConfig.lord,
      start,
      end,
      parentLord: antardashaLord,
      calculationMetadata: {
        durationYears,
        durationDays: durationYears * 365.25,
        durationBasis: 'Julian Year (365.25 days)',
      },
    });

    currentStartMs += durationMs;
  }

  return pratyantardashas;
}

/**
 * Generates Antardashas for a Mahadasha period.
 */
export function generateAntardashas(
  mahadashaLord: PlanetLord,
  fullMahadashaYears: number,
  mahadashaStart: Date,
  mahadashaEnd: Date
): DashaPeriod[] {
  const antardashas: DashaPeriod[] = [];
  const startIndex = getLordIndex(mahadashaLord);

  // Virtual start of full Mahadasha (in case mahadashaStart is balance start)
  const fullMahadashaMs = fullMahadashaYears * MS_PER_JULIAN_YEAR;
  const virtualStartMs = mahadashaEnd.getTime() - fullMahadashaMs;

  let currentStartMs = virtualStartMs;

  for (let i = 0; i < 9; i++) {
    const lordConfig = VIMSHOTTARI_CYCLE[(startIndex + i) % 9];
    const durationYears = (fullMahadashaYears * lordConfig.years) / TOTAL_VIMSHOTTARI_YEARS;
    const durationMs = durationYears * MS_PER_JULIAN_YEAR;

    const periodStartMs = currentStartMs;
    const periodEndMs = currentStartMs + durationMs;

    // Only include Antardashas that overlap with actual Mahadasha window [mahadashaStart, mahadashaEnd]
    if (periodEndMs > mahadashaStart.getTime() && periodStartMs < mahadashaEnd.getTime()) {
      const actualStart = new Date(Math.max(periodStartMs, mahadashaStart.getTime()));
      const actualEnd = new Date(Math.min(periodEndMs, mahadashaEnd.getTime()));

      const children = generatePratyantardashas(
        lordConfig.lord,
        durationYears,
        new Date(periodStartMs)
      ).filter(
        (p) => p.end.getTime() > mahadashaStart.getTime() && p.start.getTime() < mahadashaEnd.getTime()
      );

      antardashas.push({
        level: 'ANTARDASHA',
        lord: lordConfig.lord,
        start: actualStart,
        end: actualEnd,
        parentLord: mahadashaLord,
        children,
        calculationMetadata: {
          durationYears,
          durationDays: durationYears * 365.25,
          durationBasis: 'Julian Year (365.25 days)',
        },
      });
    }

    currentStartMs += durationMs;
  }

  return antardashas;
}

/**
 * Generates full sequence of Mahadashas (with Antardashas and Pratyantardashas) starting from birth.
 */
export function generateMahadashas(input: {
  birthInstant: Date;
  moonLongitude: number;
}): {
  balance: StartingDashaBalance;
  mahadashas: DashaPeriod[];
} {
  const balance = calculateBirthDashaBalance(input.moonLongitude);
  const mahadashas: DashaPeriod[] = [];

  const startIndex = getLordIndex(balance.nakshatraLord);
  let currentStartMs = input.birthInstant.getTime();

  for (let i = 0; i < 9; i++) {
    const lordConfig = VIMSHOTTARI_CYCLE[(startIndex + i) % 9];
    const fullYears = lordConfig.years;
    const isFirst = i === 0;

    const activeYears = isFirst ? balance.balanceYearsAtBirth : fullYears;
    const durationMs = activeYears * MS_PER_JULIAN_YEAR;

    const start = new Date(currentStartMs);
    const end = new Date(currentStartMs + durationMs);

    const children = generateAntardashas(lordConfig.lord, fullYears, start, end);

    mahadashas.push({
      level: 'MAHADASHA',
      lord: lordConfig.lord,
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
 * Resolves current active Mahadasha, Antardasha, and Pratyantardasha for any instant.
 */
export function getCurrentDasha(input: {
  mahadashas: DashaPeriod[];
  instant: Date;
}): CurrentDashaResult {
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

  const activePrat = activeAntar?.children?.find(
    (p) => targetTime >= p.start.getTime() && targetTime < p.end.getTime()
  );

  return {
    instant: input.instant,
    mahadasha: activeMaha,
    antardasha: activeAntar,
    pratyantardasha: activePrat,
  };
}
