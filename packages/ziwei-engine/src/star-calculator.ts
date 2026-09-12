import {
  EarthlyBranch,
  HeavenlyStem,
  ZiWeiStar,
  ZiWeiPalace,
  StarBrightness,
} from './types/ziwei-types.js';

export function calculateZiWeiBranchIndex(lunarDay: number, bureauNumber: number): number {
  if (lunarDay % bureauNumber === 0) {
    const q = lunarDay / bureauNumber;
    return (2 + (q - 1)) % 12;
  }

  let k = 1;
  while ((lunarDay + k) % bureauNumber !== 0) {
    k++;
  }

  const q = (lunarDay + k) / bureauNumber;
  if (k % 2 === 0) {
    return (2 + (q - 1) + k) % 12;
  } else {
    return ((2 + (q - 1) - k) % 12 + 12) % 12;
  }
}

export function calculateTianFuBranchIndex(ziWeiBranchIndex: number): number {
  return (4 - ziWeiBranchIndex + 12) % 12;
}

export const MAJOR_STARS_META = [
  { id: 'zi_wei', nameEn: 'Zi Wei (Emperor)', nameCn: '紫微', group: 'NORTH' },
  { id: 'tian_ji', nameEn: 'Tian Ji (Advisor)', nameCn: '天機', group: 'NORTH' },
  { id: 'tai_yang', nameEn: 'Tai Yang (Sun)', nameCn: '太陽', group: 'NORTH' },
  { id: 'wu_qu', nameEn: 'Wu Qu (General)', nameCn: '武曲', group: 'NORTH' },
  { id: 'tian_tong', nameEn: 'Tian Tong (Pleasure)', nameCn: '天同', group: 'NORTH' },
  { id: 'lian_zhen', nameEn: 'Lian Zhen (Diplomat)', nameCn: '廉貞', group: 'NORTH' },
  { id: 'tian_fu', nameEn: 'Tian Fu (Empress)', nameCn: '天府', group: 'SOUTH' },
  { id: 'tai_yin', nameEn: 'Tai Yin (Moon)', nameCn: '太陰', group: 'SOUTH' },
  { id: 'tan_lang', nameEn: 'Tan Lang (Flirt)', nameCn: '貪狼', group: 'SOUTH' },
  { id: 'ju_men', nameEn: 'Ju Men (Gloom)', nameCn: '巨門', group: 'SOUTH' },
  { id: 'tian_xiang', nameEn: 'Tian Xiang (Minister)', nameCn: '天相', group: 'SOUTH' },
  { id: 'tian_liang', nameEn: 'Tian Liang (Inspector)', nameCn: '天梁', group: 'SOUTH' },
  { id: 'qi_sha', nameEn: 'Qi Sha (Marshal)', nameCn: '七殺', group: 'SOUTH' },
  { id: 'po_jun', nameEn: 'Po Jun (Vanguard)', nameCn: '破軍', group: 'SOUTH' },
];

export function getStarBrightness(starId: string, branchIndex: number): StarBrightness {
  // Simplified classical rating mapping
  if ([2, 5, 8, 11].includes(branchIndex)) return 'Temple';
  if ([0, 3, 6, 9].includes(branchIndex)) return 'Radiance';
  if ([1, 4, 7, 10].includes(branchIndex)) return 'Gain';
  return 'Flat';
}

