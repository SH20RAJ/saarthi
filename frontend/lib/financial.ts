import { FinancialPlan, AmortizationMonth, QuarterlySummary, StressScenario, EvidenceObject } from "./types";

export function calculateFinancialPlan(
  availableMargin: number,
  customProjectCost?: number,
  categoryId: string = "dairy"
): FinancialPlan {
  const margin = Math.max(1000, Number(availableMargin) || 100000);
  
  // 1. Total Project Cost & Loan Sizing (10% equity margin baseline)
  let totalProjectCost = margin / 0.10;
  if (customProjectCost && customProjectCost > margin) {
    totalProjectCost = customProjectCost;
  }
  const indicativeLoan = totalProjectCost * 0.90;
  const equityPercentage = Number(((margin / totalProjectCost) * 100).toFixed(2));

  // 2. Scheme Routing (SIH26091 Norms)
  const isMicrofinance = totalProjectCost <= 140000;
  const schemeTier = isMicrofinance ? "Micro Finance" : "Term Loan";
  const interestRate = isMicrofinance ? 6.5 : 8.0;
  const tenureYears = isMicrofinance ? 3 : 7;
  const moratoriumMonths = isMicrofinance ? 3 : 6;
  const totalTenureMonths = tenureYears * 12;
  const activeRepaymentMonths = totalTenureMonths - moratoriumMonths;

  // 3. Monthly Interest Rate and EMI post-moratorium
  const r = (interestRate / 100) / 12;
  const monthlyMoratoriumInterest = Number((indicativeLoan * r).toFixed(2));

  let monthlyActiveEmi = 0;
  if (r > 0 && activeRepaymentMonths > 0) {
    const factor = Math.pow(1 + r, activeRepaymentMonths);
    monthlyActiveEmi = Number((indicativeLoan * ((r * factor) / (factor - 1))).toFixed(2));
  } else {
    monthlyActiveEmi = Number((indicativeLoan / Math.max(activeRepaymentMonths, 1)).toFixed(2));
  }

  // 4. Monthly Amortization Schedule
  const amortizationSchedule: AmortizationMonth[] = [];
  let currentBalance = indicativeLoan;
  let totalInterestPaid = 0;

  for (let month = 1; month <= totalTenureMonths; month++) {
    if (month <= moratoriumMonths) {
      const interest = monthlyMoratoriumInterest;
      totalInterestPaid += interest;
      amortizationSchedule.push({
        month,
        is_moratorium: true,
        principal_payment: 0,
        interest_payment: interest,
        total_installment: interest,
        closing_balance: Number(currentBalance.toFixed(2)),
      });
    } else {
      const interest = Number((currentBalance * r).toFixed(2));
      let principal = 0;
      let installment = 0;

      if (month === totalTenureMonths) {
        principal = Number(currentBalance.toFixed(2));
        installment = Number((principal + interest).toFixed(2));
        currentBalance = 0;
      } else {
        principal = Number((monthlyActiveEmi - interest).toFixed(2));
        if (principal > currentBalance) {
          principal = Number(currentBalance.toFixed(2));
        }
        installment = monthlyActiveEmi;
        currentBalance = Number((currentBalance - principal).toFixed(2));
      }

      totalInterestPaid += interest;
      amortizationSchedule.push({
        month,
        is_moratorium: false,
        principal_payment: principal,
        interest_payment: interest,
        total_installment: installment,
        closing_balance: Math.max(0, currentBalance),
      });
    }
  }

  totalInterestPaid = Number(totalInterestPaid.toFixed(2));
  const totalDebtService = Number((indicativeLoan + totalInterestPaid).toFixed(2));

  // 5. Quarterly Schedule
  const quarterlySchedule: QuarterlySummary[] = [];
  const quarterCount = Math.ceil(totalTenureMonths / 3);
  for (let q = 1; q <= quarterCount; q++) {
    const startIdx = (q - 1) * 3;
    const endIdx = Math.min(startIdx + 3, amortizationSchedule.length);
    const qMonths = amortizationSchedule.slice(startIdx, endIdx);
    const qPrincipal = Number(qMonths.reduce((acc, m) => acc + m.principal_payment, 0).toFixed(2));
    const qInterest = Number(qMonths.reduce((acc, m) => acc + m.interest_payment, 0).toFixed(2));
    const qTotal = Number(qMonths.reduce((acc, m) => acc + m.total_installment, 0).toFixed(2));
    const qEndBalance = qMonths[qMonths.length - 1].closing_balance;
    quarterlySchedule.push({
      quarter: q,
      principal_paid: qPrincipal,
      interest_paid: qInterest,
      total_paid: qTotal,
      ending_balance: qEndBalance,
    });
  }

  // 6. Multi-Scenario Stress Tests
  const revFactor = categoryId === "grocery" ? 0.14 : categoryId === "poultry" ? 0.11 : 0.09;
  const opexFactor = categoryId === "grocery" ? 0.115 : categoryId === "poultry" ? 0.075 : 0.055;
  const baseRev = totalProjectCost * revFactor;
  const baseOpex = totalProjectCost * opexFactor;

  const scenariosDef: Record<string, [number, number]> = {
    Conservative: [baseRev * 0.80, baseOpex * 1.10],
    Expected: [baseRev, baseOpex],
    Optimistic: [baseRev * 1.15, baseOpex],
  };

  const stressScenarios: Record<string, StressScenario> = {};
  for (const [name, [rev, opex]] of Object.entries(scenariosDef)) {
    const noi = rev - opex;
    const surplus = noi - monthlyActiveEmi;
    const dscr = Number((noi / Math.max(monthlyActiveEmi, 1)).toFixed(2));
    let riskLevel: StressScenario["risk_level"] = "Healthy";
    if (noi < monthlyActiveEmi) riskLevel = "Insolvent";
    else if (dscr < 1.10) riskLevel = "Critical Risk";
    else if (dscr < 1.50) riskLevel = "Moderate Risk";

    stressScenarios[name] = {
      name,
      revenue: Number(rev.toFixed(2)),
      opex: Number(opex.toFixed(2)),
      net_operating_income: Number(noi.toFixed(2)),
      debt_service_emi: monthlyActiveEmi,
      monthly_surplus: Number(surplus.toFixed(2)),
      dscr,
      risk_level: riskLevel,
    };
  }

  // 7. Evidence Pack
  const evidencePack: EvidenceObject[] = [
    {
      claim: `Project Cost sized at ₹${totalProjectCost.toLocaleString("en-IN")} from 10% entrepreneur equity contribution`,
      value: totalProjectCost,
      unit: "₹",
      source: "SIH26091 Financial Structuring Norms",
      source_type: "deterministic_math",
      geographic_resolution: "national",
      recency: "2026-09",
      confidence: 1.0,
      methodology: "P = Available_Margin / 0.10",
    },
    {
      claim: `Auto-routed to ${schemeTier} scheme at ${interestRate}% annual interest with ${moratoriumMonths}-month moratorium`,
      value: interestRate,
      unit: "% p.a.",
      source: "MoSJE / NBCFDC Scheme Framework",
      source_type: "government_scheme",
      geographic_resolution: "national",
      recency: "2026-09",
      confidence: 1.0,
      methodology: "Threshold routing: <= ₹1.4L -> Micro Finance (6.5%); > ₹1.4L -> Term Loan (8.0%)",
    },
  ];

  const disclaimer =
    "NOTICE: Indicative financial projection generated under SIH26091 assumptions. Formal sanction requires credit verification under applicable NBCFDC / NSFDC / state implementing agency guidelines.";

  return {
    available_margin: margin,
    total_project_cost: totalProjectCost,
    indicative_loan_amount: indicativeLoan,
    equity_percentage: equityPercentage,
    scheme_tier: schemeTier,
    annual_interest_rate: interestRate,
    tenure_years: tenureYears,
    total_tenure_months: totalTenureMonths,
    moratorium_months: moratoriumMonths,
    active_repayment_months: activeRepaymentMonths,
    monthly_moratorium_interest: monthlyMoratoriumInterest,
    monthly_active_emi: monthlyActiveEmi,
    total_interest_payable: totalInterestPaid,
    total_debt_service_cost: totalDebtService,
    stress_scenarios: stressScenarios,
    quarterly_schedule: quarterlySchedule,
    amortization_schedule: amortizationSchedule,
    disclaimer,
    evidence_pack: evidencePack,
  };
}
