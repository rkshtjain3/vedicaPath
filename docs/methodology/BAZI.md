# Vedica BaZi / Four Pillars of Destiny Methodology Specification (`chinese-bazi-v1`)

## 1. Overview & Architecture

The **BaZi / Four Pillars of Destiny Engine** (`chinese-bazi-v1`) in Vedica provides a deterministic, reproducible, and explainable Chinese metaphysical calculation system.

BaZi operates as an independent, decoupled module in `@vedica/bazi-engine`. It consumes exact UTC birth instants and location coordinates to resolve tropical Sun ecliptic solar term boundaries (Jie Qi 节气), 60 Sexagenary Ganzhi cycles (六十干支), Day Master (日主) strength, Five Element balance (五行), Ten Gods (十神), Earthly Branch structural relationships, Luck Pillars (Da Yun 大运), and Annual cycles (流年).

It does **NOT** modify or contaminate any Vedic astrology engine, planetary longitude, Panchanga, Jaimini, Shadbala, or Ashtakavarga calculation.

---

## 2. Methodology Versioning & Configurations

- **Subsystem Version**: `chinese-bazi-v1`
- **Year Boundary**: `LI_CHUN_315` (Solar year begins at *Li Chun* 立春, Sun = 315° tropical ecliptic longitude).
- **Month Boundary**: `12_SOLAR_TERMS_JIE_QI` (Determined by 12 principal solar terms at 30° steps starting from Li Chun).
- **Day Boundary**: `SEXAGENARY_JDN_EPOCH` (Julian Day Number epoch offset: $(\lfloor\text{JDN} + 0.5\rfloor + 49) \bmod 60$).
- **Hour Boundary**: `12_DOUBLE_HOURS_ZI_23:00` (Zi Hour starts at 23:00; 23:00+ shifts to next day's Ganzhi cycle in Late Zi convention).
- **Da Yun Conversion**: `3_DAYS_EQUALS_1_YEAR` (Solar term distance divided by 3).

---

## 3. Four Pillars (四柱) Determination

### 3.1 Year Pillar (年柱)
- Measured relative to Li Chun (Sun = 315°). If born before Li Chun in Jan/Feb, the solar year belongs to the previous Gregorian year.
- $\text{Year Ganzhi Index} = (\text{Solar Year} - 4) \bmod 60$.

### 3.2 Month Pillar (月柱)
- Determined by tropical Sun longitude across the 12 Solar Months (Jie Qi):
  - **Yin (寅)**: Li Chun (315°) to Jing Zhe (345°)
  - **Mao (卯)**: Jing Zhe (345°) to Qing Ming (15°)
  - **Chen (辰)**: Qing Ming (15°) to Li Xia (45°)
  - **Si (巳)**: Li Xia (45°) to Mang Zhong (75°)
  - **Wu (午)**: Mang Zhong (75°) to Xiao Shu (105°)
  - **Wei (未)**: Xiao Shu (105°) to Li Qiu (135°)
  - **Shen (申)**: Li Qiu (135°) to Bai Lu (165°)
  - **You (酉)**: Bai Lu (165°) to Han Lu (195°)
  - **Xu (戌)**: Han Lu (195°) to Li Dong (225°)
  - **Hai (亥)**: Li Dong (225°) to Da Xue (255°)
  - **Zi (子)**: Da Xue (255°) to Xiao Han (285°)
  - **Chou (丑)**: Xiao Han (285°) to Li Chun (315°)
- Month Stem is derived via the **Five Tiger Seek Method (五虎遁)** starting from Yin Month.

### 3.3 Day Pillar (日柱) & Day Master (日主)
- Calculated via Julian Day Number (JDN) sexagenary cycle.
- The Heavenly Stem of the Day Pillar is designated as the **Day Master (日主)**.

### 3.4 Hour Pillar (时柱)
- Divided into 12 double-hours (Shi Chen 十二时辰) starting at 23:00 (Zi Hour).
- Hour Stem is derived via the **Five Rat Seek Method (五鼠遁)** based on the Day Stem.

---

## 4. Ten Gods (十神) Classification

Relative to the Day Master (DM):

| Target Element Relation | Same Polarity | Opposite Polarity | Category |
| :--- | :--- | :--- | :--- |
| **Same Element** | Friend (比肩) | Rob Wealth (劫财) | Self |
| **DM Produces Target** | Eating God (食神) | Hurting Officer (伤官) | Output |
| **DM Controls Target** | Indirect Wealth (偏财) | Direct Wealth (正财) | Wealth |
| **Target Controls DM** | Seven Killings (七杀) | Direct Officer (正官) | Officer |
| **Target Produces DM** | Indirect Resource (偏印) | Direct Resource (正印) | Resource |

---

## 5. Branch Structural Relationships

1. **Six Harmonies (六合)**: Zi-Chou (Earth), Yin-Hai (Wood), Mao-Xu (Fire), Chen-You (Metal), Si-Shen (Water), Wu-Wei (Fire).
2. **Three Harmonies Trines (三合)**: Shen-Zi-Chen (Water), Hai-Mao-Wei (Wood), Yin-Wu-Xu (Fire), Si-You-Chou (Metal).
3. **Six Clashes (六冲)**: Zi-Wu, Chou-Wei, Yin-Shen, Mao-You, Chen-Xu, Si-Hai.
4. **Three Punishments (三刑)**: Ungrateful (Yin-Si-Shen), Bullying (Chou-Xu-Wei), Uncivilized (Zi-Mao).

---

## 6. Luck Pillars (大运 - Da Yun)

- **Direction**:
  - **Forward (顺)**: Yang Male or Yin Female.
  - **Reverse (逆)**: Yang Female or Yin Male.
- **Starting Age**: Distance in days from birth to next solar term (Forward) or previous solar term (Reverse), divided by 3 (3 days = 1 year).
- Sequence advances or reverses step-by-step from the Month Pillar in 10-year increments.
