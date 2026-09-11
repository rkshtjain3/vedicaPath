export interface MonthlyTransitPlanet {
  planet: string;
  sign: string;
  signId: number;
  houseFromLagna: number;
  houseFromMoon: number;
  isRetrograde: boolean;
  dignity?: string;
  savPointsInHouse?: number;
}

export interface MonthlyKeyDate {
  date: string; // ISO date string YYYY-MM-DD
  dayNumber: number;
  titleEn: string;
  titleHi: string;
  category: 'INGRESS' | 'FAVORABLE' | 'CAUTION' | 'LUNAR_CYCLE' | 'RETROGRADE';
  descriptionEn: string;
  descriptionHi: string;
  planetsInvolved: string[];
}

export interface DomainPulseItem {
  score: number; // 0-100
  trend: 'RISING' | 'PEAK' | 'STABLE' | 'CONSOLIDATING';
  keyFactorEn: string;
  keyFactorHi: string;
}

export interface MonthlyDomainPulse {
  career: DomainPulseItem;
  wealth: DomainPulseItem;
  relationships: DomainPulseItem;
  health: DomainPulseItem;
  focus: DomainPulseItem;
}

export interface MonthlyHoroscopeData {
  year: number;
  month: number; // 1-12
  monthNameEn: string; // e.g. "September 2026"
  monthNameHi: string; // e.g. "सितंबर 2026"
  startDate: string;
  endDate: string;
  isCurrentMonth: boolean;

  // Active Dasha Climate
  dashaClimate: {
    mahadashaLord: string;
    antardashaLord: string;
    pratyantardashaLord?: string;
    themeTitleEn: string;
    themeTitleHi: string;
    descriptionEn: string;
    descriptionHi: string;
  };

  // Cosmic Weather & Atmosphere
  cosmicWeather: {
    rating: 'GOLDEN_OPPORTUNITY' | 'DYNAMIC_MOMENTUM' | 'BALANCED_PROGRESS' | 'STRUCTURAL_DISCIPLINE' | 'INTROSPECTIVE_REALIGNMENT';
    titleEn: string;
    titleHi: string;
    score: number; // 0-100 overall score
    summaryEn: string;
    summaryHi: string;
  };

  // Key Solar Ingress / Sankranti for this month
  solarIngress: {
    sign: string;
    signId: number;
    houseFromLagna: number;
    houseFromMoon: number;
    sankrantiNameEn: string;
    sankrantiNameHi: string;
    focusThemeEn: string;
    focusThemeHi: string;
    savPoints: number;
  };

  // Transits Summary in this month
  transits: MonthlyTransitPlanet[];

  // Domain Pulse (Career, Wealth, Love, Health, Focus)
  domainPulse: MonthlyDomainPulse;

  // Key Milestones & Highlight Days
  keyDates: MonthlyKeyDate[];

  // Favorable & Caution Windows
  favorableWindows: Array<{ startDay: number; endDay: number; focusEn: string; focusHi: string }>;
  cautionWindows: Array<{ startDay: number; endDay: number; adviceEn: string; adviceHi: string }>;

  // Sattvic Habit & Lifestyle Guidance
  sattvicFocus: {
    element: 'FIRE' | 'EARTH' | 'AIR' | 'WATER' | 'ETHER';
    habitTitleEn: string;
    habitTitleHi: string;
    habitDescriptionEn: string;
    habitDescriptionHi: string;
    colorResonance: string;
    mindfulnessKeyEn: string;
    mindfulnessKeyHi: string;
  };

  // Traceable Astrological Why
  astrologicalWhy: Array<{
    factorEn: string;
    factorHi: string;
    ruleSource: string;
    evidenceStrength: 'HIGH' | 'MEDIUM' | 'SUPPORTIVE';
  }>;
}

export interface YearlyHoroscopeForecast {
  targetYear: number;
  months: MonthlyHoroscopeData[];
  yearlySummaryEn: string;
  yearlySummaryHi: string;
  peakMonths: number[]; // e.g. [3, 9, 11]
  cautionMonths: number[]; // e.g. [5, 8]
}
