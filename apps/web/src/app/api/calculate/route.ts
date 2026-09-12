import { NextResponse } from 'next/server';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import {
  resolveLocalTime,
  calculateInputFingerprint,
  calculateReproducibilityHash,
} from '@vedica/shared';
import {
  calculateLifePathNumber,
  calculateBirthdayNumber,
  calculateAttitudeNumber,
  calculatePersonalYearNumber,
  calculatePersonalMonthNumber,
  calculatePersonalDayNumber,
  analyzeNameNumerology,
} from '@vedica/numerology-engine';

import {
  generateMahadashas,
  getCurrentDasha,
  calculateYoginiDasha,
} from '@vedica/dasha-engine';

import { analyzeChart } from '@vedica/analysis-engine';
import {
  evaluateRulesEngine,
  PERSONAL_RULES_V1 as RULES_V1,
  evaluateCareerD10Rules,
  PERSONAL_CAREER_D10_RULES_V1,
} from '@vedica/rules-engine';
import {
  evaluateTimingEngine,
  PERSONAL_TIMING_V1 as TIMING_V1,
  evaluateTransitAshtakavarga,
  PERSONAL_TRANSIT_ASHTAKAVARGA_V1,
  calculateLifeMilestones,
} from '@vedica/timing-engine';
import {
  evaluateInterpretationEngine,
  PERSONAL_INTERPRETATION_V1 as INTERPRETATION_V1,
  synthesizeLifeStorybook,
} from '@vedica/interpretation-engine';
import {
  evaluateLifeDomainEngine,
  diagnoseStruggleAndFailure,
} from '@vedica/life-domain-engine';
import { evaluateTimelineEngine, generateMonthlyForecast } from '@vedica/timeline-engine';
import { evaluateTransitEngine, evaluateNatalDashaTransitConvergence } from '@vedica/transit-engine';
import { evaluateYogaEngine, PERSONAL_YOGA_V1 } from '@vedica/yoga-engine';
import { generatePersonalReport, PERSONAL_REPORT_V1 } from '@vedica/report-engine';
import { db } from '@/db/client';
import { birthProfiles } from '@/db/schema';

