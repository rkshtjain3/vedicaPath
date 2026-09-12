export type FiveElement = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type Polarity = 'Yin' | 'Yang';
export type StemName = 'Jia' | 'Yi' | 'Bing' | 'Ding' | 'Wu' | 'Ji' | 'Geng' | 'Xin' | 'Ren' | 'Gui';
export type BranchName = 'Zi' | 'Chou' | 'Yin' | 'Mao' | 'Chen' | 'Si' | 'Wu' | 'Wei' | 'Shen' | 'You' | 'Xu' | 'Hai';
export interface HeavenlyStemDetails {
    name: StemName;
    chinese: string;
    pinyin: string;
    element: FiveElement;
    polarity: Polarity;
}
export interface HiddenStemItem {
    stem: HeavenlyStemDetails;
    role: 'MAIN' | 'MIDDLE' | 'RESIDUAL';
    percentageWeight: number;
    tenGod: string;
}
export interface EarthlyBranchDetails {
    name: BranchName;
    chinese: string;
    pinyin: string;
    zodiacAnimal: string;
    element: FiveElement;
    polarity: Polarity;
    hiddenStems: HiddenStemItem[];
}
export interface BaZiEvidence {
    pillarName: 'YEAR' | 'MONTH' | 'DAY' | 'HOUR';
    stem: StemName;
    branch: BranchName;
    solarTerm?: string;
    solarTermLongitude?: number;
    jdn?: number;
    reasoning: string;
    reasoningHi: string;
}
export interface Pillar {
    stem: HeavenlyStemDetails;
    branch: EarthlyBranchDetails;
    tenGodStem: string;
    hiddenStems: HiddenStemItem[];
    evidence: BaZiEvidence;
}
export interface FourPillars {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
}
export interface DayMasterDetails {
    stem: HeavenlyStemDetails;
    monthBranch: EarthlyBranchDetails;
    seasonalStatus: 'IN_SEASON' | 'PROSPEROUS' | 'WEAKENING' | 'TRAPPED' | 'DEAD';
    seasonalDescription: string;
    seasonalDescriptionHi: string;
    strengthScore: number;
    strengthClassification: 'EXTREMELY_STRONG' | 'STRONG' | 'BALANCED' | 'WEAK' | 'EXTREMELY_WEAK';
    reasoning: string;
    reasoningHi: string;
}
export interface FiveElementCount {
    element: FiveElement;
    visibleCount: number;
    hiddenWeightPercentage: number;
    status: 'DOMINANT' | 'STRONG' | 'BALANCED' | 'WEAK' | 'DEFICIENT';
}
export interface TenGodCount {
    godName: string;
    chineseName: string;
    pinyin: string;
    category: 'SELF' | 'OUTPUT' | 'WEALTH' | 'OFFICER' | 'RESOURCE';
    visibleCount: number;
    hiddenCount: number;
    stemsInvolved?: string[];
    description: string;
}
export interface BranchRelationship {
    type: 'SIX_HARMONY' | 'THREE_HARMONY' | 'THREE_MEETING' | 'SIX_CLASH' | 'SIX_HARM' | 'THREE_PUNISHMENT' | 'SIX_DESTRUCTION';
    name: string;
    chineseName: string;
    branchesInvolved: BranchName[];
    pillarsInvolved: string[];
    formedElement?: FiveElement;
    significance: string;
    significanceHi: string;
}
export interface LuckPillar {
    pillarNumber: number;
    startingAge: number;
    endingAge: number;
    startYear: number;
    endYear: number;
    stem: HeavenlyStemDetails;
    branch: EarthlyBranchDetails;
    tenGodStem: string;
}
export interface DaYunDetails {
    direction: 'FORWARD' | 'REVERSE';
    gender: 'MALE' | 'FEMALE';
    yearStemPolarity: Polarity;
    startingAge: number;
    solarTermDistanceDays: number;
    calculationReasoning: string;
    calculationReasoningHi: string;
    pillars: LuckPillar[];
}
export interface AnnualPillarInfo {
    year: number;
    stem: HeavenlyStemDetails;
    branch: EarthlyBranchDetails;
    tenGodStem: string;
    clashesWithNatal: string[];
    harmoniesWithNatal: string[];
}
export interface BaZiReport {
    profileVersion: 'chinese-bazi-v1';
    fourPillars: FourPillars;
    dayMaster: DayMasterDetails;
    fiveElements: FiveElementCount[];
    tenGods: TenGodCount[];
    branchRelationships: BranchRelationship[];
    luckPillars: DaYunDetails;
    annualPillar: AnnualPillarInfo;
    calculationConvention: {
        yearBoundary: 'LI_CHUN_315';
        monthBoundary: '12_SOLAR_TERMS_JIE_QI';
        dayBoundary: 'SEXAGENARY_JDN_EPOCH';
        hourBoundary: '12_DOUBLE_HOURS_ZI_23:00';
        daYunConversion: '3_DAYS_EQUALS_1_YEAR';
    };
}
