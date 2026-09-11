# Ashtakavarga Engine (BAV & SAV) Documentation

## Overview

The `@vedica/ashtakavarga-engine` package provides a deterministic, canonical calculation layer for Vedic Ashtakavarga points based on D1 natal positions.

It strictly adheres to classical Parashari Ashtakavarga rules:
- **Bhinna Ashtakavarga (BAV)**: Calculates planet-wise bindu points across all 12 zodiac signs from 8 contributors (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna).
- **Sarvashtakavarga (SAV)**: Computes the 12-sign summation across all 7 planetary BAV matrices.
- **Canonical Sum Validation**: Verifies that the sum of BAV totals across all 7 planets and the SAV total equals **337 bindus**.

---

## Canonical Rule Reference & Expected Totals

| Planet Target | Expected BAV Total | 8 Contributors |
| :--- | :--- | :--- |
| **SUN** | **48** | Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna |
| **MOON** | **49** | Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna |
| **MARS** | **39** | Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna |
| **MERCURY** | **54** | Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna |
| **JUPITER** | **56** | Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna |
| **VENUS** | **52** | Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna |
| **SATURN** | **39** | Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna |
| **SAV TOTAL** | **337** | Sum of 7 Planetary BAV Totals |

*Note: Lagna is an 8th contributor inside each planet's BAV calculation, but is NOT an 8th BAV row in SAV summation.*

---

## Relative House Calculation Formula

The relative house position of a target sign from a contributor's source sign is calculated using 1-based indexing (1 = Aries ... 12 = Pisces):

```ts
relativeHouse = ((targetSignIndex - sourceSignIndex + 12) % 12) + 1;
```

---

## Traceable Explainability

Every bindu is 100% traceable. The engine provides complete step-by-step evidence arrays detailing:
- Target planet
- Contributor name & source sign
- Target sign
- Calculated relative house position
- Allowed canonical relative house array
- Individual bindu contribution (`1` or `0`)

---

## Non-Predictive Architecture

The Ashtakavarga engine provides factual numerical bindu points only. It does NOT generate speculative predictions, horoscope readings, or fortune-telling outputs.
