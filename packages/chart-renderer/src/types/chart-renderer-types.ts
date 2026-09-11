export type ChartStyle = 'NORTH_INDIAN' | 'SOUTH_INDIAN';

export type ChartType =
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D7'
  | 'D9'
  | 'D10'
  | 'D12'
  | 'D16'
  | 'D20'
  | 'D24'
  | 'D27'
  | 'D30'
  | 'D40'
  | 'D45'
  | 'D60';

export interface ChartPlanet {
  planet: string;
  abbreviation: string;
  longitude?: number;
  formattedDegree?: string;
  sign: string;
  signId: number; // 1 (Aries) to 12 (Pisces)
  house: number; // 1 to 12
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
  house: number; // 1 to 12
  sign: string;
  signId: number; // 1 to 12
  lord?: string;
  planets: ChartPlanet[];
}

export interface ChartViewModel {
  chartType: ChartType;
  title: string;
  ascendantSign: string;
  ascendantSignId: number; // 1 to 12
  ascendantLongitude?: number;
  formattedAscendantDegree?: string;
  houses: ChartHouse[]; // Length 12, index 0 is House 1
  planets: ChartPlanet[];
  style: ChartStyle;
}
