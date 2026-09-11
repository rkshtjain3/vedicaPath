import { TimelinePeriod } from '../types.js';
import { calculateDurationDays, toIsoString } from '../shared/date-utils.js';
import { buildMahadashaLordContext } from '../dasha/mahadasha-context.js';
import { buildAntardashaLordContext } from '../dasha/antardasha-context.js';
import { buildPratyantardashaLordContext } from '../dasha/pratyantardasha-context.js';
import { mapLordContextToTimingEvidence } from '../dasha/dasha-evidence-mapper.js';

export function convertDashaPeriodToTimelinePeriod(
  dashaPeriod: any,
  targetDate: Date,
  engineData: any
): TimelinePeriod {
  const level = dashaPeriod.level || 'MAHADASHA';
  const lord = String(dashaPeriod.lord).toUpperCase();
  const parentLord = dashaPeriod.parentLord ? String(dashaPeriod.parentLord).toUpperCase() : undefined;

  const startIso = toIsoString(dashaPeriod.start);
  const endIso = toIsoString(dashaPeriod.end);
  const durationDays = calculateDurationDays(startIso, endIso);

  const tMs = targetDate.getTime();
  const sMs = new Date(startIso).getTime();
  const eMs = new Date(endIso).getTime();

  const isCurrent = tMs >= sMs && tMs <= eMs;
  const isPast = eMs < tMs;
  const isFuture = sMs > tMs;

  const periodId = level === 'MAHADASHA'
    ? `MD-${lord}`
    : level === 'ANTARDASHA'
    ? `MD-${parentLord}-AD-${lord}`
    : `AD-${parentLord}-PD-${lord}`;

  let lordContext;
  if (level === 'MAHADASHA') {
    lordContext = buildMahadashaLordContext(lord, engineData);
  } else if (level === 'ANTARDASHA') {
    lordContext = buildAntardashaLordContext(lord, engineData);
  } else {
    lordContext = buildPratyantardashaLordContext(lord, engineData);
  }

  const evidence = mapLordContextToTimingEvidence(periodId, lordContext, engineData);

  const children: TimelinePeriod[] = [];
  if (dashaPeriod.children && Array.isArray(dashaPeriod.children)) {
    for (const child of dashaPeriod.children) {
      children.push(convertDashaPeriodToTimelinePeriod(child, targetDate, engineData));
    }
  }

  return {
    id: periodId,
    level,
    lord,
    parentLord,
    startDate: startIso,
    endDate: endIso,
    durationDays,
    isPast,
    isCurrent,
    isFuture,
    lordContext,
    evidence,
    children: children.length > 0 ? children : undefined,
  };
}
