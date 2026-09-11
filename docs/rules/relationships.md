# Relationships Domain Rules Specification

## Overview
Relationship rules evaluate relationship activity, stability, harmony, and challenges based on 7th house, 7th lord, Venus, and malefic influences.

---

### REL-001: 7th Lord Dignity & Placement
- **Conditions**: 7th lord has strong dignity (`EXALTED`, `OWN_SIGN`, `MOOLATRIKONA`) OR is placed in Kendra/Trikona (1, 4, 5, 7, 9, 10).
- **Effects**: `RelationshipActivity +2`, `Stability +2`.
- **Evidence**: `RELATIONSHIP_LORD_DIGNITY`.

---

### REL-002: Venus Placement & Dignity
- **Conditions**: Venus (Karaka of relationships) has strong dignity OR is placed in favorable houses (1, 4, 5, 7, 9, 10, 11).
- **Effects**: `Harmony +2`, `RelationshipActivity +1`.
- **Evidence**: `VENUS_RELATIONSHIP_KARAKA`.

---

### REL-003: Dasha Connection to 7th House
- **Conditions**: Active Mahadasha or Antardasha lord is connected to 7th house or 7th lord.
- **Effects**: `RelationshipActivity +2`, `Stability +1`.
- **Evidence**: `DASHA_RELATIONSHIP_CONNECTION`.

---

### REL-004: Malefic Influence on 7th House/Lord
- **Conditions**: Malefic planets (Mars, Saturn, Rahu, Ketu) occupy 7th house, aspect 7th house, or aspect 7th lord.
- **Effects**: `Challenges +2`, `Stability -1`.
- **Evidence**: `MALEFIC_OCCUPIES_7TH_HOUSE`, `MALEFIC_ASPECTS_7TH_HOUSE`, or `MALEFIC_ASPECTS_7TH_LORD`.