import {
  calculateDivisionalChart,
  calculateAllDivisionalCharts,
  calculateVimsopakaBala,
  analyzeDivisionalChart,
  compareRashiAndNavamsa,
  compareRashiAndDashamsa,
  calculateCareerCrossChartFacts,
} from '@vedica/divisional-chart-engine';
import { evaluateJaimini } from '@vedica/jaimini-engine';
import { evaluateBaZi } from '@vedica/bazi-engine';
import {
  calculateAshtakavarga,
  PERSONAL_ASHTAKAVARGA_V1,
} from '@vedica/ashtakavarga-engine';
import {
  evaluateStrengthEngine,
  PERSONAL_STRENGTH_V1 as STRENGTH_V1,
} from '@vedica/strength-engine';
import {
  evaluateShadbalaEngine,
  PERSONAL_SHADBALA_V1 as SHADBALA_V1,
} from '@vedica/shadbala-engine';
import { evaluatePanchanga } from '@vedica/panchanga-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const birthTime = {
      dateOfBirth: body.dateOfBirth || body.birthLocalDate || '1996-09-23',
      timeOfBirth: body.timeOfBirth || body.birthLocalTime || '12:00:00',
      timezone: body.timezone || body.location?.timezone || 'Asia/Kolkata',
    };

    // DST Local Time Resolution Check
    const localTimeRes = resolveLocalTime(
      birthTime,
      body.dstOccurrencePreference === 'SECOND' ? 'SECOND' : 'FIRST'
    );

    if (localTimeRes.status === 'NON_EXISTENT') {
      return NextResponse.json(
        {
          success: false,
          error: 'NON_EXISTENT_LOCAL_TIME',
          reason: localTimeRes.reason,
        },
        { status: 400 }
      );
    }

    const location = {
      latitude: parseFloat(body.latitude) || body.location?.latitude || 28.6139,
      longitude: parseFloat(body.longitude) || body.location?.longitude || 77.209,
      name: body.locationName || body.location?.displayName || 'New Delhi, India',
      timezone: body.timezone || body.location?.timezone || 'Asia/Kolkata',
    };

    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      { birthTime, location },
      PERSONAL_VEDIC_V1
    );

    // Complete Shodashavarga (16 Divisional Charts) Engine
    const allDivisionalCharts = calculateAllDivisionalCharts(chart);
    const d9Chart = allDivisionalCharts.D9;
    const d10Chart = allDivisionalCharts.D10;

    const analysis = analyzeChart(chart);
    const d9Analysis = analyzeDivisionalChart(d9Chart, analysis);
    const d10Analysis = analyzeDivisionalChart(d10Chart, analysis);

    const vargaComparison = compareRashiAndNavamsa(chart, d9Chart, analysis);
    const dashamsaComparison = compareRashiAndDashamsa(chart, d10Chart, analysis);

    // Vimsopaka Bala (20-Point Divisional Strength)
    const vimsopakaBala = calculateVimsopakaBala(chart, allDivisionalCharts, 'SHODASHAVARGA');

    // Jaimini Astrology Engine (Chara Karakas, Arudha Padas, Rashi Drishti, Karakamsha)
    const jaimini = evaluateJaimini(chart, '7_KARAKA');

    // BaZi / Four Pillars of Destiny Engine (chinese-bazi-v1)
    const bazi = evaluateBaZi(chart, { gender: body.gender === 'FEMALE' ? 'FEMALE' : 'MALE' });

    // Classical Yoga Engine (Phase 16)
    const yogaAnalysis = evaluateYogaEngine(chart, analysis, PERSONAL_YOGA_V1);

    // Ashtakavarga Engine
    const ashtakavarga = calculateAshtakavarga(chart, PERSONAL_ASHTAKAVARGA_V1);

    const currentInstant = new Date();

    // Transit-Ashtakavarga Evidence Evaluation
    const transitAshtakavarga = await evaluateTransitAshtakavarga({
      natalChart: chart,
      ashtakavarga,
      instant: currentInstant,
      profile: PERSONAL_TRANSIT_ASHTAKAVARGA_V1,
    });

    // Audit Input Fingerprint & Reproducibility Hash
    const auditInput = {
      birthLocalDate: birthTime.dateOfBirth,
      birthLocalTime: birthTime.timeOfBirth,
      location: {
        displayName: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone,
      },
      resolvedUTC: chart.utcInstant.isoString,
      calculationProfile: PERSONAL_VEDIC_V1.version,
    };

    const inputFingerprint = calculateInputFingerprint(auditInput);

    const planetLongitudes: Record<string, number> = {};
    for (const p of chart.planets) {
      planetLongitudes[p.planet] = p.longitude;
    }
    // Include D9 & D10 divisional longitudes in reproducibility audit
    for (const [pName, pPos] of Object.entries(d9Chart.planets)) {
      planetLongitudes[`D9_${pName}`] = pPos.absoluteLongitude;
    }
    planetLongitudes[`D10_Lagna`] = d10Chart.ascendant.absoluteLongitude;
    for (const [pName, pPos] of Object.entries(d10Chart.planets)) {
      planetLongitudes[`D10_${pName}`] = pPos.absoluteLongitude;
    }
    // Include BAV & SAV sign totals in reproducibility audit metadata
    for (const [pName, b] of Object.entries(ashtakavarga.bav)) {
      for (const [signName, pts] of Object.entries(b.signPoints)) {
        planetLongitudes[`BAV_${pName}_${signName}`] = pts;
      }
    }
    for (const [signName, pts] of Object.entries(ashtakavarga.sav.signPoints)) {
      planetLongitudes[`SAV_${signName}`] = pts;
    }
    for (const [pName, ev] of Object.entries(transitAshtakavarga.evidenceMap)) {
      planetLongitudes[`TRANSIT_A8_BAV_${pName}`] = ev.bavPoints;
      planetLongitudes[`TRANSIT_A8_SAV_${pName}`] = ev.savPoints;
    }

    const reproducibilityHash = calculateReproducibilityHash(
      inputFingerprint,
      chart.lagna.longitude,
      planetLongitudes
    );

    // Dasha Calculations
    const moonPlanet = chart.planets.find((p) => p.planet === 'Moon')!;
    const birthDate = new Date(chart.utcInstant.isoString);

    const dashaResult = generateMahadashas({
      birthInstant: birthDate,
      moonLongitude: moonPlanet.longitude,
    });

    const currentDasha = getCurrentDasha({
      mahadashas: dashaResult.mahadashas,
      instant: currentInstant,
    });

    const yoginiDasha = calculateYoginiDasha({
      birthInstant: birthDate,
      moonLongitude: moonPlanet.longitude,
      targetInstant: currentInstant,
      cycles: 3,
    });


    // Numerology Calculations
    const lifePath = calculateLifePathNumber(birthTime.dateOfBirth);
    const birthday = calculateBirthdayNumber(birthTime.dateOfBirth);
    const attitude = calculateAttitudeNumber(birthTime.dateOfBirth);
    const personalYear = calculatePersonalYearNumber(
      birthTime.dateOfBirth,
      new Date().getFullYear()
    );
    const personalMonth = calculatePersonalMonthNumber(
      birthTime.dateOfBirth,
      new Date().getFullYear(),
      new Date().getMonth() + 1
    );
    const personalDay = calculatePersonalDayNumber(
      birthTime.dateOfBirth,
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    );

    const fullName = body.fullName || body.name || undefined;
    const nameAnalysis = fullName ? analyzeNameNumerology(fullName) : null;

    // Store profile in SQLite (non-blocking)
    const profileId = `prof_${Date.now()}`;
    db.insert(birthProfiles)
      .values({
        id: profileId,
        name: fullName || 'Anonymous',
        fullName: fullName || null,
        dateOfBirth: birthTime.dateOfBirth,
        timeOfBirth: birthTime.timeOfBirth,
        timezone: location.timezone,
        latitude: location.latitude,
        longitude: location.longitude,
        locationName: location.name,
        calculationProfileVersion: PERSONAL_VEDIC_V1.version,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .catch((err) => console.warn('Database save warning:', err));

    // Planetary Strength & Relationship Engine
    const strengthAnalysis = evaluateStrengthEngine(
      chart,
      analysis,
      d9Chart,
      STRENGTH_V1
    );

    // Classical Shadbala Engine
    const shadbala = evaluateShadbalaEngine(
      {
        chart,
        analysis,
        d9Chart,
      },
      SHADBALA_V1
    );

    const strengthScoreMap: Record<string, { totalScore: number; classification: string }> = {};
    for (const s of strengthAnalysis.planets) {
      strengthScoreMap[s.planet] = {
        totalScore: s.score,
        classification: s.overallStrength,
      };
    }

    const careerCrossChart = calculateCareerCrossChartFacts(
      chart,
      d10Chart,
      analysis,
      d9Chart,
      strengthScoreMap
    );

    const rules = evaluateRulesEngine(
      {
        chart,
        dasha: dashaResult,
        currentDasha,
        analysis,
        d10Chart,
        d9Chart,
        careerCrossChart,
      },
      RULES_V1
    );

    const careerD10 = evaluateCareerD10Rules(
      {
        chart,
        dasha: dashaResult,
        currentDasha,
        analysis,
        d10Chart,
        d9Chart,
        careerCrossChart,
      },
      PERSONAL_CAREER_D10_RULES_V1
    );
    rules.careerD10 = careerD10;

    const timing = await evaluateTimingEngine({
      chart,
      analysis,
      dasha: {
        mahadashas: dashaResult.mahadashas,
        current: currentDasha,
      },
      instant: currentInstant,
      profile: TIMING_V1,
    });

    const interpretation = evaluateInterpretationEngine({
      rulesResult: rules,
      timingResult: timing,
      profile: INTERPRETATION_V1,
    });

    const lifeDomainAnalysis = evaluateLifeDomainEngine({
      astrology: chart,
      analysis,
      divisionalCharts: {
        d9: d9Chart,
        d9Analysis,
        d10: d10Chart,
        d10Analysis,
      },
      strengthAnalysis,
      shadbala,
      ashtakavarga: {
        bav: ashtakavarga.bav,
        sav: ashtakavarga.sav,
        validation: ashtakavarga.validation,
        profileVersion: ashtakavarga.profileVersion,
      },
      transitAshtakavarga,
      yogaAnalysis,
      rules,
      timing,
      dasha: {
        balance: dashaResult.balance,
        mahadashas: dashaResult.mahadashas,
        current: currentDasha,
      },
      crossChartAnalysis: {
        career: careerCrossChart,
      },
    });

    const timelineAnalysis = evaluateTimelineEngine(
      {
        astrology: chart,
        analysis,
        divisionalCharts: {
          d9Chart,
          d9Analysis,
          d10Chart,
          d10Analysis,
        },
        strengthAnalysis,
        shadbala,
        ashtakavarga: {
          bav: ashtakavarga.bav,
          sav: ashtakavarga.sav,
        },
        yogaAnalysis,
        rules,
        timing,
        dasha: {
          balance: dashaResult.balance,
          mahadashas: dashaResult.mahadashas,
          current: currentDasha,
        },
        lifeDomainAnalysis,
      },
      { currentDate: currentInstant }
    );

    const transitTargetDate = body.transitDate ? new Date(body.transitDate) : currentInstant;
    const transitAnalysis = await evaluateTransitEngine(chart, { transitDate: transitTargetDate });
    const natalDashaTransitConvergence = evaluateNatalDashaTransitConvergence({
      lifeDomainAnalysis,
      timelineAnalysis,
      transitAnalysis,
      ashtakavarga,
      yogaAnalysis,
      strengthAnalysis,
    });

    const numerologyData = {
      lifePath,
      birthday,
      attitude,
      personalYear,
      personalMonth,
      personalDay,
      nameAnalysis,
    };

    const report = generatePersonalReport(
      {
        chart,
        analysis,
        yogaAnalysis,
        divisionalCharts: {
          d9: d9Chart,
          d9Analysis,
          d10: d10Chart,
          d10Analysis,
        },
        vargaComparison,
        strengthAnalysis,
        shadbala,
        ashtakavarga: {
          bav: ashtakavarga.bav,
          sav: ashtakavarga.sav,
          validation: ashtakavarga.validation,
          profileVersion: ashtakavarga.profileVersion,
        },
        rules,
        timing,
        numerology: numerologyData,
        lifeDomainAnalysis,
        timelineAnalysis,
        crossChartAnalysis: {
          career: careerCrossChart,
        },
      },
      PERSONAL_REPORT_V1
    );

    const targetYear = body.forecastYear ? parseInt(body.forecastYear) : new Date().getFullYear();
    const monthlyForecast = await generateMonthlyForecast(chart, {
      targetYear,
      ashtakavarga: {
        sav: ashtakavarga.sav,
      },
      dashaData: {
        timeline: timelineAnalysis.timeline,
      },
      shadbala,
      strengthResult: strengthAnalysis,
    });

    // Classical Panchanga & Muhurtha Engine
    const panchanga = evaluatePanchanga({ chart });

    // Life Milestones & Timing Windows
    const milestones = calculateLifeMilestones({
      chart,
      analysis,
      mahadashas: dashaResult.mahadashas,
      currentDate: currentInstant,
    });

    // Struggle & Failure Diagnostic
    const struggles = diagnoseStruggleAndFailure({
      chart,
      analysis,
      currentDasha,
      ashtakavarga,
      transitAnalysis,
      currentDate: currentInstant,
    });

    // Executive Life Storybook Synthesis (Narrative Human Experience)
    const lifeStorybook = synthesizeLifeStorybook({
      chart,
      analysis,
      fullName,
      dashaData: {
        current: currentDasha,
        mahadashas: dashaResult.mahadashas,
      },
      timingData: timing,
      milestones,
      struggles,
    });

    return NextResponse.json({
      success: true,
      data: {
        astrology: chart,
        analysis,
        panchanga,
        yogaAnalysis,
        shodashavarga: allDivisionalCharts,
        vimsopakaBala,
        jaimini,
        bazi,
        divisionalCharts: {
          d9: d9Chart,
          d9Analysis,
          d10: d10Chart,
          d10Analysis,
        },
        vargaComparison,
        dashamsaComparison,
        crossChartAnalysis: {
          career: careerCrossChart,
        },
        strengthAnalysis,
        shadbala,
        ashtakavarga: {
          bav: ashtakavarga.bav,
          sav: ashtakavarga.sav,
          shodhana: ashtakavarga.shodhana,
          validation: ashtakavarga.validation,
          profileVersion: ashtakavarga.profileVersion,
        },
        transitAshtakavarga,
        rules,
        timing,
        interpretation,
        lifeDomainAnalysis,
        timelineAnalysis,
        transitAnalysis,
        natalDashaTransitConvergence,
        monthlyForecast,
        milestones,
        struggles,
        lifeStorybook,
        dasha: {
          balance: dashaResult.balance,
          mahadashas: dashaResult.mahadashas,
          current: currentDasha,
          yogini: yoginiDasha,
        },
        numerology: numerologyData,

        report,

        audit: {
          ...auditInput,
          inputFingerprint,
          reproducibilityHash,
          localTimeResolution: localTimeRes.status,
          dstWarning: localTimeRes.status === 'AMBIGUOUS' ? localTimeRes.warning : undefined,
        },
      },
    });
  } catch (error: any) {
    console.error('Calculation API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Calculation Error' },
      { status: 500 }
    );
  }
}
