import { AstrologyRule, AstrologyRuleContext, RuleEvaluation, RuleEvidence } from '../../types/rule-types.js';
import { isPlanetConnectedToHouse } from '../../core/connection-resolver.js';

export const relRule001: AstrologyRule = {
  id: 'REL-001',
  domain: 'RELATIONSHIPS',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const house7LordFact = context.analysis.houseLordFacts.find((hl) => hl.house === 7);
    if (!house7LordFact) {
      return {
        ruleId: 'REL-001',
        domain: 'RELATIONSHIPS',
        triggered: false,
        effects: [],
        evidence: [],
        explanationKey: 'REL_001_FAIL',
      };
    }

    const strongDignities = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'];
    const kendraTrikonaHouses = [1, 4, 5, 7, 9, 10];

    const isStrong = strongDignities.includes(house7LordFact.dignity);
    const isFavorableHouse = kendraTrikonaHouses.includes(house7LordFact.lordHouse);

    const evidence: RuleEvidence[] = [
      {
        type: 'RELATIONSHIP_LORD_DIGNITY',
        house: 7,
        lord: house7LordFact.lord,
        dignity: house7LordFact.dignity,
        lordHouse: house7LordFact.lordHouse,
        details: `7th Lord ${house7LordFact.lord} has ${house7LordFact.dignity} dignity and is in House ${house7LordFact.lordHouse}`,
      },
    ];

    if (isStrong || isFavorableHouse) {
      return {
        ruleId: 'REL-001',
        domain: 'RELATIONSHIPS',
        triggered: true,
        effects: [
          { dimension: 'RelationshipActivity', value: 2 },
          { dimension: 'Stability', value: 2 },
        ],
        evidence,
        explanationKey: 'REL_001_PASS',
      };
    }

    return {
      ruleId: 'REL-001',
      domain: 'RELATIONSHIPS',
      triggered: false,
      effects: [],
      evidence,
      explanationKey: 'REL_001_FAIL',
    };
  },
};

export const relRule002: AstrologyRule = {
  id: 'REL-002',
  domain: 'RELATIONSHIPS',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const venusFact = context.analysis.planetFacts.find((p) => p.planet === 'Venus');
    const venusDignity = context.analysis.dignities.find((d) => d.planet === 'Venus');

    if (!venusFact || !venusDignity) {
      return {
        ruleId: 'REL-002',
        domain: 'RELATIONSHIPS',
        triggered: false,
        effects: [],
        evidence: [],
        explanationKey: 'REL_002_FAIL',
      };
    }

    const strongDignities = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'];
    const favorableHouses = [1, 4, 5, 7, 9, 10, 11];

    const isStrongDignity = strongDignities.includes(venusDignity.primaryDignity);
    const isFavorableHouse = favorableHouses.includes(venusFact.house);

    const evidence: RuleEvidence[] = [
      {
        type: 'VENUS_RELATIONSHIP_KARAKA',
        planet: 'Venus',
        house: venusFact.house,
        dignity: venusDignity.primaryDignity,
        details: `Venus (Relationship Karaka) is in House ${venusFact.house} with ${venusDignity.primaryDignity} dignity`,
      },
    ];

    if (isStrongDignity || isFavorableHouse) {
      return {
        ruleId: 'REL-002',
        domain: 'RELATIONSHIPS',
        triggered: true,
        effects: [
          { dimension: 'Harmony', value: 2 },
          { dimension: 'RelationshipActivity', value: 1 },
        ],
        evidence,
        explanationKey: 'REL_002_PASS',
      };
    }

    return {
      ruleId: 'REL-002',
      domain: 'RELATIONSHIPS',
      triggered: false,
      effects: [],
      evidence,
      explanationKey: 'REL_002_FAIL',
    };
  },
};

