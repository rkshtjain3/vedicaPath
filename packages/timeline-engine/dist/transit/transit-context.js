import { extractJupiterTransitContext } from './jupiter-context.js';
import { extractSaturnTransitContext } from './saturn-context.js';
import { extractAshtakavargaTransitContext } from './ashtakavarga-context.js';
export function buildTransitContextOverlay(engineData) {
    return {
        jupiter: extractJupiterTransitContext(engineData),
        saturn: extractSaturnTransitContext(engineData),
        ashtakavargaSummary: extractAshtakavargaTransitContext(engineData),
    };
}
//# sourceMappingURL=transit-context.js.map