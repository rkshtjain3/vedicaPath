export function filterTimelineByDateWindow(periods, windowStart, windowEnd) {
    const ws = windowStart.getTime();
    const we = windowEnd.getTime();
    const filtered = [];
    for (const p of periods) {
        const ps = new Date(p.startDate).getTime();
        const pe = new Date(p.endDate).getTime();
        // Check overlap
        if (pe >= ws && ps <= we) {
            const cloned = { ...p };
            if (p.children && p.children.length > 0) {
                cloned.children = filterTimelineByDateWindow(p.children, windowStart, windowEnd);
            }
            filtered.push(cloned);
        }
    }
    return filtered;
}
export function findCurrentActiveHierarchy(periods) {
    const currentMaha = periods.find((p) => p.isCurrent);
    if (!currentMaha)
        return {};
    const currentAntar = currentMaha.children?.find((c) => c.isCurrent);
    const currentPrat = currentAntar?.children?.find((c) => c.isCurrent);
    return {
        mahadasha: currentMaha,
        antardasha: currentAntar,
        pratyantardasha: currentPrat,
    };
}
//# sourceMappingURL=period-tree.js.map