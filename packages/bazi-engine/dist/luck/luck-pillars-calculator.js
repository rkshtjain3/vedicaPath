import { BRANCH_ORDER, EARTHLY_BRANCHES, HEAVENLY_STEMS, STEM_ORDER, } from '../constants/ganzhi-constants.js';
import { classifyTenGod, } from '../analysis/ten-gods-calculator.js';
export function calculateLuckPillars(chart, fourPillars, gender = 'MALE') {
    const yearStem = fourPillars.year.stem;
    const monthStem = fourPillars.month.stem;
    const monthBranch = fourPillars.month.branch;
    const dayMaster = fourPillars.day.stem;
    const isYearYang = yearStem.polarity === 'Yang';
    // Determine Direction (Forward vs Reverse)
    // Forward if (Yang Male) OR (Yin Female)
    // Reverse if (Yang Female) OR (Yin Male)
    let direction = 'FORWARD';
    if ((isYearYang && gender === 'MALE') || (!isYearYang && gender === 'FEMALE')) {
        direction = 'FORWARD';
    }
    else {
        direction = 'REVERSE';
    }
    // Calculate Solar Term Distance (approx 15 to 30 days span; average distance ~ 12 to 24 days)
    // 3 days = 1 year of starting age
    // Deterministic calculation based on tropical Sun longitude distance to next/prev solar term boundary:
    const sunLong = (fourPillars.month.evidence.solarTermLongitude ?? 180);
    // Distance to boundary in degrees (1° Sun longitude ≈ 1 day)
    const degDistance = direction === 'FORWARD' ? 30 - (sunLong % 30) : sunLong % 30;
    const daysDistance = Number((degDistance * 1.01).toFixed(1)); // Approx 1.01 days per 1° Sun movement
    let startingAge = Math.round(daysDistance / 3);
    if (startingAge < 1)
        startingAge = 1;
    if (startingAge > 10)
        startingAge = 10;
    const birthUtc = chart.utcInstant?.isoString || new Date().toISOString();
    const birthYear = new Date(birthUtc).getUTCFullYear();
    // Find Month Stem & Branch indices in 60-cycle
    const monthStemIdx = STEM_ORDER.indexOf(monthStem.name);
    const monthBranchIdx = BRANCH_ORDER.indexOf(monthBranch.name);
    const pillars = [];
    for (let i = 1; i <= 10; i++) {
        const step = direction === 'FORWARD' ? i : -i;
        const stemIdx = ((monthStemIdx + step) % 10 + 10) % 10;
        const branchIdx = ((monthBranchIdx + step) % 12 + 12) % 12;
        const sName = STEM_ORDER[stemIdx];
        const bName = BRANCH_ORDER[branchIdx];
        const stem = HEAVENLY_STEMS[sName];
        const branch = EARTHLY_BRANCHES[bName];
        const tenGod = classifyTenGod(dayMaster, stem);
        const startAge = startingAge + (i - 1) * 10;
        const endAge = startAge + 9;
        const startYr = birthYear + startAge;
        const endYr = startYr + 9;
        pillars.push({
            pillarNumber: i,
            startingAge: startAge,
            endingAge: endAge,
            startYear: startYr,
            endYear: endYr,
            stem,
            branch,
            tenGodStem: `${tenGod.name} (${tenGod.chinese})`,
        });
    }
    const reasoning = `Year Stem is ${yearStem.name} (${yearStem.polarity}) and Gender is ${gender}. Luck Pillars progress in ${direction} direction. Distance to ${direction === 'FORWARD' ? 'next' : 'previous'} solar term: ${daysDistance} days. Starting age of 1st Luck Pillar: ${startingAge} years.`;
    const reasoningHi = `वर्ष का स्वामी ${yearStem.name} (${yearStem.polarity}) एवं लिंग ${gender} है। भाग्य स्तम्भ ${direction === 'FORWARD' ? 'अनुलोम (顺)' : 'प्रतिलोम (逆)'} दिशा में हैं। सौर-अवधि दूरी: ${daysDistance} दिन। प्रथम भाग्य स्तम्भ की प्रारंभिक आयु: ${startingAge} वर्ष।`;
    return {
        direction,
        gender,
        yearStemPolarity: yearStem.polarity,
        startingAge,
        solarTermDistanceDays: daysDistance,
        calculationReasoning: reasoning,
        calculationReasoningHi: reasoningHi,
        pillars,
    };
}
export function calculateAnnualPillar(fourPillars, targetYear = new Date().getFullYear()) {
    const dayMaster = fourPillars.day.stem;
    const yearGanzhiIndex = ((targetYear - 4) % 60 + 60) % 60;
    const stemName = STEM_ORDER[yearGanzhiIndex % 10];
    const branchName = BRANCH_ORDER[yearGanzhiIndex % 12];
    const stem = HEAVENLY_STEMS[stemName];
    const branch = EARTHLY_BRANCHES[branchName];
    const tenGod = classifyTenGod(dayMaster, stem);
    const clashesWithNatal = [];
    const harmoniesWithNatal = [];
    const natalBranches = [
        { name: 'Year Pillar', b: fourPillars.year.branch.name },
        { name: 'Month Pillar', b: fourPillars.month.branch.name },
        { name: 'Day Pillar', b: fourPillars.day.branch.name },
        { name: 'Hour Pillar', b: fourPillars.hour.branch.name },
    ];
    // Simple clash checks (Zi-Wu, Mao-You, Yin-Shen, etc.)
    const clashPairs = {
        Zi: 'Wu', Wu: 'Zi',
        Chou: 'Wei', Wei: 'Chou',
        Yin: 'Shen', Shen: 'Yin',
        Mao: 'You', You: 'Mao',
        Chen: 'Xu', Xu: 'Chen',
        Si: 'Hai', Hai: 'Si',
    };
    const clashTarget = clashPairs[branchName];
    for (const nb of natalBranches) {
        if (nb.b === clashTarget) {
            clashesWithNatal.push(`Annual Branch ${branchName} clashes with ${nb.name} Branch (${nb.b})`);
        }
    }
    return {
        year: targetYear,
        stem,
        branch,
        tenGodStem: `${tenGod.name} (${tenGod.chinese})`,
        clashesWithNatal,
        harmoniesWithNatal,
    };
}
