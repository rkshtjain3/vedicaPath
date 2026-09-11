import { isKendraHouse } from '../../helpers/house-helpers.js';
import { getPlanetDignity, isDignified } from '../../helpers/dignity-helpers.js';
const MAHAPURUSHA_YOGAS = [
    {
        planet: 'Mars',
        yogaId: 'RUCHAKA_YOGA',
        yogaName: 'Ruchaka Yoga (Mahapurusha)',
        description: 'Mars is in a Kendra house (1st, 4th, 7th, 10th) in Own Sign (Aries, Scorpio) or Exaltation (Capricorn).',
    },
    {
        planet: 'Mercury',
        yogaId: 'BHADRA_YOGA',
        yogaName: 'Bhadra Yoga (Mahapurusha)',
        description: 'Mercury is in a Kendra house (1st, 4th, 7th, 10th) in Own Sign (Gemini, Virgo) or Exaltation (Virgo).',
    },
    {
        planet: 'Jupiter',
        yogaId: 'HAMSA_YOGA',
        yogaName: 'Hamsa Yoga (Mahapurusha)',
        description: 'Jupiter is in a Kendra house (1st, 4th, 7th, 10th) in Own Sign (Sagittarius, Pisces) or Exaltation (Cancer).',
    },
    {
        planet: 'Venus',
        yogaId: 'MALAVYA_YOGA',
        yogaName: 'Malavya Yoga (Mahapurusha)',
        description: 'Venus is in a Kendra house (1st, 4th, 7th, 10th) in Own Sign (Taurus, Libra) or Exaltation (Pisces).',
    },
    {
        planet: 'Saturn',
        yogaId: 'SASA_YOGA',
        yogaName: 'Sasa Yoga (Mahapurusha)',
        description: 'Saturn is in a Kendra house (1st, 4th, 7th, 10th) in Own Sign (Capricorn, Aquarius) or Exaltation (Libra).',
    },
];
export function evaluateMahapurushaYogas(planetFacts, dignities, methodologyVersion) {
    return MAHAPURUSHA_YOGAS.map((cfg) => {
        const pFact = planetFacts.find((p) => p.planet.toLowerCase() === cfg.planet.toLowerCase());
        const pDig = getPlanetDignity(cfg.planet, dignities);
        const conditions = [];
        const evidence = [];
        // Condition 1: Kendra Placement
        const inKendra = pFact ? isKendraHouse(pFact.house) : false;
        conditions.push({
            id: `${cfg.yogaId}_KENDRA`,
            description: `${cfg.planet} is in a Kendra house (1st, 4th, 7th, or 10th) from Lagna`,
            passed: inKendra,
            result: inKendra,
            expectedValue: 'Kendra House (1, 4, 7, 10)',
            actualValue: pFact ? `House ${pFact.house} (${pFact.sign})` : 'Missing',
            evidence: [pFact ? `${cfg.planet} occupies House ${pFact.house}` : 'Planet fact not found'],
        });
        if (pFact) {
            evidence.push({
                type: 'PLANET_POSITION',
                planet: cfg.planet,
                house: pFact.house,
                details: [`${cfg.planet} is in House ${pFact.house} (${pFact.sign} ${pFact.degreeInSign.toFixed(2)}°)`],
            });
        }
        // Condition 2: Own Sign, Moolatrikona, or Exaltation
        const dignified = isDignified(pDig);
        const dignityName = pDig?.primaryDignity || 'UNKNOWN';
        conditions.push({
            id: `${cfg.yogaId}_DIGNITY`,
            description: `${cfg.planet} is in Own Sign, Moolatrikona, or Exaltation`,
            passed: dignified,
            result: dignified,
            expectedValue: 'OWN_SIGN | EXALTED | MOOLATRIKONA',
            actualValue: dignityName,
            evidence: [pDig ? `${cfg.planet} primary dignity is ${dignityName}` : 'Dignity fact not found'],
        });
        if (pDig) {
            evidence.push({
                type: 'DIGNITY',
                planet: cfg.planet,
                details: [`${cfg.planet} dignity in ${pDig.sign} is classified as ${pDig.primaryDignity}`],
            });
        }
        const detected = conditions.every((c) => c.passed);
        return {
            id: cfg.yogaId,
            name: cfg.yogaName,
            category: 'MAHAPURUSHA',
            status: detected ? 'DETECTED' : 'NOT_DETECTED',
            detected,
            chartScope: 'D1',
            conditions,
            evidence,
            methodologyVersion,
            notes: [
                `Classical Pancha Mahapurusha criteria for ${cfg.planet}: Kendra placement and dignity requirement.`,
            ],
        };
    });
}
