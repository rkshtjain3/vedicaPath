export function retrieveAshtakavargaEvidence(calculationData, targetPlanet) {
    const items = [];
    const av = calculationData.ashtakavarga || {};
    const transitAV = calculationData.transitAshtakavarga || {};
    // SAV Total Points
    if (av.sav && Array.isArray(av.sav.houseScores)) {
        for (const hs of av.sav.houseScores) {
            const isStrong = hs.score >= 30;
            const isWeak = hs.score <= 22;
            const direction = isStrong ? 'SUPPORTIVE' : isWeak ? 'CHALLENGING' : 'NEUTRAL';
            if (isStrong || isWeak) {
                items.push({
                    id: `SAV-HOUSE-${hs.house}`,
                    sourceEngine: 'ASHTAKAVARGA',
                    sourceRuleId: 'SAV-SCORE',
                    category: 'Samudaya Ashtakavarga',
                    direction,
                    title: `House ${hs.house} SAV Points: ${hs.score}`,
                    description: `House ${hs.house} holds ${hs.score} SAV bindus (${isStrong ? 'Strong support' : 'Reduced strength'}). Average is 28.`,
                    whyEvidence: [
                        `House: ${hs.house}`,
                        `SAV Bindus: ${hs.score}`,
                        `Threshold: Average 28 bindus per house`,
                    ],
                });
            }
        }
    }
    // BAV Points per Planet
    if (av.bav && typeof av.bav === 'object') {
        for (const [pName, bData] of Object.entries(av.bav)) {
            if (targetPlanet && pName.toLowerCase() !== targetPlanet.toLowerCase())
                continue;
            if (bData && Array.isArray(bData.houseScores)) {
                const total = bData.totalPoints || bData.houseScores.reduce((acc, curr) => acc + (curr.score || 0), 0);
                items.push({
                    id: `BAV-${pName.toUpperCase()}`,
                    sourceEngine: 'ASHTAKAVARGA',
                    sourceRuleId: 'BAV-SCORE',
                    category: 'Bhinna Ashtakavarga',
                    planet: pName,
                    direction: total >= 40 ? 'SUPPORTIVE' : 'NEUTRAL',
                    title: `${pName} BAV Total Bindus: ${total}`,
                    description: `${pName} accumulates ${total} total BAV bindus across 12 houses.`,
                    whyEvidence: [
                        `Planet: ${pName}`,
                        `Total BAV Bindus: ${total}`,
                    ],
                });
            }
        }
    }
    // Jupiter & Saturn Transit Ashtakavarga Context
    if (transitAV.evaluations && Array.isArray(transitAV.evaluations)) {
        for (const tav of transitAV.evaluations) {
            if (targetPlanet && tav.planet?.toLowerCase() !== targetPlanet.toLowerCase())
                continue;
            items.push({
                id: `TRANSIT-AV-${tav.planet.toUpperCase()}`,
                sourceEngine: 'ASHTAKAVARGA',
                sourceRuleId: 'TRANSIT-ASHTAKAVARGA',
                category: 'Transit Ashtakavarga',
                planet: tav.planet,
                direction: tav.bavPoints >= 5 ? 'SUPPORTIVE' : tav.bavPoints <= 2 ? 'CHALLENGING' : 'NEUTRAL',
                title: `Transiting ${tav.planet} Ashtakavarga Score: ${tav.bavPoints} BAV / ${tav.savPoints} SAV`,
                description: `Transiting ${tav.planet} passes through House ${tav.currentHouse} containing ${tav.bavPoints} BAV bindus and ${tav.savPoints} SAV bindus.`,
                whyEvidence: [
                    `Transit Planet: ${tav.planet}`,
                    `Current House: ${tav.currentHouse}`,
                    `BAV Points: ${tav.bavPoints}`,
                    `SAV Points: ${tav.savPoints}`,
                    `Classification: ${tav.classification || 'NEUTRAL'}`,
                ],
            });
        }
    }
    return items;
}
