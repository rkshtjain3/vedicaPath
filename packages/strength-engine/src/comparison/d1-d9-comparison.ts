import { PlanetName } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { DivisionalChart, analyzeDivisionalChart } from '@vedica/divisional-chart-engine';
import { StrengthFactor, StrengthProfile } from '../types/strength-types.js';

export interface D1D9ComparisonResult {
  planet: PlanetName;
  d1Sign: string;
  d9Sign?: string;
  d1House: number;
  d9House?: number;
  isVargottama: boolean;
  vargottamaFactor: StrengthFactor | null;
}

export function evaluateD1D9Comparison(
  planet: PlanetName,
  analysis: ChartAnalysisResult,
  d9Chart?: DivisionalChart,
  profile?: StrengthProfile
): D1D9ComparisonResult {
  const pD1 = analysis.planetFacts.find((p) => p.planet === planet);
  const d1Sign = pD1 ? pD1.sign : 'Unknown';
  const d1House = pD1 ? pD1.house : 1;

  if (!d9Chart) {
    return {
      planet,
      d1Sign,
      d1House,
      isVargottama: false,
      vargottamaFactor: null,
    };
  }

  const d9Analysis = analyzeDivisionalChart(d9Chart, analysis);
  const pD9 = d9Analysis.planets.find((p) => p.planet === planet);
  const d9Sign = pD9 ? pD9.position.sign.name : undefined;
  const d9House = pD9 ? pD9.house : undefined;

  const isVargottama = d1Sign === d9Sign;
  const weight = profile?.weights.VARGOTTAMA ?? 3;

  let vargottamaFactor: StrengthFactor | null = null;
  if (isVargottama) {
    vargottamaFactor = {
      id: `VARGOTTAMA_${planet.toUpperCase()}`,
      category: 'VARGOTTAMA',
      effect: 'SUPPORTIVE',
      scoreContribution: weight,
      evidence: [
        `${planet} is Vargottama (D1: ${d1Sign}, D9: ${d9Sign}).`,
        `Occupies identical sign in D1 Rashi and D9 Navamsa charts.`,
        `Score Contribution: +${weight}.`,
      ],
    };
  }

  return {
    planet,
    d1Sign,
    d9Sign,
    d1House,
    d9House,
    isVargottama,
    vargottamaFactor,
  };
}
