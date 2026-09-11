export function filterEvidenceByDomain(evidenceList, domain) {
    return evidenceList.filter((e) => e.domain === domain);
}
export function detectOverlapLords(evidenceList) {
    return Array.from(new Set(evidenceList.map((e) => e.planet)));
}
//# sourceMappingURL=overlap-detector.js.map