import math
from typing import List, Dict, Tuple, Optional
from app.core.config import settings
from app.schemas.financial import (
    FinancialCalculationRequest,
    FinancialStructuringPlan,
    AmortizationMonth,
    QuarterlySummary,
    StressScenario
)
from app.schemas.evidence import EvidenceObject

CATEGORY_BASELINES = {
    "dairy": {"monthly_rev_factor": 0.09, "monthly_opex_factor": 0.055},
    "poultry": {"monthly_rev_factor": 0.11, "monthly_opex_factor": 0.075},
    "grocery": {"monthly_rev_factor": 0.14, "monthly_opex_factor": 0.110},
    "tailoring": {"monthly_rev_factor": 0.08, "monthly_opex_factor": 0.040},
    "food_processing": {"monthly_rev_factor": 0.10, "monthly_opex_factor": 0.065},
    "default": {"monthly_rev_factor": 0.095, "monthly_opex_factor": 0.060}
}

class FinancialEngine:
    """
    Deterministic Financial Structuring Engine adhering to SIH26091 norms.
    Strict zero-hallucination policy.
    """

    @staticmethod
    def calculate_plan(req: FinancialCalculationRequest) -> FinancialStructuringPlan:
        margin = float(req.available_margin)
        
        # 1. Total Project Cost and Loan sizing
        if req.custom_project_cost and req.custom_project_cost > margin:
            total_project_cost = float(req.custom_project_cost)
            indicative_loan = total_project_cost - margin
        else:
            total_project_cost = margin / settings.EQUITY_MARGIN_RATIO
            indicative_loan = total_project_cost * settings.LOAN_RATIO

        equity_percentage = round((margin / total_project_cost) * 100.0, 2)
        
        # 2. Scheme Routing according to SIH26091 PS thresholds
        if total_project_cost <= settings.MICROFINANCE_MAX_COST:
            scheme_tier = "Micro Finance"
            interest_rate = settings.MICROFINANCE_INTEREST_RATE
            tenure_years = settings.MICROFINANCE_TENURE_YEARS
            moratorium_months = settings.MICROFINANCE_MORATORIUM_MONTHS
        else:
            scheme_tier = "Term Loan"
            interest_rate = settings.TERM_LOAN_INTEREST_RATE
            tenure_years = settings.TERM_LOAN_TENURE_YEARS
            moratorium_months = settings.TERM_LOAN_MORATORIUM_MONTHS

        total_tenure_months = tenure_years * 12
        active_repayment_months = total_tenure_months - moratorium_months
        
        # 3. Monthly Interest Rate
        r = (interest_rate / 100.0) / 12.0
        
        # Monthly simple interest accrued during moratorium
        monthly_moratorium_interest = round(indicative_loan * r, 2)
        
        # Standard EMI for post-moratorium active repayment period
        # EMI = L * [r * (1 + r)^n] / [(1 + r)^n - 1]
        if r > 0 and active_repayment_months > 0:
            numerator = r * math.pow(1.0 + r, active_repayment_months)
            denominator = math.pow(1.0 + r, active_repayment_months) - 1.0
            monthly_active_emi = round(indicative_loan * (numerator / denominator), 2)
        else:
            monthly_active_emi = round(indicative_loan / max(active_repayment_months, 1), 2)

        # 4. Generate Monthly Amortization Schedule
        amortization_schedule: List[AmortizationMonth] = []
        current_balance = indicative_loan
        total_interest_paid = 0.0

        for month in range(1, total_tenure_months + 1):
            if month <= moratorium_months:
                # In moratorium: interest only, zero principal repayment
                interest_payment = monthly_moratorium_interest
                principal_payment = 0.0
                total_installment = interest_payment
                total_interest_paid += interest_payment
                amortization_schedule.append(
                    AmortizationMonth(
                        month=month,
                        is_moratorium=True,
                        principal_payment=0.0,
                        interest_payment=interest_payment,
                        total_installment=total_installment,
                        closing_balance=round(current_balance, 2)
                    )
                )
            else:
                # Active repayment
                interest_payment = round(current_balance * r, 2)
                
                # Final month adjustments to prevent rounding residuals
                if month == total_tenure_months:
                    principal_payment = round(current_balance, 2)
                    total_installment = round(principal_payment + interest_payment, 2)
                    current_balance = 0.0
                else:
                    principal_payment = round(monthly_active_emi - interest_payment, 2)
                    if principal_payment > current_balance:
                        principal_payment = round(current_balance, 2)
                    total_installment = monthly_active_emi
                    current_balance = round(current_balance - principal_payment, 2)

                total_interest_paid += interest_payment
                amortization_schedule.append(
                    AmortizationMonth(
                        month=month,
                        is_moratorium=False,
                        principal_payment=principal_payment,
                        interest_payment=interest_payment,
                        total_installment=total_installment,
                        closing_balance=max(0.0, current_balance)
                    )
                )

        total_interest_paid = round(total_interest_paid, 2)
        total_debt_service = round(indicative_loan + total_interest_paid, 2)

        # 5. Aggregate into Quarterly Summaries
        quarterly_schedule: List[QuarterlySummary] = []
        quarter_count = math.ceil(total_tenure_months / 3)
        for q in range(1, quarter_count + 1):
            start_idx = (q - 1) * 3
            end_idx = min(start_idx + 3, len(amortization_schedule))
            q_months = amortization_schedule[start_idx:end_idx]
            q_principal = round(sum(m.principal_payment for m in q_months), 2)
            q_interest = round(sum(m.interest_payment for m in q_months), 2)
            q_total = round(sum(m.total_installment for m in q_months), 2)
            q_end_balance = q_months[-1].closing_balance
            quarterly_schedule.append(
                QuarterlySummary(
                    quarter=q,
                    principal_paid=q_principal,
                    interest_paid=q_interest,
                    total_paid=q_total,
                    ending_balance=q_end_balance
                )
            )

        # 6. Cash Flow Stress Testing (Conservative, Expected, Optimistic)
        baseline_cfg = CATEGORY_BASELINES.get(req.category_id or "dairy", CATEGORY_BASELINES["default"])
        base_rev = req.monthly_revenue_baseline or (total_project_cost * baseline_cfg["monthly_rev_factor"])
        base_opex = req.monthly_opex_baseline or (total_project_cost * baseline_cfg["monthly_opex_factor"])

        stress_scenarios = FinancialEngine._compute_stress_scenarios(
            base_rev=base_rev,
            base_opex=base_opex,
            emi=monthly_active_emi
        )

        # 7. Generate Data Provenance / Evidence Pack
        evidence_pack = [
            EvidenceObject(
                claim=f"Project Cost structured at ₹{total_project_cost:,.2f} based on 10% equity ratio",
                value=total_project_cost,
                unit="₹",
                source="SIH26091 Financial Structuring Guidelines (Section 16)",
                source_type="deterministic_math",
                geographic_resolution="national",
                recency="2026-09",
                confidence=1.0,
                methodology="P = Available_Margin / 0.10"
            ),
            EvidenceObject(
                claim=f"Auto-routed to {scheme_tier} scheme tier with {interest_rate}% p.a. interest",
                value=interest_rate,
                unit="% p.a.",
                source="MoSJE / SIH26091 Microfinance & Term Loan Framework",
                source_type="government_scheme",
                geographic_resolution="national",
                recency="2026-09",
                confidence=1.0,
                methodology="Cost threshold routing: <= ₹1.4L -> Microfinance (6.5%); > ₹1.4L -> Term Loan (8.0%)"
            ),
            EvidenceObject(
                claim=f"Moratorium grace period established at {moratorium_months} months",
                value=moratorium_months,
                unit="months",
                source="SIH26091 Official Repayment Norms",
                source_type="government_scheme",
                geographic_resolution="national",
                recency="2026-09",
                confidence=1.0,
                methodology="Microfinance: 3 months grace; Term Loan: 6 months grace"
            )
        ]

        disclaimer = (
            "NOTICE: This financial projection is indicative and generated under the official "
            "SIH26091 problem statement assumptions for the Ministry of Social Justice & Empowerment. "
            "Financing approval is subject to statutory due diligence, credit appraisal, and "
            "formal verification under applicable NBCFDC / NSFDC / state implementing agency guidelines."
        )

        return FinancialStructuringPlan(
            available_margin=round(margin, 2),
            total_project_cost=round(total_project_cost, 2),
            indicative_loan_amount=round(indicative_loan, 2),
            equity_percentage=equity_percentage,
            scheme_tier=scheme_tier,
            annual_interest_rate=interest_rate,
            tenure_years=tenure_years,
            total_tenure_months=total_tenure_months,
            moratorium_months=moratorium_months,
            active_repayment_months=active_repayment_months,
            monthly_moratorium_interest=monthly_moratorium_interest,
            monthly_active_emi=monthly_active_emi,
            total_interest_payable=total_interest_paid,
            total_debt_service_cost=total_debt_service,
            stress_scenarios=stress_scenarios,
            quarterly_schedule=quarterly_schedule,
            amortization_schedule=amortization_schedule,
            disclaimer=disclaimer,
            evidence_pack=evidence_pack
        )

    @staticmethod
    def _compute_stress_scenarios(base_rev: float, base_opex: float, emi: float) -> Dict[str, StressScenario]:
        scenarios_def = {
            "Conservative": (base_rev * 0.80, base_opex * 1.10),
            "Expected": (base_rev, base_opex),
            "Optimistic": (base_rev * 1.15, base_opex)
        }
        res: Dict[str, StressScenario] = {}

        for name, (rev, opex) in scenarios_def.items():
            noi = rev - opex
            surplus = noi - emi
            dscr = round(noi / max(emi, 1.0), 2)
            
            if noi < emi:
                risk_level = "Insolvent"
            elif dscr < 1.10:
                risk_level = "Critical Risk"
            elif dscr < 1.50:
                risk_level = "Moderate Risk"
            else:
                risk_level = "Healthy"

            res[name] = StressScenario(
                name=name,
                revenue=round(rev, 2),
                opex=round(opex, 2),
                net_operating_income=round(noi, 2),
                debt_service_emi=round(emi, 2),
                monthly_surplus=round(surplus, 2),
                dscr=dscr,
                risk_level=risk_level
            )
        return res
