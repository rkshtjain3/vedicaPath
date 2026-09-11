import { DomainTransitEvidence, LifeDomain, TransitAspect, TransitConjunction, TransitHouseContext, TransitPosition } from '../types.js';
export declare function evaluateDomainTransitEvidence(transits: TransitPosition[], aspects: TransitAspect[], conjunctions: TransitConjunction[], houseContexts: TransitHouseContext[]): Record<LifeDomain, DomainTransitEvidence>;
