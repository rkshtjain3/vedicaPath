import { TransitContextOverlay } from '../types.js';
import { extractJupiterTransitContext } from './jupiter-context.js';
import { extractSaturnTransitContext } from './saturn-context.js';
import { extractAshtakavargaTransitContext } from './ashtakavarga-context.js';

export function buildTransitContextOverlay(engineData: any): TransitContextOverlay {
  return {
    jupiter: extractJupiterTransitContext(engineData),
    saturn: extractSaturnTransitContext(engineData),
    ashtakavargaSummary: extractAshtakavargaTransitContext(engineData),
  };
}
