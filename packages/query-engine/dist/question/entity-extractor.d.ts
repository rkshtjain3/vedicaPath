import { DirectionFilter, LifeDomain, PlanetName, QueryParserEvidence } from '../types.js';
import { QueryProfile } from '../profile.js';
export interface ExtractedEntities {
    domain?: LifeDomain;
    planet?: PlanetName;
    isTiming: boolean;
    isYoga: boolean;
    isStrength: boolean;
    isTransit: boolean;
    isNumerology: boolean;
    isPredictive: boolean;
    directionFilter?: DirectionFilter;
    parserEvidence: QueryParserEvidence[];
}
export declare function extractEntities(rawQuestion: string, profile?: QueryProfile): ExtractedEntities;
