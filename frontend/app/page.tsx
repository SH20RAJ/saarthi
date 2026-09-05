import React from "react";
import Link from "next/link";
import {
  Compass,
  Coins,
  ShieldCheck,
  CreditCard,
  Building,
  Bot,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  GitCompare,
  TrendingUp,
  PlayCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";

export const metadata = {
  title: "SAARTHI | Evidence Before Enterprise (SIH26091)",
  description:
    "AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs.",
};

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 text-white p-8 sm:p-14 overflow-hidden border border-teal-800/40 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/70 border border-teal-700 text-teal-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Smart India Hackathon 2026 • Ministry of Social Justice & Empowerment</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Evidence Before Enterprise.
          </h1>

          <p className="text-sm sm:text-base text-teal-200/90 leading-relaxed max-w-2xl font-normal">
            A research-backed, evidence-grounded decision support platform for rural micro-entrepreneurs.
            Combines hyper-local geospatial catchment analysis, deterministic loan sizing, alternative credit profiling, and grounded AI advice.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/dashboard">
              <Button variant="teal" size="lg" className="gap-2 shadow-lg">
                <PlayCircle className="w-4 h-4 text-amber-300" />
                <span>Launch Feasibility Demo</span>
              </Button>
            </Link>

            <Link href="/credit-score">
              <Button variant="outline" size="lg" className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>Check Rural Credit Score (300-900)</span>
              </Button>
            </Link>

            <Link href="/advisor">
              <Button variant="ghost" size="lg" className="gap-2 text-teal-200 hover:text-white hover:bg-white/10">
                <Bot className="w-4 h-4" />
                <span>Copilot AI Advisor</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Grid Accent in Background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none hidden md:block" />
      </section>

      {/* Feature Pillar Grid */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <Badge variant="teal" className="text-[10px]">
            Comprehensive SIH26091 Architecture
          </Badge>
          <h2 className="text-2xl font-black text-slate-900">
            Four Core Pillars of Rural Micro-Enterprise Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Pillar 1: Feasibility */}
          <Card className="hover:border-teal-300 transition-all">
            <CardHeader className="pb-3">
              <div className="p-3 w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2">
                <Compass className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">1. Geospatial & Feasibility</CardTitle>
              <CardDescription>
                5 km & 10 km concentric catchment radius, competitor clustering, and SHAP explainable reason codes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard" className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">
                <span>View Feasibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Pillar 2: Financial Structuring */}
          <Card className="hover:border-teal-300 transition-all">
            <CardHeader className="pb-3">
              <div className="p-3 w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
                <Coins className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">2. Deterministic Financials</CardTitle>
              <CardDescription>
                100% deterministic arithmetic. Auto-routes Micro Finance (&le;₹1.4L @ 6.5%) vs Term Loan (&gt;₹1.4L @ 8.0%).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/finance" className="text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1">
                <span>Simulate Repayment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Pillar 3: Rural Credit Score */}
          <Card className="hover:border-teal-300 transition-all">
            <CardHeader className="pb-3">
              <div className="p-3 w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <CreditCard className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">3. Rural Credit Score</CardTitle>
              <CardDescription>
                300–900 alternative credit index evaluating SHG membership, PM Vishwakarma certification, and savings buffer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/credit-score" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
                <span>Assess Credit Score</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Pillar 4: Copilot AI */}
          <Card className="hover:border-teal-300 transition-all">
            <CardHeader className="pb-3">
              <div className="p-3 w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-2">
                <Bot className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">4. Copilot AI Advisor</CardTitle>
              <CardDescription>
                Bilingual voice & conversational assistant with tools to inspect schemes, compute EMIs, and explain risks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/advisor" className="text-xs font-bold text-slate-800 hover:text-slate-900 inline-flex items-center gap-1">
                <span>Chat with Advisor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benchmark Demo Teaser */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <Badge variant="teal" className="text-[10px] mb-2">
            3-Minute Hackathon Demonstration
          </Badge>
          <h3 className="text-xl font-black">Preloaded Benchmark: Kanke, Ranchi (Dairy Unit)</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Explore a complete case study of a rural entrepreneur with ₹1,00,000 equity, demonstrating 90% term loan financing (₹9,00,000), 6-month moratorium grace, and DSCR stress testing.
          </p>
        </div>

        <Link href="/dashboard">
          <Button variant="amber" size="lg" className="gap-2 shadow-md shrink-0">
            <PlayCircle className="w-4 h-4" />
            <span>Launch Preloaded Demo</span>
          </Button>
        </Link>
      </section>
    </div>
  );
}
