import {
  DomainEvidenceItem,
  EvidenceDirection,
  EvidenceStrength,
  LifeDomain,
} from '../types.js';

export interface CreateEvidenceParams {
  id: string;
  domain: LifeDomain;
  sourceEngine: string;
  sourceRuleId?: string;
  description: string;
  direction: EvidenceDirection;
  strength: EvidenceStrength;
  weight?: number;
  whyEvidence: string[];
}

export function createEvidenceItem(params: CreateEvidenceParams): DomainEvidenceItem {
  const defaultWeight =
    params.strength === 'HIGH' ? 1.0 : params.strength === 'MEDIUM' ? 0.7 : 0.4;

  return {
    id: params.id,
    domain: params.domain,
    sourceEngine: params.sourceEngine,
    sourceRuleId: params.sourceRuleId,
    description: params.description,
    direction: params.direction,
    strength: params.strength,
    weight: params.weight ?? defaultWeight,
    whyEvidence: params.whyEvidence,
  };
}
