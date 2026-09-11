import { BirthChart } from '@vedica/astrology-core';
import { PanchangaResult } from './types/panchanga-types.js';
import { calculateTithi } from './tithi/tithi-calculator.js';
import { calculateVara } from './vara/vara-calculator.js';
import { calculateNakshatraPanchanga } from './nakshatra/nakshatra-panchanga.js';
import { calculateYoga } from './yoga/yoga-calculator.js';
import { calculateKarana } from './karana/karana-calculator.js';
import { calculateMuhurthaWindows } from './muhurtha/muhurtha-calculator.js';
import { calculateUpagrahas } from './upagraha/upagraha-calculator.js';

export interface PanchangaContext {
  chart: BirthChart;
  sunriseMinutes?: number;
  sunsetMinutes?: number;
}

export function evaluatePanchanga(context: PanchangaContext): PanchangaResult {
  const { chart } = context;

  const sunPos = chart.planets.find((p) => p.planet === 'Sun');
  const moonPos = chart.planets.find((p) => p.planet === 'Moon');
  const lagnaLongitude = chart.lagna?.longitude ?? 0;

  const sunLongitude = sunPos?.longitude ?? 0;
  const moonLongitude = moonPos?.longitude ?? 0;
  const birthDate = chart.utcInstant?.isoString || new Date().toISOString();

  // 1. Five Limbs of Panchanga
  const tithi = calculateTithi(sunLongitude, moonLongitude);
  const vara = calculateVara(birthDate);
  const nakshatra = calculateNakshatraPanchanga(moonLongitude);
  const yoga = calculateYoga(sunLongitude, moonLongitude);
  const karana = calculateKarana(sunLongitude, moonLongitude);

  // 2. Muhurtha Windows
  const muhurtha = calculateMuhurthaWindows(
    vara.dayIndex,
    context.sunriseMinutes ?? 360,
    context.sunsetMinutes ?? 1080
  );

  // 3. Upagrahas (Mandi & Gulika)
  const sunHouse = Math.floor(((sunLongitude - lagnaLongitude + 360) % 360) / 30) + 1;
  const isDayBirth = sunHouse >= 7 && sunHouse <= 12;
  const upagrahas = calculateUpagrahas(lagnaLongitude, vara.dayIndex, isDayBirth);

  // 4. Trace & Evidence
  const evidence: string[] = [
    `=== Classical Panchanga Evaluation ===`,
    `1. Tithi: ${tithi.name} (${tithi.sanskritName}) — ${tithi.pakshaName} [${tithi.percentageElapsed.toFixed(1)}% elapsed]`,
    `   Deity: ${tithi.deity} | Nature: ${tithi.nature} | Ruler: ${tithi.rulingPlanet}`,
    `2. Vara: ${vara.name} (${vara.sanskritName}) | Lord: ${vara.lord} | Guna: ${vara.guna}`,
    `3. Nakshatra: ${nakshatra.name} (${nakshatra.sanskritName}) Pada ${nakshatra.pada} | Lord: ${nakshatra.lord} | Deity: ${nakshatra.deity} | Gana: ${nakshatra.gana}`,
    `4. Yoga: ${yoga.name} (${yoga.sanskritName}) [${yoga.isAuspicious ? 'Auspicious' : 'Caution'}] — ${yoga.meaning}`,
    `5. Karana: ${karana.karanaName} (${karana.sanskritName}) [${karana.type}] — ${karana.auspiciousness}`,
    ``,
    `=== Muhurtha & Daily Kaala Windows ===`,
    `- Rahu Kalam: ${muhurtha.rahuKalam.start} – ${muhurtha.rahuKalam.end}`,
    `- Yamaganda: ${muhurtha.yamaganda.start} – ${muhurtha.yamaganda.end}`,
    `- Gulika Kalam: ${muhurtha.gulikaKalam.start} – ${muhurtha.gulikaKalam.end}`,
    `- Abhijit Muhurta: ${muhurtha.abhijitMuhurta.start} – ${muhurtha.abhijitMuhurta.end}`,
    `- Brahma Muhurta: ${muhurtha.brahmaMuhurta.start} – ${muhurtha.brahmaMuhurta.end}`,
    ``,
    `=== Upagrahas ===`,
    `- Gulika: ${upagrahas.gulikaSign} (${upagrahas.gulikaDegreeFormatted})`,
    `- Mandi: ${upagrahas.mandiSign} (${upagrahas.mandiDegreeFormatted})`,
  ];

  const summary = {
    title: `${tithi.name} • ${nakshatra.name} • ${vara.name}`,
    description: `Born on ${tithi.pakshaName} ${tithi.name} under ${nakshatra.name} Nakshatra (Pada ${nakshatra.pada}) and ${yoga.name} Yoga with ${karana.karanaName} Karana.`,
    dominantEnergy: `${tithi.element} (Tithi) + ${vara.element} (Vara) + ${nakshatra.element} (Nakshatra) + ${yoga.element} (Yoga) + ${karana.element} (Karana)`,
    sattvicRecommendation: `${vara.recommendation} Harmonize with ${tithi.auspiciousness}`,
  };

  return {
    tithi,
    vara,
    nakshatra,
    yoga,
    karana,
    muhurtha,
    upagrahas,
    summary,
    evidence,
  };
}
