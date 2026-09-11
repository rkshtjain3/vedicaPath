export function buildCrossEngineSynthesis(domains) {
    const convergences = domains.map((d) => d.convergence);
    const contradictions = domains.map((d) => d.contradiction);
    let totalEvidence = 0;
    const engineSet = new Set();
    for (const d of domains) {
        totalEvidence += d.evidence.length;
        for (const e of d.evidence) {
            engineSet.add(e.sourceEngine);
        }
    }
    const highConvergenceDomains = convergences.filter((c) => c.level === 'HIGH').map((c) => c.domain);
    const mixedSignalDomains = contradictions.filter((c) => c.mixedSignals).map((c) => c.domain);
    const overallSummary = `Cross-Engine Synthesis Layer evaluated ${domains.length} life domains across ${engineSet.size} configured engines with ${totalEvidence} total normalized evidence items. High Convergence Domains: ${highConvergenceDomains.length > 0 ? highConvergenceDomains.join(', ') : 'None'}. Mixed-Signal Domains: ${mixedSignalDomains.length > 0 ? mixedSignalDomains.join(', ') : 'None'}.`;
    return {
        totalEnginesEvaluated: engineSet.size,
        totalEvidenceItems: totalEvidence,
        convergences,
        contradictions,
        overallSummary,
    };
}