export const relRule003: AstrologyRule = {
  id: 'REL-003',
  domain: 'RELATIONSHIPS',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const mdLord = context.currentDasha?.mahadasha?.lord as any;
    const adLord = context.currentDasha?.antardasha?.lord as any;

    const evidence: RuleEvidence[] = [];
    let isConnected = false;

    if (mdLord) {
      const conn7 = isPlanetConnectedToHouse(mdLord, 7, context.analysis);
      if (conn7.connected) {
        isConnected = true;
        evidence.push({
          type: 'DASHA_RELATIONSHIP_CONNECTION',
          dashaLevel: 'Mahadasha',
          planet: mdLord,
          details: `Mahadasha Lord ${mdLord} connected to 7th house of relationships`,
        });
        evidence.push(...conn7.evidence);
      }
    }

    if (adLord) {
      const conn7 = isPlanetConnectedToHouse(adLord, 7, context.analysis);
      if (conn7.connected) {
        isConnected = true;
        evidence.push({
          type: 'DASHA_RELATIONSHIP_CONNECTION',
          dashaLevel: 'Antardasha',
          planet: adLord,
          details: `Antardasha Lord ${adLord} connected to 7th house of relationships`,
        });
        evidence.push(...conn7.evidence);
      }
    }

    if (isConnected) {
      return {
        ruleId: 'REL-003',
        domain: 'RELATIONSHIPS',
        triggered: true,
        effects: [
          { dimension: 'RelationshipActivity', value: 2 },
          { dimension: 'Stability', value: 1 },
        ],
        evidence,
        explanationKey: 'REL_003_PASS',
      };
    }

    return {
      ruleId: 'REL-003',
      domain: 'RELATIONSHIPS',
      triggered: false,
      effects: [],
      evidence: [
        {
          type: 'DASHA_RELATIONSHIP_CONNECTION',
          details: 'Neither Mahadasha nor Antardasha lord connects directly to 7th house',
        },
      ],
      explanationKey: 'REL_003_FAIL',
    };
  },
};

export const relRule004: AstrologyRule = {
  id: 'REL-004',
  domain: 'RELATIONSHIPS',
  version: '1.0.0',
  evaluate(context: AstrologyRuleContext): RuleEvaluation {
    const house7Fact = context.analysis.houseFacts.find((h) => h.house === 7);
    const house7LordFact = context.analysis.houseLordFacts.find((hl) => hl.house === 7);
    const house7Lord = house7LordFact?.lord;

    const malefics = ['Mars', 'Saturn', 'Rahu', 'Ketu'];
    const evidence: RuleEvidence[] = [];

    if (house7Fact) {
      const maleficOccupants = house7Fact.planets.filter((p) => malefics.includes(p));
      if (maleficOccupants.length > 0) {
        evidence.push({
          type: 'MALEFIC_OCCUPIES_7TH_HOUSE',
          planets: maleficOccupants,
          details: `Malefics (${maleficOccupants.join(', ')}) occupy 7th house`,
        });
      }
    }

    const maleficAspectingHouse7 = context.analysis.aspects.filter(
      (asp) => malefics.includes(asp.fromPlanet) && asp.toHouse === 7
    );
    for (const asp of maleficAspectingHouse7) {
      evidence.push({
        type: 'MALEFIC_ASPECTS_7TH_HOUSE',
        planet: asp.fromPlanet,
        aspectNumber: asp.aspectNumber,
        details: `Malefic ${asp.fromPlanet} aspects 7th house`,
      });
    }

    if (house7Lord) {
      const maleficAspectingLord7 = context.analysis.aspects.filter(
        (asp) => malefics.includes(asp.fromPlanet) && asp.targetPlanets.includes(house7Lord)
      );
      for (const asp of maleficAspectingLord7) {
        evidence.push({
          type: 'MALEFIC_ASPECTS_7TH_LORD',
          planet: asp.fromPlanet,
          lord: house7Lord,
          aspectNumber: asp.aspectNumber,
          details: `Malefic ${asp.fromPlanet} aspects 7th lord (${house7Lord})`,
        });
      }
    }

    if (evidence.length > 0) {
      return {
        ruleId: 'REL-004',
        domain: 'RELATIONSHIPS',
        triggered: true,
        effects: [
          { dimension: 'Challenges', value: 2 },
          { dimension: 'Stability', value: -1 },
        ],
        evidence,
        explanationKey: 'REL_004_PASS',
      };
    }

    return {
      ruleId: 'REL-004',
      domain: 'RELATIONSHIPS',
      triggered: false,
      effects: [],
      evidence: [
        {
          type: 'MALEFIC_7TH_INFLUENCE',
          details: 'No malefic planets occupy or aspect 7th house or 7th lord',
        },
      ],
      explanationKey: 'REL_004_FAIL',
    };
  },
};

export const relationshipRulesList: AstrologyRule[] = [
  relRule001,
  relRule002,
  relRule003,
  relRule004,
];
