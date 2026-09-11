import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { PlanetName } from '@vedica/astrology-core';
import { isPlanetConnectedToHouse } from '@vedica/rules-engine';
import {
  DashaLevelActivation,
  MultiLevelDashaActivation,
  TimingDomain,
} from '../types/timing-types.js';
import { TimingProfile } from '../profiles/timing-profile.js';

const DOMAIN_HOUSES: Record<TimingDomain, number[]> = {
  CAREER: [10],
  WEALTH: [2, 11],
  RELATIONSHIPS: [7],
  PROPERTY: [4],
};

export function evaluateDashaLevelForDomain(
  dashaLevel: 'MAHADASHA' | 'ANTARDASHA' | 'PRATYANTARDASHA',
  lord: PlanetName | undefined,
  domain: TimingDomain,
  analysis: ChartAnalysisResult,
  profile: TimingProfile
): DashaLevelActivation {
  if (!lord) {
    return {
      dashaLevel,
      lord: 'Sun',
      connected: false,
      score: 0,
      evidence: [],
    };
  }

  const targetHouses = DOMAIN_HOUSES[domain] || [];
  let isConnected = false;
  const combinedEvidence: any[] = [];

  for (const house of targetHouses) {
    const res = isPlanetConnectedToHouse(lord, house, analysis);
    if (res.connected) {
      isConnected = true;
      combinedEvidence.push(...res.evidence);
    }
  }

  const weight = profile.dashaWeights[dashaLevel] || 0;
  const score = isConnected ? weight : 0;

  return {
    dashaLevel,
    lord,
    connected: isConnected,
    score,
    evidence: combinedEvidence,
  };
}

export function evaluateMultiLevelDashaActivation(
  dasha: {
    mahadasha?: { lord?: string | PlanetName };
    antardasha?: { lord?: string | PlanetName };
    pratyantardasha?: { lord?: string | PlanetName };
  },
  domain: TimingDomain,
  analysis: ChartAnalysisResult,
  profile: TimingProfile
): MultiLevelDashaActivation {
  const mdLord = dasha.mahadasha?.lord as PlanetName;
  const adLord = dasha.antardasha?.lord as PlanetName;
  const pdLord = dasha.pratyantardasha?.lord as PlanetName;

  const mahadasha = evaluateDashaLevelForDomain(
    'MAHADASHA',
    mdLord,
    domain,
    analysis,
    profile
  );
  const antardasha = evaluateDashaLevelForDomain(
    'ANTARDASHA',
    adLord,
    domain,
    analysis,
    profile
  );
  const pratyantardasha = evaluateDashaLevelForDomain(
    'PRATYANTARDASHA',
    pdLord,
    domain,
    analysis,
    profile
  );

  const totalScore = mahadasha.score + antardasha.score + pratyantardasha.score;

  return {
    domain,
    mahadasha,
    antardasha,
    pratyantardasha,
    totalScore,
  };
}
