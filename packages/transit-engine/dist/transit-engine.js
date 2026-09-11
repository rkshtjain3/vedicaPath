import { DEFAULT_TRANSIT_PROFILE } from './profile.js';
import { calculateTransitPositions } from './planetary-transits/transit-position-calculator.js';
import { evaluateTransitAspects } from './aspects/transit-aspect-evaluator.js';
import { evaluateTransitConjunctions } from './conjunctions/transit-conjunction-evaluator.js';
import { evaluateTransitHouseContexts } from './house-transits/transit-house-evaluator.js';
import { evaluateTransitRetrogradeContexts } from './retrograde/transit-retrograde-context.js';
import { evaluateDomainTransitEvidence } from './domain-context/domain-transit-adapters.js';
import { calculateTransitHash } from './reproducibility/transit-hash.js';
export async function evaluateTransitEngine(natalChart, options) {
    const profile = options?.profile || DEFAULT_TRANSIT_PROFILE;
    const transitDate = options?.transitDate ? new Date(options.transitDate) : new Date();
    const natalLagnaLong = natalChart.lagna?.longitude || natalChart.ascendant?.longitude || 0;
    const moonObj = natalChart.planets?.find((p) => p.planet?.toLowerCase() === 'moon');
    const sunObj = natalChart.planets?.find((p) => p.planet?.toLowerCase() === 'sun');
    const natalMoonLong = moonObj?.longitude || 0;
    const natalSunLong = sunObj?.longitude || 0;
    const natalPlanets = (natalChart.planets || []).map((p) => ({
        planet: p.planet,
        longitude: p.longitude,
    }));
    const { configuration, planets } = await calculateTransitPositions(transitDate, natalLagnaLong, natalMoonLong, natalSunLong, profile);
    const aspects = evaluateTransitAspects(planets, natalPlanets, natalLagnaLong);
    const conjunctions = evaluateTransitConjunctions(planets, natalPlanets, profile.conjunctionToleranceDegrees);
    const houseContexts = evaluateTransitHouseContexts(planets);
    const retrogradeContexts = evaluateTransitRetrogradeContexts(planets);
    const domainEvidence = evaluateDomainTransitEvidence(planets, aspects, conjunctions, houseContexts);
    const reproducibilityHash = calculateTransitHash(profile.version, transitDate.toISOString(), planets);
    return {
        profileVersion: profile.version,
        calculationDate: transitDate.toISOString(),
        configuration,
        planets,
        aspects,
        conjunctions,
        houseContexts,
        retrogradeContexts,
        domainEvidence,
        reproducibilityHash,
    };
}
