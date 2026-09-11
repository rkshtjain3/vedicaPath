function dateToUTCInstant(d) {
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const hour = d.getUTCHours();
    const minute = d.getUTCMinutes();
    const second = d.getUTCSeconds();
    const decimalHour = hour + minute / 60 + second / 3600;
    const isoString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}Z`;
    return {
        year,
        month,
        day,
        hour,
        minute,
        second,
        decimalHour,
        isoString,
    };
}
/**
 * Formats a given UTC Date into local YYYY-MM-DD HH:mm:ss for specified IANA timezone.
 */
export function formatInTimezone(date, timezone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const m = {};
    for (const p of parts) {
        if (p.type !== 'literal') {
            m[p.type] = p.value;
        }
    }
    const h = m.hour === '24' ? '00' : m.hour.padStart(2, '0');
    const min = m.minute.padStart(2, '0');
    const s = m.second ? m.second.padStart(2, '0') : '00';
    const monthPadded = m.month.padStart(2, '0');
    const dayPadded = m.day.padStart(2, '0');
    const dateStr = `${m.year}-${monthPadded}-${dayPadded}`;
    const timeStr = `${h}:${min}:${s}`;
    return { dateStr, timeStr };
}
/**
 * Resolves local birth time in specified IANA timezone, detecting DST ambiguous or non-existent times.
 */
export function resolveLocalTime(input, occurrencePref = 'FIRST') {
    const [yearStr, monthStr, dayStr] = input.dateOfBirth.split('-');
    const [hourStr, minuteStr, secondStr] = input.timeOfBirth.split(':');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const second = secondStr ? parseInt(secondStr, 10) : 0;
    const targetDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const targetTimePrefix = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    // Candidate UTC timestamp base
    const localAsUtcMs = Date.UTC(year, month - 1, day, hour, minute, second);
    const matchingInstants = [];
    // Search window: ±15 hours (-900 to +900 minutes) around candidate to cover all world timezones
    for (let offsetMinutes = -900; offsetMinutes <= 900; offsetMinutes++) {
        const candidateMs = localAsUtcMs + offsetMinutes * 60 * 1000;
        const candidateDate = new Date(candidateMs);
        try {
            const formatted = formatInTimezone(candidateDate, input.timezone);
            if (formatted.dateStr === targetDateStr && formatted.timeStr.startsWith(targetTimePrefix)) {
                if (!matchingInstants.some((inst) => inst.getTime() === candidateDate.getTime())) {
                    matchingInstants.push(candidateDate);
                }
            }
        }
        catch {
            // Ignore invalid timezone strings
        }
    }
    if (matchingInstants.length === 0) {
        return {
            status: 'NON_EXISTENT',
            reason: 'This local time did not exist due to a daylight-saving transition.',
        };
    }
    if (matchingInstants.length === 1) {
        return {
            status: 'VALID',
            instant: matchingInstants[0],
            utcInstant: dateToUTCInstant(matchingInstants[0]),
        };
    }
    // Multiple matching instants (ambiguous DST time)
    const chosenInstant = occurrencePref === 'SECOND' ? matchingInstants[matchingInstants.length - 1] : matchingInstants[0];
    return {
        status: 'AMBIGUOUS',
        possibleInstants: matchingInstants,
        warning: 'This local time occurred more than once because of a daylight-saving transition.',
        utcInstant: dateToUTCInstant(chosenInstant),
    };
}
/**
 * Calculates UTC instant from local date, time, and IANA timezone.
 * Handles daylight saving and timezone offsets correctly.
 */
export function getUTCInstant(input) {
    const resolution = resolveLocalTime(input);
    if (resolution.status === 'NON_EXISTENT') {
        // Fallback safely to simple conversion if strictly non-existent
        const [yearStr, monthStr, dayStr] = input.dateOfBirth.split('-');
        const [hourStr, minuteStr, secondStr] = input.timeOfBirth.split(':');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        const second = secondStr ? parseInt(secondStr, 10) : 0;
        return dateToUTCInstant(new Date(Date.UTC(year, month - 1, day, hour, minute, second)));
    }
    return resolution.utcInstant;
}
//# sourceMappingURL=time.js.map