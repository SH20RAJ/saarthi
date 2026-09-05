# Problem Statement: SIH26091

## Official Title
**AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs**

- **Problem Statement ID:** SIH26091
- **Organization:** Ministry of Social Justice and Empowerment (MoSJE)
- **Department:** Department of Social Justice and Empowerment
- **Category:** Software
- **Theme:** Agriculture, FoodTech & Rural Development

---

## 1. Background & Context
Rural and semi-urban micro-entrepreneurs in India face a critical structural barrier when initiating micro-enterprises: **information asymmetry and lack of financial structuring**.

While aspiring entrepreneurs often possess modest personal savings (own margin money) and vocational skills (e.g., dairy farming, poultry, small retail, food processing, tailoring), they lack access to:
1. **Hyper-local market intelligence**: Is local demand saturated? How many competing establishments operate within 5 km or 10 km? Where are the nearest mandis, weekly haats, and transit corridors?
2. **Deterministic financial structuring**: How does their available margin money translate into a viable total project cost? What financing tier applies to them? What will their realistic debt service burden (EMI) look like post-moratorium?
3. **Evidence-backed viability**: Are their projections grounded in empirical data or unverified optimism?

Consequently, millions of micro-entrepreneurs either under-capitalize their ventures, select saturated categories with negative unit economics, or take informal high-interest loans that lead to enterprise failure and default.

---

## 2. Core Problem Statement Directives

The objective is **NOT** to construct a generic conversational AI chatbot. Rather, it is to build an **integrated, research-grounded decision-support and financial structuring platform** that provides:

### Module 1: Hyper-Local Business Feasibility Report
1. **Market Reach**: Estimation of catchment population, household density, consumer purchasing power proxies, and accessibility metrics within 5 km and 10 km radii.
2. **Opportunity Analysis**: Detection of underserved market niches, local supply gaps, and value-addition opportunities (e.g., processing raw milk into paneer/ghee rather than raw milk liquidation).
3. **Evidence-Based SWOT**: Strengths, Weaknesses, Opportunities, and Threats tied directly to empirical geospatial and market signals.
4. **Threat Identification**: Category-specific operational, regulatory, climatic, and input-price volatility risks.
5. **Competitor Mapping**: Spatial clustering, competitor density per square kilometer, and distance to nearest competitors.
6. **Product Market Value & Pricing**: Indicative regional and local price benchmarks with explicit confidence ratings.

### Module 2: Smart Financial Calculator & Scheme Router
1. **Financial Structuring**:
   - Margin money input: $M$
   - Total Project Cost: $P = M / 0.10$ (assuming 10% entrepreneur equity contribution as standard baseline)
   - Indicative Financing Requirement: $L = 0.90 \times P$
2. **Scheme Auto-Selection (SIH26091 Norms)**:
   - **Micro Finance Tier**: Project cost up to ₹1.40 Lakh
     - Annual Interest Rate: 6.5%
     - Repayment Tenure: 3 Years (36 Months)
     - Moratorium Period: 3 Months
   - **Term Loan Tier**: Project cost above ₹1.40 Lakh up to ₹50.00 Lakh
     - Annual Interest Rate: 8.0%
     - Repayment Tenure: 7 Years (84 Months)
     - Moratorium Period: 6 Months
3. **EMI & Moratorium Generator**:
   - Full monthly amortization schedule detailing principal repayment, interest accrual, and outstanding balance during and post-moratorium.
   - Cash-flow stress testing under **Conservative**, **Expected**, and **Optimistic** operating scenarios.
   - Debt Service Coverage Ratio (DSCR) and working capital cushion validation.

---

## 3. Product Vision: SAARTHI ("Evidence Before Enterprise")
**SAARTHI** serves as the digital charioteer for the rural entrepreneur. It guarantees:
- **No Fabricated Facts**: Every metric has data provenance, geographic granularity, and confidence score.
- **Explainable Feasibility**: Feasibility is derived from transparent weighted multi-criteria models and tabular ML (XGBoost) with SHAP reason codes.
- **Multilingual & Voice-First**: Designed for Bharat (Hindi + English) with natural voice interactions compatible with Bhashini.
- **Actionable Verdicts**: Explicit decisions: `PROCEED`, `PROCEED WITH CONDITIONS`, `RECONSIDER / MODIFY`, or `INSUFFICIENT EVIDENCE`.
