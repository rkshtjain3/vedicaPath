import { BirthChart } from '../types/astrology.js';
import { LocationInput } from '@vedica/shared';
import { SwissEphemerisEngine } from './swiss-ephemeris-engine.js';
import { PERSONAL_VEDIC_V1 } from '../settings/calculation-profile.js';

export interface PrashnaQueryInput {
  question: string;
  location: LocationInput;
  queryInstantIso?: string; // Default current ISO time
}

export interface PrashnaChartResult {
  question: string;
  queryInstantIso: string;
  chart: BirthChart;
  prashnaLagnaSign: string;
  prashnaLagnaLord: string;
}

export async function calculatePrashnaChart(
  input: PrashnaQueryInput
): Promise<PrashnaChartResult> {
  const instantDate = input.queryInstantIso ? new Date(input.queryInstantIso) : new Date();
  const isoString = instantDate.toISOString();

  // Format date and time for BirthTimeInput
  const year = instantDate.getUTCFullYear();
  const month = String(instantDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(instantDate.getUTCDate()).padStart(2, '0');
  const hour = String(instantDate.getUTCHours()).padStart(2, '0');
  const min = String(instantDate.getUTCMinutes()).padStart(2, '0');
  const sec = String(instantDate.getUTCSeconds()).padStart(2, '0');

  const birthTime = {
    dateOfBirth: `${year}-${month}-${day}`,
    timeOfBirth: `${hour}:${min}:${sec}`,
    timezone: input.location.timezone || 'Asia/Kolkata',
  };

  const engine = new SwissEphemerisEngine();
  const chart = await engine.calculateBirthChart(
    { birthTime, location: input.location },
    PERSONAL_VEDIC_V1
  );

  return {
    question: input.question,
    queryInstantIso: isoString,
    chart,
    prashnaLagnaSign: chart.lagna.sign.name,
    prashnaLagnaLord: chart.lagna.sign.ruler,
  };
}

