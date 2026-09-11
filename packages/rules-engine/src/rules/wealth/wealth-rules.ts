import { AstrologyRule, AstrologyRuleContext, RuleEvaluation, RuleEvidence } from '../../types/rule-types.js';
import { isPlanetConnectedToHouse } from '../../core/connection-resolver.js';

export const wealthRule001: AstrologyRule = {
  id: 'WEALTH-001',
  domain: 'WEALTH',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const house2LordFact = context.analysis.houseLordFacts.find((hl) => hl.house === 2);
    const house11LordFact = context.analysis.houseLordFacts.find((hl) => hl.house === 11);

    const strongDignities = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'];
    const h2Strong = house2LordFact ? strongDignities.includes(house2LordFact.dignity) : false;
    const h11Strong = house11LordFact ? strongDignities.includes(house11LordFact.dignity) : false;

    const evidence: RuleEvidence[] = [];
    if (house2LordFact) {
      evidence.push({
        type: 'WEALTH_LORD_DIGNITY',
        house: 2,
        lord: house2LordFact.lord,
        dignity: house2LordFact.dignity,
        details: `2nd Lord ${house2LordFact.lord} has ${house2LordFact.dignity} dignity`,
      });
    }
    if (house11LordFact) {
      evidence.push({
        type: 'WEALTH_LORD_DIGNITY',
        house: 11,
        lord: house11LordFact.lord,
        dignity: house11LordFact.dignity,
        details: `11th Lord ${house11LordFact.lord} has ${house11LordFact.dignity} dignity`,
      });
    }

    if (h2Strong || h11Strong) {
      return {
        ruleId: 'WEALTH-001',
        domain: 'WEALTH',
        triggered: true,
        effects: [
          { dimension: 'IncomePotential', value: 2 },
          { dimension: 'SavingsPotential', value: 2 },
        ],
        evidence,
        explanationKey: 'WEALTH_001_PASS',
      };
    }

    return {
      ruleId: 'WEALTH-001',
      domain: 'WEALTH',
      triggered: false,
      effects: [],
      evidence,
      explanationKey: 'WEALTH_001_FAIL',
    };
  },
};

export const wealthRule002: AstrologyRule = {
  id: 'WEALTH-002',
  domain: 'WEALTH',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const mdLord = context.currentDasha?.mahadasha?.lord as any;
    const adLord = context.currentDasha?.antardasha?.lord as any;

    const evidence: RuleEvidence[] = [];
    let isConnected = false;

    if (mdLord) {
      const conn2 = isPlanetConnectedToHouse(mdLord, 2, context.analysis);
      const conn11 = isPlanetConnectedToHouse(mdLord, 11, context.analysis);
      if (conn2.connected || conn11.connected) {
        isConnected = true;
        evidence.push({
          type: 'DASHA_WEALTH_CONNECTION',
          dashaLevel: 'Mahadasha',
          planet: mdLord,
          details: `Mahadasha Lord ${mdLord} connected to wealth houses (2nd/11th)`,
        });
        evidence.push(...conn2.evidence, ...conn11.evidence);
      }
    }

    if (adLord) {
      const conn2 = isPlanetConnectedToHouse(adLord, 2, context.analysis);
      const conn11 = isPlanetConnectedToHouse(adLord, 11, context.analysis);
      if (conn2.connected || conn11.connected) {
        isConnected = true;
        evidence.push({
          type: 'DASHA_WEALTH_CONNECTION',
          dashaLevel: 'Antardasha',
          planet: adLord,
          details: `Antardasha Lord ${adLord} connected to wealth houses (2nd/11th)`,
        });
        evidence.push(...conn2.evidence, ...conn11.evidence);
      }
    }

    if (isConnected) {
      return {
        ruleId: 'WEALTH-002',
        domain: 'WEALTH',
        triggered: true,
        effects: [
          { dimension: 'IncomePotential', value: 2 },
          { dimension: 'AssetBuilding', value: 1 },
        ],
        evidence,
        explanationKey: 'WEALTH_002_PASS',
      };
    }

    return {
      ruleId: 'WEALTH-002',
      domain: 'WEALTH',
      triggered: false,
      effects: [],
      evidence: [
        {
          type: 'DASHA_WEALTH_CONNECTION',
          details: 'Neither Mahadasha nor Antardasha lord connects directly to 2nd or 11th house',
        },
      ],
      explanationKey: 'WEALTH_002_FAIL',
    };
  },
};

