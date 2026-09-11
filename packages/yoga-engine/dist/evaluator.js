import { PERSONAL_YOGA_V1 } from './profiles/personal-yoga-v1.js';
import { evaluateMahapurushaYogas } from './yogas/mahapurusha/mahapurusha-evaluator.js';
import { evaluateRajaYogas } from './yogas/raja/raja-evaluator.js';
import { evaluateDhanaYogas } from './yogas/dhana/dhana-evaluator.js';
import { evaluateLunarYogas } from './yogas/lunar/lunar-evaluator.js';
import { evaluateSpecialYogas } from './yogas/special/special-evaluator.js';
export function evaluateYogaEngine(chart, analysis, profile = PERSONAL_YOGA_V1) {
    const { planetFacts, houseLordFacts, conjunctions, aspects, dignities } = analysis;
    const allResults = [
        ...evaluateMahapurushaYogas(planetFacts, dignities, profile.version),
        ...evaluateRajaYogas(houseLordFacts, planetFacts, conjunctions, aspects, profile.version),
        ...evaluateDhanaYogas(houseLordFacts, planetFacts, conjunctions, aspects, profile.version),
        ...evaluateLunarYogas(planetFacts, dignities, profile.version),
        ...evaluateSpecialYogas(planetFacts, houseLordFacts, conjunctions, aspects, dignities, profile.version),
    ];
    // Filter based on enabled Yogas in profile if configured
    const filteredResults = profile.enabledYogas && profile.enabledYogas.length > 0
        ? allResults.filter((y) => profile.enabledYogas.includes(y.id))
        : allResults;
    const detectedCount = filteredResults.filter((r) => r.status === 'DETECTED').length;
    const notDetectedCount = filteredResults.filter((r) => r.status === 'NOT_DETECTED').length;
    const notSupportedCount = filteredResults.filter((r) => r.status === 'NOT_SUPPORTED').length;
    return {
        profileVersion: profile.version,
        evaluatedAt: new Date().toISOString(),
        totalEvaluated: filteredResults.length,
        detectedCount,
        notDetectedCount,
        notSupportedCount,
        results: filteredResults,
    };
}
