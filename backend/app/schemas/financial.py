from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from .evidence import EvidenceObject

class FinancialCalculationRequest(BaseModel):
    available_margin: float = Field(..., gt=0, description="Entrepreneur's own available capital in ₹")
    custom_project_cost: Optional[float] = Field(None, gt=0, description="Optional custom total project cost in ₹")
    category_id: Optional[str] = Field("dairy", description="Business category ID (e.g. dairy, poultry, tailoring)")
    monthly_revenue_baseline: Optional[float] = Field(None, gt=0, description="Optional projected baseline monthly revenue in ₹")
    monthly_opex_baseline: Optional[float] = Field(None, gt=0, description="Optional projected baseline monthly operating expense in ₹")

class AmortizationMonth(BaseModel):
    month: int = Field(..., description="Month number (1 to N)")
    is_moratorium: bool = Field(..., description="Whether this month falls in the grace/moratorium period")
    principal_payment: float = Field(..., description="Principal amount repaid in this month in ₹")
    interest_payment: float = Field(..., description="Interest amount paid in this month in ₹")
    total_installment: float = Field(..., description="Total cash outflow (EMI or moratorium interest) in ₹")
    closing_balance: float = Field(..., description="Outstanding principal balance at month end in ₹")

class QuarterlySummary(BaseModel):
    quarter: int
    principal_paid: float
    interest_paid: float
    total_paid: float
    ending_balance: float

class StressScenario(BaseModel):
    name: str = Field(..., description="Conservative | Expected | Optimistic")
    revenue: float = Field(..., description="Projected monthly revenue under scenario in ₹")
    opex: float = Field(..., description="Projected monthly operating cost under scenario in ₹")
    net_operating_income: float = Field(..., description="Monthly operating surplus in ₹")
    debt_service_emi: float = Field(..., description="Monthly active EMI obligation in ₹")
    monthly_surplus: float = Field(..., description="Cash surplus remaining after servicing debt in ₹")
    dscr: float = Field(..., description="Debt Service Coverage Ratio (NOI / EMI)")
    risk_level: str = Field(..., description="Healthy | Moderate Risk | Critical Risk | Insolvent")

class FinancialStructuringPlan(BaseModel):
    available_margin: float
    total_project_cost: float
    indicative_loan_amount: float
    equity_percentage: float
    scheme_tier: str = Field(..., description="Micro Finance (up to ₹1.4L) | Term Loan (>₹1.4L up to ₹50L)")
    annual_interest_rate: float
    tenure_years: int
    total_tenure_months: int
    moratorium_months: int
    active_repayment_months: int
    monthly_moratorium_interest: float
    monthly_active_emi: float
    total_interest_payable: float
    total_debt_service_cost: float
    stress_scenarios: Dict[str, StressScenario]
    quarterly_schedule: List[QuarterlySummary]
    amortization_schedule: List[AmortizationMonth]
    disclaimer: str
    evidence_pack: List[EvidenceObject]
