import { describe, expect, it } from 'vitest';
import { evaluateYogaEngine } from '../src/evaluator.js';
import { PERSONAL_YOGA_V1 } from '../src/profiles/personal-yoga-v1.js';
import { ChartAnalysisResultInput } from '../src/types/yoga-types.js';

describe('Classical Yoga Engine (@vedica/yoga-engine)', () => {
  // Mock birth chart & analysis input (Lagna in Sagittarius 26.56°, Sun/Mercury in Virgo H10, Jupiter in Sag H1, Moon in Cap H2)
  const mockChart: any = {
    birthTime: { dateOfBirth: '1996-09-23', timeOfBirth: '14:30:00', timezone: 'Asia/Kolkata' },
    location: { latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
    lagna: { degreeInSign: 26.56, longitude: 266.56, sign: { id: 9, name: 'Sagittarius' } },
  };

  const mockAnalysis: ChartAnalysisResultInput = {
    planetFacts: [
      { planet: 'Sun', longitude: 156.8, sign: 'Virgo', degreeInSign: 6.8, house: 10, nakshatra: 'Uttara Phalguni', pada: 4, retrograde: false },
      { planet: 'Moon', longitude: 285.5, sign: 'Capricorn', degreeInSign: 15.5, house: 2, nakshatra: 'Shravana', pada: 2, retrograde: false },
      { planet: 'Mars', longitude: 95.2, sign: 'Cancer', degreeInSign: 5.2, house: 8, nakshatra: 'Pushya', pada: 1, retrograde: false },
      { planet: 'Mercury', longitude: 160.1, sign: 'Virgo', degreeInSign: 10.1, house: 10, nakshatra: 'Hasta', pada: 1, retrograde: false },
      { planet: 'Jupiter', longitude: 250.4, sign: 'Sagittarius', degreeInSign: 10.4, house: 1, nakshatra: 'Mula', pada: 4, retrograde: false },
      { planet: 'Venus', longitude: 125.0, sign: 'Leo', degreeInSign: 5.0, house: 9, nakshatra: 'Magha', pada: 2, retrograde: false },
      { planet: 'Saturn', longitude: 340.0, sign: 'Pisces', degreeInSign: 10.0, house: 4, nakshatra: 'Uttara Bhadrapada', pada: 3, retrograde: true },
      { planet: 'Rahu', longitude: 170.0, sign: 'Virgo', degreeInSign: 20.0, house: 10, nakshatra: 'Hasta', pada: 4, retrograde: true },
      { planet: 'Ketu', longitude: 350.0, sign: 'Pisces', degreeInSign: 20.0, house: 4, nakshatra: 'Revati', pada: 2, retrograde: true },
    ],
    houseLordFacts: [
      { house: 1, lord: 'Jupiter', lordHouse: 1, lordSign: 'Sagittarius', dignity: 'OWN_SIGN', retrograde: false },
      { house: 2, lord: 'Saturn', lordHouse: 4, lordSign: 'Pisces', dignity: 'NEUTRAL_SIGN', retrograde: true },
      { house: 3, lord: 'Saturn', lordHouse: 4, lordSign: 'Pisces', dignity: 'NEUTRAL_SIGN', retrograde: true },
      { house: 4, lord: 'Jupiter', lordHouse: 1, lordSign: 'Sagittarius', dignity: 'OWN_SIGN', retrograde: false },
      { house: 5, lord: 'Mars', lordHouse: 8, lordSign: 'Cancer', dignity: 'DEBILITATED', retrograde: false },
      { house: 6, lord: 'Venus', lordHouse: 9, lordSign: 'Leo', dignity: 'ENEMY_SIGN', retrograde: false },
      { house: 7, lord: 'Mercury', lordHouse: 10, lordSign: 'Virgo', dignity: 'EXALTED', retrograde: false },
      { house: 8, lord: 'Moon', lordHouse: 2, lordSign: 'Capricorn', dignity: 'NEUTRAL_SIGN', retrograde: false },
      { house: 9, lord: 'Sun', lordHouse: 10, lordSign: 'Virgo', dignity: 'FRIENDLY_SIGN', retrograde: false },
      { house: 10, lord: 'Mercury', lordHouse: 10, lordSign: 'Virgo', dignity: 'EXALTED', retrograde: false },
      { house: 11, lord: 'Venus', lordHouse: 9, lordSign: 'Leo', dignity: 'ENEMY_SIGN', retrograde: false },
      { house: 12, lord: 'Mars', lordHouse: 8, lordSign: 'Cancer', dignity: 'DEBILITATED', retrograde: false },
    ],
    conjunctions: [
      { planetA: 'Sun', planetB: 'Mercury', longitudeDifference: 3.3, orb: 8, detected: true },
    ],
    aspects: [
      { fromPlanet: 'Jupiter', fromHouse: 1, aspectNumber: 7, toHouse: 7, targetPlanets: [] },
      { fromPlanet: 'Jupiter', fromHouse: 1, aspectNumber: 9, toHouse: 9, targetPlanets: ['Venus'] },
      { fromPlanet: 'Saturn', fromHouse: 4, aspectNumber: 7, toHouse: 10, targetPlanets: ['Sun', 'Mercury', 'Rahu'] },
    ],
    dignities: [
      { planet: 'Sun', sign: 'Virgo', primaryDignity: 'FRIENDLY_SIGN', relationshipToSignLord: 'FRIENDLY' },
      { planet: 'Moon', sign: 'Capricorn', primaryDignity: 'NEUTRAL_SIGN', relationshipToSignLord: 'NEUTRAL' },
      { planet: 'Mars', sign: 'Cancer', primaryDignity: 'DEBILITATED', relationshipToSignLord: 'ENEMY' },
      { planet: 'Mercury', sign: 'Virgo', primaryDignity: 'EXALTED', relationshipToSignLord: 'OWN_SIGN' },
      { planet: 'Jupiter', sign: 'Sagittarius', primaryDignity: 'OWN_SIGN', relationshipToSignLord: 'OWN_SIGN' },
      { planet: 'Venus', sign: 'Leo', primaryDignity: 'ENEMY_SIGN', relationshipToSignLord: 'FRIENDLY' },
      { planet: 'Saturn', sign: 'Pisces', primaryDignity: 'NEUTRAL_SIGN', relationshipToSignLord: 'FRIENDLY' },
      { planet: 'Rahu', sign: 'Virgo', primaryDignity: 'FRIENDLY_SIGN', relationshipToSignLord: 'FRIENDLY' },
      { planet: 'Ketu', sign: 'Pisces', primaryDignity: 'NEUTRAL_SIGN', relationshipToSignLord: 'FRIENDLY' },
    ],
  };

  it('1. should evaluate all 24 classical Yogas accurately', () => {
    const res = evaluateYogaEngine(mockChart, mockAnalysis, PERSONAL_YOGA_V1);
    expect(res.profileVersion).toBe('personal-yoga-v1');
    expect(res.totalEvaluated).toBe(24);
    expect(res.results.length).toBe(24);
  });

  it('2. should detect Hamsa Yoga (Jupiter in House 1 Sagittarius Own Sign)', () => {
    const res = evaluateYogaEngine(mockChart, mockAnalysis, PERSONAL_YOGA_V1);
    const hamsa = res.results.find((y) => y.id === 'HAMSA_YOGA');
    expect(hamsa).toBeDefined();
    expect(hamsa?.status).toBe('DETECTED');
    expect(hamsa?.detected).toBe(true);
    expect(hamsa?.conditions[0].passed).toBe(true); // Kendra
    expect(hamsa?.conditions[1].passed).toBe(true); // Own Sign
  });

  it('3. should detect Budha-Aditya Yoga (Sun & Mercury conjunct in House 10)', () => {
    const res = evaluateYogaEngine(mockChart, mockAnalysis, PERSONAL_YOGA_V1);
    const ba = res.results.find((y) => y.id === 'BUDHA_ADITYA_YOGA');
    expect(ba).toBeDefined();
    expect(ba?.status).toBe('DETECTED');
    expect(ba?.detected).toBe(true);
  });

  it('4. should detect Dharma-Karmadhipati Yoga (9th Lord Sun & 10th Lord Mercury conjunct in H10)', () => {
    const res = evaluateYogaEngine(mockChart, mockAnalysis, PERSONAL_YOGA_V1);
    const dk = res.results.find((y) => y.id === 'DHARMA_KARMADHIPATI_YOGA');
    expect(dk).toBeDefined();
    expect(dk?.status).toBe('DETECTED');
    expect(dk?.detected).toBe(true);
  });

  it('5. should detect Viparita Raja Yoga Harsha (6th Lord Venus in H9 -> not Harsha, 12th Lord Mars in H8 -> Vimala detected)', () => {
    const res = evaluateYogaEngine(mockChart, mockAnalysis, PERSONAL_YOGA_V1);
    const vimala = res.results.find((y) => y.id === 'VIPARITA_RAJA_YOGA_VIMALA');
    expect(vimala).toBeDefined();
    expect(vimala?.status).toBe('DETECTED');
    expect(vimala?.detected).toBe(true);
  });

  it('6. should preserve failed conditions for undetected Yogas (e.g. Gajakesari)', () => {
    const res = evaluateYogaEngine(mockChart, mockAnalysis, PERSONAL_YOGA_V1);
    const gk = res.results.find((y) => y.id === 'GAJAKESARI_YOGA');
    expect(gk).toBeDefined();
    expect(gk?.status).toBe('NOT_DETECTED');
    expect(gk?.conditions.length).toBe(2);
    expect(gk?.conditions[0].passed).toBe(false); // 12th from Moon -> Not Kendra
    expect(gk?.conditions[1].passed).toBe(true);  // Jupiter not debilitated
  });
});
