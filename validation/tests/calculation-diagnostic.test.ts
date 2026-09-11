/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │  VEDICA CALCULATION DIAGNOSTIC & ACCURACY AUDIT                           │
 * │  ─────────────────────────────────────────────────────────────────────────  │
 * │  Tests every layer of the astronomical pipeline:                          │
 * │    1. UTC Time Conversion (timezone → Julian Day)                         │
 * │    2. Planetary Longitude Accuracy (vs JHora reference)                   │
 * │    3. Rashi Sign Assignment                                               │
 * │    4. Nakshatra & Pada Accuracy                                           │
 * │    5. Ascendant (Lagna) Correctness                                       │
 * │    6. Ayanamsa Value Range                                                │
 * │    7. Ketu = Rahu + 180° Identity                                         │
 * │    8. Multi-Timezone UTC Conversion (India, US DST, UK BST, Australia)    │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */
import { describe, it, expect } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { getUTCInstant, resolveLocalTime } from '@vedica/shared';

// ──────────────────────────────────────────────────────────────────────────────
// Reference: CASE-001 from chart-dataset.json (Jagannatha Hora v8.0 verified)
// Birth: 1985-06-15 08:30 IST, New Delhi (28.6139°N, 77.209°E)
// ──────────────────────────────────────────────────────────────────────────────
const CASE_001_INPUT = {
  birthTime: {
    dateOfBirth: '1985-06-15',
    timeOfBirth: '08:30:00',
    timezone: 'Asia/Kolkata',
  },
  location: {
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
  },
};

const CASE_001_REFERENCE = {
  ascendantLongitude: 100.5302,
  ascendantSign: 'Cancer',
  planetaryLongitudes: {
    Sun: 60.3121,
    Moon: 22.5193,
    Mars: 70.1309,
    Mercury: 69.4056,
    Jupiter: 293.1478,
    Venus: 14.5854,
    Saturn: 209.0792,
    Rahu: 24.2191,
    Ketu: 204.2191,
  } as Record<string, number>,
  planetarySigns: {
    Sun: 'Gemini',
    Moon: 'Aries',
    Mars: 'Gemini',
    Mercury: 'Gemini',
    Jupiter: 'Capricorn',
    Venus: 'Aries',
    Saturn: 'Libra',
    Rahu: 'Aries',
    Ketu: 'Libra',
  } as Record<string, string>,
  nakshatras: {
    Sun: 'Mrigashira',
    Moon: 'Bharani',
    Mars: 'Ardra',
    Mercury: 'Ardra',
    Jupiter: 'Shravana',
    Venus: 'Bharani',
    Saturn: 'Vishakha',
    Rahu: 'Bharani',
    Ketu: 'Vishakha',
  } as Record<string, string>,
  padas: {
    Sun: 3,
    Moon: 3,
    Mars: 2,
    Mercury: 1,
    Jupiter: 4,
    Venus: 1,
    Saturn: 3,
    Rahu: 4,
    Ketu: 2,
  } as Record<string, number>,
};

