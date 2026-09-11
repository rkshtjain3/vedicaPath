import { QueryEvidenceItem } from '../types.js';

export function retrieveTransitEvidence(calculationData: any, targetPlanet?: string): QueryEvidenceItem[] {
  const items: QueryEvidenceItem[] = [];
  const transitAnalysis = calculationData.transitAnalysis || {};
  const convergence = calculationData.natalDashaTransitConvergence || {};

  // Transits
  if (transitAnalysis.transits && Array.isArray(transitAnalysis.transits)) {
    for (const t of transitAnalysis.transits) {
      if (targetPlanet && t.planet?.toLowerCase() !== targetPlanet.toLowerCase()) continue;

      items.push({
        id: `TRANSIT-${t.planet.toUpperCase()}`,
        sourceEngine: 'TRANSIT',
        sourceRuleId: 'GOCHAR-PLACEMENT',
        category: 'Transit Placement',
        planet: t.planet,
        direction: t.retrograde ? 'CHALLENGING' : 'NEUTRAL',
        title: `Transit ${t.planet} in ${t.currentSign?.name || 'Sign'} (House ${t.houseFromLagna})`,
        description: `Transiting ${t.planet} is in House ${t.houseFromLagna} relative to Lagna and House ${t.houseFromMoon} relative to Moon.${t.retrograde ? ' (Retrograde)' : ''}`,
        whyEvidence: [
          `Transit Planet: ${t.planet}`,
          `Sign: ${t.currentSign?.name || 'N/A'}`,
          `House from Lagna: ${t.houseFromLagna}`,
          `House from Moon: ${t.houseFromMoon}`,
          `Retrograde: ${t.retrograde ? 'YES' : 'NO'}`,
        ],
      });
    }
  }

  // Aspects & Conjunctions
  if (transitAnalysis.conjunctions && Array.isArray(transitAnalysis.conjunctions)) {
    for (const c of transitAnalysis.conjunctions) {
      if (
        targetPlanet &&
        c.transitPlanet?.toLowerCase() !== targetPlanet.toLowerCase() &&
        c.natalPlanet?.toLowerCase() !== targetPlanet.toLowerCase()
      ) {
        continue;
      }

      items.push({
        id: `TRANSIT-CONJUNCTION-${c.transitPlanet}-${c.natalPlanet}`,
        sourceEngine: 'TRANSIT',
        sourceRuleId: 'TRANSIT-CONJUNCTION',
        category: 'Transit Conjunction',
        planet: c.transitPlanet,
        direction: 'SUPPORTIVE',
        title: `Transit ${c.transitPlanet} Conjunct Natal ${c.natalPlanet}`,
        description: `Transiting ${c.transitPlanet} forms a close conjunction with Natal ${c.natalPlanet} (Orb: ${c.orbDegrees?.toFixed(2)}°).`,
        whyEvidence: [
          `Transit Planet: ${c.transitPlanet}`,
          `Natal Target: ${c.natalPlanet}`,
          `Orb: ${c.orbDegrees?.toFixed(2)}°`,
        ],
      });
    }
  }

  // Convergence Results
  if (convergence.domainConvergence && Array.isArray(convergence.domainConvergence)) {
    for (const dc of convergence.domainConvergence) {
      if (dc.convergenceLevel && dc.convergenceLevel !== 'NONE') {
        items.push({
          id: `CONVERGENCE-${dc.domain}`,
          sourceEngine: 'TIMELINE',
          sourceRuleId: 'NDT-CONVERGENCE',
          category: 'Natal-Dasha-Transit Convergence',
          domain: dc.domain,
          direction: dc.convergenceLevel === 'HIGH' ? 'SUPPORTIVE' : 'NEUTRAL',
          title: `Natal-Dasha-Transit Convergence for ${dc.domain}`,
          description: `Domain ${dc.domain} exhibits ${dc.convergenceLevel} convergence across Natal, Dasha, and Transit engines.`,
          whyEvidence: [
            `Domain: ${dc.domain}`,
            `Convergence Level: ${dc.convergenceLevel}`,
            `Summary: ${dc.summary || 'Multi-engine alignment'}`,
          ],
        });
      }
    }
  }

  return items;
}
