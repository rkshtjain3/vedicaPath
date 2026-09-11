import { TransitEvaluation, TransitPosition } from '../types/timing-types.js';
import { TimingProfile } from '../profiles/timing-profile.js';

export function evaluateTransitRules(
  transits: TransitPosition[],
  profile: TimingProfile
): TransitEvaluation[] {
  const evaluations: TransitEvaluation[] = [];

  const enabled = new Set(profile.enabledTransitRules);

  const jupiter = transits.find((t) => t.planet === 'Jupiter');
  const saturn = transits.find((t) => t.planet === 'Saturn');

  // TRANSIT-001: Jupiter transiting natal 10th house (CAREER)
  if (enabled.has('TRANSIT-001')) {
    const triggered = jupiter ? jupiter.natalHouse === 10 : false;
    evaluations.push({
      ruleId: 'TRANSIT-001',
      domain: 'CAREER',
      triggered,
      effects: triggered ? [{ dimension: 'Growth', value: 2 }] : [],
      evidence: {
        transitPlanet: 'Jupiter',
        transitSign: jupiter?.signName || 'Aries',
        natalHouse: 10,
        details: triggered
          ? `Transit Jupiter in ${jupiter?.signName} occupies natal 10th house (Career)`
          : `Transit Jupiter in ${jupiter?.signName} is in natal ${jupiter?.natalHouse}th house (not 10th)`,
      },
      explanationKey: triggered ? 'TRANSIT_001_PASS' : 'TRANSIT_001_FAIL',
    });
  }

  // TRANSIT-002: Saturn transiting natal 10th house (CAREER)
  if (enabled.has('TRANSIT-002')) {
    const triggered = saturn ? saturn.natalHouse === 10 : false;
    evaluations.push({
      ruleId: 'TRANSIT-002',
      domain: 'CAREER',
      triggered,
      effects: triggered
        ? [
            { dimension: 'Responsibility', value: 2 },
            { dimension: 'Challenges', value: 1 },
          ]
        : [],
      evidence: {
        transitPlanet: 'Saturn',
        transitSign: saturn?.signName || 'Aries',
        natalHouse: 10,
        details: triggered
          ? `Transit Saturn in ${saturn?.signName} occupies natal 10th house (Career)`
          : `Transit Saturn in ${saturn?.signName} is in natal ${saturn?.natalHouse}th house (not 10th)`,
      },
      explanationKey: triggered ? 'TRANSIT_002_PASS' : 'TRANSIT_002_FAIL',
    });
  }

  // TRANSIT-003: Jupiter transiting natal 2nd or 11th house (WEALTH)
  if (enabled.has('TRANSIT-003')) {
    const triggered = jupiter ? jupiter.natalHouse === 2 || jupiter.natalHouse === 11 : false;
    evaluations.push({
      ruleId: 'TRANSIT-003',
      domain: 'WEALTH',
      triggered,
      effects: triggered
        ? [
            { dimension: 'IncomePotential', value: 2 },
            { dimension: 'AssetBuilding', value: 1 },
          ]
        : [],
      evidence: {
        transitPlanet: 'Jupiter',
        transitSign: jupiter?.signName || 'Aries',
        natalHouse: jupiter?.natalHouse || 0,
        details: triggered
          ? `Transit Jupiter in ${jupiter?.signName} occupies natal ${jupiter?.natalHouse}th house (Wealth)`
          : `Transit Jupiter in ${jupiter?.signName} is in natal ${jupiter?.natalHouse}th house (not 2nd/11th)`,
      },
      explanationKey: triggered ? 'TRANSIT_003_PASS' : 'TRANSIT_003_FAIL',
    });
  }

  // TRANSIT-004: Jupiter transiting natal 7th house (RELATIONSHIPS)
  if (enabled.has('TRANSIT-004')) {
    const triggered = jupiter ? jupiter.natalHouse === 7 : false;
    evaluations.push({
      ruleId: 'TRANSIT-004',
      domain: 'RELATIONSHIPS',
      triggered,
      effects: triggered
        ? [
            { dimension: 'RelationshipActivity', value: 2 },
            { dimension: 'Harmony', value: 1 },
          ]
        : [],
      evidence: {
        transitPlanet: 'Jupiter',
        transitSign: jupiter?.signName || 'Aries',
        natalHouse: 7,
        details: triggered
          ? `Transit Jupiter in ${jupiter?.signName} occupies natal 7th house (Relationships)`
          : `Transit Jupiter in ${jupiter?.signName} is in natal ${jupiter?.natalHouse}th house (not 7th)`,
      },
      explanationKey: triggered ? 'TRANSIT_004_PASS' : 'TRANSIT_004_FAIL',
    });
  }

  // TRANSIT-005: Jupiter transiting natal 4th house (PROPERTY)
  if (enabled.has('TRANSIT-005')) {
    const triggered = jupiter ? jupiter.natalHouse === 4 : false;
    evaluations.push({
      ruleId: 'TRANSIT-005',
      domain: 'PROPERTY',
      triggered,
      effects: triggered
        ? [
            { dimension: 'PropertyActivity', value: 2 },
            { dimension: 'AcquisitionPotential', value: 1 },
          ]
        : [],
      evidence: {
        transitPlanet: 'Jupiter',
        transitSign: jupiter?.signName || 'Aries',
        natalHouse: 4,
        details: triggered
          ? `Transit Jupiter in ${jupiter?.signName} occupies natal 4th house (Property)`
          : `Transit Jupiter in ${jupiter?.signName} is in natal ${jupiter?.natalHouse}th house (not 4th)`,
      },
      explanationKey: triggered ? 'TRANSIT_005_PASS' : 'TRANSIT_005_FAIL',
    });
  }

  // TRANSIT-006: Saturn transiting natal 4th house (PROPERTY)
  if (enabled.has('TRANSIT-006')) {
    const triggered = saturn ? saturn.natalHouse === 4 : false;
    evaluations.push({
      ruleId: 'TRANSIT-006',
      domain: 'PROPERTY',
      triggered,
      effects: triggered
        ? [
            { dimension: 'PropertyActivity', value: 1 },
            { dimension: 'Obstacles', value: 2 },
          ]
        : [],
      evidence: {
        transitPlanet: 'Saturn',
        transitSign: saturn?.signName || 'Aries',
        natalHouse: 4,
        details: triggered
          ? `Transit Saturn in ${saturn?.signName} occupies natal 4th house (Property)`
          : `Transit Saturn in ${saturn?.signName} is in natal ${saturn?.natalHouse}th house (not 4th)`,
      },
      explanationKey: triggered ? 'TRANSIT_006_PASS' : 'TRANSIT_006_FAIL',
    });
  }

  return evaluations;
}
