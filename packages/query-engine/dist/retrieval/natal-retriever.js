export function retrieveNatalEvidence(calculationData, targetPlanet) {
    const items = [];
    const ast = calculationData.astrology || calculationData.chart || {};
    const analysis = calculationData.analysis || {};
    // Lagna Evidence
    if (ast.ascendant && (!targetPlanet || targetPlanet === ast.ascendant?.sign?.ruler)) {
        items.push({
            id: 'NATAL-LAGNA-001',
            sourceEngine: 'ASTROLOGY_CORE',
            sourceRuleId: 'LAGNA-POSITION',
            category: 'Natal Lagna',
            direction: 'FACTUAL',
            title: `Ascendant in ${ast.ascendant.sign?.name}`,
            description: `Lagna is situated in ${ast.ascendant.sign?.name} (${ast.ascendant.sign?.sanskritName}) ruled by ${ast.ascendant.sign?.ruler}.`,
            whyEvidence: [
                `Ascendant Longitude: ${ast.ascendant.longitude?.toFixed(2)}°`,
                `Rasi: ${ast.ascendant.sign?.name}`,
                `Sign Ruler: ${ast.ascendant.sign?.ruler}`,
            ],
        });
    }
    // Planetary Placements
    if (ast.planets && Array.isArray(ast.planets)) {
        const planetFacts = analysis.planetFacts || [];
        const dignities = analysis.dignities || [];
        const strengthPlanets = calculationData.strengthAnalysis?.planets || [];
        const lagnaSignId = ast.ascendant?.sign?.id || ast.lagna?.sign?.id || 1;
        for (const p of ast.planets) {
            const pName = p.planet || p.name || 'Sun';
            if (targetPlanet && pName.toLowerCase() !== targetPlanet.toLowerCase())
                continue;
            const factEntry = planetFacts.find((f) => f.planet === pName);
            const dignityEntry = dignities.find((d) => d.planet === pName);
            const strengthEntry = strengthPlanets.find((s) => s.planet === pName);
            const signId = typeof p.sign === 'object' ? p.sign?.id : 0;
            const computedHouse = signId ? ((signId - lagnaSignId + 12) % 12) + 1 : 1;
            const house = factEntry?.house || p.house || computedHouse;
            const dignity = dignityEntry?.dignityName || strengthEntry?.d1Dignity || p.dignity || 'NEUTRAL';
            const isStrong = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'].includes(dignity.toUpperCase());
            const isWeak = ['DEBILITATED', 'ENEMY_SIGN', 'VERY_WEAK', 'WEAK'].includes(dignity.toUpperCase());
            const direction = isStrong ? 'SUPPORTIVE' : isWeak ? 'CHALLENGING' : 'NEUTRAL';
            items.push({
                id: `NATAL-PLANET-${pName.toUpperCase()}`,
                sourceEngine: 'ASTROLOGY_CORE',
                sourceRuleId: 'PLANET-PLACEMENT',
                category: 'Planetary Placement',
                planet: pName,
                direction,
                title: `${pName} in ${p.sign?.name} (${house}th House)`,
                description: `${pName} is placed in House ${house} (${p.sign?.name}) with ${dignity} dignity. Nakshatra: ${p.nakshatra?.name || 'N/A'}.`,
                whyEvidence: [
                    `Planet: ${pName}`,
                    `Sign: ${p.sign?.name}`,
                    `House from Lagna: ${house}`,
                    `Dignity: ${dignity}`,
                    `Nakshatra: ${p.nakshatra?.name || 'N/A'} (Pada ${p.nakshatra?.pada || 1})`,
                ],
            });
        }
    }
    // House Lords Facts
    if (analysis.houseLordFacts && Array.isArray(analysis.houseLordFacts)) {
        for (const hl of analysis.houseLordFacts) {
            if (targetPlanet && hl.lord?.toLowerCase() !== targetPlanet.toLowerCase())
                continue;
            items.push({
                id: `NATAL-HOUSE-LORD-${hl.house}`,
                sourceEngine: 'ASTROLOGY_CORE',
                sourceRuleId: 'HOUSE-LORDSHIP',
                category: 'House Lordship',
                planet: hl.lord,
                direction: ['EXALTED', 'OWN_SIGN'].includes(hl.dignity) ? 'SUPPORTIVE' : 'NEUTRAL',
                title: `House ${hl.house} Lord (${hl.lord})`,
                description: `Lord of House ${hl.house} (${hl.lord}) is placed in House ${hl.lordHouse} in ${hl.dignity} dignity.`,
                whyEvidence: [
                    `House: ${hl.house}`,
                    `Lord: ${hl.lord}`,
                    `Placed in House: ${hl.lordHouse}`,
                    `Dignity: ${hl.dignity}`,
                ],
            });
        }
    }
    return items;
}
