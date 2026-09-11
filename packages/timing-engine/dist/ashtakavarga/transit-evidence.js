export function buildTransitAshtakavargaEvidenceStrings(transitPlanet, transitDate, transitSign, transitHouseFromLagna, bavEval, savEval) {
    return [
        `Transit Planet: ${transitPlanet}`,
        `Transit Date: ${transitDate}`,
        `Transit Sign: ${transitSign.name} (${transitSign.sanskritName})`,
        `Transit House from Natal Lagna: House ${transitHouseFromLagna}`,
        `${transitPlanet} BAV in ${transitSign.name}: ${bavEval.bavPoints} bindus`,
        `Natal ${transitPlanet} BAV Chart Average: ${bavEval.bavAverage} bindus (${bavEval.totalPoints} total / 12 signs)`,
        `${transitPlanet} BAV Relative Classification: ${bavEval.classification}`,
        `Natal SAV for ${transitSign.name}: ${savEval.savPoints} bindus`,
        `Natal SAV Chart Average: ${savEval.savAverage} bindus (337 total / 12 signs)`,
        `SAV Relative Classification: ${savEval.classification}`,
    ];
}
//# sourceMappingURL=transit-evidence.js.map