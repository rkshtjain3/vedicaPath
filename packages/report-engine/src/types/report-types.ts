import { ReportEvidence } from './evidence-types.js';
import { ConvergenceResult, ContradictionResult, LifeDomain } from './domain-types.js';
export { LifeDomain };

export type ReportConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ReportSection {
  id: string;
  title: string;
  summary: string;
  evidence: ReportEvidence[];
  supportiveEvidence: ReportEvidence[];
  challengingEvidence: ReportEvidence[];
  neutralEvidence: ReportEvidence[];
  mixedSignals: boolean;
  confidence: ReportConfidenceLevel;
}

export interface DomainReportSection extends ReportSection {
  domain: LifeDomain;
  convergence: ConvergenceResult;
  contradiction: ContradictionResult;
}

export interface CrossEngineSynthesisResult {
  totalEnginesEvaluated: number;
  totalEvidenceItems: number;
  convergences: ConvergenceResult[];
  contradictions: ContradictionResult[];
  overallSummary: string;
}

export interface PersonalAstrologyReport {
  profileVersion: string;
  generatedAt: string;
  natalOverview: ReportSection;
  planetaryStrength: ReportSection;
  yogas: ReportSection;
  career: DomainReportSection;
  wealth: DomainReportSection;
  relationships: DomainReportSection;
  property: DomainReportSection;
  timing: ReportSection;
  numerology?: ReportSection;
  lifeDomainSynthesis?: any;
  timelineSynthesis?: any;
  transitSynthesis?: any;
  convergenceSynthesis?: any;
  crossEngineSynthesis: CrossEngineSynthesisResult;
  queryAnswers?: any[];
}
