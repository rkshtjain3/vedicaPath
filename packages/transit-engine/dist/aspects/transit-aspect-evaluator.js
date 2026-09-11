import { getAspectingHouses } from './vedic-aspects.js';
export function evaluateTransitAspects(transits, natalPlanets, natalLagnaLongitude) {
    const aspects = [];
    const allTargets = [
        { name: 'Lagna', longitude: natalLagnaLongitude },
        ...natalPlanets.map((p) => ({ name: p.planet, longitude: p.longitude })),
    ];
    for (const tr of transits) {
        const transitSignIndex = Math.floor(tr.longitude / 30);
        const aspectOffsets = getAspectingHouses(tr.planet);
        for (const target of allTargets) {
            const targetSignIndex = Math.floor(target.longitude / 30);
            // Sign distance (1-indexed whole sign offset)
            const signDistance = ((targetSignIndex - transitSignIndex + 12) % 12) + 1;
            if (aspectOffsets.includes(signDistance)) {
                aspects.push({
                    transitingPlanet: tr.planet,
                    natalTarget: target.name,
                    targetLongitude: target.longitude,
                    aspectHouseDistance: signDistance,
                    aspectType: `${signDistance}th`,
                    detected: true,
                    whyEvidence: [
                        `Transiting ${tr.planet} in ${tr.sign.name} aspects natal ${target.name} in sign index ${targetSignIndex + 1}.`,
                        `Sign distance: ${signDistance}th house aspect (${tr.planet} classical aspect offset ${signDistance}).`,
                    ],
                });
            }
        }
    }
    return aspects;
}
