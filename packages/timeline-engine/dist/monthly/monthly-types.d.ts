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
    date: string;
    dayNumber: number;
    titleEn: string;
    titleHi: string;
    category: 'INGRESS' | 'FAVORABLE' | 'CAUTION' | 'LUNAR_CYCLE' | 'RETROGRADE';
    descriptionEn: string;
    descriptionHi: string;
    planetsInvolved: string[];
}
export interface DomainPulseItem {
    score: number;
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
    month: number;
    monthNameEn: string;
    monthNameHi: string;
    startDate: string;
    endDate: string;
    isCurrentMonth: boolean;
    dashaClimate: {
        mahadashaLord: string;
        antardashaLord: string;
        pratyantardashaLord?: string;
        themeTitleEn: string;
        themeTitleHi: string;
        descriptionEn: string;
        descriptionHi: string;
    };
    cosmicWeather: {
        rating: 'GOLDEN_OPPORTUNITY' | 'DYNAMIC_MOMENTUM' | 'BALANCED_PROGRESS' | 'STRUCTURAL_DISCIPLINE' | 'INTROSPECTIVE_REALIGNMENT';
        titleEn: string;
        titleHi: string;
        score: number;
        summaryEn: string;
        summaryHi: string;
    };
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
    transits: MonthlyTransitPlanet[];
    domainPulse: MonthlyDomainPulse;
    keyDates: MonthlyKeyDate[];
    favorableWindows: Array<{
        startDay: number;
        endDay: number;
        focusEn: string;
        focusHi: string;
    }>;
    cautionWindows: Array<{
        startDay: number;
        endDay: number;
        adviceEn: string;
        adviceHi: string;
    }>;
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
    peakMonths: number[];
    cautionMonths: number[];
}
//# sourceMappingURL=monthly-types.d.ts.map