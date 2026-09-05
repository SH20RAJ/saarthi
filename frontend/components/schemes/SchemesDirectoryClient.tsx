"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Building2,
  Percent,
  CheckCircle,
  ExternalLink,
  Search,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

interface SchemeItem {
  id: string;
  name: string;
  ministry: string;
  maxProjectCost: string;
  interestRate: string;
  subsidyRate: string;
  tenure: string;
  moratorium: string;
  targetBeneficiary: string;
  keyFeatures: string[];
}

const SCHEMES: SchemeItem[] = [
  {
    id: "nbcfdc-term",
    name: "NBCFDC Term Loan Scheme",
    ministry: "Ministry of Social Justice & Empowerment (MoSJE)",
    maxProjectCost: "Up to ₹15.00 Lakh (Unit cost up to ₹50 Lakh)",
    interestRate: "6.0% - 8.0% p.a.",
    subsidyRate: "Interest subvention via State Channelising Agencies",
    tenure: "Up to 8 Years",
    moratorium: "6 Months",
    targetBeneficiary: "OBC / Marginalized rural micro-entrepreneurs",
    keyFeatures: [
      "Collateral-free financing up to ₹1.40 Lakh under Micro-Finance component",
      "Term loan support up to 90% of total project cost",
      "Direct disbursement through State Cooperative & RRB banks"
    ]
  },
  {
    id: "nsfdc-term",
    name: "NSFDC Term Loan & Micro-Credit Scheme",
    ministry: "Ministry of Social Justice & Empowerment (MoSJE)",
    maxProjectCost: "Up to ₹50.00 Lakh",
    interestRate: "6.0% - 8.0% p.a.",
    subsidyRate: "Margin money capital assistance up to 10%",
    tenure: "Up to 7 Years",
    moratorium: "6 Months",
    targetBeneficiary: "SC entrepreneurs living below double poverty line",
    keyFeatures: [
      "Micro-credit finance up to ₹1,40,000 @ 6.5% interest with 3-month grace",
      "Special focus on agricultural, dairy, and rural retail trades",
      "Mandatory entrepreneurship orientation training included"
    ]
  },
  {
    id: "pmegp",
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    ministry: "Ministry of MSME",
    maxProjectCost: "₹50 Lakh (Manufacturing) / ₹20 Lakh (Service)",
    interestRate: "Normal bank lending rate (9% - 11%)",
    subsidyRate: "25% (General Rural) to 35% (Special Category / SC / ST / Women)",
    tenure: "3 to 7 Years",
    moratorium: "Up to 6 Months",
    targetBeneficiary: "Any individual above 18 years for new micro-enterprises",
    keyFeatures: [
      "High capital subsidy credited upfront in bank lock-in term deposit",
      "Entrepreneur margin requirement only 5% for special categories",
      "Implemented directly by KVIC, KVIB, and District Industries Centres (DIC)"
    ]
  },
  {
    id: "mudra",
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    ministry: "Department of Financial Services, Ministry of Finance",
    maxProjectCost: "Shishu: ₹50k | Kishor: ₹5L | Tarun: ₹10L",
    interestRate: "8.5% - 11.5% p.a.",
    subsidyRate: "No capital subsidy; 100% collateral-free credit guarantee",
    tenure: "Up to 5 Years",
    moratorium: "Up to 3 Months",
    targetBeneficiary: "Non-corporate, non-farm micro and small enterprises",
    keyFeatures: [
      "No collateral or third-party guarantor required for loans up to ₹10 Lakh",
      "Mudra Debit Card issued for seamless working capital withdrawals",
      "Available at all Public Sector, Private, Regional Rural, and Small Finance Banks"
    ]
  },
  {
    id: "vishwakarma",
    name: "PM Vishwakarma Scheme",
    ministry: "Ministry of MSME & MoSJE",
    maxProjectCost: "Tier 1: ₹1 Lakh | Tier 2: ₹2 Lakh",
    interestRate: "Concessional 5% p.a. (Interest subvention cap of 8%)",
    subsidyRate: "₹15,000 modern toolkit incentive + ₹500/day stipend during training",
    tenure: "18 Months (Tier 1) / 30 Months (Tier 2)",
    moratorium: "Nil",
    targetBeneficiary: "Traditional rural artisans & craftspeople (18 trades)",
    keyFeatures: [
      "Free 5 to 7 days basic vocational skill verification & training",
      "Enterprise credit sanction without any physical collateral requirement",
      "Digital transaction incentive: ₹1 per digital transaction up to 100 txn/month"
    ]
  }
];

export const SchemesDirectoryClient: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = SCHEMES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetBeneficiary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-teal-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-700 text-teal-200 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Official Government Financial Scheme Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Government Scheme Directory & Auto-Router
          </h1>
          <p className="text-xs sm:text-sm text-teal-200 mt-1 max-w-2xl">
            Verified financing frameworks from the Ministry of Social Justice and Empowerment (MoSJE), NBCFDC, NSFDC, PMEGP, and MUDRA.
          </p>
        </div>

        <Link href="/credit-score">
          <Button variant="amber" size="sm" className="gap-1.5 shadow-md shrink-0">
            <span>Check Your Eligibility Score</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <Search className="w-5 h-5 text-slate-400 pl-1" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by scheme name, ministry, target beneficiary, or keyword..."
          className="border-none focus-visible:ring-0 text-xs sm:text-sm"
        />
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((scheme) => (
          <Card key={scheme.id} className="flex flex-col justify-between hover:border-teal-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                    {scheme.ministry}
                  </span>
                  <CardTitle className="text-base mt-0.5">{scheme.name}</CardTitle>
                </div>
                <Badge variant="teal" className="text-[9px] shrink-0 font-mono">
                  {scheme.interestRate}
                </Badge>
              </div>
              <CardDescription className="pt-1">
                Target: <strong>{scheme.targetBeneficiary}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 font-sans block text-[10px] uppercase font-bold">Max Project Cost</span>
                  <span className="font-bold text-slate-900">{scheme.maxProjectCost}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans block text-[10px] uppercase font-bold">Tenure & Grace</span>
                  <span className="font-bold text-slate-900">{scheme.tenure} ({scheme.moratorium} grace)</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block mb-1.5">
                  Core Scheme Provisions
                </span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  {scheme.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
