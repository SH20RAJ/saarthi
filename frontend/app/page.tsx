"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  Building,
  Coins,
  FileText,
  Compass,
  BarChart3,
  GitCompare,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { FinancialCalculator } from "../components/FinancialCalculator";
import { CompetitorMap } from "../components/CompetitorMap";
import { FeasibilityScore } from "../components/FeasibilityScore";
import { BusinessComparison } from "../components/BusinessComparison";
import { FeasibilityReportModal } from "../components/FeasibilityReportModal";
import { VoiceAssistantModal } from "../components/VoiceAssistantModal";
import { LOCATIONS, BUSINESS_CATEGORIES } from "../lib/constants";
import { LocationContext, BusinessCategory } from "../lib/types";
import { calculateFinancialPlan } from "../lib/financial";

export default function Home() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [selectedLocation, setSelectedLocation] = useState<LocationContext>(LOCATIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory>(BUSINESS_CATEGORIES[0]);
  const [margin, setMargin] = useState<number>(100000);
  const [activeTab, setActiveTab] = useState<"overview" | "finance" | "geo" | "compare">("overview");

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Instant reactive financial calculation
  const plan = useMemo(() => {
    return calculateFinancialPlan(margin, undefined, selectedCategory.id);
  }, [margin, selectedCategory.id]);

  // 1-Click SIH Live Demo Handler (Kanke, Ranchi Dairy scenario)
  const handleLoadDemo = () => {
    setSelectedLocation(LOCATIONS[0]); // Kanke, Ranchi
    setSelectedCategory(BUSINESS_CATEGORIES[0]); // Dairy
    setMargin(100000); // ₹1,00,000
    setActiveTab("overview");
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        lang={lang}
        setLang={setLang}
        onLoadDemo={handleLoadDemo}
        onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
      />

      {/* Hero & Context Control Panel */}
      <section className="bg-gradient-to-b from-teal-900 via-teal-950 to-slate-900 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-teal-800/40">
        <div className="max-w-7xl mx-auto">
          {/* Tagline */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-800/60 border border-teal-700 text-teal-200 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                <span>Smart India Hackathon 2026 • SIH26091</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                {lang === "en" ? "Evidence Before Enterprise." : "उद्यम से पहले साक्ष्य।"}
              </h1>
              <p className="text-xs sm:text-sm text-teal-200/90 mt-1 max-w-2xl leading-relaxed">
                {lang === "en"
                  ? "Hyper-local business viability analytics and deterministic financial structuring for rural micro-entrepreneurs."
                  : "ग्रामीण उद्यमियों के लिए अति-स्थानीय बाजार विश्लेषण एवं निश्चित वित्तीय संरचना सहायक।"}
              </p>
            </div>

            {/* Quick Dossier Trigger */}
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>{lang === "en" ? "Generate Feasibility Dossier" : "व्यवहार्यता रिपोर्ट देखें"}</span>
            </button>
          </div>

          {/* 3-Step Scenario Control Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
            {/* Step 1: Village Location */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-800 text-teal-200 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-teal-200 block">
                  {lang === "en" ? "1. Target Location" : "१. लक्षित स्थान"}
                </label>
                <select
                  value={selectedLocation.id}
                  onChange={(e) => {
                    const loc = LOCATIONS.find((l) => l.id === e.target.value);
                    if (loc) setSelectedLocation(loc);
                  }}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer truncate"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                      {loc.name}, {loc.district} ({loc.state})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Enterprise Category */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-800 text-teal-200 shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-teal-200 block">
                  {lang === "en" ? "2. Business Sector" : "२. उद्यम क्षेत्र"}
                </label>
                <select
                  value={selectedCategory.id}
                  onChange={(e) => {
                    const cat = BUSINESS_CATEGORIES.find((c) => c.id === e.target.value);
                    if (cat) setSelectedCategory(cat);
                  }}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer truncate"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                      {lang === "en" ? cat.name : cat.name_hi}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Capital */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-600/30 text-amber-300 shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  {lang === "en" ? "3. Available Equity Margin" : "३. उपलब्ध स्वयं की पूंजी"}
                </label>
                <div className="text-xs font-black font-mono text-white">
                  ₹{margin.toLocaleString("en-IN")} → Total: ₹{plan.total_project_cost.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white p-1.5 rounded-2xl shadow-xs mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{lang === "en" ? "Feasibility & Verdict" : "व्यवहार्यता एवं निर्णय"}</span>
          </button>

          <button
            onClick={() => setActiveTab("finance")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "finance"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>{lang === "en" ? "Financial Structuring (SIH26091)" : "वित्तीय संरचना एवं ईएमआई"}</span>
          </button>

          <button
            onClick={() => setActiveTab("geo")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "geo"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{lang === "en" ? "Geospatial & Competitors" : "प्रतिस्पर्धी एवं स्थानिक मानचित्र"}</span>
          </button>

          <button
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "compare"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>{lang === "en" ? "Compare 5 Enterprises" : "५ व्यवसायों की तुलना"}</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <FeasibilityScore
              category={selectedCategory}
              location={selectedLocation}
              margin={margin}
              lang={lang}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CompetitorMap
                location={selectedLocation}
                categoryName={selectedCategory.name}
                lang={lang}
              />
              <FinancialCalculator
                plan={plan}
                margin={margin}
                setMargin={setMargin}
                lang={lang}
              />
            </div>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="space-y-6">
            <FinancialCalculator
              plan={plan}
              margin={margin}
              setMargin={setMargin}
              lang={lang}
            />
          </div>
        )}

        {activeTab === "geo" && (
          <div className="space-y-6">
            <CompetitorMap
              location={selectedLocation}
              categoryName={selectedCategory.name}
              lang={lang}
            />
          </div>
        )}

        {activeTab === "compare" && (
          <div className="space-y-6">
            <BusinessComparison
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveTab("overview");
              }}
              margin={margin}
              lang={lang}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong>SAARTHI AI</strong> — Ministry of Social Justice and Empowerment (MoSJE) • Smart India Hackathon 2026 (SIH26091)
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>ODbL OpenStreetMap</span>
            <span>•</span>
            <span>NBCFDC / NSFDC Norms</span>
            <span>•</span>
            <span>Cloudflare Workers Edge</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FeasibilityReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        category={selectedCategory}
        location={selectedLocation}
        plan={plan}
        margin={margin}
        lang={lang}
      />

      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        category={selectedCategory}
        location={selectedLocation}
        plan={plan}
        margin={margin}
        lang={lang}
      />
    </div>
  );
}
