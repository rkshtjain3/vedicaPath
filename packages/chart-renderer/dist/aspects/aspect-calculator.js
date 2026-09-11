/**
 * Computes classical Parashari Graha Drishti (aspects cast) for any planet from its source house.
 */
export function getPlanetaryAspects(planet, sourceHouse) {
    const normPlanet = planet.toLowerCase();
    const aspects = [];
    const getTargetHouse = (offset) => {
        return (((sourceHouse - 1 + offset) % 12) + 1);
    };
    // 1. All planets cast 100% full aspect on the 7th house (offset +6)
    aspects.push({
        targetHouse: getTargetHouse(6),
        aspectPercentage: 100,
        specialAspect: false,
        label: '7th Full Aspect (Samasaptaka)',
    });
    // 2. Special Parashari Aspects
    if (normPlanet === 'mars' || normPlanet === 'ma') {
        // Mars: 4th (offset +3) and 8th (offset +7)
        aspects.push({
            targetHouse: getTargetHouse(3),
            aspectPercentage: 100,
            specialAspect: true,
            label: '4th Special Aspect (Chaturtha Drishti)',
        });
        aspects.push({
            targetHouse: getTargetHouse(7),
            aspectPercentage: 100,
            specialAspect: true,
            label: '8th Special Aspect (Ashtama Drishti)',
        });
    }
    else if (normPlanet === 'jupiter' || normPlanet === 'ju' || normPlanet === 'guru') {
        // Jupiter: 5th (offset +4) and 9th (offset +8)
        aspects.push({
            targetHouse: getTargetHouse(4),
            aspectPercentage: 100,
            specialAspect: true,
            label: '5th Special Trine Aspect (Panchama Drishti)',
        });
        aspects.push({
            targetHouse: getTargetHouse(8),
            aspectPercentage: 100,
            specialAspect: true,
            label: '9th Special Trine Aspect (Navama Drishti)',
        });
    }
    else if (normPlanet === 'saturn' || normPlanet === 'sa' || normPlanet === 'shani') {
        // Saturn: 3rd (offset +2) and 10th (offset +9)
        aspects.push({
            targetHouse: getTargetHouse(2),
            aspectPercentage: 100,
            specialAspect: true,
            label: '3rd Special Aspect (Tritiya Drishti)',
        });
        aspects.push({
            targetHouse: getTargetHouse(9),
            aspectPercentage: 100,
            specialAspect: true,
            label: '10th Special Aspect (Dashama Drishti)',
        });
    }
    else if (normPlanet === 'rahu' || normPlanet === 'ketu' || normPlanet === 'ra' || normPlanet === 'ke') {
        // Rahu / Ketu: 5th and 9th in classical Parashari tradition
        aspects.push({
            targetHouse: getTargetHouse(4),
            aspectPercentage: 100,
            specialAspect: true,
            label: '5th Trine Aspect (Panchama Drishti)',
        });
        aspects.push({
            targetHouse: getTargetHouse(8),
            aspectPercentage: 100,
            specialAspect: true,
            label: '9th Trine Aspect (Navama Drishti)',
        });
    }
    return aspects;
}
