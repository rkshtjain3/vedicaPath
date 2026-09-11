import { ContradictionResult, LifeDomain } from '../types/domain-types.js';
import { PartitionedEvidence } from '../evidence/evidence-conflicts.js';
export declare function detectContradictionForDomain(domain: LifeDomain, partitioned: PartitionedEvidence): ContradictionResult;
