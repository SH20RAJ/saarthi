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
    <div className="space-y-4 max-w-7xl mx-auto py-2">
      {/* Context Control Bar (X-Style) */}
      <div className="bg-[#16181c] border border-[#2f3336] p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black border border-[#2f3336] text-[#71767b] text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1d9bf0]" />
            <span>SIH26091 • MoSJE Decision Support System</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Enterprise Feasibility & Viability Engine
          </h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Empirical demand evidence, competitor density, and deterministic financial structuring.
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
              <span>Print Dossier</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 3 Parameter Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#16181c] rounded-2xl border border-[#2f3336]">
        {/* Location */}
        <div className="p-2.5 rounded-xl bg-black border border-[#2f3336] flex items-center gap-3">
          <div className="p-2 rounded-full bg-[#16181c] text-[#1d9bf0]">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-[#71767b] block">Target Village / Block</span>
            <select
              value={selectedLocation.id}
              onChange={(e) => {
                const loc = LOCATIONS.find((l) => l.id === e.target.value);
                if (loc) setSelectedLocation(loc);
              }}
              className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer truncate"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-[#16181c] text-white">
                  {loc.name}, {loc.district} ({loc.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Business */}
        <div className="p-2.5 rounded-xl bg-black border border-[#2f3336] flex items-center gap-3">
          <div className="p-2 rounded-full bg-[#16181c] text-[#1d9bf0]">
            <Building className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-[#71767b] block">Enterprise Sector</span>
            <select
              value={selectedCategory.id}
              onChange={(e) => {
                const cat = BUSINESS_CATEGORIES.find((c) => c.id === e.target.value);
                if (cat) setSelectedCategory(cat);
              }}
              className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer truncate"
            >
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#16181c] text-white">
                  {cat.name} ({cat.risk_level} Risk)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Margin Input */}
        <div className="p-2.5 rounded-xl bg-black border border-[#2f3336] flex items-center gap-3">
          <div className="p-2 rounded-full bg-[#16181c] text-[#1d9bf0]">
            <Coins className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-[#71767b] block">Available Margin (10% Equity)</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#71767b]">₹</span>
              <input
                type="number"
                min={10000}
                max={500000}
                step={5000}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full bg-transparent text-xs font-bold text-white focus:outline-none font-mono"
              />
            </div>
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
