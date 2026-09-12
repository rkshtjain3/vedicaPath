import { analyzeDayMasterAndElements } from './analysis/day-master-analyzer.js';
import { evaluateBranchRelationships } from './analysis/branch-relationships-calculator.js';
import { populateTenGods } from './analysis/ten-gods-calculator.js';
import { calculateAnnualPillar, calculateLuckPillars } from './luck/luck-pillars-calculator.js';
import { calculateFourPillars } from './pillars/four-pillars-calculator.js';
/**
 * Main coordinator function producing a reproducible BaZi / Four Pillars report (`chinese-bazi-v1`).
 */
export function evaluateBaZi(birthChart, options = {}) {
    const gender = options.gender || 'MALE';
    const targetYear = options.targetYear || new Date().getFullYear();
    // 1. Four Pillars (Year, Month, Day, Hour)
    const fourPillars = calculateFourPillars(birthChart);
    // 2. Populate Ten Gods for visible and hidden stems
    const tenGods = populateTenGods(fourPillars);
    // 3. Day Master & Five Elements Analysis
    const { dayMaster, fiveElements } = analyzeDayMasterAndElements(fourPillars);
    // 4. Branch Relationships (Combos, Clashes, Harms, Punishments)
    const branchRelationships = evaluateBranchRelationships(fourPillars);
    // 5. Luck Pillars (Da Yun)
    const luckPillars = calculateLuckPillars(birthChart, fourPillars, gender);
    // 6. Annual Pillar
    const annualPillar = calculateAnnualPillar(fourPillars, targetYear);
    return {
        profileVersion: 'chinese-bazi-v1',
        fourPillars,
        dayMaster,
        fiveElements,
        tenGods,
        branchRelationships,
        luckPillars,
        annualPillar,
        calculationConvention: {
            yearBoundary: 'LI_CHUN_315',
            monthBoundary: '12_SOLAR_TERMS_JIE_QI',
            dayBoundary: 'SEXAGENARY_JDN_EPOCH',
            hourBoundary: '12_DOUBLE_HOURS_ZI_23:00',
            daYunConversion: '3_DAYS_EQUALS_1_YEAR',
        },
    };
}
