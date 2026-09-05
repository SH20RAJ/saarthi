export interface CreditProfileInput {
  fullName: string;
  age: number;
  availableEquity: number;
  monthlyHouseholdIncome: number;
  existingDebtMonthlyEmi: number;
  
  // Social Collateral
  isShgMember: boolean;
  shgVintageYears: number; // 0 to 10+
  isCooperativeMember: boolean; // e.g. Milk cooperative
  
  // Skills & Certification
  hasPmVishwakarma: boolean;
  hasRsetiTraining: boolean;
  tradeExperienceYears: number;
  
  // Physical & Productive Assets
  hasPmtLandOrPatta: boolean;
  hasProductiveAsset: boolean; // e.g. Cattle shed, irrigation, tractor/tempo
  
  // Banking Discipline
  bankAccountVintageYears: number;
  usesDigitalPayments: boolean; // UPI / AePS
  hasPastLoanDefault: boolean;
}

export interface CreditScoreResult {
  score: number; // 300 to 900
  tier: "Tier A: Prime Micro-Borrower" | "Tier B: Good Standing" | "Tier C: Moderate Risk" | "Tier D: Incubation Needed";
  tierColor: string;
  riskRating: "Very Low" | "Low" | "Moderate" | "High";
  maxRecommendedLoanMultiplier: number;
  maxSanctionAmount: number;
  dimensionScores: {
    equityAndCashflow: { score: number; max: 225; label: "Equity & Savings Buffer" };
    socialCollateral: { score: number; max: 225; label: "Community & SHG Standing" };
    vocationalCapability: { score: number; max: 180; label: "Trade Skills & Certifications" };
    productiveAssets: { score: number; max: 135; label: "Asset & Land Backing" };
    bankingDiscipline: { score: number; max: 135; label: "Financial & Banking History" };
  };
  recommendations: string[];
  keyStrengths: string[];
  flaggedRisks: string[];
}

