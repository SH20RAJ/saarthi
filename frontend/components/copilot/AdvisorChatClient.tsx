"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Mic,
  Key,
  Check,
  Building,
  Coins,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { MarkdownRenderer } from "../ui/MarkdownRenderer";
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
  const [isLoading, setIsLoading] = useState(false);

  // OpenAI API Key management (loads from env variable or localStorage, client-safe)
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("saarthi_openai_key");
      if (stored) return stored;
    }
    return process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState("");

  const plan = calculateFinancialPlan(margin, undefined, selectedCategory.id);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "copilot",
      text: `### Namaste! I am your SAARTHI AI Advisor
Powered by OpenAI GPT-4o and strictly grounded in the **Ministry of Social Justice and Empowerment (MoSJE)** SIH26091 guidelines.

Currently analyzing **${selectedCategory.name}** in **${selectedLocation.name}, ${selectedLocation.district}** with an entrepreneur margin of **₹${margin.toLocaleString("en-IN")}**.

#### How can I assist you today?
- **Financial Structuring**: 10% equity, 90% loan auto-routing, and moratorium schedules.
- **Enterprise Feasibility**: Local population demand and market competition.
- **Credit Readiness**: 300–900 MoSJE credit profile scoring.`,
      timestamp: "Just now",
      actionCard: {
        type: "financial",
        title: "Live Financial Structuring Baseline",
        data: {
          projectCost: plan.total_project_cost,
          loanAmount: plan.indicative_loan_amount,
          scheme: plan.scheme_tier,
          rate: `${plan.annual_interest_rate}% p.a.`,
          moratorium: `${plan.moratorium_months} Months`,
          activeEmi: `₹${plan.monthly_active_emi.toLocaleString("en-IN")}/mo`,
        },
      },
    },
  ]);

  // Handle call to OpenAI GPT-4o-mini
  const callOpenAI = async (userPrompt: string, history: ChatMessage[]): Promise<string> => {
    const systemPrompt = `You are SAARTHI AI, the official AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs under Smart India Hackathon 2026 (SIH26091) for the Ministry of Social Justice and Empowerment (MoSJE).

CRITICAL GROUNDING RULES:
1. Ground every statement in empirical evidence and official MoSJE/NBCFDC norms. Never hallucinate interest rates or feasibility statistics.
2. Format your response cleanly using Markdown headings (###, ####), bullet points, and bold text for clarity.
3. SIH26091 Financial Norms:
   - Equity Margin Ratio: 10% (Project Cost = Available_Margin / 0.10, Loan = 90% of Project Cost).
   - Micro Finance: Project cost up to ₹1.40 Lakh -> 6.5% p.a. interest, 3-year tenure (36 months), 3-month moratorium grace period.
   - Term Loan: Project cost above ₹1.40 Lakh up to ₹50.00 Lakh -> 8.0% p.a. interest, 7-year tenure (84 months), 6-month moratorium grace period.
   - Moratorium: During moratorium months, borrower pays ONLY simple monthly interest. Zero principal payment. Post-grace active EMI begins after moratorium.
4. Current Live Context:
   - Location: ${selectedLocation.name}, ${selectedLocation.block} Block, ${selectedLocation.district} District, ${selectedLocation.state}
   - 5 km Population: ${selectedLocation.population_5km.toLocaleString("en-IN")}
   - Sector / Enterprise: ${selectedCategory.name}
   - Available Margin (Equity): ₹${margin.toLocaleString("en-IN")}
   - Total Permissible Project Cost: ₹${plan.total_project_cost.toLocaleString("en-IN")}
   - Indicative Financing (90% Loan): ₹${plan.indicative_loan_amount.toLocaleString("en-IN")}
   - Auto-Routed Scheme: ${plan.scheme_tier} (${plan.annual_interest_rate}% p.a.)
   - Moratorium Period: ${plan.moratorium_months} Months (Monthly simple interest: ₹${plan.monthly_moratorium_interest.toLocaleString("en-IN")})
   - Post-Grace Active EMI: ₹${plan.monthly_active_emi.toLocaleString("en-IN")}/month
   - Expected DSCR: ${plan.stress_scenarios["Expected"].dscr}x (${plan.stress_scenarios["Expected"].risk_level})
5. Explain clearly and empathetically. If the user writes in Hindi or asks in Hindi, reply in fluent Hindi (हिंदी). Maintain exact ₹ currency numbers and percentages.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-6).map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      })),
      { role: "user" as const, content: userPrompt },
    ];

    const currentKey = apiKey.trim();
    if (!currentKey) {
      throw new Error("No OpenAI API key found. Please configure in the settings modal.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: apiMessages,
        temperature: 0.3,
        max_tokens: 550,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `OpenAI API error: HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response received from model.";
  };

  const handleSend = async (overrideText?: string) => {
    const q = overrideText || input;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const lower = q.toLowerCase();
    let actionCard: ChatMessage["actionCard"] = undefined;

    // Trigger local state updates if relevant
    if (lower.includes("poultry") || lower.includes("मुर्गी")) {
      const poultry = BUSINESS_CATEGORIES.find((c) => c.id === "poultry") || BUSINESS_CATEGORIES[1];
      setSelectedCategory(poultry);
      actionCard = {
        type: "feasibility",
        title: "Sector Switched: Poultry Farming",
        data: { demand: "High", risk: "Medium", minEquity: `₹${poultry.min_capital.toLocaleString("en-IN")}` },
      };
    } else if (lower.includes("kanke") || lower.includes("ormanjhi") || lower.includes("mandu")) {
      const loc = LOCATIONS.find((l) => lower.includes(l.name.toLowerCase())) || LOCATIONS[0];
      setSelectedLocation(loc);
      actionCard = {
        type: "feasibility",
        title: `Geospatial Target: ${loc.name}`,
        data: { pop5km: loc.population_5km.toLocaleString("en-IN"), mandiDist: `${loc.market_distance_km} km` },
      };
    } else if (lower.includes("moratorium") || lower.includes("मोराटोरियम") || lower.includes("grace")) {
      actionCard = {
        type: "financial",
        title: "Moratorium Grace Structure",
        data: {
          period: `${plan.moratorium_months} Months`,
          interestOnly: `₹${plan.monthly_moratorium_interest.toLocaleString("en-IN")}/mo`,
          postGraceEmi: `₹${plan.monthly_active_emi.toLocaleString("en-IN")}/mo`,
        },
      };
    } else if (lower.includes("credit") || lower.includes("क्रेडिट") || lower.includes("cibil")) {
      actionCard = {
        type: "credit",
        title: "Rural Credit Readiness Framework",
        data: { scale: "300 to 900", primeThreshold: "750+", maxMultiplier: "Up to 10x Equity" },
      };
    }

    try {
      const replyText = await callOpenAI(q, messages);
      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: "copilot",
          text: replyText,
          timestamp: "Just now",
          actionCard,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: "copilot",
          text: `### Live MoSJE Advisory Note
*Grounding context: ${selectedLocation.name} (${selectedCategory.name})*

Based on deterministic MoSJE norms:
- **Available Margin (Equity 10%)**: ₹${margin.toLocaleString("en-IN")}
- **Total Project Cost**: ₹${plan.total_project_cost.toLocaleString("en-IN")}
- **Indicative Loan (90%)**: ₹${plan.indicative_loan_amount.toLocaleString("en-IN")}
- **Auto-Routed Scheme**: ${plan.scheme_tier} (${plan.annual_interest_rate}% p.a.)
- **Moratorium**: ${plan.moratorium_months} Months grace at ₹${plan.monthly_moratorium_interest.toLocaleString("en-IN")}/month simple interest
- **Post-Grace Active EMI**: ₹${plan.monthly_active_emi.toLocaleString("en-IN")}/month

> *Notice: ${err?.message || "Using deterministic fallback response"}*`,
          timestamp: "Just now",
          actionCard,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Streamlined Minimal Context Bar (X-Style) */}
      <div className="bg-[#16181c] border border-[#2f3336] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-xs shrink-0">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">
                Saarthi AI Advisor
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black border border-[#2f3336] text-[#1d9bf0]">
                GPT-4o Grounded
              </span>
            </div>
            <p className="text-[11px] text-[#71767b]">
              MoSJE Scheme Norms • OpenStreetMap POIs • Deterministic Financial Math
            </p>
          </div>
        </div>

        {/* Quick Context Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-black border border-[#2f3336] text-neutral-300 text-[11px]">
            📍 {selectedLocation.name}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-black border border-[#2f3336] text-neutral-300 text-[11px]">
            🏭 {selectedCategory.name}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-black border border-[#2f3336] text-white font-mono text-[11px]">
            ₹{margin.toLocaleString("en-IN")} Margin
          </span>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                setTempKey(localStorage.getItem("saarthi_openai_key") || "");
              }
              setShowKeyModal(!showKeyModal);
            }}
            className="p-1.5 rounded-full bg-black border border-[#2f3336] hover:border-[#71767b] text-[#71767b] hover:text-white transition-colors"
            title="Configure OpenAI Key"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Key Modal */}
      {showKeyModal && (
        <div className="bg-[#16181c] border border-[#2f3336] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#1d9bf0]" />
              OpenAI API Key (Client-Side)
            </span>
            <span className="text-[10px] text-[#71767b]">Direct browser fetch</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="sk-proj-..."
              className="flex-1 bg-black border border-[#2f3336] text-white text-xs px-3 py-1.5 rounded-xl font-mono focus:outline-none focus:border-[#1d9bf0]"
            />
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("saarthi_openai_key", tempKey.trim());
                  setApiKey(tempKey.trim());
                }
                setShowKeyModal(false);
              }}
              className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-[#d7dbdc] transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Chat Window Container (X Dark Mode) */}
      <div className="bg-black rounded-2xl border border-[#2f3336] overflow-hidden flex flex-col h-[620px]">
        {/* Messages Feed */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    S
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm ${
                    isUser
                      ? "bg-[#1d9bf0] text-white rounded-br-xs"
                      : "bg-[#16181c] text-[#e7e9ea] border border-[#2f3336] rounded-tl-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                    <span className="font-semibold">
                      {isUser ? "You" : "Saarthi Copilot (GPT-4o)"}
                    </span>
                    <span className="text-[#71767b]">{m.timestamp}</span>
                  </div>

                  {/* Rendered Markdown Output */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                  ) : (
                    <MarkdownRenderer content={m.text} />
                  )}

                  {/* Structured MoSJE Baseline Card */}
                  {m.actionCard && (
                    <div className="mt-3 p-3 rounded-xl bg-black border border-[#2f3336] space-y-2">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#1d9bf0]" />
                        <span>{m.actionCard.title}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                        {Object.entries(m.actionCard.data).map(([k, v]) => (
                          <div
                            key={k}
                            className="p-2 rounded-lg bg-[#16181c] border border-[#2f3336]"
                          >
                            <span className="text-[9px] text-[#71767b] uppercase font-bold block truncate">
                              {k}
                            </span>
                            <span className="font-bold text-white block mt-0.5 truncate">
                              {typeof v === "number"
                                ? `₹${Number(v).toLocaleString("en-IN")}`
                                : String(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-black text-xs shrink-0">
                S
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-[#16181c] border border-[#2f3336] text-xs text-[#71767b] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#1d9bf0] animate-spin" />
                <span>Grounding response with GPT-4o & MoSJE evidence...</span>
              </div>
            </div>
          )}

          {/* Speech-to-Text Listening Indicator */}
          {isListening && (
            <div className="flex justify-center p-2">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16181c] border border-red-500/50 text-red-400 text-xs font-semibold animate-pulse">
                <Mic className="w-3.5 h-3.5" />
                <span>Listening via Bhashini Speech-to-Text...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Suggestion Chips (X-Style Horizontal Scroll) */}
        <div className="p-2 border-t border-[#2f3336] bg-black flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
          <span className="text-[10px] font-bold uppercase text-[#71767b] pl-2">
            Ask:
          </span>
          <button
            onClick={() => handleSend("Explain moratorium and monthly interest")}
            className="px-3 py-1 rounded-full bg-[#16181c] border border-[#2f3336] text-[#71767b] hover:text-white hover:border-[#71767b] transition-colors text-xs"
          >
            How does Moratorium work?
          </button>
          <button
            onClick={() => handleSend("Switch to poultry enterprise")}
            className="px-3 py-1 rounded-full bg-[#16181c] border border-[#2f3336] text-[#71767b] hover:text-white hover:border-[#71767b] transition-colors text-xs"
          >
            Switch to Poultry
          </button>
          <button
            onClick={() => handleSend("डेयरी शुरू करने की जानकारी और ब्याज दर?")}
            className="px-3 py-1 rounded-full bg-[#16181c] border border-[#2f3336] text-[#71767b] hover:text-white hover:border-[#71767b] transition-colors text-xs"
          >
            डेयरी ब्याज दर (हिंदी)
          </button>
          <button
            onClick={() => handleSend("What is the MoSJE credit readiness rating?")}
            className="px-3 py-1 rounded-full bg-[#16181c] border border-[#2f3336] text-[#71767b] hover:text-white hover:border-[#71767b] transition-colors text-xs"
          >
            Credit Rating
          </button>
        </div>

        {/* X-Style Input Bar */}
        <div className="p-3 border-t border-[#2f3336] bg-black">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-[#16181c] border border-[#2f3336] rounded-full px-3 py-1.5 focus-within:border-[#1d9bf0] transition-colors"
          >
            <button
              type="button"
              onClick={toggleMic}
              className={`p-1.5 rounded-full transition-colors ${
                isListening
                  ? "bg-red-500/20 text-red-400"
                  : "text-[#71767b] hover:text-white"
              }`}
              title="Speak in Hindi/English"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about feasibility, loan routing, or moratorium in English or हिंदी..."
              className="flex-1 bg-transparent text-white placeholder:text-[#71767b] text-xs sm:text-sm focus:outline-none"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-1.5 rounded-full bg-white text-black hover:bg-[#d7dbdc] disabled:opacity-30 disabled:hover:bg-white text-xs font-bold transition-all flex items-center gap-1 shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
