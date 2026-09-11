# Name-Based Numerology Engine & Profile Name Specification

## 1. Overview
The Personal Vedic Astrology & Numerology Analyzer supports optional **Full Name** profile inputs. The Full Name is used exclusively for profile identification and name-based numerology calculations.

---

## 2. Astrology Isolation Guarantee
- **Zero Impact on Astrology**: The person's name is strictly isolated from planetary longitudes, Lagna, Nakshatras, Vimshottari Dasha, Divisional Charts (D1, D9, D10), Ashtakavarga (BAV & SAV), Shadbala (6-fold strength), Rules Engine, Timing Engine, and Interpretation Engine.
- **Reproducibility Fingerprint Invariance**: The input fingerprint (`calculateInputFingerprint`) and calculation reproducibility hash (`calculateReproducibilityHash`) depend solely on date of birth, time of birth, latitude, longitude, timezone, resolved UTC instant, and calculation profile version. Changing the name while keeping birth data identical produces a 100% identical astrology output and hash.

---

## 3. Name Normalization Rules
1. Converts input string to uppercase.
2. Strips spaces, hyphens (`-`), apostrophes (`'`), periods (`.`), and any non-alphabetic characters.
3. Example:
   - Input: `"Rakshit Jain"` → Normalized: `"RAKSHITJAIN"`
   - Input: `"Rakshit-Jain."` → Normalized: `"RAKSHITJAIN"`

---

## 4. Pythagorean Letter Mapping Schema
System Profile: `PERSONAL_NUMEROLOGY_V1`

```text
1 → A, J, S
2 → B, K, T
3 → C, L, U
4 → D, M, V
5 → E, N, W
6 → F, O, X
7 → G, P, Y
8 → H, Q, Z
9 → I, R
```

---

## 5. Calculations & Master Number Policy

### Expression Number (Destiny Number)
- **Formula**: Sum of Pythagorean values for ALL letters in the normalized name.
- **Reduction**: Digits are summed iteratively until a single digit (1–9) or Master Number (11, 22, 33) is reached.

### Soul Urge Number (Heart's Desire)
- **Formula**: Sum of Pythagorean values for VOWELS (`A, E, I, O, U`).
- **Y Policy (`PERSONAL_NUMEROLOGY_V1`)**: `Y` is treated as a consonant by default (configurable per profile).

### Personality Number
- **Formula**: Sum of Pythagorean values for CONSONANTS.

### Master Number Preservation
- Numbers `11`, `22`, and `33` are preserved as Master Numbers during intermediate and final reduction steps when `preserveMasterNumbers: true`.

---

## 6. Transparency & Traceability Output
Every name numerology result contains:
- `rawSum`: Unreduced initial sum of values.
- `letterBreakdown`: Array of `{ letter, value, type }` objects for every character.
- `includedLetters`: Array of letters used in the calculation.
- `formulaSteps`: Step-by-step mathematical reduction trace detailing each digit sum and expression.
