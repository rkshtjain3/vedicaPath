import { BRANCH_ORDER, EARTHLY_BRANCHES, FIVE_RAT_SEEK_START, FIVE_TIGER_SEEK_START, HEAVENLY_STEMS, STEM_ORDER, } from '../constants/ganzhi-constants.js';
export const SOLAR_TERMS_12 = [
    { termName: 'Li Chun (立春)', monthBranch: 'Yin', targetLongitude: 315 },
    { termName: 'Jing Zhe (惊蛰)', monthBranch: 'Mao', targetLongitude: 345 },
    { termName: 'Qing Ming (清明)', monthBranch: 'Chen', targetLongitude: 15 },
    { termName: 'Li Xia (立夏)', monthBranch: 'Si', targetLongitude: 45 },
    { termName: 'Mang Zhong (芒种)', monthBranch: 'Wu', targetLongitude: 75 },
    { termName: 'Xiao Shu (小暑)', monthBranch: 'Wei', targetLongitude: 105 },
    { termName: 'Li Qiu (立秋)', monthBranch: 'Shen', targetLongitude: 135 },
    { termName: 'Bai Lu (白露)', monthBranch: 'You', targetLongitude: 165 },
    { termName: 'Han Lu (寒露)', monthBranch: 'Xu', targetLongitude: 195 },
    { termName: 'Li Dong (立冬)', monthBranch: 'Hai', targetLongitude: 225 },
    { termName: 'Da Xue (大雪)', monthBranch: 'Zi', targetLongitude: 255 },
    { termName: 'Xiao Han (小寒)', monthBranch: 'Chou', targetLongitude: 285 },
];
/**
 * Calculates tropical Sun longitude from birth chart sidereal longitude & ayanamsha.
 */
export function getTropicalSunLongitude(chart) {
    const sun = chart.planets.find((p) => p.planet === 'Sun');
    if (!sun)
        return 0;
    const ayanamsha = chart.ayanamsaValue ?? 23.85;
    return ((sun.longitude + ayanamsha) % 360 + 360) % 360;
}
/**
 * Resolves the 12 Solar Months (Jie Qi) based on Tropical Sun Longitude.
 */
export function resolveSolarTermMonth(sunLongitude) {
    // Li Chun is 315°. Normalizing longitude relative to Li Chun (0° to 360° starting from 315°):
    const normLong = ((sunLongitude - 315 % 360) + 360) % 360;
    const monthIdx = Math.floor(normLong / 30); // 0 to 11
    return SOLAR_TERMS_12[monthIdx % 12];
}
/**
 * Calculates Julian Day Number (JDN) from UTC Instant.
 */
