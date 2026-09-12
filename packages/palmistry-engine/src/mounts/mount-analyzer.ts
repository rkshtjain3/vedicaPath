import { PalmarMounts, PalmarMountDetail, PalmistryInputPayload } from '../types/palmistry-types.js';

export function analyzePalmarMounts(payload: PalmistryInputPayload): PalmarMounts {
  const jupiter: PalmarMountDetail = {
    id: 'jupiter',
    nameEn: 'Jupiter Mount',
    nameSanskrit: 'Guru Parvata (गुरु पर्वत)',
    prominence: 'PROMINENT_WELL_DEVELOPED',
    score: 85,
    elementAffinity: 'Ether / Fire',
    significance: 'High leadership ambition, ethical integrity, executive dignity, and natural mentor archetype.',
  };

  const saturn: PalmarMountDetail = {
    id: 'saturn',
    nameEn: 'Saturn Mount',
    nameSanskrit: 'Shani Parvata (शनि पर्वत)',
    prominence: 'BALANCED_NORMAL',
    score: 75,
    elementAffinity: 'Air / Earth',
    significance: 'Pragmatic patience, structural discipline, research capability, and sober financial foresight.',
  };

  const sun: PalmarMountDetail = {
    id: 'sun',
    nameEn: 'Sun Mount',
    nameSanskrit: 'Surya Parvata (सूर्य पर्वत)',
    prominence: 'PROMINENT_WELL_DEVELOPED',
    score: 82,
    elementAffinity: 'Fire / Radiant Light',
    significance: 'Creative originality, charismatic influence, optimism, and drive for lasting legacy.',
  };

  const mercury: PalmarMountDetail = {
    id: 'mercury',
    nameEn: 'Mercury Mount',
    nameSanskrit: 'Budh Parvata (बुध पर्वत)',
    prominence: 'PROMINENT_WELL_DEVELOPED',
    score: 80,
    elementAffinity: 'Water / Air',
    significance: 'Commercial instinct, scientific curiosity, mental agility, and persuasive communication.',
  };

  const upperMars: PalmarMountDetail = {
    id: 'upper_mars',
    nameEn: 'Upper Mars Mount',
    nameSanskrit: 'Mangal Upper (उच्च मंगल)',
    prominence: 'BALANCED_NORMAL',
    score: 78,
    elementAffinity: 'Fire / Iron',
    significance: 'Moral resilience, defensive fortitude, calm persistence under pressure.',
  };

  const lowerMars: PalmarMountDetail = {
    id: 'lower_mars',
    nameEn: 'Lower Mars Mount',
    nameSanskrit: 'Mangal Lower (निम्न मंगल)',
    prominence: 'BALANCED_NORMAL',
    score: 72,
    elementAffinity: 'Fire / Kinetic Energy',
    significance: 'Proactive courage, assertiveness, physical energy, and decisive initiation.',
  };

  const venus: PalmarMountDetail = {
    id: 'venus',
    nameEn: 'Venus Mount',
    nameSanskrit: 'Shukra Parvata (शुक्र पर्वत)',
    prominence: 'PROMINENT_WELL_DEVELOPED',
    score: 88,
    elementAffinity: 'Water / Earth',
    significance: 'Vitality reserves, warmth, aesthetic appreciation, emotional generosity, and sensory vigor.',
  };

  const moon: PalmarMountDetail = {
    id: 'moon',
    nameEn: 'Moon Mount',
    nameSanskrit: 'Chandra Parvata (चंद्र पर्वत)',
    prominence: 'PROMINENT_WELL_DEVELOPED',
    score: 84,
    elementAffinity: 'Water / Sublime Imagination',
    significance: 'Intuitive depth, rich sub-conscious imagination, affinity for travel and international trade.',
  };

  return {
    jupiter,
    saturn,
    sun,
    mercury,
    upperMars,
    lowerMars,
    venus,
    moon,
  };
}
