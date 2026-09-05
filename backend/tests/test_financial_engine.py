import pytest
from app.engines.finance.calculator import FinancialEngine
from app.schemas.financial import FinancialCalculationRequest

def test_microfinance_threshold_routing():
    # Capital of ₹10,000 -> Project cost ₹1,00,000 (<= ₹1.40 Lakh) -> Micro Finance tier
    req = FinancialCalculationRequest(available_margin=10000.0, category_id="dairy")
    plan = FinancialEngine.calculate_plan(req)
    
    assert plan.total_project_cost == 100000.0
    assert plan.indicative_loan_amount == 90000.0
    assert plan.equity_percentage == 10.0
    assert plan.scheme_tier == "Micro Finance"
    assert plan.annual_interest_rate == 6.5
    assert plan.tenure_years == 3
    assert plan.total_tenure_months == 36
    assert plan.moratorium_months == 3
    assert plan.active_repayment_months == 33
    assert plan.monthly_moratorium_interest > 0
    assert plan.monthly_active_emi > 0

def test_term_loan_threshold_routing():
    # Capital of ₹1,00,000 -> Project cost ₹10,00,000 (> ₹1.40 Lakh) -> Term Loan tier
    req = FinancialCalculationRequest(available_margin=100000.0, category_id="dairy")
    plan = FinancialEngine.calculate_plan(req)
    
    assert plan.total_project_cost == 1000000.0
    assert plan.indicative_loan_amount == 900000.0
    assert plan.equity_percentage == 10.0
    assert plan.scheme_tier == "Term Loan"
    assert plan.annual_interest_rate == 8.0
    assert plan.tenure_years == 7
    assert plan.total_tenure_months == 84
    assert plan.moratorium_months == 6
    assert plan.active_repayment_months == 78
    assert plan.monthly_moratorium_interest == 6000.0  # 900000 * 0.08 / 12 = 6000.0
    assert len(plan.amortization_schedule) == 84
    assert plan.amortization_schedule[-1].closing_balance == 0.0

def test_moratorium_zero_principal():
    req = FinancialCalculationRequest(available_margin=50000.0, category_id="poultry")
    plan = FinancialEngine.calculate_plan(req)
    
    # Check first 6 moratorium months
    for month_data in plan.amortization_schedule[:plan.moratorium_months]:
        assert month_data.is_moratorium is True
        assert month_data.principal_payment == 0.0
        assert month_data.interest_payment == plan.monthly_moratorium_interest

def test_stress_scenarios_and_dscr():
    req = FinancialCalculationRequest(available_margin=100000.0, category_id="dairy")
    plan = FinancialEngine.calculate_plan(req)
    
    scenarios = plan.stress_scenarios
    assert "Conservative" in scenarios
    assert "Expected" in scenarios
    assert "Optimistic" in scenarios
    
    assert scenarios["Conservative"].revenue < scenarios["Expected"].revenue
    assert scenarios["Conservative"].opex > scenarios["Expected"].opex
    assert scenarios["Optimistic"].revenue > scenarios["Expected"].revenue
    assert scenarios["Expected"].dscr > 0