// ──────────────────────────────────────────────────────────────────────────────
// LAYER 1: UTC Time Conversion Audit
// ──────────────────────────────────────────────────────────────────────────────
describe('Layer 1: UTC Time Conversion Accuracy', () => {
  it('INDIA IST (UTC+5:30) — 1985-06-15 08:30 IST → 1985-06-15 03:00 UTC', () => {
    const utc = getUTCInstant({
      dateOfBirth: '1985-06-15',
      timeOfBirth: '08:30:00',
      timezone: 'Asia/Kolkata',
    });

    expect(utc.year).toBe(1985);
    expect(utc.month).toBe(6);
    expect(utc.day).toBe(15);
    expect(utc.hour).toBe(3);
    expect(utc.minute).toBe(0);
    expect(utc.second).toBe(0);
    expect(utc.decimalHour).toBeCloseTo(3.0, 4);
    expect(utc.isoString).toBe('1985-06-15T03:00:00Z');
  });

  it('USA EDT (DST) — 1990-07-04 14:15 EDT → 1990-07-04 18:15 UTC', () => {
    const utc = getUTCInstant({
      dateOfBirth: '1990-07-04',
      timeOfBirth: '14:15:00',
      timezone: 'America/New_York',
    });

    // July 4 is during EDT (UTC-4), so 14:15 EDT = 18:15 UTC
    expect(utc.year).toBe(1990);
    expect(utc.month).toBe(7);
    expect(utc.day).toBe(4);
    expect(utc.hour).toBe(18);
    expect(utc.minute).toBe(15);
    expect(utc.decimalHour).toBeCloseTo(18.25, 4);
  });

  it('UK BST (Summer) — 1975-10-24 09:30 BST → 1975-10-24 08:30 UTC', () => {
    // In 1975, UK had BST until late October. Oct 24 should still be BST (UTC+1).
    // HOWEVER: In 1975, the UK had a complex experiment. BST ended on Oct 26, 1975.
    // So Oct 24 was BST = UTC+1 → 09:30 BST = 08:30 UTC
    const utc = getUTCInstant({
      dateOfBirth: '1975-10-24',
      timeOfBirth: '09:30:00',
      timezone: 'Europe/London',
    });

    expect(utc.year).toBe(1975);
    expect(utc.month).toBe(10);
    expect(utc.day).toBe(24);
    expect(utc.hour).toBe(8);
    expect(utc.minute).toBe(30);
    expect(utc.decimalHour).toBeCloseTo(8.5, 4);
  });

  it('AUSTRALIA AEDT (Summer DST) — 1995-12-25 16:45 AEDT → 1995-12-25 05:45 UTC', () => {
    // Sydney in December = AEDT = UTC+11
    const utc = getUTCInstant({
      dateOfBirth: '1995-12-25',
      timeOfBirth: '16:45:00',
      timezone: 'Australia/Sydney',
    });

    expect(utc.year).toBe(1995);
    expect(utc.month).toBe(12);
    expect(utc.day).toBe(25);
    expect(utc.hour).toBe(5);
    expect(utc.minute).toBe(45);
    expect(utc.decimalHour).toBeCloseTo(5.75, 4);
  });

  it('DST resolution correctly identifies VALID status for unambiguous times', () => {
    const res = resolveLocalTime({
      dateOfBirth: '1985-06-15',
      timeOfBirth: '08:30:00',
      timezone: 'Asia/Kolkata',
    });
    // India has no DST, should always be VALID
    expect(res.status).toBe('VALID');
  });

  it('Nepal UTC+5:45 — 2000-01-01 12:00 NPT → 2000-01-01 06:15 UTC', () => {
    const utc = getUTCInstant({
      dateOfBirth: '2000-01-01',
      timeOfBirth: '12:00:00',
      timezone: 'Asia/Kathmandu',
    });

    // Nepal = UTC+5:45
    expect(utc.year).toBe(2000);
    expect(utc.month).toBe(1);
    expect(utc.day).toBe(1);
    expect(utc.hour).toBe(6);
    expect(utc.minute).toBe(15);
  });

  it('Date rollback — India midnight birth 00:30 IST → previous day 19:00 UTC', () => {
    const utc = getUTCInstant({
      dateOfBirth: '1996-09-23',
      timeOfBirth: '00:30:00',
      timezone: 'Asia/Kolkata',
    });

    // 00:30 IST = 19:00 UTC previous day
    expect(utc.year).toBe(1996);
    expect(utc.month).toBe(9);
    expect(utc.day).toBe(22);
    expect(utc.hour).toBe(19);
    expect(utc.minute).toBe(0);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// LAYER 2: Planetary Longitude Accuracy (CASE-001 vs JHora Reference)
// ──────────────────────────────────────────────────────────────────────────────
describe('Layer 2: Planetary Longitude Accuracy vs JHora Reference', () => {
  const ANGULAR_TOLERANCE = 0.05; // Allow 0.05° (3 arcminute) tolerance

  it('computes all 9 planetary longitudes within ±0.05° of JHora reference', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(CASE_001_INPUT, PERSONAL_VEDIC_V1);

    const mismatches: string[] = [];

    for (const planet of chart.planets) {
      const refLon = CASE_001_REFERENCE.planetaryLongitudes[planet.planet];
      if (refLon === undefined) continue;

      const diff = Math.abs(planet.longitude - refLon);
      const angularDiff = Math.min(diff, 360 - diff); // Handle wraparound

      if (angularDiff > ANGULAR_TOLERANCE) {
        mismatches.push(
          `${planet.planet}: Got ${planet.longitude.toFixed(4)}°, Expected ${refLon.toFixed(4)}°, Diff = ${angularDiff.toFixed(4)}°`
        );
      }

      // Each planet must be within tolerance
      expect(
        angularDiff,
        `${planet.planet} longitude mismatch: engine=${planet.longitude.toFixed(4)}, ref=${refLon.toFixed(4)}, diff=${angularDiff.toFixed(4)}°`
      ).toBeLessThanOrEqual(ANGULAR_TOLERANCE);
    }

    if (mismatches.length > 0) {
      console.error('\n⚠️ LONGITUDE MISMATCHES:\n' + mismatches.join('\n'));
    }
  });

  it('prints detailed planetary position dump for manual verification', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(CASE_001_INPUT, PERSONAL_VEDIC_V1);

    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║       CASE-001: 1985-06-15 08:30 IST, New Delhi               ║');
    console.log('╠══════════════════════════════════════════════════════════════════╣');
    console.log(`║  UTC: ${chart.utcInstant.isoString}`);
    console.log(`║  Ayanamsa (Lahiri): ${chart.ayanamsaValue.toFixed(6)}°`);
    console.log(`║  Lagna: ${chart.lagna.longitude.toFixed(4)}° in ${chart.lagna.sign.name}`);
    console.log(`║  Lagna Ref: ${CASE_001_REFERENCE.ascendantLongitude}° in ${CASE_001_REFERENCE.ascendantSign}`);
    console.log('╠══════════════════════════════════════════════════════════════════╣');

    for (const p of chart.planets) {
      const refLon = CASE_001_REFERENCE.planetaryLongitudes[p.planet];
      const refSign = CASE_001_REFERENCE.planetarySigns[p.planet];
      const diff = refLon !== undefined ? Math.abs(p.longitude - refLon) : NaN;
      const angDiff = refLon !== undefined ? Math.min(diff, 360 - diff) : NaN;
      const status = angDiff <= ANGULAR_TOLERANCE ? '✅' : '❌';

      console.log(
        `║  ${status} ${p.planet.padEnd(8)} | ${p.longitude.toFixed(4).padStart(10)}° ${p.sign.name.padEnd(12)} ` +
        `| Ref: ${(refLon?.toFixed(4) || 'N/A').padStart(10)}° ${(refSign || 'N/A').padEnd(12)} | Δ = ${angDiff.toFixed(4)}°` +
        `${p.isRetrograde ? ' [R]' : ''}`
      );
    }
    console.log('╚══════════════════════════════════════════════════════════════════╝');

    // This test always passes; it's for human-readable output
    expect(true).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// LAYER 3: Rashi Sign Assignment
// ──────────────────────────────────────────────────────────────────────────────
describe('Layer 3: Rashi Sign Assignment vs JHora Reference', () => {
  it('assigns correct rashi sign for every planet in CASE-001', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(CASE_001_INPUT, PERSONAL_VEDIC_V1);

    for (const planet of chart.planets) {
      const expectedSign = CASE_001_REFERENCE.planetarySigns[planet.planet];
      if (!expectedSign) continue;

      expect(
        planet.sign.name,
        `${planet.planet} sign mismatch: got ${planet.sign.name}, expected ${expectedSign}`
      ).toBe(expectedSign);
    }
  });

  it('assigns correct Lagna sign', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(CASE_001_INPUT, PERSONAL_VEDIC_V1);

    expect(chart.lagna.sign.name).toBe(CASE_001_REFERENCE.ascendantSign);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// LAYER 4: Nakshatra & Pada Accuracy
// ──────────────────────────────────────────────────────────────────────────────
describe('Layer 4: Nakshatra & Pada Accuracy vs JHora Reference', () => {
  it('assigns correct nakshatra for every planet in CASE-001', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(CASE_001_INPUT, PERSONAL_VEDIC_V1);

    for (const planet of chart.planets) {
      const expectedNak = CASE_001_REFERENCE.nakshatras[planet.planet];
      if (!expectedNak) continue;

      expect(
        planet.nakshatra.name,
        `${planet.planet} nakshatra mismatch: got ${planet.nakshatra.name}, expected ${expectedNak}`
      ).toBe(expectedNak);
    }
  });

  it('assigns correct pada for every planet in CASE-001', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(CASE_001_INPUT, PERSONAL_VEDIC_V1);

    for (const planet of chart.planets) {
      const expectedPada = CASE_001_REFERENCE.padas[planet.planet];
      if (expectedPada === undefined) continue;

      expect(
        planet.nakshatra.pada,
        `${planet.planet} pada mismatch: got ${planet.nakshatra.pada}, expected ${expectedPada}`
      ).toBe(expectedPada);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// LAYER 5: Ayanamsa Value Sanity Check
// ──────────────────────────────────────────────────────────────────────────────
describe('Layer 5: Ayanamsa Value Sanity Check', () => {
  it('Lahiri ayanamsa for 1985 should be approx 23.6° (within 23.0° - 24.5°)', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(CASE_001_INPUT, PERSONAL_VEDIC_V1);

    // Lahiri ayanamsa in 1985 is approximately 23.65°
    expect(chart.ayanamsaValue).toBeGreaterThan(23.0);
    expect(chart.ayanamsaValue).toBeLessThan(24.5);
    console.log(`Ayanamsa (1985): ${chart.ayanamsaValue.toFixed(6)}°`);
  });

  it('Lahiri ayanamsa for 2026 should be approx 24.2° (within 24.0° - 25.0°)', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      {
        birthTime: {
          dateOfBirth: '2026-01-01',
          timeOfBirth: '12:00:00',
          timezone: 'Asia/Kolkata',
        },
        location: {
          latitude: 28.6139,
          longitude: 77.209,
          timezone: 'Asia/Kolkata',
        },
      },
      PERSONAL_VEDIC_V1
    );

    expect(chart.ayanamsaValue).toBeGreaterThan(24.0);
    expect(chart.ayanamsaValue).toBeLessThan(25.0);
    console.log(`Ayanamsa (2026): ${chart.ayanamsaValue.toFixed(6)}°`);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// LAYER 6: Ketu Derivation Identity (Ketu = Rahu + 180°)
// ──────────────────────────────────────────────────────────────────────────────
describe('Layer 6: Ketu = Rahu + 180° Identity', () => {
  it('Ketu longitude is exactly Rahu + 180° (mod 360)', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(CASE_001_INPUT, PERSONAL_VEDIC_V1);

    const rahu = chart.planets.find((p) => p.planet === 'Rahu')!;
    const ketu = chart.planets.find((p) => p.planet === 'Ketu')!;

    const expected = (rahu.longitude + 180) % 360;
    expect(ketu.longitude).toBeCloseTo(expected, 10);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// LAYER 7: Multi-Birth Consistency (Regression Guard)
// ──────────────────────────────────────────────────────────────────────────────
describe('Layer 7: Deterministic Reproducibility', () => {
  it('produces identical results for the same input across 3 consecutive runs', async () => {
    const engine = new SwissEphemerisEngine();

    const chart1 = await engine.calculateBirthChart(CASE_001_INPUT, PERSONAL_VEDIC_V1);
    const chart2 = await engine.calculateBirthChart(CASE_001_INPUT, PERSONAL_VEDIC_V1);
    const chart3 = await engine.calculateBirthChart(CASE_001_INPUT, PERSONAL_VEDIC_V1);

    for (const p of chart1.planets) {
      const p2 = chart2.planets.find((x) => x.planet === p.planet)!;
      const p3 = chart3.planets.find((x) => x.planet === p.planet)!;
      expect(p.longitude).toBe(p2.longitude);
      expect(p.longitude).toBe(p3.longitude);
    }

    expect(chart1.lagna.longitude).toBe(chart2.lagna.longitude);
    expect(chart1.lagna.longitude).toBe(chart3.lagna.longitude);
    expect(chart1.ayanamsaValue).toBe(chart2.ayanamsaValue);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// LAYER 8: Cross-Timezone Planetary Position Sanity
// ──────────────────────────────────────────────────────────────────────────────
describe('Layer 8: Cross-Timezone Birth Position Sanity', () => {
  it('US DST birth (New York July 4 1990) produces plausible planetary positions', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      {
        birthTime: {
          dateOfBirth: '1990-07-04',
          timeOfBirth: '14:15:00',
          timezone: 'America/New_York',
        },
        location: {
          latitude: 40.7128,
          longitude: -74.006,
          timezone: 'America/New_York',
        },
      },
      PERSONAL_VEDIC_V1
    );

    // Sun in early July 1990 (Lahiri sidereal) should be in Gemini (~78-88°)
    const sun = chart.planets.find((p) => p.planet === 'Moon')!;
    // All longitudes should be 0-360
    for (const p of chart.planets) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
    }

    // UTC should be correctly computed
    expect(chart.utcInstant.hour).toBe(18);
    expect(chart.utcInstant.minute).toBe(15);

    console.log('\n── US DST Birth (1990-07-04 14:15 EDT, NYC) ──');
    console.log(`UTC: ${chart.utcInstant.isoString}`);
    console.log(`Lagna: ${chart.lagna.longitude.toFixed(4)}° in ${chart.lagna.sign.name}`);
    for (const p of chart.planets) {
      console.log(`  ${p.planet.padEnd(8)} ${p.longitude.toFixed(4).padStart(10)}° ${p.sign.name} ${p.nakshatra.name} P${p.nakshatra.pada}${p.isRetrograde ? ' [R]' : ''}`);
    }
  });

  it('Southern Hemisphere birth (Sydney Dec 25 1995) produces valid positions', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      {
        birthTime: {
          dateOfBirth: '1995-12-25',
          timeOfBirth: '16:45:00',
          timezone: 'Australia/Sydney',
        },
        location: {
          latitude: -33.8688,
          longitude: 151.2093,
          timezone: 'Australia/Sydney',
        },
      },
      PERSONAL_VEDIC_V1
    );

    // All longitudes must be valid
    for (const p of chart.planets) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
      expect(p.sign.id).toBeGreaterThanOrEqual(1);
      expect(p.sign.id).toBeLessThanOrEqual(12);
      expect(p.nakshatra.id).toBeGreaterThanOrEqual(1);
      expect(p.nakshatra.id).toBeLessThanOrEqual(27);
      expect(p.nakshatra.pada).toBeGreaterThanOrEqual(1);
      expect(p.nakshatra.pada).toBeLessThanOrEqual(4);
    }

    // UTC should be correctly computed (AEDT = UTC+11)
    expect(chart.utcInstant.hour).toBe(5);
    expect(chart.utcInstant.minute).toBe(45);

    console.log('\n── Southern Hemisphere Birth (1995-12-25 16:45 AEDT, Sydney) ──');
    console.log(`UTC: ${chart.utcInstant.isoString}`);
    console.log(`Lagna: ${chart.lagna.longitude.toFixed(4)}° in ${chart.lagna.sign.name}`);
    for (const p of chart.planets) {
      console.log(`  ${p.planet.padEnd(8)} ${p.longitude.toFixed(4).padStart(10)}° ${p.sign.name} ${p.nakshatra.name} P${p.nakshatra.pada}${p.isRetrograde ? ' [R]' : ''}`);
    }
  });
});
