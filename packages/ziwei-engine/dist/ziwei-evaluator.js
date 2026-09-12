import { evaluateBaZi } from '@vedica/bazi-engine';
import { createHash } from 'crypto';
import { generate12Palaces, EARTHLY_BRANCHES, } from './palace-calculator.js';
import { calculateWuxingJu } from './wuxing-ju-calculator.js';
import { populateStarsInPalaces } from './star-calculator.js';
import { calculateSiHuaTransformations, attachSiHuaToPalaces, } from './sihua-calculator.js';
export function evaluateZiWei(chart) {
    // Use BaZi engine stem-branch calculation as validated Chinese metaphysical provider
    const bazi = evaluateBaZi(chart);
    const yearStem = bazi.fourPillars.year.stem.name;
    const yearBranch = bazi.fourPillars.year.branch.name;
    const hourBranch = bazi.fourPillars.hour.branch.name;
    const hourBranchIdx = Math.max(0, EARTHLY_BRANCHES.indexOf(hourBranch));
    // Determine Lunar Date from chart UTC instant
    const dt = new Date(chart.utcInstant.isoString);
    const lunarYear = dt.getUTCFullYear();
    const lunarMonth = ((dt.getUTCMonth() + 1) % 12) || 12;
    const lunarDay = Math.min(30, Math.max(1, dt.getUTCDate()));
    // 1. Generate 12 Palaces
    const { palaces, mingGongBranchIdx, shenGongBranchIdx } = generate12Palaces(lunarMonth, hourBranchIdx, yearStem);
    const mingPalace = palaces.find((p) => p.isLifePalace);
    const bodyPalace = palaces.find((p) => p.isBodyPalace);
    // 2. Five Elements Bureau (Wuxing Ju)
    const bureau = calculateWuxingJu(mingPalace.stem, mingPalace.branch);
    // 3. Populate 14 Major Stars & Auxiliary Stars
    const { ziWeiBranchIdx, tianFuBranchIdx } = populateStarsInPalaces(palaces, lunarDay, bureau.number, lunarMonth, hourBranchIdx, yearStem, yearBranch);
    // 4. Si Hua Four Transformations
    const siHuaList = calculateSiHuaTransformations(yearStem);
    attachSiHuaToPalaces(palaces, siHuaList);
    // 5. Reproducibility Hash
    const canonicalPayload = [
        `chinese-ziwei-v1`,
        `YEAR:${yearStem}-${yearBranch}`,
        `LUNAR:${lunarYear}-${lunarMonth}-${lunarDay}`,
        `BUREAU:${bureau.name}`,
        `MING:${mingPalace.branch}`,
        `SHEN:${bodyPalace.branch}`,
        `ZW_POS:${EARTHLY_BRANCHES[ziWeiBranchIdx]}`,
        `TF_POS:${EARTHLY_BRANCHES[tianFuBranchIdx]}`,
    ].join('|');
    const calculationHash = createHash('sha256').update(canonicalPayload).digest('hex');
    return {
        profileVersion: 'chinese-ziwei-v1',
        lunarDate: {
            year: lunarYear,
            month: lunarMonth,
            day: lunarDay,
            isLeapMonth: false,
        },
        bureau,
        lifePalaceBranch: mingPalace.branch,
        bodyPalaceBranch: bodyPalace.branch,
        palaces,
        siHuaTransformations: siHuaList,
        calculationHash,
        auditTrail: {
            ruleSet: 'chinese-ziwei-v1 (San He & Zi Wei Dou Shu Classical Consensus)',
            mingGongCalculation: `Life Palace = (Month ${lunarMonth} - Hour ${hourBranch} [${hourBranchIdx}]) = ${mingPalace.branch} (${mingPalace.stem})`,
            shenGongCalculation: `Body Palace = (Month ${lunarMonth} + Hour ${hourBranch} [${hourBranchIdx}]) = ${bodyPalace.branch} (${bodyPalace.stem})`,
            bureauCalculation: `Na Yin Element for Ming Gong Stem-Branch (${mingPalace.stem}-${mingPalace.branch}) = ${bureau.name}`,
            ziWeiStarPlacement: `Zi Wei Star placed at Branch ${EARTHLY_BRANCHES[ziWeiBranchIdx]} based on Lunar Day ${lunarDay} & Bureau ${bureau.number}`,
        },
    };
}
