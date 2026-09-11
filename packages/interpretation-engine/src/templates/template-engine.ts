import { InterpretationDomain } from '../types/interpretation-types.js';

export interface TemplateVariables {
  domain: InterpretationDomain;
  activity: 'LOW' | 'MODERATE' | 'HIGH';
  supportiveCount: number;
  challengingCount: number;
  neutralCount: number;
}

export interface RenderedTemplate {
  templateKey: string;
  summary: string;
}

const DOMAIN_NAMES: Record<InterpretationDomain, string> = {
  CAREER: 'Career and professional development',
  WEALTH: 'Financial and asset-related',
  RELATIONSHIPS: 'Interpersonal and relationship',
  PROPERTY: 'Property, home, and real estate',
};

export function selectAndRenderTemplate(vars: TemplateVariables): RenderedTemplate {
  const { domain, activity, supportiveCount, challengingCount } = vars;
  const domainTitle = DOMAIN_NAMES[domain] || domain;

  let templateKey = 'MODERATE_ACTIVITY';
  let summary = '';

  if (supportiveCount > 0 && challengingCount > 0) {
    templateKey = 'MIXED_SUPPORTIVE_CHALLENGING';
    summary = `${domainTitle} themes show elevated activity with a mix of supportive factors (${supportiveCount}) and challenging indicators (${challengingCount}), suggesting an active period requiring balanced navigation.`;
  } else if (supportiveCount > 0 && challengingCount === 0) {
    templateKey = 'SUPPORTIVE_DOMINANT';
    if (activity === 'HIGH') {
      summary = `${domainTitle} themes are strongly activated during this period, with multiple supportive factors indicating favourable conditions for progress.`;
    } else {
      summary = `${domainTitle} themes show moderate activity supported by positive chart indicators.`;
    }
  } else if (challengingCount > 0 && supportiveCount === 0) {
    templateKey = 'CHALLENGING_DOMINANT';
    summary = `${domainTitle} themes contain active challenging factors (${challengingCount}), suggesting potential delays, increased demands, or obstacles requiring careful attention.`;
  } else {
    if (activity === 'HIGH') {
      templateKey = 'HIGH_ACTIVITY';
      summary = `${domainTitle} themes show high overall activity during this period.`;
    } else if (activity === 'MODERATE') {
      templateKey = 'MODERATE_ACTIVITY';
      summary = `${domainTitle} themes indicate moderate activity during this period.`;
    } else {
      templateKey = 'LOW_ACTIVITY';
      summary = `${domainTitle} themes show low baseline activity with minimal active transit triggers.`;
    }
  }

  return {
    templateKey,
    summary,
  };
}
