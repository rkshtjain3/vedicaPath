export function classifyIntent(entities) {
    let category = 'UNKNOWN';
    let confidence = 'LOW';
    if (entities.isNumerology) {
        category = 'NUMEROLOGY';
        confidence = 'HIGH';
    }
    else if (entities.planet) {
        category = 'PLANET';
        confidence = 'HIGH';
    }
    else if (entities.domain) {
        category = 'DOMAIN';
        confidence = 'HIGH';
    }
    else if (entities.isYoga) {
        category = 'YOGA';
        confidence = 'HIGH';
    }
    else if (entities.isStrength) {
        category = 'STRENGTH';
        confidence = 'HIGH';
    }
    else if (entities.isTransit) {
        category = 'TRANSIT';
        confidence = 'HIGH';
    }
    else if (entities.isTiming) {
        category = 'TIMING';
        confidence = 'HIGH';
    }
    else if (entities.directionFilter) {
        category = 'EVIDENCE';
        confidence = 'MEDIUM';
    }
    else if (entities.parserEvidence.length > 0) {
        category = 'EVIDENCE';
        confidence = 'MEDIUM';
    }
    else {
        category = 'UNKNOWN';
        confidence = 'LOW';
    }
    return {
        category,
        domain: entities.domain,
        planet: entities.planet,
        directionFilter: entities.directionFilter,
        isPredictiveQuery: entities.isPredictive,
        requiresNameForNumerology: category === 'NUMEROLOGY',
        confidence,
        parserEvidence: entities.parserEvidence,
    };
}
