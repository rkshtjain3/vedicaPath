import { generateMahadashas } from '@vedica/dasha-engine';
import { convertDashaPeriodToTimelinePeriod } from './period-generator.js';
import { filterTimelineByDateWindow } from './period-tree.js';
import { addYears } from '../shared/date-utils.js';
export function buildMultiLevelTimeline(engineData, options) {
    const targetDate = options?.currentDate ? new Date(options.currentDate) : new Date();
    const historyYears = options?.historyYears ?? 10;
    const futureYears = options?.futureYears ?? 10;
    const ast = engineData.astrology || engineData;
    let rawMahadashas = [];
    if (engineData.dasha?.mahadashas) {
        rawMahadashas = engineData.dasha.mahadashas;
    }
    else if (ast.planets) {
        const moon = ast.planets.find((p) => p.planet?.toLowerCase() === 'moon');
        const moonLong = moon?.longitude || moon?.degree || 0;
        const birthInstant = ast.birthTime?.utcInstant ? new Date(ast.birthTime.utcInstant) : new Date('1990-01-01T00:00:00Z');
        const calculated = generateMahadashas({ birthInstant, moonLongitude: moonLong });
        rawMahadashas = calculated.mahadashas;
    }
    const allMahadashas = rawMahadashas.map((m) => convertDashaPeriodToTimelinePeriod(m, targetDate, engineData));
    const windowStart = addYears(targetDate, -historyYears);
    const windowEnd = addYears(targetDate, futureYears);
    const boundedTimeline = filterTimelineByDateWindow(allMahadashas, windowStart, windowEnd);
    return {
        targetDate,
        allMahadashas,
        boundedTimeline,
    };
}
//# sourceMappingURL=timeline-builder.js.map