# Financial Model Specification (SIH26091)

## 1. Overview
The Financial Engine in **SAARTHI** is strictly deterministic. No LLM or generative model performs financial arithmetic. All calculations are executed by verified Python algorithms with unit-tested edge cases.

---

## 2. Core Structuring Formulas

### Step 1: Entrepreneur Equity and Total Project Cost
Given an entrepreneur's available own contribution (margin money) $M$:
- Standard baseline equity requirement: $10\%$ ($0.10$)
- Total Permissible Project Cost:
  $$P = \frac{M}{0.10} = 10 \times M$$
- Indicative Financing Requirement:
  $$L = 0.90 \times P = 9 \times M$$

*(Note: The user can adjust project cost or equity ratio if their capital exceeds minimum requirement, but default structuring adheres to the $10\%$ equity baseline).*

---

## 3. Scheme Routing Matrix (SIH26091 Rules)

| Scheme Tier | Threshold Criteria | Annual Interest ($r_{\text{annual}}$) | Total Tenure ($N_{\text{total}}$) | Moratorium Period ($m$) | Active Repayment Months ($n$) |
|---|---|---|---|---|---|
| **Micro Finance** | $P \le ₹1,40,000$ | 6.5% p.a. | 3 Years (36 Months) | 3 Months | 33 Months |
| **Term Loan** | $₹1,40,000 < P \le ₹50,00,000$ | 8.0% p.a. | 7 Years (84 Months) | 6 Months | 78 Months |

---

## 4. Amortization and Moratorium Mechanics

Let:
- $r = \frac{r_{\text{annual}}}{12 \times 100}$ (Monthly fractional interest rate)
- $m$ = Number of moratorium months
- $n = N_{\text{total}} - m$ = Number of post-moratorium repayment months

### During Moratorium ($t \in [1, m]$):
- Principal repayment: $Principal_t = 0$
- Simple monthly interest accrued: $Interest_t = L \times r$
- In standard SIH26091 micro-enterprise terms, simple interest is serviced or deferred without compounding penalty.

### Post-Moratorium Active Repayment ($t \in [m+1, N_{\text{total}}]$):
The monthly Equated Monthly Installment ($EMI$) for the remaining $n$ months is:
$$EMI = L \times \frac{r(1+r)^n}{(1+r)^n - 1}$$

For each subsequent month $t$:
$$Interest_t = Balance_{t-1} \times r$$
$$Principal_t = EMI - Interest_t$$
$$Balance_t = Balance_{t-1} - Principal_t$$

At $t = N_{\text{total}}$, $Balance = 0$.

---

## 5. Cash-Flow Stress Testing & DSCR

For a selected business category with projected monthly revenue $R_{\text{base}}$ and operating expense $OPEX_{\text{base}}$:
$$\text{Net Operating Income (NOI)} = R - OPEX$$
$$\text{Debt Service Coverage Ratio (DSCR)} = \frac{\text{NOI}}{EMI}$$

### Scenarios:
1. **Conservative Scenario**:
   - $R_{\text{cons}} = 0.80 \times R_{\text{base}}$ (-20% market slump)
   - $OPEX_{\text{cons}} = 1.10 \times OPEX_{\text{base}}$ (+10% input cost inflation)
2. **Expected Scenario (Baseline)**:
   - $R_{\text{exp}} = R_{\text{base}}$
   - $OPEX_{\text{exp}} = OPEX_{\text{base}}$
3. **Optimistic Scenario**:
   - $R_{\text{opt}} = 1.15 \times R_{\text{base}}$ (+15% demand capture)
   - $OPEX_{\text{opt}} = OPEX_{\text{base}}$

### Risk Flag Rules:
- **Healthy**: $DSCR \ge 1.50$
- **Moderate Risk**: $1.10 \le DSCR < 1.50$
- **Critical Risk (High Default Probability)**: $DSCR < 1.10$
- **Insolvent (Negative Cashflow)**: $NOI < EMI$
