export function detectConvergenceForDomain(domain, evidenceList) {
    const supportiveItems = evidenceList.filter((e) => e.classification === 'SUPPORTIVE');
    const engineSet = new Set();
    for (const item of supportiveItems) {
        engineSet.add(item.sourceEngine);
    }
    const engines = Array.from(engineSet).sort();
    let level = 'LOW';
    if (engines.length >= 3 || supportiveItems.length >= 4) {
        level = 'HIGH';
    }
    else if (engines.length >= 2 || supportiveItems.length >= 2) {
        level = 'MODERATE';
    }
    let explanation = '';
    if (level === 'HIGH') {
        explanation = `High cross-engine convergence detected across ${engines.length} configured engines (${engines.join(', ')}).`;
    }
    else if (level === 'MODERATE') {
        explanation = `Moderate cross-engine convergence detected across ${engines.length} engines (${engines.join(', ')}).`;
    }
    else {
        explanation = `Low cross-engine convergence detected (${engines.length > 0 ? engines.join(', ') : 'no supportive engines'}).`;
    }
    return {
        domain,
        level,
        engines,
        evidence: supportiveItems,
        explanation,
    };
}
