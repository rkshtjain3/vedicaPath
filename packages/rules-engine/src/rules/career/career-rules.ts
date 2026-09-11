import { AstrologyRule, AstrologyRuleContext, RuleEvaluation, RuleEvidence } from '../../types/rule-types.js';
import { isPlanetConnectedToHouse } from '../../core/connection-resolver.js';

export const careerRule001: AstrologyRule = {
  id: 'CAREER-001',
  domain: 'CAREER',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const house10LordFact = context.analysis.houseLordFacts.find((hl) => hl.house === 10);
    if (!house10LordFact) {
      return {
        ruleId: 'CAREER-001',
        domain: 'CAREER',
        triggered: false,
        effects: [],
        evidence: [],
        explanationKey: 'CAREER_001_FAIL',
      };
    }

    const dignity = house10LordFact.dignity;
    const strongDignities = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'];
    const isStrong = strongDignities.includes(dignity);

    const evidence: RuleEvidence[] = [
      {
        type: 'HOUSE_LORD_DIGNITY',
        house: 10,
        lord: house10LordFact.lord,
        dignity: house10LordFact.dignity,
        details: `10th Lord ${house10LordFact.lord} has ${dignity} dignity`,
      },
    ];

    if (isStrong) {
      return {
        ruleId: 'CAREER-001',
        domain: 'CAREER',
        triggered: true,
        effects: [
          { dimension: 'Growth', value: 2 },
          { dimension: 'Stability', value: 2 },
        ],
        evidence,
        explanationKey: 'CAREER_001_PASS',
      };
    }

    return {
      ruleId: 'CAREER-001',
      domain: 'CAREER',
      triggered: false,
      effects: [],
      evidence,
      explanationKey: 'CAREER_001_FAIL',
    };
  },
};

export const careerRule002: AstrologyRule = {
  id: 'CAREER-002',
  domain: 'CAREER',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const mdLord = context.currentDasha?.mahadasha?.lord as any;
    if (!mdLord) {
      return {
        ruleId: 'CAREER-002',
        domain: 'CAREER',
        triggered: false,
        effects: [],
        evidence: [],
        explanationKey: 'CAREER_002_NO_DASHA',
      };
    }

    const conn = isPlanetConnectedToHouse(mdLord, 10, context.analysis);

    if (conn.connected) {
      return {
        ruleId: 'CAREER-002',
        domain: 'CAREER',
        triggered: true,
        effects: [
          { dimension: 'Change', value: 2 },
          { dimension: 'Growth', value: 1 },
        ],
        evidence: [
          {
            type: 'MAHADASHA_CAREER_CONNECTION',
            planet: mdLord,
            house: 10,
            details: `Mahadasha Lord ${mdLord} is connected to 10th house of career`,
          },
          ...conn.evidence,
        ],
        explanationKey: 'CAREER_002_PASS',
      };
    }

    return {
      ruleId: 'CAREER-002',
      domain: 'CAREER',
      triggered: false,
      effects: [],
      evidence: [
        {
          type: 'MAHADASHA_CAREER_CONNECTION',
          planet: mdLord,
          house: 10,
          details: `Mahadasha Lord ${mdLord} has no direct connection to 10th house`,
        },
      ],
      explanationKey: 'CAREER_002_FAIL',
    };
  },
};

export const careerRule003: AstrologyRule = {
  id: 'CAREER-003',
  domain: 'CAREER',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const adLord = context.currentDasha?.antardasha?.lord as any;
    if (!adLord) {
      return {
        ruleId: 'CAREER-003',
        domain: 'CAREER',
        triggered: false,
        effects: [],
        evidence: [],
        explanationKey: 'CAREER_003_NO_DASHA',
      };
    }

    const conn = isPlanetConnectedToHouse(adLord, 10, context.analysis);

    if (conn.connected) {
      return {
        ruleId: 'CAREER-003',
        domain: 'CAREER',
        triggered: true,
        effects: [
          { dimension: 'Change', value: 1 },
          { dimension: 'Growth', value: 1 },
        ],
        evidence: [
          {
            type: 'ANTARDASHA_CAREER_CONNECTION',
            planet: adLord,
            house: 10,
            details: `Antardasha Lord ${adLord} is connected to 10th house of career`,
          },
          ...conn.evidence,
        ],
        explanationKey: 'CAREER_003_PASS',
      };
    }

    return {
      ruleId: 'CAREER-003',
      domain: 'CAREER',
      triggered: false,
      effects: [],
      evidence: [
        {
          type: 'ANTARDASHA_CAREER_CONNECTION',
          planet: adLord,
          house: 10,
          details: `Antardasha Lord ${adLord} has no direct connection to 10th house`,
        },
      ],
      explanationKey: 'CAREER_003_FAIL',
    };
  },
};

