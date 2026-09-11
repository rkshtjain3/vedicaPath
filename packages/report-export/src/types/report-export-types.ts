import { ChartViewModel } from '@vedica/chart-renderer';

export interface ProfileSummary {
  fullName?: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationName: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CalculationConfigSummary {
  zodiac: string;
  ayanamsha: string;
  houseSystem: string;
  nodeType: string;
  ephemerisSource: string;
  utcInstantIso: string;
  timezone: string;
  dstResolutionStatus?: string;
}

export interface StrengthStatusSummary {
  planet: string;
  totalScore?: number;
  classification?: string;
  shadbalaVirupas?: number;
  implementationStatus: 'IMPLEMENTED' | 'PARTIAL' | 'FOUNDATION' | 'BENCHMARK_VALIDATED' | 'NOT_VALIDATED';
}

export interface YogaReportSummary {
  id: string;
  name: string;
  category: string;
  isDetected: boolean;
  whyEvidence: string[];
}

export interface DomainReportSummary {
  domain: string;
  title: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  supportingEvidence: string[];
  mixedSignalsPreserved: boolean;
}

export interface TimingReportSummary {
  currentMahadasha?: string;
  currentAntardasha?: string;
  dashaStartDate?: string;
  dashaEndDate?: string;
  transitSummary?: string;
}

export interface NumerologyReportSummary {
  lifePath?: number;
  birthday?: number;
  attitude?: number;
  personalYear?: number;
  hasNameNumerology: boolean;
  expressionNumber?: number;
  soulUrgeNumber?: number;
  personalityNumber?: number;
  note?: string;
}

export interface AuditReportSummary {
  inputFingerprint: string;
  reproducibilityHash: string;
  engineProfileVersions: Record<string, string>;
  limitations: string[];
}

export interface PrintableReportViewModel {
  generatedAt: string;
  profile: ProfileSummary;
  config: CalculationConfigSummary;
  charts: {
    d1: ChartViewModel;
    d9: ChartViewModel;
    d10: ChartViewModel;
  };
  vargaComparisonItems: Array<{
    planet: string;
    d1Sign: string;
    d9Sign: string;
    isVargottama: boolean;
    explanation: string;
  }>;
  strengths: StrengthStatusSummary[];
  yogas: YogaReportSummary[];
  domains: DomainReportSummary[];
  lifeDomains?: any;
  timelineSynthesis?: any;
  transitSynthesis?: any;
  convergenceSynthesis?: any;
  timing: TimingReportSummary;
  numerology: NumerologyReportSummary;
  audit: AuditReportSummary;
  queryAnswers?: any[];
}
