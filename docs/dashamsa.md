# D10 Dashamsa Divisional Chart & Career Cross-Chart Facts (`@vedica/divisional-chart-engine`)

The **D10 Dashamsa Divisional Engine** computes the 10th divisional chart (D10) from D1 Sidereal planetary longitudes and provides factual cross-chart career connections between D1 Natal Rashi and D10 Dashamsa charts.

---

## 1. D10 Dashamsa Mathematical Calculation & Sign Mapping

Each 30° zodiac sign is divided into **10 equal parts** of **3.0°**.

D10 sign sequence is governed by canonical Vedic astrology odd/even sign rules:

| Sign Category | D1 Signs (Rashi IDs) | Starting Dashamsa Sign |
| :--- | :--- | :--- |
| **Odd Signs (Visham)** | Aries (1), Gemini (3), Leo (5), Libra (7), Sagittarius (9), Aquarius (11) | **Same Sign** (1st sign from D1) |
| **Even Signs (Sama)** | Taurus (2), Cancer (4), Virgo (6), Scorpio (8), Capricorn (10), Pisces (12) | **9th Sign** counted from D1 sign |

### Mathematical Formula
For a normalized D1 sidereal longitude $L \in [0, 360)$:
1. D1 Sign Index: $S = \lfloor L / 30 \rfloor + 1 \in \{1, \dots, 12\}$
2. Longitude in D1 Sign: $deg = L \pmod{30}$
3. Division Size: $W = 30 / 10 = 3.0^\circ$
4. Division Index: $divIdx = \min(\lfloor deg / W \rfloor, 9) \in \{0, \dots, 9\}$
5. Division Number: $divNum = divIdx + 1 \in \{1, \dots, 10\}$
6. Starting Sign $S_{start}$:
   - Odd Sign: $S_{start} = S$
   - Even Sign: $S_{start} = ((S + 9 - 2) \pmod{12}) + 1 = ((S + 7) \pmod{12}) + 1$
7. D10 Sign: $S_{D10} = ((S_{start} + divNum - 2) \pmod{12}) + 1$
8. D10 Degree: $deg_{D10} = (deg - divIdx \times 3.0) \times 10 \in [0^\circ, 30^\circ)$

---

## 2. Whole Sign House System in D10

In D10 Dashamsa, house calculation uses **Whole Sign Houses**:
- **House 1**: The sign of the D10 Ascendant ($S_{D10\_Lagna}$).
- **House $H$**: Sign $((S_{D10\_Lagna} + H - 2) \pmod{12}) + 1$.

---

## 3. D1 vs D10 Factual Comparison (`sameD1D10Sign`)

When a planet or Lagna occupies the same zodiac sign in D1 Rashi and D10 Dashamsa, the engine flags `sameD1D10Sign = true`.

> [!NOTE]
> Standard Vedic terminology reserves the term **Vargottama** strictly for D1 vs D9 Navamsa sign match. For D10, the engine uses the explicit, unambiguous property `sameD1D10Sign: boolean`.

---

## 4. Career Cross-Chart Facts Framework

The `calculateCareerCrossChartFacts()` module extracts factual indicators across D1 and D10 charts:
1. **D1 Career Facts**: 10th house sign/lord/occupants, 6th/11th lords, key significators (Sun, Saturn, Jupiter).
2. **D10 Career Facts**: D10 Lagna/lord, D10 10th house/lord, 6th/11th lords in D10.
3. **Cross-Chart Matrix**: Factual placement comparison for Sun, Saturn, Jupiter, D1 10th Lord, and D10 10th Lord across D1 and D10.
4. **Traceable "WHY?" Evidence**: Every relationship provides a step-by-step calculation trace string array.

---

## 5. Non-Predictive Scope Policy

- **No AI / LLM Generation**: Output consists of pure mathematical facts derived deterministically.
- **No Predictive Statements**: Does not issue future predictions or generic career horoscopes.
