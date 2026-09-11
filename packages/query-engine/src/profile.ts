import { LifeDomain, PlanetName } from './types.js';

export interface QueryProfile {
  version: string;
  maxEvidenceItemsPerAnswer: number;
  domainKeywords: Record<LifeDomain, string[]>;
  planetAliases: Record<PlanetName, string[]>;
  timingKeywords: string[];
  yogaKeywords: string[];
  strengthKeywords: string[];
  transitKeywords: string[];
  numerologyKeywords: string[];
  predictiveKeywords: string[];
  filterKeywords: {
    supportive: string[];
    challenging: string[];
    neutral: string[];
    mixed: string[];
  };
  rankingPolicy: {
    directMatchBonus: number;
    domainRelevanceBonus: number;
    activeTimingBonus: number;
    multiEngineBonus: number;
  };
}

export const PERSONAL_QUERY_V1: QueryProfile = {
  version: 'personal-query-v1',
  maxEvidenceItemsPerAnswer: 25,

  domainKeywords: {
    CAREER: [
      'career',
      'career path',
      'job',
      'job or business',
      'job vs business',
      'startup',
      'profession',
      'vocation',
      'work',
      'employment',
      'promotion',
      'business',
      'occupation',
      'status',
      'reputation',
      'd10',
      'dashamsha',
    ],
    WEALTH: [
      'wealth',
      'money',
      'finance',
      'finances',
      'income',
      'financial',
      'assets',
      'gains',
      'savings',
      'cash',
      'prosperity',
    ],
    RELATIONSHIPS: [
      'relationship',
      'relationships',
      'marriage',
      'get married',
      'when will i get married',
      'marriage timing',
      'wedding',
      'spouse',
      'partner',
      'life partner',
      'partnership',
      'love',
      'd9',
      'navamsha',
      'navamsa',
    ],
    HEALTH: [
      'health',
      'vitality',
      'illness',
      'disease',
      'physical',
      'wellbeing',
      'wellness',
      'constitution',
    ],
    EDUCATION: [
      'education',
      'study',
      'studies',
      'learning',
      'academic',
      'knowledge',
      'school',
      'university',
      'college',
      'degree',
    ],
    PROPERTY: [
      'property',
      'buy home',
      'buy house',
      'buy property',
      'house',
      'home',
      'flat',
      'apartment',
      'real estate',
      'land',
      'vehicle',
      'vehicles',
      'conveyance',
      'd4',
    ],
    SPIRITUALITY: [
      'aim of my life',
      'life aim',
      'purpose of life',
      'life purpose',
      'calling',
      'soul purpose',
      'soul mission',
      'spirituality',
      'spiritual',
      'dharma',
      'moksha',
      'meditation',
      'devotion',
      'pilgrimage',
      'soul',
    ],
  },

  planetAliases: {
    Sun: ['sun', 'surya', 'suryadev', 'ravi', 'bhanu', 'aditya'],
    Moon: ['moon', 'chandra', 'chandrama', 'soma'],
    Mars: ['mars', 'mangal', 'mangala', 'kuja', 'angarak', 'angaraka'],
    Mercury: ['mercury', 'budh', 'budha', 'saumya'],
    Jupiter: ['jupiter', 'guru', 'brihaspati', 'bhrigu', 'devaguru'],
    Venus: ['venus', 'shukra', 'sukra', 'bhargava'],
    Saturn: ['saturn', 'shani', 'sani', 'shanidev', 'manda'],
    Rahu: ['rahu', 'dragon head', 'north node'],
    Ketu: ['ketu', 'dragon tail', 'south node'],
  },

  timingKeywords: [
    'timing',
    'why fail',
    'failing',
    'fail',
    'getting fail',
    'last 2 years',
    'struggle',
    'struggles',
    'obstacles',
    'delay',
    'delays',
    'setback',
    'setbacks',
    'bad phase',
    'difficult phase',
    'sade sati',
    'current',
    'now',
    'today',
    'present',
    'active',
    'dasha',
    'dashas',
    'period',
    'periods',
    'mahadasha',
    'mahadasa',
    'antardasha',
    'antardasa',
    'pratyantardasha',
    'transit',
    'transits',
    'gochar',
    'window',
    'windows',
  ],

  yogaKeywords: [
    'yoga',
    'yogas',
    'raja yoga',
    'dhana yoga',
    'gajakesari',
    'gaja kesari',
    'amala',
    'combination',
    'combinations',
  ],

  strengthKeywords: [
    'strength',
    'shadbala',
    'strong',
    'weak',
    'exalted',
    'debilitated',
    'moolatrikona',
    'dignity',
    'power',
    'rupa',
    'rupas',
    'maitri',
  ],

  transitKeywords: [
    'transit',
    'transits',
    'gochar',
    'current transit',
    'transiting',
    'aspect',
    'aspects',
    'conjunction',
    'conjunctions',
    'retrograde',
  ],

  numerologyKeywords: [
    'numerology',
    'number',
    'numbers',
    'life path',
    'expression number',
    'soul urge',
    'name number',
    'name numerology',
    'attitude number',
    'personal year',
  ],

  predictiveKeywords: [
    'will i',
    'when will',
    'shall i',
    'going to',
    'am i going to',
    'predict',
    'future',
    'billionaire',
    'lottery',
    'exact date',
    'guarantee',
  ],

  filterKeywords: {
    supportive: ['support', 'supportive', 'favorable', 'positive', 'good', 'strengths'],
    challenging: ['challenge', 'challenging', 'unfavorable', 'negative', 'weakness', 'obstacles'],
    neutral: ['neutral', 'average', 'mixed'],
    mixed: ['mixed', 'conflict', 'conflicting', 'disagreement', 'contradiction'],
  },

  rankingPolicy: {
    directMatchBonus: 50,
    domainRelevanceBonus: 30,
    activeTimingBonus: 20,
    multiEngineBonus: 10,
  },
};
