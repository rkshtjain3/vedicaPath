# Zi Wei Dou Shu Methodology: `chinese-ziwei-v1`

## 1. Overview
`chinese-ziwei-v1` is a deterministic, explainable Chinese astrology engine implemented in `@vedica/ziwei-engine`. It operates strictly on documented classical rules of Zi Wei Dou Shu (紫微斗數) without mixing conflicting modern shortcut conventions.

---

## 2. Core Concepts & Astronomical Mapping

### 2.1 Birth Time Inputs & Stem-Branch Resolution
Input parameters:
- `birthLocalDate` (YYYY-MM-DD)
- `birthLocalTime` (HH:mm:ss)
- `timezone`
- `latitude` / `longitude`

The system calculates:
1. Solar Date & UTC Instant.
2. Lunar Month (1–12) and Lunar Day (1–30) using true astronomical solar term / lunar phase boundary resolution.
3. Birth Year Heavenly Stem (天干) and Earthly Branch (地支).
4. Birth Month Earthly Branch and Birth Hour Earthly Branch (Zi, Chou, Yin, Mao, Chen, Si, Wu, Wei, Shen, You, Xu, Hai).

---

## 3. The 12 Palaces (十二宮)

### 3.1 Palace List & Canonical Order
Starting from the **Life Palace (命宮)**, the 12 Palaces proceed in counter-clockwise order:

1. **Life / Self Palace (命宮 - Ming Gong)**: Core personality, intrinsic potential, physical constitution.
2. **Siblings Palace (兄弟宮 - Xiong Di Gong)**: Peer relationships, siblings, close collaborators.
3. **Spouse Palace (夫妻宮 - Fu Qi Gong)**: Marriage, romantic partnerships, spouse characteristics.
4. **Children Palace (子女宮 - Zi Nv Gong)**: Offspring, subordinates, creative progeny.
5. **Wealth Palace (財帛宮 - Cai Bo Gong)**: Financial inflow, wealth accumulation style, monetary management.
6. **Health Palace (疾厄宮 - Ji E Gong)**: Physical vulnerabilities, health tendencies, stress impact.
7. **Travel Palace (遷移宮 - Qian Yi Gong)**: Relocation, public image, overseas travel, external environment.
8. **Friends / Servants Palace (交友宮 - Jiao You Gong)**: Social circle, staff, broad public relations.
9. **Career Palace (官祿宮 - Guan Lu Gong)**: Profession, ambition, domain mastery, work style.
10. **Property Palace (田宅宮 - Tian Zhai Gong)**: Real estate, fixed assets, home sanctuary, ancestral inheritances.
11. **Fortune / Spirit Palace (福德宮 - Fu De Gong)**: Mental well-being, spiritual inclination, inner joy, karma.
12. **Parents Palace (父母宮 - Fu Mu Gong)**: Elders, mentors, institutional authority, parents.

### 3.2 Life Palace (Ming Gong) & Body Palace (Shen Gong) Determination
- **Life Palace Earthly Branch Index**:
  $$\text{Ming Branch} = (\text{Lunar Month Index} - \text{Hour Branch Index} + 12) \pmod{12}$$
  *(where Month 1 starts at Yin, Hour 1 Zi = 0)*
- **Body Palace Earthly Branch Index**:
  $$\text{Shen Branch} = (\text{Lunar Month Index} + \text{Hour Branch Index}) \pmod{12}$$

### 3.3 Palace Heavenly Stems (Five Tigers Chasing Stems 五虎遁)
Based on Birth Year Heavenly Stem:
- **Jia / Ji years**: Yin Palace starts with Bing (丙).
- **Yi / Geng years**: Yin Palace starts with Wu (戊).
- **Bing / Xin years**: Yin Palace starts with Geng (庚).
- **Ding / Ren years**: Yin Palace starts with Ren (壬).
- **Wu / Gui years**: Yin Palace starts with Jia (甲).

---

## 4. Five Elements Bureau (五行局 Wuxing Ju)

