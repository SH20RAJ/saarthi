from fastapi import APIRouter, HTTPException
from app.schemas.financial import FinancialCalculationRequest, FinancialStructuringPlan
from app.engines.finance.calculator import FinancialEngine

router = APIRouter()

@router.post("/structure", response_model=FinancialStructuringPlan)
def structure_financial_plan(request: FinancialCalculationRequest):
    """
    Calculate deterministic project cost, scheme tier, indicative financing,
    repayment schedule, and stress test scenarios based on SIH26091 norms.
    """
    try:
        plan = FinancialEngine.calculate_plan(request)
        return plan
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Financial calculation error: {str(e)}")

@router.get("/rules")
def get_scheme_rules():
    """
    Returns official SIH26091 parameter rules and thresholds.
    """
    return {
        "equity_ratio": 0.10,
        "loan_ratio": 0.90,
        "tiers": {
            "micro_finance": {
                "max_project_cost": 140000.0,
                "annual_interest_rate_pct": 6.5,
                "tenure_years": 3,
                "moratorium_months": 3
            },
            "term_loan": {
                "max_project_cost": 5000000.0,
                "annual_interest_rate_pct": 8.0,
                "tenure_years": 7,
                "moratorium_months": 6
            }
        },
        "source": "Ministry of Social Justice and Empowerment / SIH26091 Official Guidelines"
    }
