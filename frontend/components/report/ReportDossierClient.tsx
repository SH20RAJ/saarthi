"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, Building2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { LOCATIONS, BUSINESS_CATEGORIES } from "../../lib/constants";
import { calculateFinancialPlan } from "../../lib/financial";

export const ReportDossierClient: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [margin, setMargin] = useState(100000);

  const plan = calculateFinancialPlan(margin, undefined, selectedCategory.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs print:hidden">
        <Link href="/dashboard" className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} variant="teal" size="sm" className="gap-1.5 shadow-sm">
            <Printer className="w-4 h-4" />
            <span>Print Official Dossier</span>
          </Button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-md space-y-8 text-slate-800 text-xs leading-relaxed print:p-0 print:border-none print:shadow-none">
        {/* Official Letterhead */}
        <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-800 block">
              MINISTRY OF SOCIAL JUSTICE AND EMPOWERMENT (MoSJE)
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              MICRO-ENTERPRISE FEASIBILITY & FINANCIAL STRUCTURING DOSSIER
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Generated via SAARTHI AI Platform • Smart India Hackathon 2026 (Problem Statement SIH26091)
            </p>
          </div>
          <div className="text-right">
            <span className="px-2.5 py-1 bg-teal-50 text-teal-800 font-bold border border-teal-200 rounded-lg text-xs">
              {plan.scheme_tier}
            </span>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">Ref: SRTH-2026-JH-{selectedLocation.id.slice(0, 5)}</div>
          </div>
        </div>

        {/* Section 1: Enterprise Overview */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3">
            1. Proposed Enterprise & Geospatial Setting
          </h2>
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-slate-500 font-medium">Enterprise Sector:</p>
              <p className="font-bold text-slate-900 text-sm">{selectedCategory.name}</p>
              <p className="text-slate-500 font-medium mt-2">Target Village & Block:</p>
              <p className="font-bold text-slate-900">{selectedLocation.name}, {selectedLocation.block} Block, {selectedLocation.district}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">5 km Catchment Population:</p>
              <p className="font-bold text-slate-900">{selectedLocation.population_5km.toLocaleString("en-IN")} residents</p>
              <p className="text-slate-500 font-medium mt-2">Geographic Coordinates:</p>
              <p className="font-mono text-slate-700">{selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lng.toFixed(4)}°E</p>
            </div>
          </div>
        </div>

        {/* Section 2: Deterministic Financial Plan */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3">
            2. Deterministic Financial Structuring (SIH26091 Norms)
          </h2>
          <table className="w-full border border-slate-200 rounded-xl overflow-hidden text-xs">
            <tbody className="divide-y divide-slate-200 font-mono">
              <tr>
                <td className="p-3 bg-slate-50 font-sans font-medium text-slate-600">Entrepreneur Available Margin:</td>
                <td className="p-3 font-bold text-slate-900">₹{margin.toLocaleString("en-IN")} ({plan.equity_percentage}% Equity)</td>
              </tr>
              <tr>
                <td className="p-3 bg-slate-50 font-sans font-medium text-slate-600">Total Permissible Project Cost:</td>
                <td className="p-3 font-bold text-slate-900">₹{plan.total_project_cost.toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td className="p-3 bg-slate-50 font-sans font-medium text-slate-600">Indicative Loan Amount (90% Financing):</td>
                <td className="p-3 font-bold text-teal-700">₹{plan.indicative_loan_amount.toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td className="p-3 bg-slate-50 font-sans font-medium text-slate-600">Auto-Routed Scheme Tier:</td>
                <td className="p-3 font-bold text-slate-900">{plan.scheme_tier} @ {plan.annual_interest_rate}% p.a.</td>
              </tr>
              <tr>
                <td className="p-3 bg-slate-50 font-sans font-medium text-slate-600">Total Tenure & Grace:</td>
                <td className="p-3 text-slate-900">{plan.tenure_years} Years with {plan.moratorium_months} Months Moratorium Period</td>
              </tr>
              <tr>
                <td className="p-3 bg-slate-50 font-sans font-medium text-slate-600">Monthly Moratorium Simple Interest:</td>
                <td className="p-3 text-amber-700">₹{plan.monthly_moratorium_interest.toLocaleString("en-IN")}/mo</td>
              </tr>
              <tr>
                <td className="p-3 bg-slate-50 font-sans font-medium text-slate-600">Post-Grace Active Repayment EMI:</td>
                <td className="p-3 font-black text-slate-900">₹{plan.monthly_active_emi.toLocaleString("en-IN")}/mo ({plan.active_repayment_months} active installments)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Stress Testing */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3">
            3. Multi-Scenario Sensitivity Stress Testing (DSCR)
          </h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            {Object.values(plan.stress_scenarios).map((sc) => (
              <div key={sc.name} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <span className="font-bold block text-slate-900">{sc.name} Scenario</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">DSCR: <strong>{sc.dscr}x</strong></span>
                <span className="text-teal-800 font-bold block mt-1 font-mono">
                  ₹{sc.monthly_surplus.toLocaleString("en-IN")}/mo Surplus
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>{plan.disclaimer}</div>
        </div>
      </div>
    </div>
  );
};