export const careerRule004: AstrologyRule = {
  id: 'CAREER-004',
  domain: 'CAREER',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const jupiterAspects = context.analysis.aspects.filter(
      (asp) => asp.fromPlanet === 'Jupiter' && asp.toHouse === 10
    );

    if (jupiterAspects.length > 0) {
      return {
        ruleId: 'CAREER-004',
        domain: 'CAREER',
        triggered: true,
        effects: [{ dimension: 'Growth', value: 2 }],
        evidence: [
          {
            type: 'JUPITER_ASPECT_CAREER_HOUSE',
            planet: 'Jupiter',
            house: 10,
            aspectNumber: jupiterAspects[0].aspectNumber,
            details: `Jupiter casts its ${jupiterAspects[0].aspectNumber}th aspect onto 10th house`,
          },
        ],
        explanationKey: 'CAREER_004_PASS',
      };
    }

    return {
      ruleId: 'CAREER-004',
      domain: 'CAREER',
      triggered: false,
      effects: [],
      evidence: [
        {
          type: 'JUPITER_ASPECT_CAREER_HOUSE',
          planet: 'Jupiter',
          house: 10,
          details: 'Jupiter does not aspect 10th house',
        },
      ],
      explanationKey: 'CAREER_004_FAIL',
    };
  },
};

export const careerRule005: AstrologyRule = {
  id: 'CAREER-005',
  domain: 'CAREER',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const house10Fact = context.analysis.houseFacts.find((h) => h.house === 10);
    const saturnOccupies = house10Fact ? house10Fact.planets.includes('Saturn') : false;
    const saturnAspects = context.analysis.aspects.filter(
      (asp) => asp.fromPlanet === 'Saturn' && asp.toHouse === 10
    );

    if (saturnOccupies || saturnAspects.length > 0) {
      const evidence: RuleEvidence[] = [];
      if (saturnOccupies) {
        evidence.push({
          type: 'SATURN_OCCUPIES_CAREER_HOUSE',
          planet: 'Saturn',
          house: 10,
          details: 'Saturn occupies 10th house of career',
        });
      }
      if (saturnAspects.length > 0) {
        evidence.push({
          type: 'SATURN_ASPECTS_CAREER_HOUSE',
          planet: 'Saturn',
          house: 10,
          aspectNumber: saturnAspects[0].aspectNumber,
          details: `Saturn casts its ${saturnAspects[0].aspectNumber}th aspect onto 10th house`,
        });
      }

      return {
        ruleId: 'CAREER-005',
        domain: 'CAREER',
        triggered: true,
        effects: [
          { dimension: 'Responsibility', value: 2 },
          { dimension: 'Challenges', value: 1 },
        ],
        evidence,
        explanationKey: 'CAREER_005_PASS',
      };
    }

    return {
      ruleId: 'CAREER-005',
      domain: 'CAREER',
      triggered: false,
      effects: [],
      evidence: [
        {
          type: 'SATURN_CAREER_INFLUENCE',
          planet: 'Saturn',
          house: 10,
          details: 'Saturn does not occupy or aspect 10th house',
        },
      ],
      explanationKey: 'CAREER_005_FAIL',
    };
  },
};

export const careerRulesList: AstrologyRule[] = [
  careerRule001,
  careerRule002,
  careerRule003,
  careerRule004,
  careerRule005,
];
