import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
import { ReportEvidence } from '../types/evidence-types.js';
import { ReportSection } from '../types/report-types.js';

export function buildNumerologySection(numerologyResult: any): ReportSection {
  const evidence: ReportEvidence[] = [];

  if (numerologyResult?.lifePath) {
    evidence.push(
      createEvidenceItem(
        'num_lifepath',
        'numerology-engine',
        'BIRTH_NUMEROLOGY',
        `Life Path Number: ${numerologyResult.lifePath.finalNumber}${
          numerologyResult.lifePath.isMasterNumber ? ' (Master Number)' : ''
        }`,
        'FACTUAL',
        'HIGH',
        'NUMEROLOGY',
        'LIFE_PATH',
        numerologyResult.lifePath
      )
    );
  }

  if (numerologyResult?.birthday) {
    evidence.push(
      createEvidenceItem(
        'num_birthday',
        'numerology-engine',
        'BIRTH_NUMEROLOGY',
        `Birthday Number: ${numerologyResult.birthday.finalNumber}`,
        'FACTUAL',
        'MEDIUM',
        'NUMEROLOGY',
        'BIRTHDAY',
        numerologyResult.birthday
      )
    );
  }

  if (numerologyResult?.attitude) {
    evidence.push(
      createEvidenceItem(
        'num_attitude',
        'numerology-engine',
        'BIRTH_NUMEROLOGY',
        `Attitude Number: ${numerologyResult.attitude.finalNumber}`,
        'FACTUAL',
        'MEDIUM',
        'NUMEROLOGY',
        'ATTITUDE',
        numerologyResult.attitude
      )
    );
  }

  let nameText = '';
  if (numerologyResult?.nameAnalysis) {
    const na = numerologyResult.nameAnalysis;
    evidence.push(
      createEvidenceItem(
        'num_expression',
        'numerology-engine',
        'NAME_NUMEROLOGY',
        `Expression Number: ${na.expressionNumber.finalNumber}`,
        'FACTUAL',
        'HIGH',
        'NUMEROLOGY',
        'EXPRESSION',
        na.expressionNumber
      )
    );
    evidence.push(
      createEvidenceItem(
        'num_soul_urge',
        'numerology-engine',
        'NAME_NUMEROLOGY',
        `Soul Urge Number: ${na.soulUrgeNumber.finalNumber}`,
        'FACTUAL',
        'MEDIUM',
        'NUMEROLOGY',
        'SOUL_URGE',
        na.soulUrgeNumber
      )
    );
    evidence.push(
      createEvidenceItem(
        'num_personality',
        'numerology-engine',
        'NAME_NUMEROLOGY',
        `Personality Number: ${na.personalityNumber.finalNumber}`,
        'FACTUAL',
        'MEDIUM',
        'NUMEROLOGY',
        'PERSONALITY',
        na.personalityNumber
      )
    );
    nameText = ` Name-based Expression Number: ${na.expressionNumber.finalNumber}, Soul Urge: ${na.soulUrgeNumber.finalNumber}, Personality: ${na.personalityNumber.finalNumber}.`;
  } else {
    nameText = ' Name-based numerology was not calculated because no name was supplied.';
  }

  const summary = `Birth-based Life Path Number: ${numerologyResult?.lifePath?.finalNumber || 'N/A'}, Birthday Number: ${
    numerologyResult?.birthday?.finalNumber || 'N/A'
  }.${nameText} (Note: Numerology calculations are completely isolated from planetary astrology).`;

  return {
    id: 'numerology_summary',
    title: 'Numerology Summary',
    summary,
    evidence,
    supportiveEvidence: [],
    challengingEvidence: [],
    neutralEvidence: evidence,
    mixedSignals: false,
    confidence: 'HIGH',
  };
}
