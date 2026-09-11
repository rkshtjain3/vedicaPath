# Career Domain Rules Specification

## Overview
Career rules evaluate professional growth, stability, career changes, responsibility, and challenges based on 10th house, 10th lord, planetary aspects, and active Vimshottari Dashas.

---

### CAREER-001: 10th Lord Strong Dignity
- **Conditions**: 10th house lord has `EXALTED`, `OWN_SIGN`, or `MOOLATRIKONA` dignity.
- **Effects**: `Growth +2`, `Stability +2`.
- **Evidence**: `HOUSE_LORD_DIGNITY` (house: 10, lord, dignity).
- **Astrological Rationale**: A strong 10th lord signifies strong vocational foundation and career resilience.

---

### CAREER-002: Mahadasha Lord Career Connection
- **Conditions**: Active Mahadasha lord is connected to 10th house, 10th lord, or 10th house occupants.
- **Effects**: `Change +2`, `Growth +1`.
- **Evidence**: `MAHADASHA_CAREER_CONNECTION` + connection vector details.
- **Astrological Rationale**: Major period lord activation of 10th house triggers significant career developments.

---

### CAREER-003: Antardasha Lord Career Connection
- **Conditions**: Active Antardasha lord is connected to 10th house, 10th lord, or 10th house occupants.
- **Effects**: `Change +1`, `Growth +1`.
- **Evidence**: `ANTARDASHA_CAREER_CONNECTION` + connection vector details.
- **Astrological Rationale**: Sub-period activation provides specific timing focus for vocational activities.

---

### CAREER-004: Jupiter Aspecting 10th House
- **Conditions**: Jupiter casts 5th, 7th, or 9th house aspect onto 10th house.
- **Effects**: `Growth +2`.
- **Evidence**: `JUPITER_ASPECT_CAREER_HOUSE`.
- **Astrological Rationale**: Jupiter's benefic aspect expands opportunities and professional recognition.

---

### CAREER-005: Saturn Aspecting or Occupying 10th House
- **Conditions**: Saturn occupies 10th house or casts 3rd, 7th, or 10th aspect onto 10th house.
- **Effects**: `Responsibility +2`, `Challenges +1`.
- **Evidence**: `SATURN_OCCUPIES_CAREER_HOUSE` or `SATURN_ASPECTS_CAREER_HOUSE`.
- **Astrological Rationale**: Saturn demands discipline, hard work, and responsibility in public status.
