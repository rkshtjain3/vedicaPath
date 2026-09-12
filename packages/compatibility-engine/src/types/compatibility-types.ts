export interface KootaScore {
  kootaName: 'Varna' | 'Vashya' | 'Tara' | 'Yoni' | 'GrahaMaitri' | 'Gana' | 'Bhakoot' | 'Nadi';
  maxPoints: number;
  obtainedPoints: number;
  description: string;
}

export interface AshtaKootaResult {
  scores: KootaScore[];
  totalObtained: number;
  maxTotal: 36;
  percentage: number;
  compatibilityGrade: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'BELOW_AVERAGE' | 'POOR';
  nadiDoshaPresent: boolean;
  bhakootDoshaPresent: boolean;
}

export interface KujaDoshaDetails {
  personName: string;
  hasKujaDosha: boolean;
  afflictedHouses: number[];
  isCancelled: boolean;
  cancellationReasons: string[];
}

export interface CompatibilityAnalysisResult {
  ashtaKoota: AshtaKootaResult;
  kujaDoshaPartnerA: KujaDoshaDetails;
  kujaDoshaPartnerB: KujaDoshaDetails;
  overallCompatibilityScore: number; // 0 - 100%
  recommendation: string;
  summary: string;
}
