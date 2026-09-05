"use client";

import React from "react";
import { X, Printer, Download, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";
import { BusinessCategory, LocationContext, FinancialPlan } from "../lib/types";

interface FeasibilityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: BusinessCategory;
  location: LocationContext;
  plan: FinancialPlan;
  margin: number;
  lang: "en" | "hi";
}

export const FeasibilityReportModal: React.FC<FeasibilityReportModalProps> = ({
  isOpen,
  onClose,
  category,
  location,
  plan,
  margin,
  lang,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Action Bar (hidden in print) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {lang === "en" ? "Official Feasibility Dossier" : "आधिकारिक व्यवहार्यता रिपोर्ट"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === "en" ? "Print Dossier" : "प्रिंट करें"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed print:p-0">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-800 block">
                MINISTRY OF SOCIAL JUSTICE AND EMPOWERMENT (MoSJE)
              </span>
              <h1 className="text-xl font-black text-slate-900 mt-0.5">
                MICRO-ENTERPRISE FEASIBILITY & FINANCIAL STRUCTURING DOSSIER
              </h1>
              <p className="text-[11px] text-slate-500 mt-1">
                Generated via SAARTHI AI Platform • Smart India Hackathon 2026 (Problem Statement SIH26091)
              </p>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 bg-teal-50 text-teal-800 font-bold border border-teal-200 rounded text-[10px]">
                TIER: {plan.scheme_tier}
              </span>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Ref: SRTH-2026-{location.id.slice(0, 5)}</div>
            </div>
          </div>

          {/* Section 1: Entrepreneur & Location Context */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              1. Proposed Enterprise & Geospatial Context
            </h2>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <p className="text-slate-500">Business Category:</p>
                <p className="font-bold text-slate-900 text-sm">{category.name}</p>
                <p className="text-slate-500 mt-1">Target Village / Block:</p>
                <p className="font-bold text-slate-900">{location.name}, {location.block} Block, {location.district}</p>
              </div>
              <div>
                <p className="text-slate-500">5 km Catchment Population:</p>
                <p className="font-bold text-slate-900">{location.population_5km.toLocaleString("en-IN")} residents</p>
                <p className="text-slate-500 mt-1">Coordinates:</p>
                <p className="font-mono text-slate-700">{location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E</p>
              </div>
            </div>
          </div>

          {/* Section 2: Deterministic Financial Structure */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              2. Financial Structuring (SIH26091 Norms)
            </h2>
            <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr>
                  <td className="p-2 bg-slate-50 font-sans font-medium text-slate-600">Entrepreneur Own Margin:</td>
                  <td className="p-2 font-bold text-slate-900">₹{margin.toLocaleString("en-IN")} ({plan.equity_percentage}%)</td>
                </tr>
                <tr>
                  <td className="p-2 bg-slate-50 font-sans font-medium text-slate-600">Total Permissible Project Cost:</td>
                  <td className="p-2 font-bold text-slate-900">₹{plan.total_project_cost.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td className="p-2 bg-slate-50 font-sans font-medium text-slate-600">Indicative Financing (90% Loan):</td>
                  <td className="p-2 font-bold text-teal-700">₹{plan.indicative_loan_amount.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td className="p-2 bg-slate-50 font-sans font-medium text-slate-600">Applicable Scheme Tier & Rate:</td>
                  <td className="p-2 font-bold text-slate-900">{plan.scheme_tier} @ {plan.annual_interest_rate}% p.a.</td>
                </tr>
                <tr>
                  <td className="p-2 bg-slate-50 font-sans font-medium text-slate-600">Tenure & Moratorium:</td>
                  <td className="p-2 text-slate-900">{plan.tenure_years} Years ({plan.total_tenure_months} Months) with {plan.moratorium_months} Months Moratorium</td>
                </tr>
                <tr>
                  <td className="p-2 bg-slate-50 font-sans font-medium text-slate-600">Monthly Moratorium Interest:</td>
                  <td className="p-2 text-amber-700">₹{plan.monthly_moratorium_interest.toLocaleString("en-IN")}/mo</td>
                </tr>
                <tr>
                  <td className="p-2 bg-slate-50 font-sans font-medium text-slate-600">Post-Grace Active EMI:</td>
                  <td className="p-2 font-black text-slate-900">₹{plan.monthly_active_emi.toLocaleString("en-IN")}/mo</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Cash Flow Stress Test Analysis */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              3. Sensitivity & Cash Flow Stress Testing (DSCR)
            </h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              {Object.values(plan.stress_scenarios).map((sc) => (
                <div key={sc.name} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="font-bold text-[11px] block">{sc.name}</span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">DSCR: <strong>{sc.dscr}x</strong></span>
                  <span className="text-teal-800 font-bold block mt-1 font-mono">
                    ₹{sc.monthly_surplus.toLocaleString("en-IN")}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Provenance & Audit Trail */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              4. Evidence Provenance & Audit Trail
            </h2>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              {plan.evidence_pack.map((ev, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>{ev.claim}</strong> — <span className="text-slate-500">Source: {ev.source} (Confidence: {(ev.confidence * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Disclaimer */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-900 leading-normal">
            {plan.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
};
