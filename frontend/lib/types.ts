export interface LocationContext {
  id: string;
  name: string;
  panchayat: string;
  block: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  population_5km: number;
  households_5km: number;
  market_distance_km: number;
  road_connectivity: "High" | "Moderate" | "Low";
}

export interface BusinessCategory {
  id: string;
  name: string;
  name_hi: string;
  icon: string;
  description: string;
  description_hi: string;
  min_capital: number;
  typical_cost: number;
  demand_level: "High" | "Moderate" | "Growing";
  risk_level: "Low" | "Medium" | "High";
  monthly_rev_factor: number;
  monthly_opex_factor: number;
  key_risks: string[];
  key_opportunities: string[];
}

export interface EvidenceObject {
  claim: string;
  value: string | number;
  unit?: string;
  source: string;
  source_type: string;
  geographic_resolution: string;
  recency: string;
  confidence: number;
  methodology: string;
}

export interface AmortizationMonth {
  month: number;
  is_moratorium: boolean;
  principal_payment: number;
  interest_payment: number;
  total_installment: number;
  closing_balance: number;
}

export interface QuarterlySummary {
  quarter: number;
  principal_paid: number;
  interest_paid: number;
  total_paid: number;
  ending_balance: number;
}

export interface StressScenario {
  name: string;
  revenue: number;
  opex: number;
  net_operating_income: number;
  debt_service_emi: number;
  monthly_surplus: number;
  dscr: number;
  risk_level: "Healthy" | "Moderate Risk" | "Critical Risk" | "Insolvent";
}

export interface FinancialPlan {
  available_margin: number;
  total_project_cost: number;
  indicative_loan_amount: number;
  equity_percentage: number;
  scheme_tier: "Micro Finance" | "Term Loan";
  annual_interest_rate: number;
  tenure_years: number;
  total_tenure_months: number;
  moratorium_months: number;
  active_repayment_months: number;
  monthly_moratorium_interest: number;
  monthly_active_emi: number;
  total_interest_payable: number;
  total_debt_service_cost: number;
  stress_scenarios: Record<string, StressScenario>;
  quarterly_schedule: QuarterlySummary[];
  amortization_schedule: AmortizationMonth[];
  disclaimer: string;
  evidence_pack: EvidenceObject[];
}

export interface CompetitorPOI {
  id: string;
  name: string;
  category: string;
  distance_km: number;
  lat: number;
  lng: number;
  type: "competitor" | "mandi" | "supplier" | "transit";
}
