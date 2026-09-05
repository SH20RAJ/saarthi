"use client";

import React, { useState } from "react";
import {
  Coins,
  Building2,
  Calendar,
  Percent,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { FinancialPlan } from "../lib/types";

interface FinancialCalculatorProps {
  plan: FinancialPlan;
  margin: number;
  setMargin: (m: number) => void;
  lang: "en" | "hi";
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  plan,
  margin,
  setMargin,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<"chart" | "quarterly" | "stress">("chart");

  const PRESETS = [10000, 50000, 100000, 200000, 500000];

  // Format Amortization chart data (sample every 3 months for visual clarity)
  const chartData = plan.amortization_schedule
    .filter((m) => m.month % 3 === 0 || m.month === 1 || m.month === plan.moratorium_months)
    .map((m) => ({
      month: `M${m.month}`,
      balance: Math.round(m.closing_balance),
      principal: Math.round(m.principal_payment),
      interest: Math.round(m.interest_payment),
      installment: Math.round(m.total_installment),
    }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-teal-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-teal-100 text-teal-800">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {lang === "en" ? "Deterministic Financial Structuring" : "निश्चित वित्तीय संरचना"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {lang === "en"
                ? "SIH26091 official financial norms • 100% deterministic arithmetic without LLM hallucination"
                : "SIH26091 आधिकारिक वित्तीय मानदंड • बिना किसी भ्रम के 100% सटीक गणना"}
            </p>
          </div>

          {/* Scheme Auto-Routing Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-700 text-white shadow-xs self-start sm:self-auto">
            <Building2 className="w-4 h-4 text-amber-300" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-teal-200 block leading-none">
                {lang === "en" ? "Auto-Routed Scheme" : "योजना श्रेणी"}
              </span>
              <span className="text-xs font-bold leading-tight">
                {plan.scheme_tier} ({plan.annual_interest_rate}% p.a.)
              </span>
            </div>
          </div>
        </div>

        {/* Capital Slider & Presets */}
        <div className="mt-6 pt-5 border-t border-slate-200/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {lang === "en" ? "Your Available Margin Money (Equity)" : "आपकी अपनी उपलब्ध पूंजी (मार्जिन)"}
            </label>
            <div className="text-lg font-extrabold text-teal-800 font-mono">
              ₹{margin.toLocaleString("en-IN")}
            </div>
          </div>

          <input
            type="range"
            min={5000}
            max={500000}
            step={5000}
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
          />

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[11px] font-medium text-slate-400 mr-1">
              {lang === "en" ? "Presets:" : "त्वरित चुनें:"}
            </span>
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setMargin(p)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                  margin === p
                    ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                ₹{(p / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Core Financial Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border-b border-slate-200">
        <div className="p-4 sm:p-5 bg-white">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            {lang === "en" ? "Total Project Cost" : "कुल परियोजना लागत"}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-mono">
            ₹{plan.total_project_cost.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-teal-700 font-medium mt-0.5 block">
            {lang === "en" ? "Margin / 0.10 (10% equity)" : "मार्जिन / 0.10 (10% पूंजी)"}
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            {lang === "en" ? "Indicative Financing" : "सांकेतिक ऋण राशि"}
          </span>
          <div className="text-xl sm:text-2xl font-black text-teal-700 mt-1 font-mono">
            ₹{plan.indicative_loan_amount.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            90% of Total Cost
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            {lang === "en" ? "Moratorium Grace" : "मोराटोरियम अनुग्रह अवधि"}
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1 font-mono">
            {plan.moratorium_months} {lang === "en" ? "Months" : "माह"}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            ₹{plan.monthly_moratorium_interest.toLocaleString("en-IN")}/mo (Interest only)
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-white">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            {lang === "en" ? "Post-Grace Monthly EMI" : "मासिक किस्त (ईएमआई)"}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-mono">
            ₹{plan.monthly_active_emi.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            {plan.active_repayment_months} active months @ {plan.annual_interest_rate}%
          </span>
        </div>
      </div>

      {/* Tabs for In-depth view */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("chart")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === "chart"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {lang === "en" ? "Amortization Curve" : "ऋण चुकता वक्र"}
            </button>
            <button
              onClick={() => setActiveTab("stress")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === "stress"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {lang === "en" ? "Cash-Flow Stress Test" : "तनाव परीक्षण (DSCR)"}
            </button>
            <button
              onClick={() => setActiveTab("quarterly")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === "quarterly"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {lang === "en" ? "Quarterly Table" : "त्रैमासिक तालिका"}
            </button>
          </div>

          <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
            Total Tenure: {plan.tenure_years} Years ({plan.total_tenure_months} Mo)
          </span>
        </div>

        {/* Tab 1: Amortization Chart */}
        {activeTab === "chart" && (
          <div>
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="emiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val: number) => [`₹${Number(val).toLocaleString("en-IN")}`, ""]}
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderRadius: "0.75rem",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    name={lang === "en" ? "Outstanding Loan Balance" : "बकाया ऋण"}
                    stroke="#0F766E"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#balanceGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="installment"
                    name={lang === "en" ? "Monthly Payment" : "मासिक भुगतान"}
                    stroke="#D97706"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#emiGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>
                <strong>Total Interest Accrual:</strong> ₹{plan.total_interest_payable.toLocaleString("en-IN")}
              </span>
              <span>
                <strong>Total Outflow:</strong> ₹{plan.total_debt_service_cost.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Cash-Flow Stress Tests */}
        {activeTab === "stress" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(plan.stress_scenarios).map((sc) => {
              const isHealthy = sc.risk_level === "Healthy";
              const isMod = sc.risk_level === "Moderate Risk";
              return (
                <div
                  key={sc.name}
                  className={`p-4 rounded-xl border transition-all ${
                    isHealthy
                      ? "bg-teal-50/40 border-teal-200"
                      : isMod
                      ? "bg-amber-50/40 border-amber-200"
                      : "bg-red-50/40 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {sc.name} Scenario
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isHealthy
                          ? "bg-teal-700 text-white"
                          : isMod
                          ? "bg-amber-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {sc.risk_level}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Monthly Revenue:</span>
                      <strong className="text-slate-900">₹{sc.revenue.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Operating Costs (OPEX):</span>
                      <strong className="text-slate-900">₹{sc.opex.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1">
                      <span>Net Operating Income:</span>
                      <strong className="text-teal-700">₹{sc.net_operating_income.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Debt EMI:</span>
                      <strong className="text-slate-900">₹{sc.debt_service_emi.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold">
                      <span>Net Free Cashflow:</span>
                      <span className={sc.monthly_surplus >= 0 ? "text-teal-800" : "text-red-700"}>
                        ₹{sc.monthly_surplus.toLocaleString("en-IN")}/mo
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Coverage Ratio (DSCR):</span>
                    <span
                      className={`font-mono font-bold text-xs ${
                        sc.dscr >= 1.5 ? "text-teal-800" : sc.dscr >= 1.1 ? "text-amber-800" : "text-red-800"
                      }`}
                    >
                      {sc.dscr}x
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Quarterly Schedule Table */}
        {activeTab === "quarterly" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2.5">Quarter</th>
                  <th className="p-2.5">Principal Paid</th>
                  <th className="p-2.5">Interest Paid</th>
                  <th className="p-2.5">Total Paid</th>
                  <th className="p-2.5">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {plan.quarterly_schedule.slice(0, 8).map((q) => (
                  <tr key={q.quarter} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-sans font-semibold text-slate-800">Q{q.quarter}</td>
                    <td className="p-2.5 text-teal-700">₹{q.principal_paid.toLocaleString("en-IN")}</td>
                    <td className="p-2.5 text-amber-700">₹{q.interest_paid.toLocaleString("en-IN")}</td>
                    <td className="p-2.5 font-bold text-slate-900">₹{q.total_paid.toLocaleString("en-IN")}</td>
                    <td className="p-2.5 text-slate-600">₹{q.ending_balance.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {plan.quarterly_schedule.length > 8 && (
              <p className="text-[11px] text-slate-400 mt-2 text-right">
                Showing first 8 quarters of {plan.quarterly_schedule.length} total quarters
              </p>
            )}
          </div>
        )}

        {/* Official MoSJE Disclaimer */}
        <div className="mt-5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>{plan.disclaimer}</div>
        </div>
      </div>
    </div>
  );
};
