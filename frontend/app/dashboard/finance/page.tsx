import React from "react";
import { FinanceClient } from "../../../components/finance/FinanceClient";

export const metadata = {
  title: "Financial Structuring & Repayment Simulator | SAARTHI AI",
  description: "SIH26091 deterministic loan sizing, scheme auto-routing, and moratorium amortization.",
};

export default function FinancePage() {
  return <FinanceClient />;
}
