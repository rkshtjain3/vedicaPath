# Vimshottari Dasha Engine Specification

## Overview
Vimshottari Dasha is the primary 120-year planetary period system used in Vedic Astrology to determine timing of life events based on the Moon's sidereal longitude at birth.

## 1. Canonical Vimshottari Cycle & Durations
The 120-year cycle consists of 9 planetary lords in exact fixed order:

1. **Ketu**: 7 years
2. **Venus**: 20 years
3. **Sun**: 6 years
4. **Moon**: 10 years
5. **Mars**: 7 years
6. **Rahu**: 18 years
7. **Jupiter**: 16 years
8. **Saturn**: 19 years
9. **Mercury**: 17 years

**Total Cycle Duration**: 120 years ($7 + 20 + 6 + 10 + 7 + 18 + 16 + 19 + 17 = 120$)

## 2. 27-Nakshatra Lord Mapping
Each of the 27 Nakshatras ($13^\circ 20'$ or $13.333333333333334^\circ$ each) maps to one of the 9 lords in the canonical sequence, repeating 3 times:

| Nakshatra Index | Nakshatra Name | Ruler / Lord |
| :--- | :--- | :--- |
| 1 | Ashwini | Ketu |
| 2 | Bharani | Venus |
| 3 | Krittika | Sun |
| 4 | Rohini | Moon |
| 5 | Mrigashira | Mars |
| 6 | Ardra | Rahu |
| 7 | Punarvasu | Jupiter |
| 8 | Pushya | Saturn |
| 9 | Ashlesha | Mercury |
| 10 | Magha | Ketu |
| 11 | Purva Phalguni | Venus |
| 12 | Uttara Phalguni | Sun |
| 13 | Hasta | Moon |
| 14 | Chitra | Mars |
| 15 | Swati | Rahu |
| 16 | Vishakha | Jupiter |
| 17 | Anuradha | Saturn |
| 18 | Jyeshtha | Mercury |
| 19 | Mula | Ketu |
| 20 | Purva Ashadha | Venus |
| 21 | Uttara Ashadha | Sun |
| 22 | Shravana | Moon |
| 23 | Dhanishta | Mars |
| 24 | Shatabhisha | Rahu |
| 25 | Purva Bhadrapada | Jupiter |
| 26 | Uttara Bhadrapada | Saturn |
| 27 | Revati | Mercury |

## 3. Birth Dasha Balance Formula
Let $L_{\text{Moon}}$ be the Moon's exact sidereal longitude ($0^\circ - 360^\circ$).

1. **Nakshatra Index**:
   $$I_{\text{Nak}} = \lfloor \frac{L_{\text{Moon}}}{13.333333333333334^\circ} \rfloor$$
2. **Position within Nakshatra**:
   $$P_{\text{Nak}} = L_{\text{Moon}} - (I_{\text{Nak}} \times 13.333333333333334^\circ)$$
3. **Progress & Remaining Percentages**:
   $$\text{Progress \%} = (\frac{P_{\text{Nak}}}{13.333333333333334^\circ}) \times 100$$
   $$\text{Remaining \%} = 100 - \text{Progress \%}$$
4. **Starting Mahadasha Balance at Birth**:
   Let $D_{\text{Maha, full}}$ be the total years assigned to the Nakshatra Lord.
   $$\text{Balance (Years)} = D_{\text{Maha, full}} \times (\frac{\text{Remaining \%}}{100})$$

## 4. Proportional Sub-Dasha Formulas

### Antardasha (Level 2)
For a Mahadasha lord $M$ with full duration $D_M$ years, the duration of Antardasha lord $A$ (with standard duration $D_A$) is:
$$D_{\text{Antar}} (\text{years}) = \frac{D_M \times D_A}{120}$$

### Pratyantardasha (Level 3)
For an Antardasha duration $D_{\text{Antar}}$ years, the duration of Pratyantardasha lord $P$ (with standard duration $D_P$) is:
$$D_{\text{Pratyantar}} (\text{years}) = \frac{D_{\text{Antar}} \times D_P}{120}$$

## 5. Date Precision & Time Arithmetic Policy
- **Julian Year Basis**: $1 \text{ Dasha Year} = 365.25 \text{ days} = 31,557,600,000 \text{ milliseconds}$.
- **Boundary Precision**: All period boundaries (`start` and `end`) are stored as exact UTC `Date` timestamps (epoch milliseconds).
- **Timezones**: Display conversion happens only in presentation components formatted as `DD/MM/YYYY`.
