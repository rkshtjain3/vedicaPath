export function toIsoString(dateInput) {
    const d = new Date(dateInput);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}
export function calculateDurationDays(start, end) {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diffMs = Math.max(0, e - s);
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
export function isDateInRange(targetDate, startDate, endDate) {
    const t = new Date(targetDate).getTime();
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    return t >= s && t <= e;
}
export function addYears(date, years) {
    const d = new Date(date.getTime());
    d.setFullYear(d.getFullYear() + years);
    return d;
}
//# sourceMappingURL=date-utils.js.map