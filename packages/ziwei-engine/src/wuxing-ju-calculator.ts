import { ElementBureau, HeavenlyStem, EarthlyBranch } from './types/ziwei-types.js';

const STEM_VALUES: Record<HeavenlyStem, number> = {
  Jia: 1, Yi: 1,
  Bing: 2, Ding: 2,
  Wu: 3, Ji: 3,
  Geng: 4, Xin: 4,
  Ren: 5, Gui: 5,
};

const BRANCH_VALUES: Record<EarthlyBranch, number> = {
  Zi: 1, Chou: 1, Wu: 1, Wei: 1,
  Yin: 2, Mao: 2, Shen: 2, You: 2,
  Chen: 3, Si: 3, Xu: 3, Hai: 3,
};

export function calculateWuxingJu(
  mingStem: HeavenlyStem,
  mingBranch: EarthlyBranch
): ElementBureau {
  const sVal = STEM_VALUES[mingStem];
  const bVal = BRANCH_VALUES[mingBranch];
  let sum = sVal + bVal;
  if (sum > 5) sum -= 5;

  switch (sum) {
    case 1:
      return { name: 'Metal 4', number: 4, element: 'Metal', chineseName: '金四局' };
    case 2:
      return { name: 'Water 2', number: 2, element: 'Water', chineseName: '水二局' };
    case 3:
      return { name: 'Fire 6', number: 6, element: 'Fire', chineseName: '火六局' };
    case 4:
      return { name: 'Wood 3', number: 3, element: 'Wood', chineseName: '木三局' };
    case 5:
    default:
      return { name: 'Earth 5', number: 5, element: 'Earth', chineseName: '土五局' };
  }
}
