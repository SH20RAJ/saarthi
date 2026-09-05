"use client";

import React from "react";
import { Check, X, ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";
import { BUSINESS_CATEGORIES } from "../lib/constants";
import { BusinessCategory } from "../lib/types";

interface BusinessComparisonProps {
  selectedCategory: BusinessCategory;
  onSelectCategory: (cat: BusinessCategory) => void;
  margin: number;
  lang: "en" | "hi";
}

export const BusinessComparison: React.FC<BusinessComparisonProps> = ({
  selectedCategory,
  onSelectCategory,
  margin,
  lang,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {lang === "en" ? "Cross-Enterprise Comparison Matrix" : "विभिन्न व्यवसाय तुलना"}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === "en"
              ? "Evaluate comparative feasibility across 5 micro-enterprise sectors based on available capital"
              : "उपलब्ध पूंजी के आधार पर विभिन्न व्यवसायों की संभावनाओं की तुलना करें"}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-3">Enterprise Category</th>
              <th className="p-3">Min Capital</th>
              <th className="p-3">Demand Signal</th>
              <th className="p-3">Risk Factor</th>
              <th className="p-3">Capital Compatibility</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {BUSINESS_CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedCategory.id;
              const isAffordable = margin >= cat.min_capital;

              return (
                <tr
                  key={cat.id}
                  className={`transition-colors ${
                    isSelected ? "bg-teal-50/60 font-semibold" : "hover:bg-slate-50/50"
                  }`}
                >
                  <td className="p-3">
                    <div className="font-bold text-slate-900">
                      {lang === "en" ? cat.name : cat.name_hi}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal truncate max-w-xs">
                      {cat.description}
                    </div>
                  </td>
                  <td className="p-3 font-mono text-slate-700">
                    ₹{cat.min_capital.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.demand_level === "High"
                          ? "bg-teal-100 text-teal-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {cat.demand_level}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.risk_level === "Low"
                          ? "bg-emerald-100 text-emerald-800"
                          : cat.risk_level === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cat.risk_level} Risk
                    </span>
                  </td>
                  <td className="p-3">
                    {isAffordable ? (
                      <span className="inline-flex items-center gap-1 text-teal-700 font-bold">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>Sufficient</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                        <X className="w-3.5 h-3.5 text-red-500" />
                        <span>Shortfall</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onSelectCategory(cat)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        isSelected
                          ? "bg-teal-700 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-teal-100 hover:text-teal-800"
                      }`}
                    >
                      {isSelected ? "Active" : "Select"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
