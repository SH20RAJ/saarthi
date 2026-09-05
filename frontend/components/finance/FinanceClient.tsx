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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link href="/dashboard" className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-xs font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-slate-500">•</span>
            <Badge variant="teal" className="text-[9px]">SIH26091 Module 2</Badge>
          </div>
          <h1 className="text-2xl font-black">Financial Structuring & Repayment Simulator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic loan sizing, scheme threshold auto-routing, moratorium schedules, and cash-flow stress tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/credit-score">
            <Button variant="outline" size="sm" className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              <span>Credit Score (300-900)</span>
            </Button>
          </Link>
          <Link href="/report">
            <Button variant="amber" size="sm" className="gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </Button>
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
