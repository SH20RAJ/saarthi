# SAARTHI Architecture: Evidence Before Enterprise

## 1. System Overview

**SAARTHI** is built upon a strict separation of concerns, decoupling deterministic numerical/spatial computations from conversational orchestration:

```text
                                SAARTHI AI
                                    │
              ┌─────────────────────┴─────────────────────┐
              │                                           │
      Web Application                              AI & Voice Agent
   Next.js 14+ / TypeScript                       CopilotKit / RAG
   Tailwind CSS / shadcn/ui                      Bhashini Voice Pipeline
   MapLibre GL / Recharts                         Hindi + English LLM
   Cloudflare Worker Ready                                │
              │                                           │
              └─────────────────────┬─────────────────────┘
                                    │  REST / JSON
                             FastAPI Backend
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       │                            │                            │
 🗺️ Local Brain              💰 Financial Brain            🤖 AI Brain
  (Geospatial & ML)             (Deterministic)             (RAG & Policy)
       │                            │                            │
  PostGIS / OSM                Pure Python / NumPy          pgvector / BM25
  GeoPandas / Overpass         SIH26091 Schemes             MoSJE & NBCFDC Docs
  XGBoost + SHAP               Amortization & DSCR          Grounded Citations
       │                            │                            │
       └────────────────────────────┼────────────────────────────┘
                                    │
                        PostgreSQL + PostGIS / SQLite
                           (Data & Evidence Layer)
```

---

## 2. The Three Brains Paradigm

### Brain 1: Local Intelligence (Geospatial & Feasibility ML)
- **Goal:** Answer: *"Is there a genuine commercial opportunity in this specific geography?"*
- **Components:**
  - **Location Resolver:** Resolves Village $\rightarrow$ Gram Panchayat $\rightarrow$ Block $\rightarrow$ District $\rightarrow$ State.
  - **Spatial Buffer Generator:** Constructs dynamic 5 km and 10 km radial analysis zones.
  - **POI & Competitor Extractor:** Analyzes commercial amenities, competing units, supply markets, mandis, and transport corridors from OpenStreetMap/Overpass and local registers.
  - **Feasibility Engine:**
    - **Mode A (Deterministic Baseline):** Multi-criteria weighted scoring across 8 feature dimensions (population density, competitor saturation, road accessibility, pricing margin, capital adequacy, seasonality, local demand proxy, market gap).
    - **Mode B (Explainable ML):** Tabular gradient boosting (XGBoost / Scikit-learn) with SHAP value decomposition into positive and negative reason codes.
  - **Confidence Framework:** Deterministic metric aggregating data source tier, spatial precision, recency, and sample density.

### Brain 2: Financial Intelligence (Deterministic Microfinance Structuring)
- **Goal:** Answer: *"Can the entrepreneur realistically afford this venture and service the financing?"*
- **Components:**
  - **Zero LLM Arithmetic Policy:** 100% pure Python and NumPy calculation functions.
  - **SIH26091 Scheme Router:**
    - Margin: $M$
    - Project Cost: $P = M / 0.10$
    - Indicative Financing: $L = 0.90 \times P$
    - Threshold Routing:
      - $P \le ₹1,40,000$: **Micro Finance** (6.5% interest, 36 months tenure, 3 months moratorium).
      - $₹1,40,000 < P \le ₹50,00,000$: **Term Loan** (8.0% interest, 84 months tenure, 6 months moratorium).
  - **Repayment Simulator:** Generates monthly schedules for Principal, Interest, Balance, and Moratorium grace.
  - **Multi-Scenario Stress Test:**
    - Conservative: Revenue down 20%, Operating costs up 10%.
    - Expected: Baseline projections.
    - Optimistic: Revenue up 15%, Operating costs stable.
  - **DSCR & Working Capital Buffer:** Computes Debt Service Coverage Ratio ($DSCR = \frac{\text{Operating Surplus}}{\text{Debt Service}}$) to flag bankruptcy risk.

### Brain 3: AI Advisor (Grounded Policy RAG & Multilingual Companion)
- **Goal:** Answer: *"Explain this analysis clearly and empathetically in the entrepreneur's language."*
- **Components:**
  - **CopilotKit Integration:** Bidirectional agent connecting to frontend tools (`update_location`, `select_business`, `set_capital`, `run_feasibility`, `switch_scenario`).
  - **Scheme Knowledge RAG:** Embeddings + pgvector / lexical search over verified Ministry of Social Justice and Empowerment (MoSJE), NBCFDC, NSFDC, and PMEGP official guidelines.
  - **Grounded Verification:** Strict hallucination prevention — AI answers citations only from retrieved official sections.
  - **Multilingual Support:** English and Hindi localization with voice input/output interface ready for Bhashini API integration.

---

## 3. Data Provenance: The Evidence Object

Every single piece of data displayed on the dashboard or used in calculation conforms to the typed `Evidence` structure:

```json
{
  "claim": "Moderate competitor density within 5 km catchment",
  "value": 3,
  "unit": "competitors/5km",
  "source": "OpenStreetMap Commercial Nodes & Local Market Survey",
  "source_type": "geospatial",
  "geographic_resolution": "block",
  "recency": "2026-Q1",
  "confidence": 0.82,
  "methodology": "Overpass query filtered on category tags with Haversine buffer"
}
```

---

## 4. Frontend & Cloudflare Workers Deployment

- **Framework:** Next.js 14+ (App Router) with TypeScript.
- **Styling:** Tailwind CSS + shadcn/ui components (Radix primitives).
- **Visualization:** Recharts for cash flow & amortization curves, MapLibre GL for spatial mapping.
- **Edge Deployment:** Configured via `@opennextjs/cloudflare` with `wrangler.jsonc` allowing zero-cold-start global edge hosting on Cloudflare Workers / Pages.
- **Backend Communication:** Type-safe REST client connecting to FastAPI.
