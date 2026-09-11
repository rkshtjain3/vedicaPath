import { ReportEvidence } from './evidence-types.js';

export type LifeDomain = 'CAREER' | 'WEALTH' | 'RELATIONSHIPS' | 'PROPERTY';

export interface ConvergenceResult {
  domain: LifeDomain;
  level: 'LOW' | 'MODERATE' | 'HIGH';
  engines: string[];
  evidence: ReportEvidence[];
  explanation: string;
}

export interface ContradictionResult {
  domain: LifeDomain;
  mixedSignals: boolean;
  supportiveEvidence: ReportEvidence[];
  challengingEvidence: ReportEvidence[];
  explanation: string;
}
