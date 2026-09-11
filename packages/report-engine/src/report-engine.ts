import { PersonalAstrologyReport } from './types/report-types.js';
import { PERSONAL_REPORT_V1, PersonalReportProfile } from './profiles/personal-report-profile.js';
import { buildNatalOverviewSection } from './natal/natal-overview.js';
import { buildPlanetaryStrengthSection } from './strength/planet-strength-summary.js';
import { buildYogaSection } from './yogas/yoga-summary.js';
import { buildTimingSection } from './timing/timing-summary.js';
import { buildNumerologySection } from './numerology/numerology-summary.js';
import { buildCareerReportSection } from './domains/career-report.js';
import { buildWealthReportSection } from './domains/wealth-report.js';
import { buildRelationshipsReportSection } from './domains/relationships-report.js';
import { buildPropertyReportSection } from './domains/property-report.js';
import { buildCrossEngineSynthesis } from './synthesis/cross-engine-synthesis.js';

export interface ReportInputData {
  chart: any;
  analysis: any;
  yogaAnalysis?: any;
  divisionalCharts?: any;
  vargaComparison?: any;
  strengthAnalysis?: any;
  shadbala?: any;
  ashtakavarga?: any;
  rules?: any;
  timing?: any;
  numerology?: any;
  lifeDomainAnalysis?: any;
  timelineAnalysis?: any;
  transitAnalysis?: any;
  natalDashaTransitConvergence?: any;
  crossChartAnalysis?: any;
}

export function generatePersonalReport(
  input: ReportInputData,
  profile: PersonalReportProfile = PERSONAL_REPORT_V1
): PersonalAstrologyReport {
  const generatedAt = new Date().toISOString();

  const natalOverview = buildNatalOverviewSection(input.chart, input.analysis, input.vargaComparison);
  const planetaryStrength = buildPlanetaryStrengthSection(input.strengthAnalysis, input.shadbala);
  const yogas = buildYogaSection(input.yogaAnalysis);
  const timing = buildTimingSection(input.timing);
  const numerology = input.numerology ? buildNumerologySection(input.numerology) : undefined;

  const career = buildCareerReportSection(
    input.rules,
    input.timing,
    input.strengthAnalysis,
    input.yogaAnalysis,
    input.crossChartAnalysis,
    input.rules?.careerD10
  );

  const wealth = buildWealthReportSection(
    input.rules,
    input.timing,
    input.ashtakavarga,
    input.yogaAnalysis
  );

  const relationships = buildRelationshipsReportSection(
    input.rules,
    input.timing,
    input.analysis,
    input.divisionalCharts?.d9Analysis
  );

  const property = buildPropertyReportSection(
    input.rules,
    input.timing,
    input.analysis
  );

  const crossEngineSynthesis = buildCrossEngineSynthesis([career, wealth, relationships, property]);

  return {
    profileVersion: profile.version,
    generatedAt,
    natalOverview,
    planetaryStrength,
    yogas,
    career,
    wealth,
    relationships,
    property,
    timing,
    numerology,
    lifeDomainSynthesis: input.lifeDomainAnalysis,
    timelineSynthesis: input.timelineAnalysis,
    transitSynthesis: input.transitAnalysis,
    convergenceSynthesis: input.natalDashaTransitConvergence,
    crossEngineSynthesis,
  };
}
