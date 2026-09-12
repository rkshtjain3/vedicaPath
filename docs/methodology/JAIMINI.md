# Vedica Jaimini Jyotish Methodology Specification (`personal-jaimini-v1`)

## 1. Overview & Architectural Philosophy

The **Jaimini Jyotish Subsystem** (`personal-jaimini-v1`) in Vedica provides deterministic, explainable, and evidence-backed astrological analysis based on Maharishi Jaimini's *Upadesa Sutras* and K.N. Rao's analytical tradition.

Vedica implements Jaimini Jyotish as an independent, modular layer downstream of `@vedica/astrology-core`. It consumes raw D1/D9 planetary longitudes without modifying existing Parashari calculation pipelines, Vimshottari Dashas, Shadbala, Ashtakavarga, or divisional chart calculations.

---

## 2. Methodology Versioning & Configuration

- **Subsystem Version**: `personal-jaimini-v1`
- **Supported Schemes**:
  - `7_KARAKA` (Default): 7 non-outer planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn).
  - `8_KARAKA`: 8 planets (includes Rahu, where Rahu degree is evaluated as `30° - (longitude % 30)` due to retrograde motion).
- **Arudha Exception Rule**: `CLASSICAL_10TH_SHIFT` (If raw Arudha falls in 1st or 7th house from source house, shift 10 houses forward).
- **Rashi Drishti Rule**: `CLASSICAL_MOVABLE_FIXED_DUAL` (Sign aspects).

---

## 3. Chara Karaka System

### 3.1 Ranking Principles
Planets are ranked in descending order based on their effective degree within their occupied sign (`0° 0' 0"` to `29° 59' 59"`).

| Rank (7-Karaka) | Role | Full Name | Significations |
| :---: | :---: | :--- | :--- |
| **1** | **AK** | Atmakaraka (आत्मकारक) | Soul significator, life purpose, spiritual evolution, supreme inner guide |
| **2** | **AmK** | Amatyakaraka (अमात्यकारक) | Career, profession, administrative authority, societal standing |
| **3** | **BK** | Bhratrikaraka (भ्रातृकारक) | Mentors, spiritual guides, siblings, courage, enterprise |
| **4** | **MK** | Matrikaraka (मातृकारक) | Mother, emotional stability, heart contentment, nurturing |
| **5** | **PK** | Putrakaraka (पुत्रकारक) | Children, higher intelligence, creativity, wisdom |
| **6** | **GK** | Gnatikaraka (ज्ञातिकारक) | Karmic tests, competition, health vulnerabilities, obstacles |
| **7** | **DK** | Darakaraka (दाराकारक) | Spouse, life partner, intimate bonds, commercial alliances |

*In the 8-Karaka scheme, **Pitrukaraka (PiK)** is inserted at rank 5 for father/lineage, making Putrakaraka rank 6, Gnatikaraka rank 7, and Darakaraka rank 8.*

### 3.2 Rahu Degree Convention (8-Karaka)
Because Rahu moves retrograde, its traversal through a sign is measured from `30°` down to `0°`. Therefore:
$$\text{Effective Degree}_{\text{Rahu}} = 30^\circ - (\text{Longitude}_{\text{Rahu}} \bmod 30^\circ)$$

---

## 4. Karakamsha & Swamsha Analysis

1. **Atmakaraka Position**: Identify the planet assigned as Atmakaraka (AK).
2. **Karakamsha Sign**: Determine the Navamsa (D9) sign occupied by AK.
3. **House Placement in D1**: Calculate the house index of the Karakamsha sign relative to the D1 Lagna.
4. **Swamsha Condition**: If the Navamsa Lagna sign is identical to the Karakamsha sign, **Swamsha** is formed, conferring exceptional spiritual and creative capabilities.

---

## 5. Jaimini Rashi Drishti (Sign Aspects)

Jaimini sign aspects operate independently of Parashari Graha (planetary) aspects. Signs themselves cast aspects upon other signs:

1. **Movable Signs** (Aries, Cancer, Libra, Capricorn):
   - Aspect all **Fixed Signs** (Taurus, Leo, Scorpio, Aquarius) **except** the adjacent Fixed sign.
   - Example: Aries aspects Leo, Scorpio, Aquarius (excluding adjacent Taurus).
2. **Fixed Signs** (Taurus, Leo, Scorpio, Aquarius):
   - Aspect all **Movable Signs** (Aries, Cancer, Libra, Capricorn) **except** the adjacent Movable sign.
   - Example: Taurus aspects Cancer, Libra, Capricorn (excluding adjacent Aries).
3. **Dual Signs** (Gemini, Virgo, Sagittarius, Pisces):
   - Aspect all other **Dual Signs**.
   - Example: Gemini aspects Virgo, Sagittarius, Pisces.

---

## 6. Arudha Padas (A1–A12, AL, UL)

### 6.1 Calculation Formula
For any house $H$ (1 to 12):
1. Identify the sign $S_H$ of house $H$ and its ruling planet $L_H$.
2. Calculate the distance in signs $D$ from $S_H$ to the sign occupied by $L_H$ (counting inclusively).
3. Count $D$ signs forward from $L_H$'s sign to obtain the raw Arudha sign $R$.

### 6.2 Classical Exception Rules (Brihat Parasara Hora Shastra & Jaimini Sutras)
- **1st House Exception**: If raw Arudha $R$ falls in $S_H$ (distance offset = 1 house), shift 10 houses forward from $R$ (placing the Pada in the 10th house from $S_H$).
- **7th House Exception**: If raw Arudha $R$ falls in the 7th house from $S_H$ (distance offset = 7 houses), shift 10 houses forward from $R$ (placing the Pada in the 4th house from $S_H$).

*Key Padas*:
- **Arudha Lagna (AL)**: Arudha of 1st house (public image, societal status).
- **Upapada Lagna (UL)**: Arudha of 12th house (marriage, spouse family background).

---

## 7. Chara Dasha System (K.N. Rao Method)

### 7.1 Sequence & Direction
- If Lagna sign is **Direct** (Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius), Dasha progresses clockwise starting from Lagna.
- If Lagna sign is **Reverse** (Cancer, Leo, Virgo, Capricorn, Aquarius, Pisces), Dasha progresses counter-clockwise starting from Lagna.

### 7.2 Duration Calculation
For a sign $S$ ruled by lord $L$:
- If $S$ is a **Direct** sign: Count from $S$ to $L$'s sign clockwise, minus 1 year.
- If $S$ is a **Reverse** sign: Count from $S$ to $L$'s sign counter-clockwise, minus 1 year.
- If $L$ is in $S$ (own sign), duration is 12 years. If distance calculation yields 0, duration is 12 years.

### 7.3 Sub-Periods (Antardashas)
Each Mahadasha sign is subdivided into 12 sub-periods of equal duration (each lasting $\frac{\text{Mahadasha Years}}{12}$ years). Sub-period sequence begins from the Mahadasha sign itself, moving direct or reverse according to sign quality.

---

## 8. Deterministic Jaimini Yogas

1. **Jaimini AK-AmK Raja Yoga**: Mutual aspect or conjunction between Atmakaraka (AK) and Amatyakaraka (AmK) in D1, D9, or Arudha Lagna.
2. **Jaimini Dhana Yoga**: Association of Amatyakaraka (AmK), 5th lord, or 11th lord with Arudha Lagna (AL).
3. **Karakamsha Benefic Aspect Yoga**: Rashi Drishti aspect of natural benefics (Jupiter, Venus, Mercury) on the Karakamsha sign.
