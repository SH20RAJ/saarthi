from pydantic import BaseModel, Field
from typing import Any, Optional

class EvidenceObject(BaseModel):
    claim: str = Field(..., description="Human-readable factual claim")
    value: Any = Field(..., description="Observed or calculated metric value")
    unit: Optional[str] = Field(None, description="Measurement unit (e.g., ₹, km, %)")
    source: str = Field(..., description="Authoritative data provider or algorithm")
    source_type: str = Field(..., description="geospatial | government_scheme | market_feed | econometric_proxy | deterministic_math")
    geographic_resolution: str = Field(..., description="point | village | block | district | state | national")
    recency: str = Field(..., description="Data timestamp or vintage")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Metric confidence between 0.0 and 1.0")
    methodology: str = Field(..., description="Brief summary of calculation or sampling methodology")
