"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GitCompare, ArrowLeft, ArrowRight, Check, X, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { BusinessComparison } from "../BusinessComparison";
import { BUSINESS_CATEGORIES } from "../../lib/constants";
import { BusinessCategory } from "../../lib/types";

export const CompareClient: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory>(BUSINESS_CATEGORIES[0]);
  const [margin, setMargin] = useState<number>(100000);

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
            <Badge variant="teal" className="text-[9px]">Decision Support Matrix</Badge>
          </div>
          <h1 className="text-2xl font-black">Cross-Enterprise Comparison Matrix</h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare capital adequacy, demand signals, competitive saturation, and risk ratings across 5 rural micro-enterprise sectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Equity Capital:</span>
          <Input
            type="number"
            step={5000}
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-32 bg-white/10 text-white font-mono font-bold h-9 border-white/20"
          />
        </div>
      </div>

      <BusinessComparison
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        margin={margin}
        lang="en"
      />
    </div>
  );
};
