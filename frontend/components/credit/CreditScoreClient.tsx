"use client";

import React, { useState, useMemo } from "react";
import {
  CreditCard,
  ShieldCheck,
  Award,
  Users,
  Building,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  CheckCircle,
  HelpCircle,
  Download,
  Printer,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CreditProfileInput, evaluateRuralCreditScore } from "../../lib/creditScore";

export const CreditScoreClient: React.FC = () => {
  const [profile, setProfile] = useState<CreditProfileInput>({
    fullName: "Rameshwar Yadav",
    age: 34,
    availableEquity: 100000,
    monthlyHouseholdIncome: 28000,
    existingDebtMonthlyEmi: 2500,
    isShgMember: true,
    shgVintageYears: 3,
    isCooperativeMember: true,
    hasPmVishwakarma: true,
    hasRsetiTraining: true,
    tradeExperienceYears: 5,
    hasPmtLandOrPatta: true,
    hasProductiveAsset: true,
    bankAccountVintageYears: 4,
    usesDigitalPayments: true,
    hasPastLoanDefault: false,
  });

  const result = useMemo(() => {
    return evaluateRuralCreditScore(profile);
  }, [profile]);

  // Convert 300-900 score into a 0-100 percentage for progress bar
  const scorePercent = Math.round(((result.score - 300) / 600) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-md border border-teal-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-700 text-teal-200 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Alternative Credit Intelligence for Unbanked Rural Micro-Entrepreneurs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Rural Entrepreneur Credit Scoring Engine
          </h1>
          <p className="text-xs sm:text-sm text-teal-200/90 mt-1 max-w-2xl leading-relaxed">
            Evaluates creditworthiness on a 300–900 scale using alternative social collateral, SHG peer-savings discipline, PM Vishwakarma certification, and cash-flow capacity rather than urban CIBIL scores.
          </p>
        </div>

        <Button
          onClick={handlePrint}
          variant="amber"
          className="gap-2 shadow-md shrink-0 print:hidden"
        >
          <Printer className="w-4 h-4" />
          <span>Print Credit Certificate</span>
        </Button>
      </div>

      {/* Main Layout: Form vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Profiling Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-700" />
                <span>1. Personal & Equity Foundation</span>
              </CardTitle>
              <CardDescription>
                Basic details and liquid personal capital backing your proposed enterprise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Entrepreneur Full Name</Label>
                  <Input
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Age (Years)</Label>
                  <Input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Available Own Margin Money (₹)</Label>
                  <Input
                    type="number"
                    step={5000}
                    value={profile.availableEquity}
                    onChange={(e) => setProfile({ ...profile, availableEquity: Number(e.target.value) })}
                    className="mt-1 font-mono font-bold"
                  />
                  <span className="text-[10px] text-teal-700 mt-1 block">
                    10% equity can finance up to ₹{(profile.availableEquity * 10).toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <Label>Monthly Household Income (₹)</Label>
                  <Input
                    type="number"
                    value={profile.monthlyHouseholdIncome}
                    onChange={(e) => setProfile({ ...profile, monthlyHouseholdIncome: Number(e.target.value) })}
                    className="mt-1 font-mono"
                  />
                </div>
              </div>

              <div>
                <Label>Existing Debt Service / Ongoing Monthly EMI (₹)</Label>
                <Input
                  type="number"
                  value={profile.existingDebtMonthlyEmi}
                  onChange={(e) => setProfile({ ...profile, existingDebtMonthlyEmi: Number(e.target.value) })}
                  className="mt-1 font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Collateral & SHG */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                <span>2. Social Collateral & Peer Standing</span>
              </CardTitle>
              <CardDescription>
                Participation in community micro-credit groups and local producer cooperatives.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <input
                  type="checkbox"
                  id="shgMember"
                  checked={profile.isShgMember}
                  onChange={(e) => setProfile({ ...profile, isShgMember: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded text-teal-700 focus:ring-teal-700"
                />
                <div className="flex-1 text-xs">
                  <label htmlFor="shgMember" className="font-bold text-slate-900 cursor-pointer block">
                    Active Member of NRLM/SRLM Self-Help Group (SHG) or JLG
                  </label>
                  <p className="text-slate-500 mt-0.5">
                    Peer credit discipline significantly reduces bank risk underwriting.
                  </p>
                  {profile.isShgMember && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <Label className="text-[11px]">SHG Membership Vintage (Years):</Label>
                      <Input
                        type="number"
                        min={1}
                        max={15}
                        value={profile.shgVintageYears}
                        onChange={(e) => setProfile({ ...profile, shgVintageYears: Number(e.target.value) })}
                        className="w-20 h-7 text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <input
                  type="checkbox"
                  id="coopMember"
                  checked={profile.isCooperativeMember}
                  onChange={(e) => setProfile({ ...profile, isCooperativeMember: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded text-teal-700 focus:ring-teal-700"
                />
                <div className="flex-1 text-xs">
                  <label htmlFor="coopMember" className="font-bold text-slate-900 cursor-pointer block">
                    Member of State Milk Cooperative (e.g. Medha/Amul) or FPO
                  </label>
                  <p className="text-slate-500 mt-0.5">
                    Guarantees direct collection route and transparent sales payment receipts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vocational Training & Asset Backing */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-700" />
                <span>3. Skills, Assets & Financial Discipline</span>
              </CardTitle>
              <CardDescription>
                Verifiable government certifications, trade tenure, and banking discipline.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={profile.hasPmVishwakarma}
                    onChange={(e) => setProfile({ ...profile, hasPmVishwakarma: e.target.checked })}
                    className="h-4 w-4 text-teal-700 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-800">PM Vishwakarma Certified</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={profile.hasRsetiTraining}
                    onChange={(e) => setProfile({ ...profile, hasRsetiTraining: e.target.checked })}
                    className="h-4 w-4 text-teal-700 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-800">RSETI / PMKVY Trained</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={profile.hasPmtLandOrPatta}
                    onChange={(e) => setProfile({ ...profile, hasPmtLandOrPatta: e.target.checked })}
                    className="h-4 w-4 text-teal-700 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-800">Land Patta / Homestead</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={profile.hasProductiveAsset}
                    onChange={(e) => setProfile({ ...profile, hasProductiveAsset: e.target.checked })}
                    className="h-4 w-4 text-teal-700 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-800">Pucca Shed / Equipment</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={profile.usesDigitalPayments}
                    onChange={(e) => setProfile({ ...profile, usesDigitalPayments: e.target.checked })}
                    className="h-4 w-4 text-teal-700 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-800">UPI / QR Payment Trail</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-red-200 bg-red-50/40 cursor-pointer hover:bg-red-50">
                  <input
                    type="checkbox"
                    checked={profile.hasPastLoanDefault}
                    onChange={(e) => setProfile({ ...profile, hasPastLoanDefault: e.target.checked })}
                    className="h-4 w-4 text-red-600 rounded"
                  />
                  <span className="text-xs font-semibold text-red-900">Recorded Past Loan Default</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Real-time Credit Score & Readiness Assessment (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="sticky top-20 border-teal-200 shadow-lg overflow-hidden">
            {/* Score Header */}
            <div className="p-6 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 block">
                RURAL CREDIT READINESS INDEX
              </span>

              {/* Score Meter Dial */}
              <div className="my-4">
                <div className="text-5xl font-black font-mono tracking-tight text-white">
                  {result.score}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">
                  Scale: 300 to 900 Points
                </div>
              </div>

              {/* Tier Badge */}
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${result.tierColor} shadow-xs`}
              >
                {result.tier}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-slate-300">
                <span>Risk Appraisal:</span>
                <strong className="text-teal-200">{result.riskRating} Risk</strong>
              </div>
            </div>

            <CardContent className="p-6 space-y-5">
              {/* Max Recommended Financing Cushion */}
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">
                    Recommended Max Sanction
                  </span>
                  <span className="text-lg font-black text-teal-800 font-mono">
                    ₹{result.maxSanctionAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <Badge variant="teal">
                  {result.maxRecommendedLoanMultiplier}x Equity
                </Badge>
              </div>

              {/* 5 Dimensions Progress Bars */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Credit Pillar Breakdown
                </h4>

                {Object.values(result.dimensionScores).map((dim, idx) => {
                  const pct = Math.round((dim.score / dim.max) * 100);
                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600 font-medium">
                        <span>{dim.label}</span>
                        <span className="font-mono font-bold text-slate-900">
                          {dim.score}/{dim.max}
                        </span>
                      </div>
                      <Progress value={pct} />
                    </div>
                  );
                })}
              </div>

              {/* Key Strengths */}
              {result.keyStrengths.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">
                    Verified Credit Strengths
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {result.keyStrengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvement Roadmap */}
              {result.recommendations.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Score Improvement Action Plan</span>
                  </h4>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2"
                      >
                        <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
