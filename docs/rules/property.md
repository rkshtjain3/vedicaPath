# Property Domain Rules Specification

## Overview
Property rules evaluate property activity, acquisition potential, stability, and obstacles based on 4th house, 4th lord, Mars (Karaka for land), and Trik house lords.

---

### PROP-001: 4th Lord Dignity & Placement
- **Conditions**: 4th lord has strong dignity (`EXALTED`, `OWN_SIGN`, `MOOLATRIKONA`) OR is placed in Kendra/Trikona (1, 4, 5, 7, 9, 10).
- **Effects**: `PropertyActivity +2`, `AcquisitionPotential +2`, `Stability +2`.
- **Evidence**: `PROPERTY_LORD_DIGNITY`.

---

### PROP-002: Mars Property Karaka Connection
- **Conditions**: Mars (Bhoomi Karaka) connects to 4th house or 4th lord (occupation, lordship, aspect, or conjunction).
- **Effects**: `PropertyActivity +2`, `AcquisitionPotential +1`.
- **Evidence**: `MARS_PROPERTY_KARAKA_CONNECTION`.

---

### PROP-003: Dasha Connection to 4th House
- **Conditions**: Active Mahadasha or Antardasha lord is connected to 4th house or 4th lord.
- **Effects**: `PropertyActivity +2`, `AcquisitionPotential +2`.
- **Evidence**: `DASHA_PROPERTY_CONNECTION`.

---

### PROP-004: Obstacles to Property
- **Conditions**: Trik house lords (6th, 8th, 12th lords) occupy or aspect 4th house or 4th lord.
- **Effects**: `Obstacles +2`, `Stability -1`.
- **Evidence**: `TRIK_LORD_OCCUPIES_4TH_HOUSE`, `TRIK_LORD_ASPECTS_4TH_HOUSE`, or `TRIK_LORD_ASPECTS_4TH_LORD`.
