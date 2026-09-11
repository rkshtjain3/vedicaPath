import { KaranaFact } from '../types/panchanga-types.js';
import { CHARA_KARANAS, STHIRA_KARANAS } from '../constants/panchanga-constants.js';

export function calculateKarana(sunLongitude: number, moonLongitude: number): KaranaFact {
  const diff = ((moonLongitude - sunLongitude + 360) % 360);
  const karanaIndex = Math.min(60, Math.floor(diff / 6) + 1); // 1 to 60

  if (karanaIndex === 1) {
    const k = STHIRA_KARANAS.Kimstughna;
    return {
      index: karanaIndex,
      karanaName: k.name,
      sanskritName: k.sanskritName,
      type: k.type,
      deity: k.deity,
      element: 'PRITHVI',
      isVishtiBhadra: k.isVishtiBhadra,
      auspiciousness: k.auspiciousness,
    };
  }

  if (karanaIndex === 58) {
    const k = STHIRA_KARANAS.Shakuni;
    return {
      index: karanaIndex,
      karanaName: k.name,
      sanskritName: k.sanskritName,
      type: k.type,
      deity: k.deity,
      element: 'PRITHVI',
      isVishtiBhadra: k.isVishtiBhadra,
      auspiciousness: k.auspiciousness,
    };
  }

  if (karanaIndex === 59) {
    const k = STHIRA_KARANAS.Chatushpada;
    return {
      index: karanaIndex,
      karanaName: k.name,
      sanskritName: k.sanskritName,
      type: k.type,
      deity: k.deity,
      element: 'PRITHVI',
      isVishtiBhadra: k.isVishtiBhadra,
      auspiciousness: k.auspiciousness,
    };
  }

  if (karanaIndex === 60) {
    const k = STHIRA_KARANAS.Naga;
    return {
      index: karanaIndex,
      karanaName: k.name,
      sanskritName: k.sanskritName,
      type: k.type,
      deity: k.deity,
      element: 'PRITHVI',
      isVishtiBhadra: k.isVishtiBhadra,
      auspiciousness: k.auspiciousness,
    };
  }

  // 7 Chara Karanas cycle for indices 2 through 57:
  // index 2 -> Bava (0), index 3 -> Balava (1), ..., index 8 -> Vishti (6), index 9 -> Bava (0)
  const charaIndex = (karanaIndex - 2) % 7;
  const k = CHARA_KARANAS[charaIndex] || CHARA_KARANAS[0];

  return {
    index: karanaIndex,
    karanaName: k.name,
    sanskritName: k.sanskritName,
    type: k.type,
    deity: k.deity,
    element: 'PRITHVI',
    isVishtiBhadra: k.isVishtiBhadra,
    auspiciousness: k.auspiciousness,
  };
}
