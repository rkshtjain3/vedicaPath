import { ContradictionResult, LifeDomain } from '../types/domain-types.js';
import { PartitionedEvidence } from '../evidence/evidence-conflicts.js';

export function detectContradictionForDomain(
  domain: LifeDomain,
  partitioned: PartitionedEvidence
): ContradictionResult {
  const mixedSignals = partitioned.mixedSignals;
  let explanation = '';

  if (mixedSignals) {
    explanation = `The configured framework contains both supportive (${partitioned.supportive.length}) and challenging (${partitioned.challenging.length}) factors for the ${domain} domain. The report preserves both rather than cancelling one against the other.`;
  } else if (partitioned.supportive.length > 0) {
    explanation = `The configured framework primarily indicates supportive factors (${partitioned.supportive.length}) for the ${domain} domain without major challenging conflicts.`;
  } else if (partitioned.challenging.length > 0) {
    explanation = `The configured framework primarily indicates challenging factors (${partitioned.challenging.length}) for the ${domain} domain.`;
  } else {
    explanation = `The configured framework shows neutral or baseline indicators for the ${domain} domain.`;
  }

  return {
    domain,
    mixedSignals,
    supportiveEvidence: partitioned.supportive,
    challengingEvidence: partitioned.challenging,
    explanation,
  };
}
