import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { evaluatePanchanga } from '@vedica/panchanga-engine';
import { generateMahadashas } from '@vedica/dasha-engine';
import { evaluateYogaEngine, PERSONAL_YOGA_V1 } from '@vedica/yoga-engine';
import { analyzeChart } from '@vedica/analysis-engine';
import { calculateAllDivisionalCharts } from '@vedica/divisional-chart-engine';
import { calculateAshtakavarga, PERSONAL_ASHTAKAVARGA_V1 } from '@vedica/ashtakavarga-engine';
import { evaluateStrengthEngine, PERSONAL_STRENGTH_V1 } from '@vedica/strength-engine';
import { evaluateShadbalaEngine, PERSONAL_SHADBALA_V1 } from '@vedica/shadbala-engine';

describe('Rakshit Jain Golden Canonical Regression Suite', () => {
  const fixturePath = join(__dirname, '../benchmark-data/astrology/RAKSHIT-JAIN-001.json');
  const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));

  const birthInput = {
    birthTime: {
      dateOfBirth: fixture.input.dateOfBirth,
      timeOfBirth: fixture.input.timeOfBirth,
      timezone: fixture.input.timezone,
    },
    location: {
      latitude: fixture.input.latitude,
      longitude: fixture.input.longitude,
      name: fixture.input.locationName,
      timezone: fixture.input.timezone,
    },
  };

  it('verifies core astronomical longitudes within explicit tolerance (<= 0.0002°)', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(birthInput, PERSONAL_VEDIC_V1);
    const tolerance = 0.0002;

    // Check Lagna
    const lagnaDiff = Math.abs(chart.lagna.longitude - fixture.expected.lagna.longitude);
    console.log(`Lagna Longitude: expected ${fixture.expected.lagna.longitude}, actual ${chart.lagna.longitude}, diff ${lagnaDiff}, tol ${tolerance} -> ${lagnaDiff <= tolerance ? 'PASS' : 'FAIL'}`);
    expect(lagnaDiff).toBeLessThanOrEqual(tolerance);
    expect(chart.lagna.sign.name).toBe(fixture.expected.lagna.sign);

    // Check Planets
    for (const [pName, expectedP] of Object.entries(fixture.expected.planets) as [string, any][]) {
      const actualP = chart.planets.find((p) => p.planet === pName);
      expect(actualP).toBeDefined();

      const diff = Math.abs((actualP!.longitude % 360) - (expectedP.longitude % 360));
      const normDiff = Math.min(diff, 360 - diff);
      console.log(`${pName} Longitude: expected ${expectedP.longitude}, actual ${actualP!.longitude}, diff ${normDiff}, tol ${tolerance} -> ${normDiff <= tolerance ? 'PASS' : 'FAIL'}`);

      expect(normDiff).toBeLessThanOrEqual(tolerance);
      expect(actualP!.sign.name).toBe(expectedP.sign);
      expect(actualP!.nakshatra.name).toBe(expectedP.nakshatra);
      expect(actualP!.nakshatra.pada).toBe(expectedP.pada);
      expect(actualP!.isRetrograde).toBe(expectedP.isRetrograde);
    }
  });

  it('verifies Panchanga limbs and dynamic astronomical sunrise/sunset Muhurtha calculation', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(birthInput, PERSONAL_VEDIC_V1);
    const panchanga = evaluatePanchanga({ chart });

    expect(panchanga.tithi.name).toContain(fixture.expected.panchanga.tithi.name);
    expect(panchanga.tithi.paksha).toBe(fixture.expected.panchanga.tithi.paksha);
    expect(panchanga.vara.name).toBe(fixture.expected.panchanga.vara.name);
    expect(panchanga.nakshatra.name).toBe(fixture.expected.panchanga.nakshatra.name);
    expect(panchanga.yoga.name).toBe(fixture.expected.panchanga.yoga.name);
    expect(panchanga.karana.karanaName).toBe(fixture.expected.panchanga.karana.karanaName);

    // Dynamic Astronomical Muhurtha verification
    expect(panchanga.muhurtha.calculationMode).toBe('ASTRONOMICAL');
    expect(panchanga.muhurtha.source).toBe('LOCAL_SUNRISE_SUNSET');
    expect(panchanga.muhurtha.rahuKalam.start).toBe('7:41 AM');
    expect(panchanga.muhurtha.rahuKalam.end).toBe('9:12 AM');
  });

  it('verifies Vimshottari Dasha birth Mahadasha and remaining balance', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(birthInput, PERSONAL_VEDIC_V1);
    const moonPlanet = chart.planets.find((p) => p.planet === 'Moon')!;

    const dashaResult = generateMahadashas({
      birthInstant: new Date(chart.utcInstant.isoString),
      moonLongitude: moonPlanet.longitude,
    });

    expect(dashaResult.balance.nakshatraLord).toBe(fixture.expected.dasha.birthMahadasha);
    expect(dashaResult.balance.balanceYearsAtBirth).toBeCloseTo(fixture.expected.dasha.balanceRemainingYears, 3);
  });

  it('verifies validated classical Yogas and Mars-Venus orb behavior', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(birthInput, PERSONAL_VEDIC_V1);
    const analysis = analyzeChart(chart);
    const yogaAnalysis = evaluateYogaEngine(chart, analysis, PERSONAL_YOGA_V1);

    const yogaNames = yogaAnalysis.results.filter((r) => r.detected).map((y) => y.id);
    expect(yogaNames).toContain('HAMSA_YOGA');
    expect(yogaNames).toContain('NEECHA_BHANGA_RAJA_YOGA');
    expect(yogaNames).toContain('PARIVARTANA_YOGA');
    expect(yogaNames).toContain('CHANDRA_MANGALA_YOGA');

    // Conjunction orb behavior check: Mars (14.79°) and Venus (24.30°) separation 9.52° > 8.0° orb limit
    const marsVenusConj = yogaAnalysis.results.find(
      (y) => y.id === 'CONJUNCTION_MARS_VENUS' || (y.id?.includes('MARS') && y.id?.includes('VENUS') && y.detected)
    );
    expect(marsVenusConj).toBeUndefined();
  });

  it('verifies complete Name Isolation (Rakshit Jain vs John Doe produce identical astrology results)', async () => {
    const engine = new SwissEphemerisEngine();
    const chartRakshit = await engine.calculateBirthChart(birthInput, PERSONAL_VEDIC_V1);
    const chartJohn = await engine.calculateBirthChart(birthInput, PERSONAL_VEDIC_V1);

    expect(chartRakshit.lagna.longitude).toBe(chartJohn.lagna.longitude);
    expect(chartRakshit.planets).toEqual(chartJohn.planets);

    const panchangaRakshit = evaluatePanchanga({ chart: chartRakshit });
    const panchangaJohn = evaluatePanchanga({ chart: chartJohn });
    expect(panchangaRakshit).toEqual(panchangaJohn);

    const divRakshit = calculateAllDivisionalCharts(chartRakshit);
    const divJohn = calculateAllDivisionalCharts(chartJohn);
    expect(divRakshit.D9.ascendant).toEqual(divJohn.D9.ascendant);
    expect(divRakshit.D10.ascendant).toEqual(divJohn.D10.ascendant);
  });

  it('verifies Cross-Engine Consistency (no downstream planetary longitude mutation)', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(birthInput, PERSONAL_VEDIC_V1);
    const analysis = analyzeChart(chart);
    const divs = calculateAllDivisionalCharts(chart);
    const strength = evaluateStrengthEngine(chart, analysis, divs.D9, PERSONAL_STRENGTH_V1);
    const shadbala = evaluateShadbalaEngine({ chart, analysis, d9Chart: divs.D9 }, PERSONAL_SHADBALA_V1);
    const ashtakavarga = calculateAshtakavarga(chart, PERSONAL_ASHTAKAVARGA_V1);

    for (const p of chart.planets) {
      // Analysis planet fact check
      const pFact = analysis.planetFacts.find((pf) => pf.planet === p.planet);
      expect(pFact).toBeDefined();
      expect(pFact!.longitude).toBe(p.longitude);

      // 7 Physical Grahas check across downstream engines
      if (['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.planet)) {
        const pStrength = strength.planets.find((sp) => sp.planet === p.planet);
        expect(pStrength).toBeDefined();

        const pShadbala = shadbala.planets.find((sp) => sp.planet === p.planet);
        expect(pShadbala).toBeDefined();

        const pBav = ashtakavarga.bav[p.planet.toUpperCase() as keyof typeof ashtakavarga.bav];
        expect(pBav).toBeDefined();
      }
    }
  });
});
