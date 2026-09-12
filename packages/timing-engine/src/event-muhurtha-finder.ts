import { BirthChart } from '@vedica/astrology-core';

export type AuspiciousIntention =
  | 'BUSINESS_LAUNCH'
  | 'PROPERTY_PURCHASE'
  | 'TRAVEL'
  | 'MEDICAL_PROCEDURE';

export interface AuspiciousWindow {
  date: string; // YYYY-MM-DD
  tithiName: string;
  nakshatraName: string;
  varaName: string;
  suitabilityScore: number; // 0-100
  quality: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'CAUTION';
  reason: string;
  recommendedTimeWindow: string;
}

export interface AuspiciousSearchOptions {
  intention: AuspiciousIntention;
  startDateIso: string;
  horizonDays?: number; // Default 30
}

export function findAuspiciousWindows(
  chart: BirthChart,
  options: AuspiciousSearchOptions
): AuspiciousWindow[] {
  const { intention, startDateIso, horizonDays = 30 } = options;
  const start = new Date(startDateIso);
  const windows: AuspiciousWindow[] = [];

  const tithiList = ['Pratipada', 'Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi', 'Trayodashi'];
  const nakshatraList = ['Rohini', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Shravana', 'Dhanishta', 'Revati'];
  const varaList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < horizonDays; i++) {
    const currentMs = start.getTime() + i * 24 * 60 * 60 * 1000;
    const currDate = new Date(currentMs);
    const dateStr = currDate.toISOString().split('T')[0];
    const dayIdx = currDate.getDay();

    const tithiName = tithiList[i % tithiList.length];
    const nakshatraName = nakshatraList[(i * 3) % nakshatraList.length];
    const varaName = varaList[dayIdx];

    // Intention specific suitability
    let baseScore = 70;
    if (dayIdx === 4 || dayIdx === 5) baseScore += 15; // Thu/Fri auspicious
    if (dayIdx === 2 && intention !== 'MEDICAL_PROCEDURE') baseScore -= 15; // Tuesday caution except surgery

    if (intention === 'BUSINESS_LAUNCH' && ['Thursday', 'Friday', 'Wednesday'].includes(varaName)) {
      baseScore += 10;
    }

    const suitabilityScore = Math.min(98, Math.max(40, baseScore));
    let quality: AuspiciousWindow['quality'] = 'MODERATE';
    if (suitabilityScore >= 85) quality = 'EXCELLENT';
    else if (suitabilityScore >= 70) quality = 'GOOD';
    else if (suitabilityScore >= 55) quality = 'MODERATE';
    else quality = 'CAUTION';

    if (quality === 'EXCELLENT' || quality === 'GOOD') {
      windows.push({
        date: dateStr,
        tithiName,
        nakshatraName,
        varaName,
        suitabilityScore,
        quality,
        reason: `${tithiName} Tithi with ${nakshatraName} Nakshatra on ${varaName} provides favorable energy for ${intention.replace('_', ' ')}.`,
        recommendedTimeWindow: '09:30 AM – 11:45 AM (Abhijit/Labh Hora)',
      });
    }
  }

  return windows.slice(0, 10);
}
