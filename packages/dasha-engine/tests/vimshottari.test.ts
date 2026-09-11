import { describe, expect, it } from 'vitest';
import {
  calculateBirthDashaBalance,
  generateAntardashas,
  generateMahadashas,
  generatePratyantardashas,
  getCurrentDasha,
  NAKSHATRA_LORDS,
  TOTAL_VIMSHOTTARI_YEARS,
  VIMSHOTTARI_CYCLE,
} from '../src/index.js';

describe('Vimshottari Dasha Engine', () => {
  it('1. should maintain exact canonical Vimshottari sequence order', () => {
    const expectedSequence = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const actualSequence = VIMSHOTTARI_CYCLE.map((c) => c.lord);
    expect(actualSequence).toEqual(expectedSequence);
  });

  it('2. should sum total Vimshottari cycle to exactly 120 years', () => {
    const totalYears = VIMSHOTTARI_CYCLE.reduce((sum, c) => sum + c.years, 0);
    expect(totalYears).toBe(120);
    expect(TOTAL_VIMSHOTTARI_YEARS).toBe(120);
  });

  it('3. should map all 27 Nakshatras to correct starting lords', () => {
    expect(NAKSHATRA_LORDS.length).toBe(27);
    // Ashwini (0) -> Ketu
    expect(NAKSHATRA_LORDS[0]).toBe('Ketu');
    // Bharani (1) -> Venus
    expect(NAKSHATRA_LORDS[1]).toBe('Venus');
    // Krittika (2) -> Sun
    expect(NAKSHATRA_LORDS[2]).toBe('Sun');
    // Rohini (3) -> Moon
    expect(NAKSHATRA_LORDS[3]).toBe('Moon');
    // Shravana (21) -> Moon
    expect(NAKSHATRA_LORDS[21]).toBe('Moon');
    // Revati (26) -> Mercury
    expect(NAKSHATRA_LORDS[26]).toBe('Mercury');
  });

  it('4. should calculate birth balance correctly from Moon longitude', () => {
    // 0° longitude = 0% of Ashwini (Ketu)
    const b0 = calculateBirthDashaBalance(0);
    expect(b0.nakshatraName).toBe('Ashwini');
    expect(b0.nakshatraLord).toBe('Ketu');
    expect(b0.progressPercentage).toBe(0);
    expect(b0.remainingPercentage).toBe(100);
    expect(b0.balanceYearsAtBirth).toBe(7);

    // 6.666666666666667° longitude = 50% of Ashwini
    const bHalf = calculateBirthDashaBalance(6.666666666666667);
    expect(bHalf.progressPercentage).toBeCloseTo(50, 4);
    expect(bHalf.remainingPercentage).toBeCloseTo(50, 4);
    expect(bHalf.balanceYearsAtBirth).toBeCloseTo(3.5, 4);
  });

  it('5. should calculate Antardasha proportional duration correctly', () => {
    const start = new Date('2000-01-01T00:00:00Z');
    const end = new Date('2019-01-01T00:00:00Z'); // 19 years Saturn Mahadasha
    const antardashas = generateAntardashas('Saturn', 19, start, end);

    expect(antardashas.length).toBe(9);
    // Saturn-Saturn = 19 * 19 / 120 = 3.008333 years
    expect(antardashas[0].lord).toBe('Saturn');
    expect(antardashas[0].calculationMetadata?.durationYears).toBeCloseTo(3.008333, 4);
    // Saturn-Mercury = 19 * 17 / 120 = 2.691666 years
    expect(antardashas[1].lord).toBe('Mercury');
    expect(antardashas[1].calculationMetadata?.durationYears).toBeCloseTo(2.691666, 4);
  });

  it('6. should calculate Pratyantardasha proportional duration correctly', () => {
    const start = new Date('2000-01-01T00:00:00Z');
    const pratyantardashas = generatePratyantardashas('Saturn', 3.0083333333333333, start);

    expect(pratyantardashas.length).toBe(9);
    expect(pratyantardashas[0].lord).toBe('Saturn');
    // Saturn-Saturn-Saturn = (3.0083333 * 19) / 120
    const expectedYears = (3.0083333333333333 * 19) / 120;
    expect(pratyantardashas[0].calculationMetadata?.durationYears).toBeCloseTo(expectedYears, 4);
  });

  it('7. should resolve current Dasha accurately for past, present, and future dates', () => {
    const birthInstant = new Date('1996-09-23T14:30:00Z');
    // Moon in Shravana (Capricorn ~15.5141°) -> Shravana is Moon (10 yrs)
    const moonLongitude = 285.5141; // 15.5141 in Capricorn (270 + 15.5141)

    const res = generateMahadashas({ birthInstant, moonLongitude });

    // Lookup birth date
    const atBirth = getCurrentDasha({ mahadashas: res.mahadashas, instant: birthInstant });
    expect(atBirth.mahadasha?.lord).toBe('Moon');

    // Lookup 2026 date
    const at2026 = getCurrentDasha({ mahadashas: res.mahadashas, instant: new Date('2026-08-29T00:00:00Z') });
    expect(at2026.mahadasha).toBeDefined();
    expect(at2026.antardasha).toBeDefined();
    expect(at2026.pratyantardasha).toBeDefined();
  });

  it('8. should enforce continuous period boundaries without gap or overlap', () => {
    const birthInstant = new Date('1990-05-15T10:00:00Z');
    const res = generateMahadashas({ birthInstant, moonLongitude: 100 });

    for (let i = 0; i < res.mahadashas.length - 1; i++) {
      const currentEnd = res.mahadashas[i].end.getTime();
      const nextStart = res.mahadashas[i + 1].start.getTime();
      expect(currentEnd).toBe(nextStart);
    }
  });

  it('9. should handle Julian date arithmetic (365.25 days/year) consistently', () => {
    const b = calculateBirthDashaBalance(0); // 7 years Ketu
    expect(b.balanceDaysAtBirth).toBe(7 * 365.25);
  });

  it('10. should maintain precision at exact period boundaries', () => {
    const birthInstant = new Date('2000-01-01T00:00:00Z');
    const res = generateMahadashas({ birthInstant, moonLongitude: 0 });

    const boundary = res.mahadashas[0].end;
    const lookupAtBoundary = getCurrentDasha({ mahadashas: res.mahadashas, instant: boundary });
    expect(lookupAtBoundary.mahadasha?.lord).toBe(res.mahadashas[1].lord);
  });
});
