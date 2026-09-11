export function evaluateDomainConfidence(convergence, contradiction, evidenceList) {
    if (evidenceList.length === 0) {
        return 'LOW';
    }
    if (convergence.level === 'HIGH' && !contradiction.mixedSignals) {
        return 'HIGH';
    }
    if (convergence.level === 'HIGH' || (convergence.level === 'MODERATE' && !contradiction.mixedSignals)) {
        return 'MEDIUM';
    }
    if (contradiction.mixedSignals || evidenceList.length < 3) {
        return 'LOW';
    }
    return 'MEDIUM';
}