The Five Elements Bureau determines the core elemental energy (2, 3, 4, 5, 6) of the chart:
- **Water 2nd Bureau (水二局)**
- **Wood 3rd Bureau (木三局)**
- **Metal 4th Bureau (金四局)**
- **Earth 5th Bureau (土五局)**
- **Fire 6th Bureau (火六局)**

Calculated deterministically from the Heavenly Stem & Earthly Branch of the **Life Palace (命宮)** using the Na Yin (納音) 60-cycle element lookup.

---

## 5. Star Placement Rules (星曜配置)

### 5.1 14 Major Stars (十四主星)

#### 1. Zi Wei Star (紫微星 - Emperor)
Position determined by Lunar Day of Birth divided by Wuxing Ju Number:
- quotient and remainder determine offset from Yin/Chen/etc.

#### 2. Zi Wei Group (Northern Dipper Stars):
Positions fixed relative to Zi Wei Star:
- **Zi Wei (紫微)**
- **Tian Ji (天機)**: 1 palace counter-clockwise from Zi Wei.
- **Tai Yang (太陽)**: 3 palaces counter-clockwise from Zi Wei.
- **Wu Qu (武曲)**: 4 palaces counter-clockwise from Zi Wei.
- **Tian Tong (天同)**: 5 palaces counter-clockwise from Zi Wei.
- **Lian Zhen (廉貞)**: 8 palaces counter-clockwise from Zi Wei.

#### 3. Tian Fu Group (Southern Dipper Stars):
Tian Fu Star position is mirrored with Zi Wei across the Yin-Shen axis:
$$\text{Tian Fu Branch} = (4 - \text{Zi Wei Branch} + 12) \pmod{12}$$
Stars placed relative to Tian Fu:
- **Tian Fu (天府)**
- **Tai Yin (太陰)**: 1 palace clockwise from Tian Fu.
- **Tan Lang (貪狼)**: 2 palaces clockwise from Tian Fu.
- **Ju Men (巨門)**: 3 palaces clockwise from Tian Fu.
- **Tian Xiang (天相)**: 4 palaces clockwise from Tian Fu.
- **Tian Liang (天梁)**: 5 palaces clockwise from Tian Fu.
- **Qi Sha (七殺)**: 6 palaces clockwise from Tian Fu.
- **Po Jun (破軍)**: 10 palaces clockwise from Tian Fu.

---

## 6. Four Transformations (四化 Si Hua)

Four Transformations modify stars based on the Birth Year Heavenly Stem:

| Year Stem | Hua Lu (化祿) | Hua Quan (化權) | Hua Ke (化科) | Hua Ji (化忌) |
|---|---|---|---|---|
| **Jia (甲)** | Lian Zhen | Po Jun | Wu Qu | Tai Yang |
| **Yi (乙)** | Tian Ji | Tian Liang | Zi Wei | Tai Yin |
| **Bing (丙)** | Tian Tong | Tian Ji | Wen Chang | Lian Zhen |
| **Ding (丁)** | Tai Yin | Tian Tong | Tian Ji | Ju Men |
| **Wu (戊)** | Tan Lang | Tai Yin | Right Assistant (You Bi) | Tian Ji |
| **Ji (己)** | Wu Qu | Tan Lang | Tian Liang | Wen Qu |
| **Geng (庚)** | Tai Yang | Wu Qu | Tai Yin | Tian Tong |
| **Xin (辛)** | Ju Men | Tai Yang | Wu Qu | Wen Chang |
| **Ren (壬)** | Tian Liang | Zi Wei | Left Assistant (Zuo Fu) | Wu Qu |
| **Gui (癸)** | Po Jun | Ju Men | Tai Yin | Tan Lang |

---

## 7. Versioning & Determinism
- Protocol Version: `chinese-ziwei-v1`
- Calculation SHA-256 Hash generated from canonical inputs, Life Palace index, Wuxing Ju, and 14 Major Star positions.
