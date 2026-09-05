# Data Source Plan & Quality Framework

## 1. Overview
SAARTHI strictly enforces the principle of **Data Provenance**. No estimated population, price, competitor count, or scheme rule is hallucinated by an AI language model. Every metric is backed by documented data sources, explicit geographic resolutions, and deterministic confidence scores.

---

## 2. Primary Data Sources

| Domain | Data Source | Ingestion Method | Resolution | Licensing / Origin |
|---|---|---|---|---|
| **Roads & POIs** | OpenStreetMap (OSM) via Overpass API | Overpass QL & GeoPandas extraction | Coordinates / Village level | ODbL (Open Data Commons) |
| **Demographics** | Local Census & Gram Panchayat Directory | Pre-indexed census directories & proxy models | Village / Gram Panchayat | Data.gov.in / MoPR |
| **Market Prices** | AGMARKNET & Regional Mandi Price Feeds | Periodic ETL scraper & cached baselines | District / APMC Mandi | Open Government Data (OGD) |
| **Financial Schemes** | MoSJE, NBCFDC, NSFDC, PMEGP, Mudra | Official PDF guidelines ingestion into RAG | National & State Level | Official Ministry Publications |
| **Administrative Geometry** | Survey of India / Local Admin Boundaries GeoJSON | GeoJSON spatial polygons & PostGIS indexing | Block / District | OGD Platform India |

---

## 3. Data Tiering & Confidence Matrix

Data sources are categorized into 4 tiers to compute overall metric confidence:

1. **Tier 1 (Authoritative Government/Bank Records - Weight 1.0)**:
   - Official scheme guidelines, gazette notifications, validated APMC mandi daily bulletins.
2. **Tier 2 (Structured Geospatial Repositories - Weight 0.85)**:
   - OpenStreetMap verified nodes, PMGSY road networks, state GIS portals.
3. **Tier 3 (Derived Econometric & Demographic Proxies - Weight 0.70)**:
   - Catchment household estimates derived from district census ratios and satellite nighttime luminosity / POI density.
4. **Tier 4 (Regional Heuristic & Survey Benchmarks - Weight 0.55)**:
   - Category-typical cost structures, seasonal operating cost volatility factors.

### Confidence Formula:
$$\text{Metric Confidence} = w_{\text{tier}} \times \left(1 - \frac{\text{Age in Months}}{36}\right) \times \text{Coverage Factor}$$

If total confidence drops below **0.40**, the system flags **`INSUFFICIENT LOCAL EVIDENCE`** rather than fabricating an unsubstantiated recommendation.

---

## 4. Benchmark Location: Kanke, Ranchi, Jharkhand
To enable an instant, reproducible judging demonstration during hackathon evaluations, SAARTHI includes a verified baseline dataset for:
- **Location:** Kanke, Ranchi District, Jharkhand ($23.4316^\circ\text{N}, 85.3218^\circ\text{E}$)
- **Administrative Context:** Kanke Block, Ranchi Sub-division
- **Target Category:** Dairy Micro-Enterprise
- **Key Real-World Signals:**
  - Active milk collection routes connected to Medha Dairy (Jharkhand State Cooperative Milk Producers' Federation).
  - High demand from urban/semi-urban Ranchi fringes (Kanke Dam corridor).
  - Feed supplier availability within 4.2 km.
  - Moderate competition: 3 informal raw-milk producers within 5 km, but 0 packaged/value-added paneer processors within 7 km (clear market gap).
  - Market Price Baseline: ₹48 - ₹54 per liter raw cow milk; ₹340 - ₹380 per kg paneer.
