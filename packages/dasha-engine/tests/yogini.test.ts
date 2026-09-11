import { describe, it, expect } from 'vitest';
import {
  calculateBirthYoginiBalance,
  calculateYoginiDasha,
  generateYoginiDashas,
  getCurrentYoginiDasha,
  getStartingYoginiFromNakshatra,
  YOGINI_CYCLE,
  TOTAL_YOGINI_YEARS,
} from '../src/index.js';

describe('Yogini Dasha Engine', () => {
  it('has total 36 years across 8 Yoginis in cyclic order', () => {
    expect(YOGINI_CYCLE).toHaveLength(8);
    const sumYears = YOGINI_CYCLE.reduce((acc, y) => acc + y.years, 0);
    expect(sumYears).toBe(36);
    expect(TOTAL_YOGINI_YEARS).toBe(36);
  });

  it('correctly maps Nakshatra index to starting Yogini', () => {
    // 0: Ashwini (N=1) -> (1+3)%8 = 4 -> Bhramari (Mars, 4y)
    const ashwini = getStartingYoginiFromNakshatra(0);
    expect(ashwini.name).toBe('BHRAMARI');
    expect(ashwini.lord).toBe('Mars');

    // 1: Bharani (N=2) -> (2+3)%8 = 5 -> Bhadrika (Mercury, 5y)
    const bharani = getStartingYoginiFromNakshatra(1);
    expect(bharani.name).toBe('BHADRIKA');

    // 2: Krittika (N=3) -> (3+3)%8 = 6 -> Ulka (Saturn, 6y)
    const krittika = getStartingYoginiFromNakshatra(2);
    expect(krittika.name).toBe('ULKA');

    // 3: Rohini (N=4) -> (4+3)%8 = 7 -> Siddha (Venus, 7y)
    const rohini = getStartingYoginiFromNakshatra(3);
    expect(rohini.name).toBe('SIDDHA');

    // 4: Mrigashira (N=5) -> (5+3)%8 = 0 -> Sankata (Rahu, 8y)
    const mrigashira = getStartingYoginiFromNakshatra(4);
    expect(mrigashira.name).toBe('SANKATA');

    // 5: Ardra (N=6) -> (6+3)%8 = 1 -> Mangala (Moon, 1y)
    const ardra = getStartingYoginiFromNakshatra(5);
    expect(ardra.name).toBe('MANGALA');

    // 6: Punarvasu (N=7) -> (7+3)%8 = 2 -> Pingala (Sun, 2y)
    const punarvasu = getStartingYoginiFromNakshatra(6);
    expect(punarvasu.name).toBe('PINGALA');

    // 7: Pushya (N=8) -> (8+3)%8 = 3 -> Dhanya (Jupiter, 3y)
    const pushya = getStartingYoginiFromNakshatra(7);
    expect(pushya.name).toBe('DHANYA');
  });

  it('calculates birth Yogini balance with exact remaining percentage', () => {
    // Moon at 0 deg (exact start of Ashwini -> Bhramari, 4 years full)
    const balance0 = calculateBirthYoginiBalance(0);
    expect(balance0.nakshatraName).toBe('Ashwini');
    expect(balance0.startingYogini.name).toBe('BHRAMARI');
    expect(balance0.progressPercentage).toBeCloseTo(0, 4);
    expect(balance0.remainingPercentage).toBeCloseTo(100, 4);
    expect(balance0.balanceYearsAtBirth).toBeCloseTo(4.0, 4);

    // Moon at midpoint of Ashwini (6.666667 deg) -> 50% remaining
    const balanceMid = calculateBirthYoginiBalance(13.333333333333334 / 2);
    expect(balanceMid.progressPercentage).toBeCloseTo(50, 2);
    expect(balanceMid.remainingPercentage).toBeCloseTo(50, 2);
    expect(balanceMid.balanceYearsAtBirth).toBeCloseTo(2.0, 2);
  });

  it('generates 3 full cycles of Yogini Mahadashas with Antardashas', () => {
    const birthInstant = new Date('1990-01-01T12:00:00Z');
    const { balance, mahadashas } = generateYoginiDashas({
      birthInstant,
      moonLongitude: 45.0, // Rohini (40 - 53.333 deg) -> Siddha (7 years)
      cycles: 3,
    });

    expect(balance.startingYogini.name).toBe('SIDDHA');
    expect(mahadashas).toHaveLength(24); // 3 cycles * 8 = 24

    // First Mahadasha should be Siddha
    expect(mahadashas[0].yogini).toBe('SIDDHA');
    expect(mahadashas[0].children).toBeDefined();
    expect(mahadashas[0].children!.length).toBeGreaterThan(0);

    // Second Mahadasha should be Sankata
    expect(mahadashas[1].yogini).toBe('SANKATA');
    expect(mahadashas[1].calculationMetadata?.durationYears).toBe(8);

    // Total span of 3 cycles = approx 3 * 36 = 108 years (minus spent initial portion)
    const firstStart = mahadashas[0].start.getTime();
    const lastEnd = mahadashas[23].end.getTime();
    const totalYears = (lastEnd - firstStart) / (365.25 * 24 * 60 * 60 * 1000);
    expect(totalYears).toBeGreaterThan(100);
  });

  it('resolves active current Yogini Mahadasha and Antardasha', () => {
    const birthInstant = new Date('2000-01-01T00:00:00Z');
    const result = calculateYoginiDasha({
      birthInstant,
      moonLongitude: 0, // Ashwini -> Bhramari starts 2000-01-01 to 2004-01-01
      targetInstant: new Date('2002-01-01T00:00:00Z'),
    });

    expect(result.current.mahadasha).toBeDefined();
    expect(result.current.mahadasha?.yogini).toBe('BHRAMARI');
    expect(result.current.antardasha).toBeDefined();
  });
});
