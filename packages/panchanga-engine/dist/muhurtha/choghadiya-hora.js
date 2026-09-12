const HORA_SEQUENCE = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
const DAY_LORD_INDEX = {
    0: 0, // Sunday -> Sun
    1: 3, // Monday -> Moon
    2: 6, // Tuesday -> Mars
    3: 2, // Wednesday -> Mercury
    4: 5, // Thursday -> Jupiter
    5: 1, // Friday -> Venus
    6: 4, // Saturday -> Saturn
};
const DAY_CHOGHADIYA_START = {
    0: ['Udveg', 'Chara', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'], // Sun
    1: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Chara', 'Labh', 'Amrit'], // Mon
    2: ['Rog', 'Udveg', 'Chara', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'], // Tue
    3: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Chara', 'Labh'], // Wed
    4: ['Shubh', 'Rog', 'Udveg', 'Chara', 'Labh', 'Amrit', 'Kaal', 'Shubh'], // Thu
    5: ['Chara', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Chara'], // Fri
    6: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Chara', 'Labh', 'Amrit', 'Kaal'], // Sat
};
function formatMins(mins) {
    const norm = ((Math.floor(mins) % 1440) + 1440) % 1440;
    const h24 = Math.floor(norm / 60);
    const m = norm % 60;
    const period = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${m < 10 ? '0' + m : m} ${period}`;
}
export function calculateChoghadiyaHora(dayIndex, // 0=Sunday
sunriseMinutes = 360, sunsetMinutes = 1080) {
    const dayDuration = sunsetMinutes - sunriseMinutes;
    const nightDuration = 1440 - dayDuration;
    const horaDayLen = dayDuration / 12;
    const horaNightLen = nightDuration / 12;
    const startHoraIdx = DAY_LORD_INDEX[dayIndex] ?? 0;
    const horas = [];
    for (let i = 0; i < 24; i++) {
        const isDay = i < 12;
        const lord = HORA_SEQUENCE[(startHoraIdx + i) % 7];
        const startMins = isDay
            ? sunriseMinutes + i * horaDayLen
            : sunsetMinutes + (i - 12) * horaNightLen;
        const endMins = isDay
            ? sunriseMinutes + (i + 1) * horaDayLen
            : sunsetMinutes + (i - 11) * horaNightLen;
        const nature = ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(lord)
            ? 'Auspicious'
            : lord === 'Sun'
                ? 'Neutral'
                : 'Inauspicious';
        horas.push({
            index: i + 1,
            lord,
            isDaytime: isDay,
            interval: {
                start: formatMins(startMins),
                end: formatMins(endMins),
                startMinutesFromMidnight: Math.round(startMins),
                endMinutesFromMidnight: Math.round(endMins),
            },
            nature,
        });
    }
    // Choghadiyas
    const chogNames = DAY_CHOGHADIYA_START[dayIndex] || DAY_CHOGHADIYA_START[0];
    const chogLen = dayDuration / 8;
    const choghadiyas = [];
    for (let i = 0; i < 8; i++) {
        const name = chogNames[i];
        const startMins = sunriseMinutes + i * chogLen;
        const endMins = sunriseMinutes + (i + 1) * chogLen;
        const nature = ['Amrit', 'Shubh', 'Labh'].includes(name)
            ? 'Auspicious'
            : name === 'Chara'
                ? 'Neutral'
                : 'Inauspicious';
        choghadiyas.push({
            index: i + 1,
            name,
            isDaytime: true,
            nature,
            interval: {
                start: formatMins(startMins),
                end: formatMins(endMins),
                startMinutesFromMidnight: Math.round(startMins),
                endMinutesFromMidnight: Math.round(endMins),
            },
        });
    }
    return { horas, choghadiyas };
}
