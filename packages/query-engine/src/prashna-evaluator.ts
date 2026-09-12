import { PrashnaChartResult } from '@vedica/astrology-core';

export interface PrashnaEvaluationResult {
  question: string;
  queryCategory: 'CAREER' | 'RELATIONSHIPS' | 'FINANCE' | 'HEALTH' | 'GENERAL';
  lagnaLord: string;
  karyaLord: string;
  karyaHouse: number;
  hasIthasalaYoga: boolean; // Lord of Lagna and Lord of Karya in aspect
  outcome: 'FAVORABLE' | 'MODERATE' | 'UNFAVORABLE';
  fulfillmentConfidencePercentage: number;
  explanation: string;
}

const CATEGORY_HOUSES: Record<PrashnaEvaluationResult['queryCategory'], number> = {
  CAREER: 10,
  RELATIONSHIPS: 7,
  FINANCE: 2,
  HEALTH: 1,
  GENERAL: 11,
};

const RASHI_LORDS: Record<string, string> = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

function getRashiIndexFromLongitude(longitude: number): number {
  return Math.floor(((longitude % 360) + 360) % 360 / 30) + 1;
}

export function evaluatePrashnaQuery(prashna: PrashnaChartResult): PrashnaEvaluationResult {
  const q = prashna.question.toLowerCase();
  let category: PrashnaEvaluationResult['queryCategory'] = 'GENERAL';
  if (q.includes('job') || q.includes('career') || q.includes('work') || q.includes('business') || q.includes('promotion')) {
    category = 'CAREER';
  } else if (q.includes('marry') || q.includes('love') || q.includes('partner') || q.includes('relationship')) {
    category = 'RELATIONSHIPS';
  } else if (q.includes('money') || q.includes('wealth') || q.includes('finance') || q.includes('pay') || q.includes('income')) {
    category = 'FINANCE';
  } else if (q.includes('health') || q.includes('disease') || q.includes('cure') || q.includes('recovery')) {
    category = 'HEALTH';
  }

  const karyaHouse = CATEGORY_HOUSES[category];
  const chart = prashna.chart;
  const lagnaLongitude = chart.lagna?.longitude ?? 0;
  const lagnaSignIndex = getRashiIndexFromLongitude(lagnaLongitude);

  const karyaSignIndex = ((lagnaSignIndex - 1 + (karyaHouse - 1)) % 12) + 1;
  const rashiNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const karyaSignName = rashiNames[karyaSignIndex - 1];
  const karyaLord = RASHI_LORDS[karyaSignName] || 'Mars';

  const lagnaLord = prashna.prashnaLagnaLord;
  const lagnaLordPos = chart.planets.find((p) => p.planet === lagnaLord);
  const karyaLordPos = chart.planets.find((p) => p.planet === karyaLord);

  let hasIthasala = false;
  if (lagnaLordPos && karyaLordPos) {
    const p1SignIdx = getRashiIndexFromLongitude(lagnaLordPos.longitude);
    const p2SignIdx = getRashiIndexFromLongitude(karyaLordPos.longitude);
    const diff = Math.abs(p1SignIdx - p2SignIdx);
    if (diff === 0 || diff === 4 || diff === 6 || diff === 8) {
      hasIthasala = true;
    }
  }

  const moonPos = chart.planets.find((p) => p.planet === 'Moon');
  const moonSignIdx = moonPos ? getRashiIndexFromLongitude(moonPos.longitude) : 1;
  const moonHouse = ((moonSignIdx - lagnaSignIndex + 12) % 12) + 1;
  const isMoonFavorable = ![6, 8, 12].includes(moonHouse);

  let confidence = 50;
  if (hasIthasala) confidence += 30;
  if (isMoonFavorable) confidence += 15;

  let outcome: PrashnaEvaluationResult['outcome'] = 'MODERATE';
  if (confidence >= 80) outcome = 'FAVORABLE';
  else if (confidence < 50) outcome = 'UNFAVORABLE';

  return {
    question: prashna.question,
    queryCategory: category,
    lagnaLord,
    karyaLord,
    karyaHouse,
    hasIthasalaYoga: hasIthasala,
    outcome,
    fulfillmentConfidencePercentage: confidence,
    explanation: `Prashna Horary evaluation for ${category} query. Lagna Lord (${lagnaLord}) and Karya Lord (${karyaLord} of House ${karyaHouse}) ${hasIthasala ? 'form positive Ithasala aspect yoga' : 'do not form immediate Ithasala aspect'}. Moon placed in House ${moonHouse}.`,
  };
}
