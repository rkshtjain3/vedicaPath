import { extractNatalContext } from '../context/natal-context.js';
import { extractStrengthContext } from '../context/strength-context.js';
import { extractYogaContext } from '../context/yoga-context.js';
import { extractDivisionalContext } from '../context/divisional-context.js';
import { extractLifeDomainRelevance } from '../context/life-domain-context.js';
export function buildAntardashaLordContext(lord, engineData) {
    return {
        planet: lord,
        natalContext: extractNatalContext(lord, engineData),
        strengthContext: extractStrengthContext(lord, engineData),
        yogaContext: extractYogaContext(lord, engineData),
        divisionalContext: extractDivisionalContext(lord, engineData),
        lifeDomainRelevance: extractLifeDomainRelevance(lord, engineData),
    };
}
//# sourceMappingURL=antardasha-context.js.map