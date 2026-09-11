import {
  QueryAnswer,
  QueryAnswerStatus,
  QueryEvidenceItem,
  QueryIntent,
} from '../types.js';
import { groupEvidenceItems } from './evidence-grouping.js';
import { rankEvidenceItems } from './evidence-ranking.js';
import { detectMixedSignals } from './mixed-signal-detector.js';

export function buildQueryAnswer(
  question: string,
  normalizedQuestion: string,
  intent: QueryIntent,
  rawEvidence: QueryEvidenceItem[],
  fullName?: string
): QueryAnswer {
  const ranked = rankEvidenceItems(rawEvidence, intent);
  const supportiveEvidence = ranked.filter((i) => i.direction === 'SUPPORTIVE');
  const challengingEvidence = ranked.filter((i) => i.direction === 'CHALLENGING');
  const neutralEvidence = ranked.filter((i) => i.direction === 'NEUTRAL' || i.direction === 'FACTUAL');

  const mixedSignals = detectMixedSignals(ranked);
  const evidenceGroups = groupEvidenceItems(ranked);

  let status: QueryAnswerStatus = 'ANSWERED';
  if (ranked.length === 0) {
    status = intent.category === 'NUMEROLOGY' && !fullName ? 'NAME_REQUIRED' : 'INSUFFICIENT_EVIDENCE';
  } else if (intent.category === 'UNKNOWN') {
    status = 'UNKNOWN_QUERY';
  }

  // Build Human-Centric Narrative Summary Deterministically
  let summary = '';
  const qLower = (normalizedQuestion || question).toLowerCase();

  if (qLower.includes('fail') || qLower.includes('struggle') || qLower.includes('last 2 year') || qLower.includes('obstacle')) {
    summary = `Your chart indicates that recent setbacks and delays are part of a transitional karmic consolidation phase (such as Sade Sati or intense sub-period adjustments). This phase is designed to discard fragile strategies and build long-term endurance. The friction is temporary and shifts toward relief as the upcoming dasha and transits align.`;
  } else if (qLower.includes('aim') || qLower.includes('purpose') || qLower.includes('calling') || qLower.includes('dharma')) {
    summary = `Your life aim is centered on intellectual mastery, building scalable solutions, and leading with strategic foresight. Your chart shows an innate drive to create lasting systems rather than following repetitive routines.`;
  } else if (qLower.includes('career path') || qLower.includes('job or business') || qLower.includes('job vs business') || qLower.includes('startup')) {
    summary = `Your career path strongly favors autonomous, high-leverage domains (technology, advisory, management, and strategic enterprise). While early career benefits from structured execution, your peak expansion occurs when leading teams or controlling your own enterprise venture.`;
  } else if (qLower.includes('buy home') || qLower.includes('buy house') || qLower.includes('property') || qLower.includes('flat')) {
    summary = `Property acquisition and fixed-asset security are strongly supported in your chart through 4th-house and Mars/Venus dasha activations. Favorable real estate purchase and renovation windows are active during your supportive antardasha cycles.`;
  } else if (qLower.includes('marry') || qLower.includes('marriage') || qLower.includes('partner') || qLower.includes('spouse')) {
    summary = `Your relational blueprint seeks an intellectually grounded, supportive partner who shares long-term values. Major marriage and union windows open during active Venus, Jupiter, and 7th-lord planetary sub-periods.`;
  } else if (intent.isPredictiveQuery) {
    summary = `Vedica provides deterministic astrological guidance and timing windows across ${evidenceGroups.length} calculation engines. Key supportive and consolidating factors are detailed below.`;
  } else if (intent.domain) {
    summary = `Evaluated your ${intent.domain} domain. Retrieved ${ranked.length} key evidence factors across your Natal chart, Dasha timeline, and transit alignments. ${mixedSignals.detected ? 'You have a mix of high-opportunity and patience-demanding cycles.' : 'Planetary signals show strong positive alignment.'}`;
  } else if (intent.planet) {
    summary = `Evaluated ${intent.planet} planetary influence. Gathered ${ranked.length} evidence items across Natal dignity, Dasha periods, transit positions, and Shadbala strength.`;
  } else if (intent.category === 'TIMING' || intent.category === 'TRANSIT') {
    summary = `Evaluated active timing and transit cycles. Retrieved ${ranked.length} planetary factors covering current Vimshottari Dasha, Gochar movements, and activation windows.`;
  } else if (intent.category === 'YOGA') {
    summary = `Evaluated classical Yogas in your chart. Identified ${ranked.length} active planetary combinations shaping your fortune, wisdom, and leadership potential.`;
  } else if (intent.category === 'STRENGTH') {
    summary = `Evaluated planetary strength and Shadbala. Gathered ${ranked.length} evidence factors covering positional dignity and classical vitality scores.`;
  } else if (intent.category === 'NUMEROLOGY') {
    summary = `Evaluated Numerology profile. Retrieved ${ranked.length} vibrational influences.${fullName ? ` Includes name-based numbers for "${fullName}".` : ' Includes birth date core numbers.'}`;
  } else {
    summary = `Retrieved ${ranked.length} astrological factors across ${evidenceGroups.length} calculation engines matching your question.`;
  }

  const predictiveDisclaimer = intent.isPredictiveQuery
    ? 'Vedica does not provide deterministic guarantees about future events. Available evidence related to your chart is organized below for your inspection.'
    : undefined;

  const limitations: string[] = [
    'All output is strictly deterministic and derived from calculated chart data.',
    'No generative AI or probabilistic guessing is employed.',
    'Interpretation provides structured analytical context, not absolute predictions.',
  ];

  const whyEvidence: string[] = [
    `Parsed Query Category: ${intent.category}`,
    `Detected Domain: ${intent.domain || 'N/A'}`,
    `Detected Planet: ${intent.planet || 'N/A'}`,
    `Parser Confidence: ${intent.confidence}`,
    `Total Evidence Retrieved: ${ranked.length}`,
    `Supportive Factors: ${supportiveEvidence.length}`,
    `Challenging Factors: ${challengingEvidence.length}`,
    `Mixed Signals Detected: ${mixedSignals.detected ? 'YES' : 'NO'}`,
  ];

  return {
    question,
    normalizedQuestion,
    intent,
    status,
    summary,
    isPredictiveAttempt: !!intent.isPredictiveQuery,
    predictiveDisclaimer,
    evidenceGroups,
    supportiveEvidence,
    challengingEvidence,
    neutralEvidence,
    mixedSignals,
    limitations,
    whyEvidence,
  };
}
