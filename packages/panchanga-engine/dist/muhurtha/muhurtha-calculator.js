function formatMinutes(minutes) {
    const normalized = ((Math.floor(minutes) % 1440) + 1440) % 1440;
    const hours24 = Math.floor(normalized / 60);
    const mins = normalized % 60;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const minsFormatted = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hours12}:${minsFormatted} ${period}`;
}
function createInterval(startMins, endMins) {
    return {
        start: formatMinutes(startMins),
        end: formatMinutes(endMins),
        startMinutesFromMidnight: startMins,
        endMinutesFromMidnight: endMins,
    };
}
// 1-indexed parts of day (out of 8 parts between 6:00 AM and 6:00 PM)
const RAHU_KALAM_PARTS = {
    0: 8, // Sunday: 4:30 PM - 6:00 PM
    1: 2, // Monday: 7:30 AM - 9:00 AM
    2: 7, // Tuesday: 3:00 PM - 4:30 PM
    3: 5, // Wednesday: 12:00 PM - 1:30 PM
    4: 6, // Thursday: 1:30 PM - 3:00 PM
    5: 4, // Friday: 10:30 AM - 12:00 PM
    6: 3, // Saturday: 9:00 AM - 10:30 AM
};
const YAMAGANDA_PARTS = {
    0: 5, // Sunday: 12:00 PM - 1:30 PM
    1: 4, // Monday: 10:30 AM - 12:00 PM
    2: 3, // Tuesday: 9:00 AM - 10:30 AM
    3: 2, // Wednesday: 7:30 AM - 9:00 AM
    4: 1, // Thursday: 6:00 AM - 7:30 AM
    5: 7, // Friday: 3:00 PM - 4:30 PM
    6: 6, // Saturday: 1:30 PM - 3:00 PM
};
const GULIKA_PARTS = {
    0: 7, // Sunday: 3:00 PM - 4:30 PM
    1: 6, // Monday: 1:30 PM - 3:00 PM
    2: 5, // Tuesday: 12:00 PM - 1:30 PM
    3: 4, // Wednesday: 10:30 AM - 12:00 PM
    4: 3, // Thursday: 9:00 AM - 10:30 AM
    5: 2, // Friday: 7:30 AM - 9:00 AM
    6: 1, // Saturday: 6:00 AM - 7:30 AM
};
export function calculateMuhurthaWindows(dayIndex, sunriseMinutes = 360, // 6:00 AM
sunsetMinutes = 1080, // 6:00 PM
isAstronomical = false) {
    const dayDuration = sunsetMinutes - sunriseMinutes;
    const partDuration = dayDuration / 8;
    const rahuPart = RAHU_KALAM_PARTS[dayIndex] || 1;
    const yamaPart = YAMAGANDA_PARTS[dayIndex] || 1;
    const gulikaPart = GULIKA_PARTS[dayIndex] || 1;
    const rahuStart = sunriseMinutes + (rahuPart - 1) * partDuration;
    const rahuEnd = sunriseMinutes + rahuPart * partDuration;
    const yamaStart = sunriseMinutes + (yamaPart - 1) * partDuration;
    const yamaEnd = sunriseMinutes + yamaPart * partDuration;
    const gulikaStart = sunriseMinutes + (gulikaPart - 1) * partDuration;
    const gulikaEnd = sunriseMinutes + gulikaPart * partDuration;
    // Abhijit Muhurta: 8th Muhurta out of 15 daytime muhurtas (midday)
    const muhurtaDuration = dayDuration / 15;
    const abhijitStart = sunriseMinutes + 7 * muhurtaDuration;
    const abhijitEnd = sunriseMinutes + 8 * muhurtaDuration;
    // Brahma Muhurta: 2 Muhurtas (96 mins) before sunrise to 1 Muhurta (48 mins) before sunrise
    const brahmaStart = sunriseMinutes - 96;
    const brahmaEnd = sunriseMinutes - 48;
    return {
        rahuKalam: createInterval(rahuStart, rahuEnd),
        yamaganda: createInterval(yamaStart, yamaEnd),
        gulikaKalam: createInterval(gulikaStart, gulikaEnd),
        abhijitMuhurta: createInterval(abhijitStart, abhijitEnd),
        brahmaMuhurta: createInterval(brahmaStart, brahmaEnd),
        calculationMode: isAstronomical ? 'ASTRONOMICAL' : 'STANDARDIZED_FALLBACK',
        source: isAstronomical ? 'LOCAL_SUNRISE_SUNSET' : 'EQUAL_DAYLIGHT_DIVISION',
    };
}