export function evaluateRuralCreditScore(input: CreditProfileInput): CreditScoreResult {
  let equityScore = 0;
  let socialScore = 0;
  let skillScore = 0;
  let assetScore = 0;
  let bankingScore = 0;

  const keyStrengths: string[] = [];
  const flaggedRisks: string[] = [];
  const recommendations: string[] = [];

  // 1. Equity & Savings Buffer (Max 225 pts)
  if (input.availableEquity >= 100000) {
    equityScore += 140;
    keyStrengths.push(`Strong personal equity reserve of ₹${input.availableEquity.toLocaleString("en-IN")}`);
  } else if (input.availableEquity >= 50000) {
    equityScore += 110;
  } else if (input.availableEquity >= 20000) {
    equityScore += 80;
  } else {
    equityScore += 50;
    flaggedRisks.push("Modest equity cushion under ₹20,000");
  }

  // Debt-to-income check
  const netIncome = Math.max(1, input.monthlyHouseholdIncome);
  const dti = input.existingDebtMonthlyEmi / netIncome;
  if (dti <= 0.15) {
    equityScore += 85;
    keyStrengths.push("Negligible existing debt burden (<15% of income)");
  } else if (dti <= 0.35) {
    equityScore += 55;
  } else {
    equityScore += 20;
    flaggedRisks.push("Elevated existing monthly debt service (>35% of income)");
  }

  // 2. Community & Social Collateral (Max 225 pts)
  if (input.isShgMember) {
    const shgPoints = Math.min(135, 60 + input.shgVintageYears * 15);
    socialScore += shgPoints;
    keyStrengths.push(`Active SHG member with ${input.shgVintageYears} years of peer-savings discipline`);
  } else {
    flaggedRisks.push("No active Self-Help Group (SHG) membership");
    recommendations.push("Join a local NRLM/SRLM registered Self-Help Group to build social collateral");
  }

  if (input.isCooperativeMember) {
    socialScore += 90;
    keyStrengths.push("Registered producer cooperative linkage (assured buyer network)");
  } else {
    socialScore += 20;
    recommendations.push("Register with a local milk union or farmer producer company (FPO)");
  }

  // 3. Vocational Capability & Certifications (Max 180 pts)
  if (input.hasPmVishwakarma) {
    skillScore += 80;
    keyStrengths.push("Certified under Government of India PM Vishwakarma Scheme");
  }
  if (input.hasRsetiTraining) {
    skillScore += 50;
    keyStrengths.push("Completed certified RSETI / PMKVY enterprise training");
  } else if (!input.hasPmVishwakarma) {
    recommendations.push("Enroll in free 10-day RSETI (Rural Self Employment Training Institute) course");
  }

  const expPoints = Math.min(50, input.tradeExperienceYears * 10);
  skillScore += expPoints;
  if (input.tradeExperienceYears >= 3) {
    keyStrengths.push(`${input.tradeExperienceYears}+ years of hands-on sector experience`);
  }

  // 4. Productive Assets & Land Backing (Max 135 pts)
  if (input.hasPmtLandOrPatta) {
    assetScore += 70;
    keyStrengths.push("Documented land holding / homestead patta");
  } else {
    recommendations.push("Obtain Gram Panchayat verification certificate for operating premises");
  }

  if (input.hasProductiveAsset) {
    assetScore += 65;
    keyStrengths.push("Ownership of productive physical assets (shed/machinery)");
  }

  // 5. Banking Discipline & Digital Footprint (Max 135 pts)
  if (input.bankAccountVintageYears >= 3) {
    bankingScore += 55;
    keyStrengths.push(`${input.bankAccountVintageYears}+ years bank account relationship`);
  } else {
    bankingScore += 30;
  }

  if (input.usesDigitalPayments) {
    bankingScore += 50;
    keyStrengths.push("Active digital UPI / AePS payment trail");
  } else {
    recommendations.push("Adopt QR code payments for business sales to record verifiable turnover");
  }

  if (input.hasPastLoanDefault) {
    bankingScore = Math.max(0, bankingScore - 60);
    flaggedRisks.push("Recorded past loan delinquency or overdue KCC facility");
    recommendations.push("Clear outstanding dues or obtain No-Dues Certificate from lending bank");
  } else {
    bankingScore += 30;
  }

  // Aggregate Total (Base 300 + up to 600 earned points = 300 to 900)
  const earnedPoints = Math.min(
    600,
    equityScore + socialScore + skillScore + assetScore + bankingScore
  );
  const totalScore = Math.round(300 + earnedPoints);

  let tier: CreditScoreResult["tier"] = "Tier B: Good Standing";
  let tierColor = "text-teal-700 bg-teal-50 border-teal-200";
  let riskRating: CreditScoreResult["riskRating"] = "Low";
  let maxMultiplier = 9.0;

  if (totalScore >= 750) {
    tier = "Tier A: Prime Micro-Borrower";
    tierColor = "text-emerald-700 bg-emerald-50 border-emerald-300";
    riskRating = "Very Low";
    maxMultiplier = 10.0;
  } else if (totalScore >= 670) {
    tier = "Tier B: Good Standing";
    tierColor = "text-teal-700 bg-teal-50 border-teal-300";
    riskRating = "Low";
    maxMultiplier = 9.0;
  } else if (totalScore >= 580) {
    tier = "Tier C: Moderate Risk";
    tierColor = "text-amber-700 bg-amber-50 border-amber-300";
    riskRating = "Moderate";
    maxMultiplier = 6.0;
    recommendations.push("Provide a joint SHG peer guarantor to qualify for standard interest rate");
  } else {
    tier = "Tier D: Incubation Needed";
    tierColor = "text-red-700 bg-red-50 border-red-300";
    riskRating = "High";
    maxMultiplier = 4.0;
    recommendations.push("Attend mandatory EDP training before submitting formal loan proposal");
  }

  const maxSanctionAmount = Math.round(input.availableEquity * maxMultiplier);

  return {
    score: totalScore,
    tier,
    tierColor,
    riskRating,
    maxRecommendedLoanMultiplier: maxMultiplier,
    maxSanctionAmount,
    dimensionScores: {
      equityAndCashflow: { score: equityScore, max: 225, label: "Equity & Savings Buffer" },
      socialCollateral: { score: socialScore, max: 225, label: "Community & SHG Standing" },
      vocationalCapability: { score: skillScore, max: 180, label: "Trade Skills & Certifications" },
      productiveAssets: { score: assetScore, max: 135, label: "Asset & Land Backing" },
      bankingDiscipline: { score: bankingScore, max: 135, label: "Financial & Banking History" },
    },
    recommendations: recommendations.slice(0, 4),
    keyStrengths: keyStrengths.slice(0, 5),
    flaggedRisks: flaggedRisks.slice(0, 3),
  };
}
