export function extractSaturnTransitContext(engineData: any) {
  const timing = engineData.timing || {};
  const transits = timing.transits?.planets || [];
  const sat = transits.find((t: any) => t.planet?.toLowerCase() === 'saturn');

  const savMap = engineData.ashtakavarga?.sav || {};
  const house = sat?.houseFromLagna || 1;
  const savPoints = savMap[house] || 28;

  let classification = 'AVERAGE_TRANSIT_CONTEXT';
  if (savPoints >= 30) {
    classification = 'FAVORABLE_TRANSIT_CONTEXT';
  } else if (savPoints <= 24) {
    classification = 'CHALLENGING_TRANSIT_CONTEXT';
  }

  return {
    sign: sat?.currentSign?.name || sat?.sign,
    houseFromLagna: house,
    bavPoints: sat?.bavPoints || 4,
    bavAverage: 4,
    savPoints,
    savAverage: 28,
    classification,
  };
}
