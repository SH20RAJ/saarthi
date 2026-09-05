"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Coins, Building2, ShieldCheck, ArrowLeft, FileText, CreditCard } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { FinancialCalculator } from "../FinancialCalculator";
import { calculateFinancialPlan } from "../../lib/financial";
import { BUSINESS_CATEGORIES } from "../../lib/constants";

export const FinanceClient: React.FC = () => {
  const [margin, setMargin] = useState<number>(100000);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("dairy");

  const plan = useMemo(() => {
    return calculateFinancialPlan(margin, undefined, selectedCategoryId);
  }, [margin, selectedCategoryId]);

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#16181c] border border-[#2f3336] text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-[#1d9bf0] hover:text-[#1a8cd8] flex items-center gap-1 text-xs font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Feasibility</span>
            </Link>
            <span className="text-[#71767b]">•</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black border border-[#2f3336] text-[#71767b]">
              SIH26091 Module 2
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold">Financial Structuring & Repayment Engine</h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Deterministic loan sizing, scheme threshold auto-routing, moratorium schedules, and cash-flow stress tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/credit-score">
            <button className="px-3.5 py-1.5 rounded-full border border-[#2f3336] bg-black text-white hover:bg-[#202327] text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <CreditCard className="w-3.5 h-3.5 text-[#1d9bf0]" />
              <span>Credit Score</span>
            </button>
          </Link>
          <Link href="/report">
            <button className="px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-[#d7dbdc] text-xs font-bold flex items-center gap-1.5 transition-colors">
              <FileText className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Calculator */}
      <FinancialCalculator
        plan={plan}
        margin={margin}
        setMargin={setMargin}
        lang="en"
      />
    </div>
  );
};
