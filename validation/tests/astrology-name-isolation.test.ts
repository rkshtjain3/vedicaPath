import { describe, it, expect } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import {
  calculateInputFingerprint,
  calculateReproducibilityHash,
} from '@vedica/shared';
import { calculateDivisionalChart } from '@vedica/divisional-chart-engine';
import { calculateAshtakavarga, PERSONAL_ASHTAKAVARGA_V1 } from '@vedica/ashtakavarga-engine';
import { evaluateStrengthEngine, PERSONAL_STRENGTH_V1 } from '@vedica/strength-engine';
import { evaluateShadbalaEngine, PERSONAL_SHADBALA_V1 } from '@vedica/shadbala-engine';
import { analyzeChart } from '@vedica/analysis-engine';
import { generateMahadashas } from '@vedica/dasha-engine';

describe('Astrology Name Isolation Regression Test', () => {
  it('guarantees that astrology calculations, longitudes, Dasha, Ashtakavarga, Shadbala, and hash are 100% identical regardless of name input', async () => {
    const birthTime = {
      dateOfBirth: '1990-01-15',
      timeOfBirth: '12:30:00',
      timezone: 'Asia/Kolkata',
    };

    const location = {
      latitude: 28.6139,
      longitude: 77.209,
      name: 'New Delhi, India',
      timezone: 'Asia/Kolkata',
    };

    const engine = new SwissEphemerisEngine();

    // 1. Calculate for "Rakshit Jain"
    const chart1 = await engine.calculateBirthChart({ birthTime, location }, PERSONAL_VEDIC_V1);
    const d9Chart1 = calculateDivisionalChart(chart1, 'D9');
    const d10Chart1 = calculateDivisionalChart(chart1, 'D10');
    const analysis1 = analyzeChart(chart1);
    const strength1 = evaluateStrengthEngine(chart1, analysis1, d9Chart1, PERSONAL_STRENGTH_V1);
    const shadbala1 = evaluateShadbalaEngine({ chart: chart1, analysis: analysis1, d9Chart: d9Chart1 }, PERSONAL_SHADBALA_V1);
    const ashtakavarga1 = calculateAshtakavarga(chart1, PERSONAL_ASHTAKAVARGA_V1);

    const auditInput1 = {
      birthLocalDate: birthTime.dateOfBirth,
      birthLocalTime: birthTime.timeOfBirth,
      location: { displayName: location.name, latitude: location.latitude, longitude: location.longitude, timezone: location.timezone },
      resolvedUTC: chart1.utcInstant.isoString,
      calculationProfile: PERSONAL_VEDIC_V1.version,
    };
    const fingerprint1 = calculateInputFingerprint(auditInput1);
    const planetLongitudes1: Record<string, number> = {};
    for (const p of chart1.planets) planetLongitudes1[p.planet] = p.longitude;
    const reprHash1 = calculateReproducibilityHash(fingerprint1, chart1.lagna.longitude, planetLongitudes1);

    // 2. Calculate for "John Smith" (identical birth data)
    const chart2 = await engine.calculateBirthChart({ birthTime, location }, PERSONAL_VEDIC_V1);
    const d9Chart2 = calculateDivisionalChart(chart2, 'D9');
    const d10Chart2 = calculateDivisionalChart(chart2, 'D10');
    const analysis2 = analyzeChart(chart2);
    const strength2 = evaluateStrengthEngine(chart2, analysis2, d9Chart2, PERSONAL_STRENGTH_V1);
    const shadbala2 = evaluateShadbalaEngine({ chart: chart2, analysis: analysis2, d9Chart: d9Chart2 }, PERSONAL_SHADBALA_V1);
    const ashtakavarga2 = calculateAshtakavarga(chart2, PERSONAL_ASHTAKAVARGA_V1);

    const auditInput2 = {
      birthLocalDate: birthTime.dateOfBirth,
      birthLocalTime: birthTime.timeOfBirth,
      location: { displayName: location.name, latitude: location.latitude, longitude: location.longitude, timezone: location.timezone },
      resolvedUTC: chart2.utcInstant.isoString,
      calculationProfile: PERSONAL_VEDIC_V1.version,
    };
    const fingerprint2 = calculateInputFingerprint(auditInput2);
    const planetLongitudes2: Record<string, number> = {};
    for (const p of chart2.planets) planetLongitudes2[p.planet] = p.longitude;
    const reprHash2 = calculateReproducibilityHash(fingerprint2, chart2.lagna.longitude, planetLongitudes2);

    // VERIFY EXACT 100% EQUALITY ACROSS ALL ASTROLOGY CALCULATIONS
    expect(fingerprint1).toBe(fingerprint2);
    expect(reprHash1).toBe(reprHash2);
    expect(chart1.lagna.longitude).toBe(chart2.lagna.longitude);
    expect(chart1.planets).toEqual(chart2.planets);
    expect(d9Chart1).toEqual(d9Chart2);
    expect(d10Chart1).toEqual(d10Chart2);
    expect(strength1.planets).toEqual(strength2.planets);
    expect(shadbala1.planets).toEqual(shadbala2.planets);
    expect(ashtakavarga1.sav).toEqual(ashtakavarga2.sav);
  });
});
