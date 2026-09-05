"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Building,
  Coins,
  ShieldCheck,
  FileText,
  CreditCard,
  Compass,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { FeasibilityScore } from "../FeasibilityScore";
import { CompetitorMap } from "../CompetitorMap";
import { FinancialCalculator } from "../FinancialCalculator";
import { LOCATIONS, BUSINESS_CATEGORIES } from "../../lib/constants";
import { LocationContext, BusinessCategory } from "../../lib/types";
import { calculateFinancialPlan } from "../../lib/financial";

export const DashboardOverviewClient: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationContext>(LOCATIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory>(BUSINESS_CATEGORIES[0]);
  const [margin, setMargin] = useState<number>(100000);

  const plan = useMemo(() => {
    return calculateFinancialPlan(margin, undefined, selectedCategory.id);
  }, [margin, selectedCategory.id]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Context Control Bar */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 rounded-3xl shadow-sm border border-teal-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-800/60 text-teal-200 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>SIH26091 • MoSJE Decision Support System</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Hyper-Local Enterprise Feasibility Dashboard
          </h1>
          <p className="text-xs text-teal-200/90 mt-0.5">
            Empirical evidence, competitor density, and deterministic financial structuring.
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
            <Button variant="amber" size="sm" className="gap-1.5 shadow-md">
              <FileText className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 Parameter Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Location */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-100 text-teal-800">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Location Target</span>
            <select
              value={selectedLocation.id}
              onChange={(e) => {
                const loc = LOCATIONS.find((l) => l.id === e.target.value);
                if (loc) setSelectedLocation(loc);
              }}
              className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer truncate"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}, {loc.district} ({loc.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Business */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-100 text-teal-800">
            <Building className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Sector / Category</span>
            <select
              value={selectedCategory.id}
              onChange={(e) => {
                const cat = BUSINESS_CATEGORIES.find((c) => c.id === e.target.value);
                if (cat) setSelectedCategory(cat);
              }}
              className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer truncate"
            >
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Capital */}
        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
            <Coins className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-amber-800 block">Your Equity Margin</span>
            <span className="text-xs font-black text-slate-900 font-mono">
              ₹{margin.toLocaleString("en-IN")} → Total: ₹{plan.total_project_cost.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Core Feasibility Score & Reasons */}
      <FeasibilityScore
        category={selectedCategory}
        location={selectedLocation}
        margin={margin}
        lang="en"
      />

      {/* Two-Column Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompetitorMap
          location={selectedLocation}
          categoryName={selectedCategory.name}
          lang="en"
        />
        <FinancialCalculator
          plan={plan}
          margin={margin}
          setMargin={setMargin}
          lang="en"
        />
      </div>
    </div>
  );
};
