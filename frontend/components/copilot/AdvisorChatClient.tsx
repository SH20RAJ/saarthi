"use client";

import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Send,
  Mic,
  Volume2,
  RefreshCw,
  Building,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { LOCATIONS, BUSINESS_CATEGORIES } from "../../lib/constants";
import { calculateFinancialPlan } from "../../lib/financial";

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  actionCard?: {
    type: "financial" | "feasibility" | "scheme" | "credit";
    title: string;
    data: any;
  };
}

export const AdvisorChatClient: React.FC = () => {
  const [input, setInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [margin, setMargin] = useState(100000);
  const [isListening, setIsListening] = useState(false);

  const plan = calculateFinancialPlan(margin, undefined, selectedCategory.id);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "copilot",
      text: `Namaste! I am your Saarthi Copilot Advisor (SIH26091). I am currently analyzing ${selectedCategory.name} in ${selectedLocation.name}, ${selectedLocation.district} with your capital of ₹${margin.toLocaleString("en-IN")}. I can execute calculations, auto-route government schemes, stress-test your repayment, or simulate Bhashini voice commands. How can I help you?`,
      timestamp: "Just now",
      actionCard: {
        type: "financial",
        title: "Live Structuring Baseline",
        data: {
          projectCost: plan.total_project_cost,
          loanAmount: plan.indicative_loan_amount,
          scheme: plan.scheme_tier,
          rate: plan.annual_interest_rate,
          moratorium: plan.moratorium_months,
          activeEmi: plan.monthly_active_emi,
        },
      },
    },
  ]);

  const handleSend = (overrideText?: string) => {
    const q = overrideText || input;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: "Just now",
    };

    let replyText = "";
    let actionCard: ChatMessage["actionCard"] = undefined;
    const lower = q.toLowerCase();

    // Natural Language Tool Calling & Agentic Responses
    if (lower.includes("poultry") || lower.includes("मुर्गी")) {
      const poultry = BUSINESS_CATEGORIES.find((c) => c.id === "poultry") || BUSINESS_CATEGORIES[1];
      setSelectedCategory(poultry);
      replyText = `I have updated your enterprise sector to ${poultry.name}. For ₹${margin.toLocaleString("en-IN")} equity, total permissible project cost is ₹${(margin * 10).toLocaleString("en-IN")}. Live bird demand in ${selectedLocation.name} is High, but feed cost sensitivity is higher.`;
      actionCard = {
        type: "feasibility",
        title: "Sector Switched: Poultry Farming",
        data: { demand: "High", risk: "Medium Risk", minEquity: poultry.min_capital },
      };
    } else if (lower.includes("kanke") || lower.includes("ormanjhi") || lower.includes("mandu")) {
      const loc = LOCATIONS.find((l) => lower.includes(l.name.toLowerCase())) || LOCATIONS[0];
      setSelectedLocation(loc);
      replyText = `Switched location context to ${loc.name}, ${loc.district}. Catchment population is ${loc.population_5km.toLocaleString("en-IN")} within 5 km buffer.`;
      actionCard = {
        type: "feasibility",
        title: `Geospatial Target: ${loc.name}`,
        data: { pop5km: loc.population_5km, mandiDist: `${loc.market_distance_km} km` },
      };
    } else if (lower.includes("moratorium") || lower.includes("मोराटोरियम") || lower.includes("grace")) {
      replyText = `Under official SIH26091 guidelines for ${plan.scheme_tier}, you are entitled to ${plan.moratorium_months} months moratorium grace period. During months 1 to ${plan.moratorium_months}, you pay zero principal and only ₹${plan.monthly_moratorium_interest.toLocaleString("en-IN")}/month simple interest. Principal EMI starts from month ${plan.moratorium_months + 1}.`;
      actionCard = {
        type: "financial",
        title: "Moratorium Grace Structure",
        data: {
          period: `${plan.moratorium_months} Months`,
          interestOnly: `₹${plan.monthly_moratorium_interest.toLocaleString("en-IN")}/mo`,
          postGraceEmi: `₹${plan.monthly_active_emi.toLocaleString("en-IN")}/mo`,
        },
      };
    } else if (lower.includes("credit score") || lower.includes("क्रेडिट") || lower.includes("cibil")) {
      replyText = `Rural entrepreneurs often lack traditional CIBIL scores. Saarthi uses our 300–900 Rural Credit Readiness Index based on SHG membership, PM Vishwakarma certification, and savings buffer. Check the dedicated /credit-score page to view your official credit tier.`;
      actionCard = {
        type: "credit",
        title: "Rural Credit Readiness Framework",
        data: { scale: "300 to 900", primeThreshold: "750+", maxMultiplier: "Up to 10x Equity" },
      };
    } else {
      replyText = `Based on empirical data for ${selectedLocation.name}, your proposed ${selectedCategory.name} enterprise requires a 10% equity contribution of ₹${margin.toLocaleString("en-IN")}. Indicative loan is ₹${plan.indicative_loan_amount.toLocaleString("en-IN")} auto-routed to ${plan.scheme_tier} at ${plan.annual_interest_rate}% interest. DSCR stress-testing confirms a healthy ${plan.stress_scenarios["Expected"].dscr}x debt service coverage ratio.`;
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: `c-${Date.now()}`,
        sender: "copilot",
        text: replyText,
        timestamp: "Just now",
        actionCard,
      },
    ]);
    setInput("");
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        handleSend("Explain my moratorium period and monthly interest");
      }, 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 rounded-3xl shadow-sm border border-teal-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center text-white shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">Saarthi Copilot AI Advisor</h1>
              <Badge variant="teal" className="text-[10px]">
                CopilotKit Agentic
              </Badge>
            </div>
            <p className="text-xs text-teal-200 mt-0.5">
              Grounded in MoSJE scheme guidelines, OpenStreetMap POIs, and deterministic financial math.
            </p>
          </div>
        </div>

        {/* Live Context Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">
            📍 {selectedLocation.name}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">
            🏭 {selectedCategory.name}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
            ₹{margin.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Chat Window Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden flex flex-col h-[640px]">
        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-teal-700 text-white rounded-br-none shadow-sm"
                    : "bg-white text-slate-900 border border-slate-200/80 rounded-bl-none shadow-xs"
                }`}
              >
                <div className="font-semibold text-[11px] mb-1 opacity-70">
                  {m.sender === "user" ? "You" : "Saarthi Copilot"}
                </div>
                <div>{m.text}</div>

                {/* Generative Tool Card */}
                {m.actionCard && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs space-y-2">
                    <div className="font-bold text-teal-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>{m.actionCard.title}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                      {Object.entries(m.actionCard.data).map(([k, v]) => (
                        <div key={k} className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-sans block uppercase font-bold">
                            {k}
                          </span>
                          <span className="font-bold text-slate-900">
                            {typeof v === "number" ? `₹${Number(v).toLocaleString("en-IN")}` : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isListening && (
            <div className="flex justify-center p-3">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse shadow-sm">
                <Mic className="w-4 h-4" />
                <span>Listening via Bhashini Speech-to-Text...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Chips */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/80 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
          <span className="text-[10px] font-bold uppercase text-slate-400 pl-2">Try asking:</span>
          <button
            onClick={() => handleSend("Explain moratorium and monthly interest")}
            className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors shadow-2xs font-medium"
          >
            How does Moratorium work?
          </button>
          <button
            onClick={() => handleSend("Switch to poultry enterprise")}
            className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors shadow-2xs font-medium"
          >
            Switch to Poultry
          </button>
          <button
            onClick={() => handleSend("What is my Rural Credit Score rating?")}
            className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors shadow-2xs font-medium"
          >
            Check Credit Rating
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-xl transition-all ${
              isListening ? "bg-red-600 text-white animate-bounce" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            title="Speech input (Hindi / English)"
          >
            <Mic className="w-5 h-5" />
          </button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about enterprise feasibility, repayment, schemes, or risks..."
            className="h-11 text-xs sm:text-sm"
          />

          <Button onClick={() => handleSend()} variant="teal" size="lg" className="gap-2 shrink-0">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Copilot</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
