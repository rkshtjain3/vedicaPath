import { describe, expect, it } from 'vitest';
import { BirthChart, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import {
  calculateTithi,
  calculateVara,
  calculateNakshatraPanchanga,
  calculateYoga,
  calculateKarana,
  calculateMuhurthaWindows,
  calculateUpagrahas,
  evaluatePanchanga,
} from '../src/index.js';

function createTestChart(): BirthChart {
  return {
    calculationProfileVersion: PERSONAL_VEDIC_V1.version,
    utcInstant: { julianDayUtc: 2451545.0, isoString: '2000-01-01T12:00:00.000Z' },
    location: { latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
    siderealAyana: 23.85,
    lagna: {
      sign: { id: 1, name: 'Aries', lord: 'Mars' },
      longitude: 15.0,
      degreeInSign: 15.0,
      nakshatra: { id: 1, name: 'Ashwini', lord: 'Ketu', pada: 1 },
    },
    ascendant: { signIndex: 1, signName: 'Aries', signLord: 'Mars', longitude: 15.0, nakshatraIndex: 0, nakshatraName: 'Ashwini', pada: 1 },
    planets: [
      { planet: 'Sun', longitude: 10.0, signIndex: 1, signName: 'Aries', signLord: 'Mars', house: 1, degreeInSign: 10.0, speed: 1.0, isRetrograde: false, nakshatraIndex: 0, nakshatraName: 'Ashwini', pada: 3, sign: { id: 1, name: 'Aries', lord: 'Mars' }, nakshatra: { id: 1, name: 'Ashwini', lord: 'Ketu', pada: 3 } },
      { planet: 'Moon', longitude: 34.0, signIndex: 2, signName: 'Taurus', signLord: 'Venus', house: 2, degreeInSign: 4.0, speed: 13.0, isRetrograde: false, nakshatraIndex: 2, nakshatraName: 'Krittika', pada: 3, sign: { id: 2, name: 'Taurus', lord: 'Venus' }, nakshatra: { id: 3, name: 'Krittika', lord: 'Sun', pada: 3 } },
      { planet: 'Mars', longitude: 298.0, signIndex: 10, signName: 'Capricorn', signLord: 'Saturn', house: 10, degreeInSign: 28.0, speed: 0.6, isRetrograde: false, nakshatraIndex: 21, nakshatraName: 'Dhanishta', pada: 2, sign: { id: 10, name: 'Capricorn', lord: 'Saturn' }, nakshatra: { id: 23, name: 'Dhanishta', lord: 'Mars', pada: 2 } },
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      cuspLongitude: (i * 30 + 15) % 360,
      signIndex: i + 1,
      signName: 'Aries',
      signLord: 'Mars',
    })),
  };
}

describe('Panchanga Engine — 5 Classical Limbs', () => {
  it('calculates exact Tithi (Shukla vs Krishna)', () => {
    // Sun 10°, Moon 34° -> diff = 24° -> exactly 2 full tithis (24/12 = 2) -> 3rd Tithi (Tritiya)
    const tithi = calculateTithi(10, 34);
    expect(tithi.index).toBe(3);
    expect(tithi.numberInPaksha).toBe(3);
    expect(tithi.name).toBe('Tritiya');
    expect(tithi.paksha).toBe('SHUKLA');
    expect(tithi.element).toBe('JALA');
  });

  it('calculates exact Vara and Lord', () => {
    // 2000-01-01 was Saturday (day index 6)
    const vara = calculateVara('2000-01-01T12:00:00.000Z');
    expect(vara.dayIndex).toBe(6);
    expect(vara.name).toBe('Saturday');
    expect(vara.lord).toBe('Saturn');
    expect(vara.element).toBe('AGNI');
  });

  it('calculates Nakshatra and Pada correctly', () => {
    // Moon at 34° (Taurus 4°) -> Krittika (26°40' to 40°00') -> 34° - 26°40' = 7°20' -> Pada 3
    const nak = calculateNakshatraPanchanga(34.0);
    expect(nak.index).toBe(3);
    expect(nak.name).toBe('Krittika');
    expect(nak.pada).toBe(3);
    expect(nak.lord).toBe('Sun');
    expect(nak.element).toBe('VAYU');
  });

  it('calculates 27 Luni-Solar Yogas correctly', () => {
    // Sun 10° + Moon 34° = 44° -> 44 / 13.3333 = 3.3 -> 4th Yoga (Saubhagya)
    const yoga = calculateYoga(10, 34);
    expect(yoga.index).toBe(4);
    expect(yoga.name).toBe('Saubhagya');
    expect(yoga.isAuspicious).toBe(true);
    expect(yoga.element).toBe('AKASHA');
  });

  it('calculates 11 Karanas (Chara & Sthira) correctly', () => {
    // diff = 24° -> 24 / 6 = 4 full half-tithis -> 5th Karana -> Taitila (Chara)
    const karana = calculateKarana(10, 34);
    expect(karana.index).toBe(5);
    expect(karana.karanaName).toBe('Taitila');
    expect(karana.type).toBe('CHARA');
    expect(karana.element).toBe('PRITHVI');
  });
});

describe('Panchanga Engine — Muhurtha Windows & Upagrahas', () => {
  it('computes Rahu Kalam, Yamaganda, and Brahma Muhurta', () => {
    // Saturday (dayIndex 6): Rahu Kalam = 9:00 AM - 10:30 AM
    const muhurtha = calculateMuhurthaWindows(6, 360, 1080);
    expect(muhurtha.rahuKalam.start).toBe('9:00 AM');
    expect(muhurtha.rahuKalam.end).toBe('10:30 AM');
    expect(muhurtha.brahmaMuhurta.start).toBe('4:24 AM');
    expect(muhurtha.brahmaMuhurta.end).toBe('5:12 AM');
    expect(muhurtha.abhijitMuhurta.start).toBe('11:36 AM');
  });

  it('computes Mandi and Gulika Sphutas deterministically', () => {
    const upagrahas = calculateUpagrahas(15.0, 6, true);
    expect(upagrahas.gulikaLongitude).toBeGreaterThanOrEqual(0);
    expect(upagrahas.mandiLongitude).toBeGreaterThanOrEqual(0);
    expect(upagrahas.gulikaSign).toBeDefined();
    expect(upagrahas.mandiSign).toBeDefined();
  });
});

describe('Panchanga Engine — Master Evaluator', () => {
  it('runs evaluatePanchanga producing complete deterministic result with trace', () => {
    const chart = createTestChart();
    const result = evaluatePanchanga({ chart });

    expect(result.tithi.name).toBe('Tritiya');
    expect(result.vara.name).toBe('Saturday');
    expect(result.nakshatra.name).toBe('Krittika');
    expect(result.yoga.name).toBe('Saubhagya');
    expect(result.karana.karanaName).toBe('Taitila');
    expect(result.muhurtha.rahuKalam).toBeDefined();
    expect(result.upagrahas.gulikaSign).toBeDefined();
    expect(result.evidence.length).toBeGreaterThan(5);
    expect(result.summary.title).toContain('Tritiya');
  });
});