export const wealthRule003: AstrologyRule = {
  id: 'WEALTH-003',
  domain: 'WEALTH',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const house12Fact = context.analysis.houseFacts.find((h) => h.house === 12);
    const house12LordFact = context.analysis.houseLordFacts.find((hl) => hl.house === 12);

    const house12Lord = house12LordFact?.lord;
    const lordInWealthHouse = house12LordFact
      ? house12LordFact.lordHouse === 2 || house12LordFact.lordHouse === 11
      : false;

    const malefics = ['Mars', 'Saturn', 'Rahu', 'Ketu'];
    const maleficsIn12 = house12Fact
      ? house12Fact.planets.filter((p) => malefics.includes(p))
      : [];

    const evidence: RuleEvidence[] = [];

    if (lordInWealthHouse && house12Lord) {
      evidence.push({
        type: 'EXPENSE_LORD_IN_WEALTH_HOUSE',
        lord: house12Lord,
        placedInHouse: house12LordFact.lordHouse,
        details: `12th Lord of losses/expenses (${house12Lord}) is placed in House ${house12LordFact.lordHouse}`,
      });
    }

    if (maleficsIn12.length > 0) {
      evidence.push({
        type: 'MALEFIC_IN_EXPENSE_HOUSE',
        house: 12,
        planets: maleficsIn12,
        details: `Malefics (${maleficsIn12.join(', ')}) occupy 12th house of expenses`,
      });
    }

    if (lordInWealthHouse || maleficsIn12.length > 0) {
      return {
        ruleId: 'WEALTH-003',
        domain: 'WEALTH',
        triggered: true,
        effects: [
          { dimension: 'ExpensePressure', value: 2 },
          { dimension: 'FinancialVolatility', value: 1 },
        ],
        evidence,
        explanationKey: 'WEALTH_003_PASS',
      };
    }

    return {
      ruleId: 'WEALTH-003',
      domain: 'WEALTH',
      triggered: false,
      effects: [],
      evidence: [
        {
          type: 'EXPENSE_PRESSURE_ANALYSIS',
          details: '12th lord is not in 2nd/11th and no malefics occupy 12th house',
        },
      ],
      explanationKey: 'WEALTH_003_FAIL',
    };
  },
};

export const wealthRule004: AstrologyRule = {
  id: 'WEALTH-004',
  domain: 'WEALTH',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const jupConn2 = isPlanetConnectedToHouse('Jupiter', 2, context.analysis);
    const jupConn11 = isPlanetConnectedToHouse('Jupiter', 11, context.analysis);
    const venConn2 = isPlanetConnectedToHouse('Venus', 2, context.analysis);
    const venConn11 = isPlanetConnectedToHouse('Venus', 11, context.analysis);

    const isConnected =
      jupConn2.connected || jupConn11.connected || venConn2.connected || venConn11.connected;

    const evidence: RuleEvidence[] = [];
    if (jupConn2.connected || jupConn11.connected) {
      evidence.push({
        type: 'NATURAL_BENEFIC_WEALTH_CONNECTION',
        planet: 'Jupiter',
        details: 'Jupiter connects to wealth houses (2nd/11th)',
      });
      evidence.push(...jupConn2.evidence, ...jupConn11.evidence);
    }

    if (venConn2.connected || venConn11.connected) {
      evidence.push({
        type: 'NATURAL_BENEFIC_WEALTH_CONNECTION',
        planet: 'Venus',
        details: 'Venus connects to wealth houses (2nd/11th)',
      });
      evidence.push(...venConn2.evidence, ...venConn11.evidence);
    }

    if (isConnected) {
      return {
        ruleId: 'WEALTH-004',
        domain: 'WEALTH',
        triggered: true,
        effects: [
          { dimension: 'IncomePotential', value: 2 },
          { dimension: 'SavingsPotential', value: 1 },
        ],
        evidence,
        explanationKey: 'WEALTH_004_PASS',
      };
    }

    return {
      ruleId: 'WEALTH-004',
      domain: 'WEALTH',
      triggered: false,
      effects: [],
      evidence: [
        {
          type: 'NATURAL_BENEFIC_WEALTH_CONNECTION',
          details: 'Neither Jupiter nor Venus connects directly to 2nd or 11th house',
        },
      ],
      explanationKey: 'WEALTH_004_FAIL',
    };
  },
};

export const wealthRulesList: AstrologyRule[] = [
  wealthRule001,
  wealthRule002,
  wealthRule003,
  wealthRule004,
];
