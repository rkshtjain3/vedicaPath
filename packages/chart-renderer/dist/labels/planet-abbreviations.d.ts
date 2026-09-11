export declare const PLANET_ABBREVIATIONS: Record<string, string>;
export declare function getPlanetAbbreviation(planetName: string): string;
export declare const RASHI_NAMES: string[];
export declare const RASHI_LORDS: Record<string, string>;
export declare function getRashiIdByName(name: string): number;
export declare function getRashiNameById(id: number): string;
export declare function formatDegree(decimalDeg?: number): string;
