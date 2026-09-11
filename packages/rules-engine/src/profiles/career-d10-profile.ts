export interface CareerD10RulesProfile {
  version: string;
  ruleEffects: {
    'D10-CAREER-001': Record<string, 'SUPPORTIVE' | 'NEUTRAL' | 'CHALLENGING'>;
    'D10-CAREER-002': Record<string, 'SUPPORTIVE' | 'NEUTRAL' | 'CHALLENGING'>;
    'D10-CAREER-003': Record<string, 'SUPPORTIVE' | 'NEUTRAL' | 'CHALLENGING'>;
    'D10-CAREER-004': Record<string, 'SUPPORTIVE' | 'NEUTRAL' | 'CHALLENGING'>;
    'D10-CAREER-005': Record<string, 'SUPPORTIVE' | 'NEUTRAL' | 'CHALLENGING'>;
  };
}

export const PERSONAL_CAREER_D10_RULES_V1: CareerD10RulesProfile = {
  version: 'personal-career-d10-rules-v1',
  ruleEffects: {
    'D10-CAREER-001': {
      KENDRA: 'SUPPORTIVE',
      TRIKONA: 'SUPPORTIVE',
      UPACHAYA: 'SUPPORTIVE',
      DUSTHANA: 'CHALLENGING',
      OTHER: 'NEUTRAL',
    },
    'D10-CAREER-002': {
      EXALTED: 'SUPPORTIVE',
      MOOLATRIKONA: 'SUPPORTIVE',
      OWN_SIGN: 'SUPPORTIVE',
      FRIENDLY_SIGN: 'SUPPORTIVE',
      NEUTRAL_SIGN: 'NEUTRAL',
      ENEMY_SIGN: 'CHALLENGING',
      DEBILITATED: 'CHALLENGING',
    },
    'D10-CAREER-003': {
      KENDRA: 'SUPPORTIVE',
      TRIKONA: 'SUPPORTIVE',
      UPACHAYA: 'SUPPORTIVE',
      DUSTHANA: 'CHALLENGING',
      OTHER: 'NEUTRAL',
    },
    'D10-CAREER-004': {
      EXALTED: 'SUPPORTIVE',
      MOOLATRIKONA: 'SUPPORTIVE',
      OWN_SIGN: 'SUPPORTIVE',
      FRIENDLY_SIGN: 'SUPPORTIVE',
      NEUTRAL_SIGN: 'NEUTRAL',
      ENEMY_SIGN: 'CHALLENGING',
      DEBILITATED: 'CHALLENGING',
    },
    'D10-CAREER-005': {
      SAME_PLANET: 'SUPPORTIVE',
      DIFFERENT_PLANET: 'NEUTRAL',
    },
  },
};
