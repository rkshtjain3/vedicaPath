import { TransitPosition, TransitRetrogradeContext } from '../types.js';

export function evaluateTransitRetrogradeContexts(
  transits: TransitPosition[]
): TransitRetrogradeContext[] {
  const retrogradeContexts: TransitRetrogradeContext[] = [];

  for (const tr of transits) {
    const motionState = tr.isRetrograde ? 'RETROGRADE' : 'DIRECT';
    const speedStr = tr.speed !== undefined ? tr.speed.toFixed(4) : 'N/A';

    let explanation = `${tr.planet} is in ${motionState} motion at speed ${speedStr}°/day.`;
    if (tr.isRetrograde) {
      explanation = `Transiting ${tr.planet} is currently in RETROGRADE motion (speed: ${speedStr}°/day), indicating intensified internal review and reflection.`;
    }

    retrogradeContexts.push({
      planet: tr.planet,
      motionState,
      speed: tr.speed || 0,
      explanation,
      whyEvidence: [
        `Planet: ${tr.planet}`,
        `Motion State: ${motionState}`,
        `Daily Speed: ${speedStr}°/day`,
        explanation,
      ],
    });
  }

  return retrogradeContexts;
}
