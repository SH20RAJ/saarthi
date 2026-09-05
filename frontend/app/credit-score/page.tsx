import React from "react";
import { CreditScoreClient } from "../../components/credit/CreditScoreClient";

export const metadata = {
  title: "Rural Entrepreneur Credit Scoring Engine (300-900) | SAARTHI AI",
  description:
    "Alternative credit readiness index for rural micro-entrepreneurs using social collateral, SHG discipline, and skill certifications.",
};

export default function CreditScorePage() {
  return <CreditScoreClient />;
}
