import { HeavenlyStem, SiHuaTransformation, ZiWeiPalace } from './types/ziwei-types.js';

export const SIHUA_TABLE: Record<
  HeavenlyStem,
  { lu: string; quan: string; ke: string; ji: string }
> = {
  Jia: { lu: 'Lian Zhen (Diplomat)', quan: 'Po Jun (Vanguard)', ke: 'Wu Qu (General)', ji: 'Tai Yang (Sun)' },
  Yi: { lu: 'Tian Ji (Advisor)', quan: 'Tian Liang (Inspector)', ke: 'Zi Wei (Emperor)', ji: 'Tai Yin (Moon)' },
  Bing: { lu: 'Tian Tong (Pleasure)', quan: 'Tian Ji (Advisor)', ke: 'Wen Chang (Literary)', ji: 'Lian Zhen (Diplomat)' },
  Ding: { lu: 'Tai Yin (Moon)', quan: 'Tian Tong (Pleasure)', ke: 'Tian Ji (Advisor)', ji: 'Ju Men (Gloom)' },
  Wu: { lu: 'Tan Lang (Flirt)', quan: 'Tai Yin (Moon)', ke: 'You Bi (Right Assistant)', ji: 'Tian Ji (Advisor)' },
  Ji: { lu: 'Wu Qu (General)', quan: 'Tan Lang (Flirt)', ke: 'Tian Liang (Inspector)', ji: 'Wen Qu (Arts)' },
  Geng: { lu: 'Tai Yang (Sun)', quan: 'Wu Qu (General)', ke: 'Tai Yin (Moon)', ji: 'Tian Tong (Pleasure)' },
  Xin: { lu: 'Ju Men (Gloom)', quan: 'Tai Yang (Sun)', ke: 'Wu Qu (General)', ji: 'Wen Chang (Literary)' },
  Ren: { lu: 'Tian Liang (Inspector)', quan: 'Zi Wei (Emperor)', ke: 'Zuo Fu (Left Assistant)', ji: 'Wu Qu (General)' },
  Gui: { lu: 'Po Jun (Vanguard)', quan: 'Ju Men (Gloom)', ke: 'Tai Yin (Moon)', ji: 'Tan Lang (Flirt)' },
};

export function calculateSiHuaTransformations(yearStem: HeavenlyStem): SiHuaTransformation[] {
  const map = SIHUA_TABLE[yearStem];
  return [
    {
      type: 'Hua Lu',
      chinese: '化祿',
      starName: map.lu,
      effect: 'Prosperity, opportunity, financial flow, and harmony in the house.',
    },
    {
      type: 'Hua Quan',
      chinese: '化權',
      starName: map.quan,
      effect: 'Authority, power, decisive action, and leadership control.',
    },
    {
      type: 'Hua Ke',
      chinese: '化科',
      starName: map.ke,
      effect: 'Fame, academic excellence, reputation, and mentor guidance.',
    },
    {
      type: 'Hua Ji',
      chinese: '化忌',
      starName: map.ji,
      effect: 'Obstacles, lessons, karmic debt, stress, and required refinement.',
    },
  ];
}

export function attachSiHuaToPalaces(palaces: ZiWeiPalace[], siHuaList: SiHuaTransformation[]): void {
  for (const transform of siHuaList) {
    const starPrefix = transform.starName.split(' ')[0].toLowerCase();
    for (const p of palaces) {
      const matchMajor = p.majorStars.find((s) => s.nameEn.toLowerCase().startsWith(starPrefix));
      const matchAux = p.auxiliaryStars.find((s) => s.nameEn.toLowerCase().startsWith(starPrefix));
      if (matchMajor) {
        matchMajor.transformation = transform.type;
        p.transformations.push(transform);
      } else if (matchAux) {
        matchAux.transformation = transform.type;
        p.transformations.push(transform);
      }
    }
  }
}
