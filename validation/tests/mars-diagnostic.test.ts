/**
 * Mars Deep-Dive Diagnostic for Rakshit Jain
 * Birth: 1996-09-23 14:30 IST, New Delhi
 */
import { describe, it, expect } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1, getRashiFromLongitude } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import { evaluateStrengthEngine, PERSONAL_STRENGTH_V1 } from '@vedica/strength-engine';
import { evaluateShadbalaEngine, PERSONAL_SHADBALA_V1 } from '@vedica/shadbala-engine';
import { calculateAllDivisionalCharts, analyzeDivisionalChart } from '@vedica/divisional-chart-engine';
import { evaluateYogaEngine, PERSONAL_YOGA_V1 } from '@vedica/yoga-engine';
import {
  generateMahadashas,
  getCurrentDasha,
} from '@vedica/dasha-engine';

const RAKSHIT_INPUT = {
  birthTime: {
    dateOfBirth: '1996-09-23',
    timeOfBirth: '14:30:00',
    timezone: 'Asia/Kolkata',
  },
  location: {
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
  },
};

describe('Mars Deep-Dive Diagnostic — Rakshit Jain', () => {
  it('prints complete Mars analysis across all engines', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(RAKSHIT_INPUT, PERSONAL_VEDIC_V1);

    const mars = chart.planets.find((p) => p.planet === 'Mars')!;

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('       MARS DEEP-DIVE: Rakshit Jain (1996-09-23 14:30 IST)');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`UTC: ${chart.utcInstant.isoString}`);
    console.log(`Ayanamsa (Lahiri): ${chart.ayanamsaValue.toFixed(6)}°`);
    console.log('');
    console.log('─── MARS D1 (Rashi) Position ───');
    console.log(`  Longitude:      ${mars.longitude.toFixed(4)}°`);
    console.log(`  Sign:           ${mars.sign.name} (${mars.sign.sanskritName})`);
    console.log(`  Degree in Sign: ${mars.degreeInSign.toFixed(4)}°`);
    console.log(`  Formatted:      ${mars.formattedDegree}`);
    console.log(`  Nakshatra:      ${mars.nakshatra.name} Pada ${mars.nakshatra.pada}`);
    console.log(`  Nak Ruler:      ${mars.nakshatra.ruler}`);
    console.log(`  Retrograde:     ${mars.isRetrograde}`);
    console.log(`  Speed:          ${mars.speed.toFixed(6)}°/day`);

    // Lagna
    console.log('');
    console.log('─── LAGNA ───');
    console.log(`  ${chart.lagna.sign.name} (${chart.lagna.longitude.toFixed(4)}°)`);

    // Mars House Position
    const lagnaSignId = chart.lagna.sign.id;
    const marsSignId = mars.sign.id;
    const marsHouse = ((marsSignId - lagnaSignId + 12) % 12) + 1;
    console.log(`  Mars House:     ${marsHouse} (from Lagna)`);

    // Mars dignity analysis
    const marsRuler = mars.sign.ruler;
    const isOwnSign = marsRuler === 'Mars';
    const isExalted = mars.sign.name === 'Capricorn';
    const isDebilitated = mars.sign.name === 'Cancer';
    console.log('');
    console.log('─── MARS DIGNITY ───');
    console.log(`  Sign Ruler:     ${marsRuler}`);
    console.log(`  Own Sign:       ${isOwnSign}`);
    console.log(`  Exalted:        ${isExalted}`);
    console.log(`  Debilitated:    ${isDebilitated}`);

    // All Planets
    console.log('');
    console.log('─── ALL PLANETS ───');
    for (const p of chart.planets) {
      const h = ((p.sign.id - lagnaSignId + 12) % 12) + 1;
      console.log(`  ${p.planet.padEnd(8)} ${p.longitude.toFixed(4).padStart(10)}° ${p.sign.name.padEnd(12)} H${String(h).padStart(2)} ${p.nakshatra.name.padEnd(20)} P${p.nakshatra.pada}${p.isRetrograde ? ' [R]' : ''}`);
    }

    // Chart Analysis
    const analysis = analyzeChart(chart);
    console.log('');
    console.log('─── ANALYSIS ENGINE STRUCTURE ───');
    console.log('  Top-level keys:', Object.keys(analysis));

    // Try common patterns
    const anyAnalysis = analysis as any;
    if (anyAnalysis.functionalBenefics) {
      console.log('  Functional Benefics:', anyAnalysis.functionalBenefics);
    }
    if (anyAnalysis.functionalMalefics) {
      console.log('  Functional Malefics:', anyAnalysis.functionalMalefics);
    }
    if (anyAnalysis.houseOccupants) {
      console.log('  House Occupants:', JSON.stringify(anyAnalysis.houseOccupants));
    }
    if (anyAnalysis.planetHouseMap) {
      console.log('  Planet House Map:', JSON.stringify(anyAnalysis.planetHouseMap));
    }
    if (anyAnalysis.aspects) {
      console.log('  Aspects:', JSON.stringify(anyAnalysis.aspects));
    }

    // Strength Engine
    const allDivisionalCharts = calculateAllDivisionalCharts(chart);
    const d9Chart = allDivisionalCharts.D9;

    const strengthResult = evaluateStrengthEngine(chart, analysis, d9Chart, PERSONAL_STRENGTH_V1);
    const marsStrength = strengthResult.planets.find((p) => p.planet === 'Mars');

    console.log('');
    console.log('─── MARS STRENGTH ENGINE RESULT ───');
    if (marsStrength) {
      console.log(`  Score:           ${marsStrength.score}`);
      console.log(`  Classification:  ${marsStrength.overallStrength}`);
      console.log(`  D1 Dignity:      ${marsStrength.d1Dignity}`);
      console.log(`  D9 Dignity:      ${marsStrength.d9Dignity}`);
      console.log(`  House:           ${marsStrength.house}`);
      console.log(`  Combust:         ${marsStrength.isCombust}`);
      console.log(`  Retrograde:      ${marsStrength.isRetrograde}`);
      console.log('');
      console.log('  Strength Factors:');
      for (const f of marsStrength.factors) {
        console.log(`    ${(f.name || 'unknown').padEnd(30)} ${String(f.scoreContribution).padStart(4)} pts — ${(f as any).effect || ''} — ${(f as any).description || ''}`);
      }
      console.log('  Full Mars Strength Object:');
      console.log(JSON.stringify(marsStrength, null, 2));
    }

    // Shadbala Engine
    const shadbala = evaluateShadbalaEngine({ chart, analysis, d9Chart }, PERSONAL_SHADBALA_V1);
    console.log('');
    console.log('─── MARS SHADBALA ───');
    const anyShadbala = shadbala as any;
    if (anyShadbala.planets) {
      const marsSB = anyShadbala.planets.find?.((p: any) => p.planet === 'Mars');
      if (marsSB) {
        console.log(`  Total Shadbala: ${marsSB.totalShadbala || marsSB.total}`);
        console.log(`  Required:       ${marsSB.required}`);
        console.log(`  Ratio:          ${marsSB.ratio}`);
        console.log(`  Sufficient:     ${marsSB.isSufficient}`);
      }
    }
    if (anyShadbala.results) {
      const marsR = anyShadbala.results.find?.((r: any) => r.planet === 'Mars');
      if (marsR) {
        console.log(JSON.stringify(marsR, null, 2));
      }
    }
    // Direct access pattern
    if (anyShadbala.Mars) {
      console.log(JSON.stringify(anyShadbala.Mars, null, 2));
    }
    console.log('  Shadbala keys:', Object.keys(shadbala));

    // Divisional Charts
    console.log('');
    console.log('─── MARS IN DIVISIONAL CHARTS ───');
    for (const [key, dChart] of Object.entries(allDivisionalCharts)) {
      const anyDChart = dChart as any;
      if (anyDChart.planets?.Mars) {
        const mp = anyDChart.planets.Mars;
        console.log(`  ${key.padEnd(5)}: ${mp.rashiName?.padEnd(12) || 'N/A'} (${(mp.absoluteLongitude || 0).toFixed(2)}°)`);
      }
    }

    // Yoga Engine
    const yogaAnalysis = evaluateYogaEngine(chart, analysis, PERSONAL_YOGA_V1);
    console.log('');
    console.log('─── MARS-RELATED YOGAS ───');
    if (yogaAnalysis.yogas) {
      for (const y of yogaAnalysis.yogas) {
        const yStr = JSON.stringify(y);
        if (yStr.includes('Mars') && y.isPresent) {
          console.log(`  ✅ ${y.name}: ${y.description || ''}`);
        }
      }
      for (const y of yogaAnalysis.yogas) {
        const yStr = JSON.stringify(y);
        if (yStr.includes('Mars') && !y.isPresent) {
          console.log(`  ❌ ${y.name}: NOT present`);
        }
      }
    }

    // Dasha
    const moonPlanet = chart.planets.find((p) => p.planet === 'Moon')!;
    const birthDate = new Date(chart.utcInstant.isoString);
    const dashaResult = generateMahadashas({
      birthInstant: birthDate,
      moonLongitude: moonPlanet.longitude,
    });
    const currentDasha = getCurrentDasha({
      mahadashas: dashaResult.mahadashas,
      instant: new Date(),
    });

    console.log('');
    console.log('─── CURRENT DASHA ───');
    const maha = currentDasha?.mahadasha || currentDasha?.maha;
    const antar = currentDasha?.antardasha || currentDasha?.antar;
    const pratyantar = currentDasha?.pratyantardasha || currentDasha?.pratyantar;
    if (maha) {
      console.log(`  Maha:      ${maha.lord} (${maha.startDate?.toISOString?.()?.split('T')[0] || maha.startDate} → ${maha.endDate?.toISOString?.()?.split('T')[0] || maha.endDate})`);
    }
    if (antar) {
      console.log(`  Antar:     ${antar.lord} (${antar.startDate?.toISOString?.()?.split('T')[0] || antar.startDate} → ${antar.endDate?.toISOString?.()?.split('T')[0] || antar.endDate})`);
    }
    if (pratyantar) {
      console.log(`  Pratyantar: ${pratyantar.lord} (${pratyantar.startDate?.toISOString?.()?.split('T')[0] || pratyantar.startDate} → ${pratyantar.endDate?.toISOString?.()?.split('T')[0] || pratyantar.endDate})`);
    }

    // Mars Mahadasha
    const marsMaha = dashaResult.mahadashas.find((m) => m.lord === 'Mars');
    if (marsMaha) {
      console.log('');
      console.log('─── MARS MAHADASHA ───');
      const start = marsMaha.startDate?.toISOString ? marsMaha.startDate.toISOString().split('T')[0] : String(marsMaha.startDate).split('T')[0];
      const end = marsMaha.endDate?.toISOString ? marsMaha.endDate.toISOString().split('T')[0] : String(marsMaha.endDate).split('T')[0];
      console.log(`  Period: ${start} → ${end}`);
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');

    expect(mars).toBeDefined();
  });
});