export function populateStarsInPalaces(
  palaces: ZiWeiPalace[],
  lunarDay: number,
  bureauNumber: number,
  lunarMonth: number,
  hourBranchIndex: number,
  yearStem: HeavenlyStem,
  yearBranch: EarthlyBranch
): { ziWeiBranchIdx: number; tianFuBranchIdx: number } {
  const zwIdx = calculateZiWeiBranchIndex(lunarDay, bureauNumber);
  const tfIdx = calculateTianFuBranchIndex(zwIdx);

  const majorStarPositions: { id: string; nameEn: string; nameCn: string; category: 'MAJOR_NORTH' | 'MAJOR_SOUTH'; branchIdx: number }[] = [
    // Northern Dipper (Zi Wei Group)
    { id: 'zi_wei', nameEn: 'Zi Wei (Emperor)', nameCn: '紫微', category: 'MAJOR_NORTH', branchIdx: zwIdx },
    { id: 'tian_ji', nameEn: 'Tian Ji (Advisor)', nameCn: '天機', category: 'MAJOR_NORTH', branchIdx: (zwIdx - 1 + 12) % 12 },
    { id: 'tai_yang', nameEn: 'Tai Yang (Sun)', nameCn: '太陽', category: 'MAJOR_NORTH', branchIdx: (zwIdx - 3 + 12) % 12 },
    { id: 'wu_qu', nameEn: 'Wu Qu (General)', nameCn: '武曲', category: 'MAJOR_NORTH', branchIdx: (zwIdx - 4 + 12) % 12 },
    { id: 'tian_tong', nameEn: 'Tian Tong (Pleasure)', nameCn: '天同', category: 'MAJOR_NORTH', branchIdx: (zwIdx - 5 + 12) % 12 },
    { id: 'lian_zhen', nameEn: 'Lian Zhen (Diplomat)', nameCn: '廉貞', category: 'MAJOR_NORTH', branchIdx: (zwIdx - 8 + 12) % 12 },

    // Southern Dipper (Tian Fu Group)
    { id: 'tian_fu', nameEn: 'Tian Fu (Empress)', nameCn: '天府', category: 'MAJOR_SOUTH', branchIdx: tfIdx },
    { id: 'tai_yin', nameEn: 'Tai Yin (Moon)', nameCn: '太陰', category: 'MAJOR_SOUTH', branchIdx: (tfIdx + 1) % 12 },
    { id: 'tan_lang', nameEn: 'Tan Lang (Flirt)', nameCn: '貪狼', category: 'MAJOR_SOUTH', branchIdx: (tfIdx + 2) % 12 },
    { id: 'ju_men', nameEn: 'Ju Men (Gloom)', nameCn: '巨門', category: 'MAJOR_SOUTH', branchIdx: (tfIdx + 3) % 12 },
    { id: 'tian_xiang', nameEn: 'Tian Xiang (Minister)', nameCn: '天相', category: 'MAJOR_SOUTH', branchIdx: (tfIdx + 4) % 12 },
    { id: 'tian_liang', nameEn: 'Tian Liang (Inspector)', nameCn: '天梁', category: 'MAJOR_SOUTH', branchIdx: (tfIdx + 5) % 12 },
    { id: 'qi_sha', nameEn: 'Qi Sha (Marshal)', nameCn: '七殺', category: 'MAJOR_SOUTH', branchIdx: (tfIdx + 6) % 12 },
    { id: 'po_jun', nameEn: 'Po Jun (Vanguard)', nameCn: '破軍', category: 'MAJOR_SOUTH', branchIdx: (tfIdx + 10) % 12 },
  ];

  // Assign Major Stars to corresponding palaces
  for (const s of majorStarPositions) {
    const pal = palaces.find((p) => p.branchIndex === s.branchIdx);
    if (pal) {
      const star: ZiWeiStar = {
        id: s.id,
        nameEn: s.nameEn,
        nameCn: s.nameCn,
        category: s.category,
        brightness: getStarBrightness(s.id, s.branchIdx),
      };
      pal.majorStars.push(star);
    }
  }

  // Auxiliary Stars
  const LU_CUN_POSITIONS: Record<HeavenlyStem, number> = {
    Jia: 2, Yi: 3, Bing: 5, Ding: 6, Wu: 5, Ji: 6, Geng: 8, Xin: 9, Ren: 11, Gui: 0,
  };
  const luCunIdx = LU_CUN_POSITIONS[yearStem];
  const qingYangIdx = (luCunIdx + 1) % 12;
  const tuoLuoIdx = (luCunIdx - 1 + 12) % 12;

  const wenChangIdx = (10 - hourBranchIndex + 12) % 12;
  const wenQuIdx = (4 + hourBranchIndex) % 12;
  const zuoFuIdx = (4 + (lunarMonth - 1)) % 12;
  const youBiIdx = (10 - (lunarMonth - 1) + 12) % 12;

  const auxList = [
    { id: 'lu_cun', nameEn: 'Lu Cun (Treasury)', nameCn: '祿存', category: 'AUXILIARY_BENEFIC' as const, branchIdx: luCunIdx },
    { id: 'qing_yang', nameEn: 'Qing Yang (Goat)', nameCn: '擎羊', category: 'AUXILIARY_MALEFIC' as const, branchIdx: qingYangIdx },
    { id: 'tuo_luo', nameEn: 'Tuo Luo (Humpback)', nameCn: '陀羅', category: 'AUXILIARY_MALEFIC' as const, branchIdx: tuoLuoIdx },
    { id: 'wen_chang', nameEn: 'Wen Chang (Literary)', nameCn: '文昌', category: 'AUXILIARY_BENEFIC' as const, branchIdx: wenChangIdx },
    { id: 'wen_qu', nameEn: 'Wen Qu (Arts)', nameCn: '文曲', category: 'AUXILIARY_BENEFIC' as const, branchIdx: wenQuIdx },
    { id: 'zuo_fu', nameEn: 'Zuo Fu (Left Assistant)', nameCn: '左輔', category: 'AUXILIARY_BENEFIC' as const, branchIdx: zuoFuIdx },
    { id: 'you_bi', nameEn: 'You Bi (Right Assistant)', nameCn: '右弼', category: 'AUXILIARY_BENEFIC' as const, branchIdx: youBiIdx },
  ];

  for (const a of auxList) {
    const pal = palaces.find((p) => p.branchIndex === a.branchIdx);
    if (pal) {
      pal.auxiliaryStars.push({
        id: a.id,
        nameEn: a.nameEn,
        nameCn: a.nameCn,
        category: a.category,
        brightness: 'Radiance',
      });
    }
  }

  return { ziWeiBranchIdx: zwIdx, tianFuBranchIdx: tfIdx };
}
