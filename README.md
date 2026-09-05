# SAARTHI 🚀

> **Evidence Before Enterprise**  
> AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs  
> **Smart India Hackathon 2026** | **Problem Statement ID:** SIH26091  
> **Ministry:** Ministry of Social Justice and Empowerment (MoSJE) | **Theme:** Agriculture, FoodTech & Rural Development

---

## 📖 Executive Summary
**SAARTHI** is an evidence-grounded, research-backed decision-support system designed to empower rural and semi-urban micro-entrepreneurs. Rather than acting as an ungrounded chatbot that invents local numbers, SAARTHI enforces a strict pipeline:
$$\textbf{Empirical Evidence} \longrightarrow \textbf{Spatial / Market Features} \longrightarrow \textbf{Deterministic Financials \& ML} \longrightarrow \textbf{Reason Codes} \longrightarrow \textbf{Multilingual Explanation}$$

---

## 🏛️ The Three-Brain Architecture

1. **🗺️ Local Intelligence Brain**
   - OpenStreetMap & PostGIS geospatial buffer analytics (5 km & 10 km radii).
   - Competitor density, nearest market distances, and clustering index.
   - Transparent 8-feature baseline scoring & XGBoost tabular ML with SHAP reason codes.
2. **💰 Financial Intelligence Brain**
   - 100% deterministic Python/NumPy calculations adhering strictly to SIH26091 rules.
   - Margin input $M \implies$ Total Project Cost $P = M / 0.10 \implies$ Indicative Loan $L = 0.90 \times P$.
   - Microfinance ($\le ₹1.4\text{L}$ @ 6.5%, 3-yr / 3-mo moratorium) & Term Loan ($> ₹1.4\text{L}$ to $₹50\text{L}$ @ 8.0%, 7-yr / 6-mo moratorium).
   - Monthly amortization schedules, DSCR computation, and 3-scenario cash-flow stress testing.
3. **🤖 AI Advisor Brain**
   - CopilotKit agentic companion capable of controlling frontend state and rendering generative UI cards.
   - Grounded RAG over official MoSJE, NBCFDC, NSFDC, and PMEGP documents.
   - Multilingual Bharat-ready support (Hindi + English) with Bhashini voice pipeline readiness.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, MapLibre GL, Recharts, Lucide Icons, CopilotKit.
- **Edge Deployment:** Cloudflare Workers via `@opennextjs/cloudflare` & `wrangler.jsonc`.
- **Backend:** Python 3.11+, FastAPI, Pydantic v2, Uvicorn, NumPy.
- **Database & Spatial:** PostgreSQL 16+ with PostGIS / SQLite zero-friction demo fallback.
- **Machine Learning:** Scikit-learn, XGBoost, SHAP.

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+ (Node v20+ recommended)
- Python 3.10+
- PostgreSQL + PostGIS (optional for local demo; embedded fallback included)

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Cloudflare Worker Deployment
```bash
cd frontend
npx wrangler deploy
```

---

## 📂 Repository Layout
```text
.
├── frontend/               # Next.js App, UI components, MapLibre, CopilotKit
├── backend/                # FastAPI engines (financial, geospatial, ML, RAG)
├── docs/                   # Architecture, research papers, SIH specs, data plan
├── docker-compose.yml      # Local containerized orchestration
└── README.md
```
