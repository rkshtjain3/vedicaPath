# Historical Time & Daylight Saving Resolution Architecture

## Overview
Accurate planetary positions in sidereal Vedic astrology depend strictly on resolving local birth time into the exact Universal Time (UTC) instant when the birth occurred.

This document describes the historical time handling, IANA timezone resolution, daylight saving time (DST) transition handling, ambiguous local times, and non-existent local times in the system.

---

## 1. Local Time Resolution Pipeline
When a user inputs:
- Local Birth Date (`YYYY-MM-DD`)
- Local Birth Time (`HH:mm:ss`)
- Resolved IANA Timezone (`e.g. America/New_York`, `Asia/Kolkata`)

The `@vedica/shared` module invokes `resolveLocalTime(input, occurrencePref)`:

```ts
export type LocalTimeResolution =
  | { status: 'VALID'; instant: Date; utcInstant: UTCInstant }
  | { status: 'AMBIGUOUS'; possibleInstants: Date[]; warning: string; utcInstant: UTCInstant }
  | { status: 'NON_EXISTENT'; reason: string };
```

---

## 2. Daylight Saving Transitions (DST)

### Ambiguous Local Time (Fall-Back Jump)
During autumn DST fall-back transitions (e.g. 02:00 -> 01:00 in North America or Europe), a local time such as `01:30` occurs twice:
1. First in Daylight Saving Time (e.g. UTC-4)
2. Second in Standard Time (e.g. UTC-5)

**Resolution Policy**:
- The system returns `status: 'AMBIGUOUS'` along with the two possible UTC instants.
- The Web UI presents a prompt allowing the user to explicitly select the **1st Occurrence (Daylight Time)** or **2nd Occurrence (Standard Time)**.

### Non-Existent Local Time (Spring-Forward Jump)
During spring DST transitions (e.g. 02:00 -> 03:00 in North America or Europe), local clock time jumps forward, skipping an hour (e.g. `02:30` does not exist).

**Resolution Policy**:
- The system returns `status: 'NON_EXISTENT'`.
- Astrology calculation is **BLOCKED**.
- The Web UI renders an explicit alert banner informing the user that the entered local time did not exist on that date due to a DST transition.

---

## 3. UTC Instant Conversion
Once resolved, `getUTCInstant()` produces the canonical UTC instant used for Julian Day calculation in Swiss Ephemeris (`sweph.julday`):

```json
{
  "year": 1990,
  "month": 1,
  "day": 1,
  "hour": 5,
  "minute": 0,
  "second": 0,
  "decimalHour": 5.0,
  "isoString": "1990-01-01T05:00:00Z"
}
```
