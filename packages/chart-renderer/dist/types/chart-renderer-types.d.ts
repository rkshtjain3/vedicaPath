export type ChartStyle = 'NORTH_INDIAN' | 'SOUTH_INDIAN';
export type ChartType = 'D1' | 'D2' | 'D3' | 'D4' | 'D7' | 'D9' | 'D10' | 'D12' | 'D16' | 'D20' | 'D24' | 'D27' | 'D30' | 'D40' | 'D45' | 'D60';
export interface ChartPlanet {
    planet: string;
    abbreviation: string;
    longitude?: number;
    formattedDegree?: string;
    sign: string;
    signId: number;
    house: number;
    retrograde?: boolean;
    combust?: boolean;
    nakshatra?: {
        name: string;
        pada: number;
    };
    dignity?: string;
    isVargottama?: boolean;
    d9Sign?: string;
    d10Sign?: string;
    isTransit?: boolean;
}
export interface ChartHouse {
    house: number;
    sign: string;
    signId: number;
    lord?: string;
    planets: ChartPlanet[];
}
export interface ChartViewModel {
    chartType: ChartType;
    title: string;
    ascendantSign: string;
    ascendantSignId: number;
    ascendantLongitude?: number;
    formattedAscendantDegree?: string;
    houses: ChartHouse[];
    planets: ChartPlanet[];
    style: ChartStyle;
}
