export const EARTHLY_BRANCHES = [
    'Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si',
    'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai',
];
export const HEAVENLY_STEMS = [
    'Jia', 'Yi', 'Bing', 'Ding', 'Wu',
    'Ji', 'Geng', 'Xin', 'Ren', 'Gui',
];
export const PALACE_TYPES_COUNTER_CLOCKWISE = [
    { type: 'LIFE', en: 'Life / Self', cn: '命宮' },
    { type: 'SIBLINGS', en: 'Siblings', cn: '兄弟宮' },
    { type: 'SPOUSE', en: 'Spouse', cn: '夫妻宮' },
    { type: 'CHILDREN', en: 'Children', cn: '子女宮' },
    { type: 'WEALTH', en: 'Wealth', cn: '財帛宮' },
    { type: 'HEALTH', en: 'Health', cn: '疾厄宮' },
    { type: 'TRAVEL', en: 'Travel', cn: '遷移宮' },
    { type: 'FRIENDS', en: 'Friends / Servants', cn: '交友宮' },
    { type: 'CAREER', en: 'Career', cn: '官祿宮' },
    { type: 'PROPERTY', en: 'Property', cn: '田宅宮' },
    { type: 'FORTUNE', en: 'Fortune / Spirit', cn: '福德宮' },
    { type: 'PARENTS', en: 'Parents', cn: '父母宮' },
];
/**
 * Calculates Ming Gong (Life Palace) Earthly Branch Index (0..11)
 * Formula: (2 + (lunarMonth - 1) - hourBranchIndex + 12) % 12
 */
export function calculateMingGongBranch(lunarMonth, hourBranchIndex) {
    return ((2 + (lunarMonth - 1) - hourBranchIndex) % 12 + 12) % 12;
}
/**
 * Calculates Shen Gong (Body Palace) Earthly Branch Index (0..11)
 * Formula: (2 + (lunarMonth - 1) + hourBranchIndex) % 12
 */
export function calculateShenGongBranch(lunarMonth, hourBranchIndex) {
    return ((2 + (lunarMonth - 1) + hourBranchIndex) % 12 + 12) % 12;
}
/**
 * Five Tigers Chasing Stems (五虎遁)
 * Determines Heavenly Stem for Yin (Index 2) Palace based on Birth Year Stem
 */
export function getYinPalaceStemIndex(yearStem) {
    switch (yearStem) {
        case 'Jia':
        case 'Ji':
            return 2; // Bing (丙)
        case 'Yi':
        case 'Geng':
            return 4; // Wu (戊)
        case 'Bing':
        case 'Xin':
            return 6; // Geng (庚)
        case 'Ding':
        case 'Ren':
            return 8; // Ren (壬)
        case 'Wu':
        case 'Gui':
            return 0; // Jia (甲)
    }
}
/**
 * Calculates Heavenly Stem for any Branch Index (0..11)
 */
export function getPalaceStem(branchIndex, yearStem) {
    const yinStemIdx = getYinPalaceStemIndex(yearStem);
    const offsetFromYin = (branchIndex - 2 + 12) % 12;
    const stemIdx = (yinStemIdx + offsetFromYin) % 10;
    return HEAVENLY_STEMS[stemIdx];
}
/**
 * Generates the 12 Palaces with stem/branch mapping and evidence traces
 */
export function generate12Palaces(lunarMonth, hourBranchIndex, yearStem) {
    const mingIdx = calculateMingGongBranch(lunarMonth, hourBranchIndex);
    const shenIdx = calculateShenGongBranch(lunarMonth, hourBranchIndex);
    const palaces = [];
    for (let i = 0; i < 12; i++) {
        // 12 Palaces sequence counter-clockwise starting from Ming Gong
        const palaceMeta = PALACE_TYPES_COUNTER_CLOCKWISE[i];
        const branchIdx = (mingIdx - i + 12) % 12;
        const branch = EARTHLY_BRANCHES[branchIdx];
        const stem = getPalaceStem(branchIdx, yearStem);
        const isLife = branchIdx === mingIdx;
        const isBody = branchIdx === shenIdx;
        palaces.push({
            type: palaceMeta.type,
            nameEn: palaceMeta.en,
            nameCn: palaceMeta.cn,
            branch,
            branchIndex: branchIdx,
            stem,
            isLifePalace: isLife,
            isBodyPalace: isBody,
            majorStars: [],
            auxiliaryStars: [],
            transformations: [],
            evidence: [
                `Palace ${palaceMeta.en} (${palaceMeta.cn}) assigned to Earthly Branch ${branch} and Heavenly Stem ${stem}`,
                isLife ? 'Marked as Life Palace (命宮)' : '',
                isBody ? 'Marked as Body Palace (身宮)' : '',
            ].filter(Boolean),
        });
    }
    return { palaces, mingGongBranchIdx: mingIdx, shenGongBranchIdx: shenIdx };
}