export function calculateJulianDayNumber(utcIsoString) {
    const date = new Date(utcIsoString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();
    let y = year;
    let m = month;
    if (m <= 2) {
        y -= 1;
        m += 12;
    }
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const dayFraction = (hour + minute / 60 + second / 3600) / 24;
    const jdn = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + dayFraction + b - 1524.5;
    return jdn;
}
/**
 * Computes Day Ganzhi index (0 to 59) from JDN.
 */
export function calculateDayGanzhiIndex(jdn) {
    // Sexagenary epoch offset: (Math.floor(jdn + 0.5) + 49) % 60
    const dayNum = Math.floor(jdn + 0.5);
    return ((dayNum + 49) % 60 + 60) % 60;
}
/**
 * Calculates the Four Pillars of Destiny (Year, Month, Day, Hour) with explicit evidence traces.
 */
export function calculateFourPillars(chart) {
    const tropicalSunLong = getTropicalSunLongitude(chart);
    const utcIso = chart.utcInstant?.isoString || new Date().toISOString();
    const utcDate = new Date(utcIso);
    // 1. Year Pillar Calculation (Li Chun boundary)
    // Gregorian Year reference: Year 1984 was Jia Zi (甲子, index 0)
    // Year Ganzhi index calculation relative to Li Chun (if born before Li Chun ~Feb 4, solar year is previous year):
    let solarYear = utcDate.getUTCFullYear();
    // Check if Sun longitude is before Li Chun 315° in Jan/Feb:
    const month = utcDate.getUTCMonth() + 1;
    if (month <= 2 && tropicalSunLong < 315 && tropicalSunLong >= 285) {
        solarYear -= 1;
    }
    const yearGanzhiIndex = ((solarYear - 4) % 60 + 60) % 60;
    const yearStemName = STEM_ORDER[yearGanzhiIndex % 10];
    const yearBranchName = BRANCH_ORDER[yearGanzhiIndex % 12];
    const yearStem = HEAVENLY_STEMS[yearStemName];
    const yearBranch = EARTHLY_BRANCHES[yearBranchName];
    const yearEvidence = {
        pillarName: 'YEAR',
        stem: yearStemName,
        branch: yearBranchName,
        reasoning: `Solar Year ${solarYear} (evaluated relative to Li Chun 315° Sun longitude, actual Sun=${tropicalSunLong.toFixed(2)}°). Ganzhi Index ${yearGanzhiIndex} -> ${yearStem.name} (${yearStem.chinese}) ${yearBranch.name} (${yearBranch.chinese}).`,
        reasoningHi: `सौर वर्ष ${solarYear} (सूर्य देशांतर ${tropicalSunLong.toFixed(2)}° के आधार पर)। गन-झी सूचकांक ${yearGanzhiIndex} -> ${yearStem.name} ${yearBranch.name}।`,
    };
    const yearPillar = {
        stem: yearStem,
        branch: yearBranch,
        tenGodStem: '',
        hiddenStems: yearBranch.hiddenStems,
        evidence: yearEvidence,
    };
    // 2. Month Pillar Calculation (Solar Terms & Five Tiger Seek)
    const solarTerm = resolveSolarTermMonth(tropicalSunLong);
    const monthBranchName = solarTerm.monthBranch;
    const monthBranch = EARTHLY_BRANCHES[monthBranchName];
    const tigerStartStem = FIVE_TIGER_SEEK_START[yearStemName];
    const tigerStartIdx = STEM_ORDER.indexOf(tigerStartStem);
    const branchMonthOffset = (BRANCH_ORDER.indexOf(monthBranchName) - BRANCH_ORDER.indexOf('Yin') + 12) % 12;
    const monthStemName = STEM_ORDER[(tigerStartIdx + branchMonthOffset) % 10];
    const monthStem = HEAVENLY_STEMS[monthStemName];
    const monthEvidence = {
        pillarName: 'MONTH',
        stem: monthStemName,
        branch: monthBranchName,
        solarTerm: solarTerm.termName,
        solarTermLongitude: solarTerm.targetLongitude,
        reasoning: `Tropical Sun Longitude ${tropicalSunLong.toFixed(2)}° falls in ${solarTerm.termName} (Month Branch ${monthBranchName}). Five Tiger Seek for Year Stem ${yearStemName} yields Month Stem ${monthStemName}.`,
        reasoningHi: `सूर्य देशांतर ${tropicalSunLong.toFixed(2)}° ${solarTerm.termName} में स्थित है। पाँच बाघ खोज नियम से मासाधीश ${monthStemName} ${monthBranchName} निर्धारित हुआ।`,
    };
    const monthPillar = {
        stem: monthStem,
        branch: monthBranch,
        tenGodStem: '',
        hiddenStems: monthBranch.hiddenStems,
        evidence: monthEvidence,
    };
    // 3. Day Pillar Calculation (Julian Day Number & Sexagenary Cycle)
    const jdn = calculateJulianDayNumber(utcIso);
    // Hour check for Zi Hour transition (23:00 to 01:00):
    // Local civil birth time hour from input chart or UTC + offset:
    const localDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Local time
    let dayGanzhiIndex = calculateDayGanzhiIndex(jdn);
    // If local time is 23:00 or later (Late Zi hour), traditional BaZi increments day to next day's Ganzhi:
    if (localDate.getHours() >= 23) {
        dayGanzhiIndex = (dayGanzhiIndex + 1) % 60;
    }
    const dayStemName = STEM_ORDER[dayGanzhiIndex % 10];
    const dayBranchName = BRANCH_ORDER[dayGanzhiIndex % 12];
    const dayStem = HEAVENLY_STEMS[dayStemName];
    const dayBranch = EARTHLY_BRANCHES[dayBranchName];
    const dayEvidence = {
        pillarName: 'DAY',
        stem: dayStemName,
        branch: dayBranchName,
        jdn: Number(jdn.toFixed(2)),
        reasoning: `Julian Day Number ${jdn.toFixed(2)} yields Day Ganzhi Index ${dayGanzhiIndex}${localDate.getHours() >= 23 ? ' (Late Zi hour 23:00+ shifted to next day)' : ''}. Day Master is ${dayStemName} (${dayStem.chinese}) in ${dayBranchName} (${dayBranch.chinese}).`,
        reasoningHi: `जूलियन दिवस ${jdn.toFixed(2)} से दिवस गन-झी ${dayGanzhiIndex} प्राप्त हुआ। दिन का स्वामी (Day Master) ${dayStemName} ${dayBranchName} है।`,
    };
    const dayPillar = {
        stem: dayStem,
        branch: dayBranch,
        tenGodStem: 'Day Master (日主)',
        hiddenStems: dayBranch.hiddenStems,
        evidence: dayEvidence,
    };
    // 4. Hour Pillar Calculation (12 Double-Hours Shi Chen & Five Rat Seek)
    const localHour = localDate.getHours();
    // 12 Double-Hours (Shi Chen):
    // 23:00-01:00 Zi, 01:00-03:00 Chou, 03:00-05:00 Yin, 05:00-07:00 Mao, 07:00-09:00 Chen, 09:00-11:00 Si,
    // 11:00-13:00 Wu, 13:00-15:00 Wei, 15:00-17:00 Shen, 17:00-19:00 You, 19:00-21:00 Xu, 21:00-23:00 Hai
    const shiChenIdx = Math.floor(((localHour + 1) % 24) / 2); // 0 to 11
    const hourBranchName = BRANCH_ORDER[shiChenIdx];
    const hourBranch = EARTHLY_BRANCHES[hourBranchName];
    const ratStartStem = FIVE_RAT_SEEK_START[dayStemName];
    const ratStartIdx = STEM_ORDER.indexOf(ratStartStem);
    const hourStemName = STEM_ORDER[(ratStartIdx + shiChenIdx) % 10];
    const hourStem = HEAVENLY_STEMS[hourStemName];
    const hourEvidence = {
        pillarName: 'HOUR',
        stem: hourStemName,
        branch: hourBranchName,
        reasoning: `Local time ${localHour}:${String(localDate.getMinutes()).padStart(2, '0')} corresponds to ${hourBranchName} hour (Shi Chen index ${shiChenIdx}). Five Rat Seek for Day Stem ${dayStemName} yields Hour Stem ${hourStemName}.`,
        reasoningHi: `स्थानीय समय ${localHour}:${String(localDate.getMinutes()).padStart(2, '0')} ${hourBranchName} काल है। पाँच चूहा खोज नियम से ${hourStemName} ${hourBranchName} निर्धारित हुआ।`,
    };
    const hourPillar = {
        stem: hourStem,
        branch: hourBranch,
        tenGodStem: '',
        hiddenStems: hourBranch.hiddenStems,
        evidence: hourEvidence,
    };
    return {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar,
    };
}
