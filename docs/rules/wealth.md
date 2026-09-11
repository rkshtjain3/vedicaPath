# Wealth Domain Rules Specification

## Overview
Wealth rules evaluate income potential, savings potential, expense pressure, financial volatility, and asset building based on 2nd and 11th wealth houses, 12th house of expenses, and natural benefics.

---

### WEALTH-001: Wealth House Lords Dignity
- **Conditions**: 2nd lord or 11th lord has `EXALTED`, `OWN_SIGN`, or `MOOLATRIKONA` dignity.
- **Effects**: `IncomePotential +2`, `SavingsPotential +2`.
- **Evidence**: `WEALTH_LORD_DIGNITY` (house: 2 or 11, lord, dignity).

---

### WEALTH-002: Dasha Lord Wealth Connection
- **Conditions**: Active Mahadasha or Antardasha lord is connected to 2nd house or 11th house.
- **Effects**: `IncomePotential +2`, `AssetBuilding +1`.
- **Evidence**: `DASHA_WEALTH_CONNECTION`.

---

### WEALTH-003: Expense Pressure & Volatility
- **Conditions**: 12th lord is placed in 2nd or 11th house OR malefic planets (Mars, Saturn, Rahu, Ketu) occupy 12th house.
- **Effects**: `ExpensePressure +2`, `FinancialVolatility +1`.
- **Evidence**: `EXPENSE_LORD_IN_WEALTH_HOUSE` or `MALEFIC_IN_EXPENSE_HOUSE`.

---

### WEALTH-004: Natural Benefic Wealth Connection
- **Conditions**: Jupiter or Venus connects to 2nd or 11th house (occupation, lordship, aspect, or conjunction).
- **Effects**: `IncomePotential +2`, `SavingsPotential +1`.
- **Evidence**: `NATURAL_BENEFIC_WEALTH_CONNECTION`.
