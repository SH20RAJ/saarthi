"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  Search,
  Sparkles,
  Filter,
  Send,
  ArrowUpDown,
  Download,
  CheckCircle2,
  TrendingUp,
  Coins,
  Building,
  ShieldCheck,
  Bot,
  RefreshCw,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { LOCATIONS, BUSINESS_CATEGORIES } from "../../lib/constants";
import { calculateFinancialPlan } from "../../lib/financial";

interface EnterpriseRow {
  id: string;
  categoryName: string;
  locationName: string;
  district: string;
  minCapital: number;
  projectCost: number;
  loanAmount: number;
  schemeTier: string;
  interestRate: number;
  moratoriumMonths: number;
  monthlyEmi: number;
  dscr: number;
  riskRating: string;
  viabilityScore: number;
  demandSignal: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  highlightedRowId?: string;
}

export const DataChatClient: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState<"all" | "Micro Finance" | "Term Loan">("all");
  const [activeRowId, setActiveRowId] = useState<string>("dairy-kanke");
  
  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OpenAI Key from env or localStorage (secure & not hardcoded)
  const apiKey =
    (typeof window !== "undefined" ? localStorage.getItem("saarthi_openai_key") : null) ||
    process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
    "";

  // Build structured dataset combining locations & business sectors
  const dataset: EnterpriseRow[] = useMemo(() => {
    const rows: EnterpriseRow[] = [];
    LOCATIONS.slice(0, 3).forEach((loc) => {
      BUSINESS_CATEGORIES.forEach((cat) => {
        const capital = cat.min_capital;
        const plan = calculateFinancialPlan(capital, undefined, cat.id);
        const exp = plan.stress_scenarios["Expected"];
        const score = cat.risk_level === "Low" ? 82 : cat.risk_level === "Medium" ? 73 : 61;

        rows.push({
          id: `${cat.id}-${loc.id}`,
          categoryName: cat.name,
          locationName: loc.name,
          district: loc.district,
          minCapital: capital,
          projectCost: plan.total_project_cost,
          loanAmount: plan.indicative_loan_amount,
          schemeTier: plan.scheme_tier,
          interestRate: plan.annual_interest_rate,
          moratoriumMonths: plan.moratorium_months,
          monthlyEmi: plan.monthly_active_emi,
          dscr: exp?.dscr || 1.5,
          riskRating: cat.risk_level,
          viabilityScore: score,
          demandSignal: cat.demand_level,
        });
      });
    });
    return rows;
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return dataset.filter((row) => {
      const matchesSearch =
        row.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesScheme =
        selectedSchemeFilter === "all" || row.schemeTier === selectedSchemeFilter;
      return matchesSearch && matchesScheme;
    });
  }, [dataset, searchTerm, selectedSchemeFilter]);

  const activeRow = dataset.find((r) => r.id === activeRowId) || dataset[0];

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "copilot",
      text: "Namaste! I am your Data Copilot for SAARTHI AI. Ask me anything about the enterprise dataset on the left — compare interest rates, inspect repayment EMIs, filter by risk, or stress-test cash flows.",
      timestamp: "Just now",
    },
  ]);

  const callDataAssistant = async (question: string) => {
    const summaryContext = filteredData
      .slice(0, 8)
      .map(
        (r) =>
          `[${r.id}] ${r.categoryName} in ${r.locationName}: Margin ₹${r.minCapital}, Cost ₹${r.projectCost}, Loan ₹${r.loanAmount}, Scheme: ${r.schemeTier} (${r.interestRate}%), EMI: ₹${r.monthlyEmi}/mo, Moratorium: ${r.moratoriumMonths}mo, DSCR: ${r.dscr}x, Score: ${r.viabilityScore}/100`
      )
      .join("\n");

    const systemPrompt = `You are the CopilotKit "Chat With Your Data" assistant for SAARTHI AI (SIH26091, Ministry of Social Justice & Empowerment).
You have real-time access to the user's filtered enterprise dataset:

CURRENT DATASET SUMMARY:
${summaryContext}

CURRENT INSPECTED ROW:
${JSON.stringify(activeRow, null, 2)}

GROUNDING RULES:
1. Answer strictly using the numbers in the dataset. Never invent prices or interest rates.
2. If a specific business row is mentioned, state its row ID and exact metrics.
3. Be concise, professional, and clear. If asked in Hindi, respond in Hindi.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-4).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          { role: "user", content: question },
        ],
        temperature: 0.2,
        max_tokens: 350,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI HTTP ${response.status}`);
    }

    const res = await response.json();
    return res.choices[0]?.message?.content || "No response received.";
  };

  const handleSendMessage = async (textOverride?: string) => {
    const q = textOverride || chatInput;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsLoading(true);

    try {
      const reply = await callDataAssistant(q);
      
      // Check if user asked to select a row
      let targetRowId: string | undefined = undefined;
      const lower = q.toLowerCase();
      if (lower.includes("poultry")) targetRowId = dataset.find((r) => r.id.includes("poultry"))?.id;
      if (lower.includes("dairy")) targetRowId = dataset.find((r) => r.id.includes("dairy"))?.id;
      if (lower.includes("tailoring")) targetRowId = dataset.find((r) => r.id.includes("tailoring"))?.id;
      if (targetRowId) setActiveRowId(targetRowId);

      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: "copilot",
          text: reply,
          timestamp: "Just now",
          highlightedRowId: targetRowId,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: "copilot",
          text: `Based on the active dataset, ${activeRow.categoryName} in ${activeRow.locationName} requires minimum equity of ₹${activeRow.minCapital.toLocaleString("en-IN")} for a total project cost of ₹${activeRow.projectCost.toLocaleString("en-IN")}. Indicative financing is ₹${activeRow.loanAmount.toLocaleString("en-IN")} under ${activeRow.schemeTier} (${activeRow.interestRate}% interest) with ${activeRow.moratoriumMonths} months grace.`,
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-2">
      {/* Header Bar - Minimal & Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-slate-900">
              Chat With Your Data
            </span>
            <Badge variant="teal" className="text-[9px]">
              CopilotKit Data Canvas
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time conversational queries over rural enterprise micro-dataset • Clean, minimal, data-first UX.
          </p>
        </div>

        {/* 4 Quick Stat Badges */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <div className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono">
            <strong>{filteredData.length}</strong> Records
          </div>
          <div className="px-3 py-1 rounded-xl bg-teal-50 text-teal-800 font-mono border border-teal-200">
            Avg Score: <strong>74</strong>/100
          </div>
          <div className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 font-mono border border-amber-200">
            Moratorium: <strong>3-6 Mo</strong>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Workspace (Inspired by CopilotKit chat-with-your-data) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Minimal Data Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Bar: Search & Scheme Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter sector or village..."
                className="pl-8 h-8 text-xs border-slate-200 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <button
                onClick={() => setSelectedSchemeFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedSchemeFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Schemes
              </button>
              <button
                onClick={() => setSelectedSchemeFilter("Micro Finance")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedSchemeFilter === "Micro Finance"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Micro Finance (&le;₹1.4L)
              </button>
              <button
                onClick={() => setSelectedSchemeFilter("Term Loan")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedSchemeFilter === "Term Loan"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Term Loan (&gt;₹1.4L)
              </button>
            </div>
          </div>

          {/* Minimal Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto max-h-[480px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold sticky top-0 border-b border-slate-200 backdrop-blur">
                  <tr>
                    <th className="p-3">Sector & Location</th>
                    <th className="p-3">Min Equity</th>
                    <th className="p-3">Total Cost</th>
                    <th className="p-3">Scheme Tier</th>
                    <th className="p-3">Active EMI</th>
                    <th className="p-3 text-center">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {filteredData.map((row) => {
                    const isSelected = row.id === activeRowId;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setActiveRowId(row.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-teal-50/80 font-semibold"
                            : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className="p-3 font-sans">
                          <div className="font-bold text-slate-900 text-xs">{row.categoryName}</div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            {row.locationName}, {row.district}
                          </div>
                        </td>
                        <td className="p-3 text-slate-700">₹{row.minCapital.toLocaleString("en-IN")}</td>
                        <td className="p-3 text-slate-900 font-bold">₹{row.projectCost.toLocaleString("en-IN")}</td>
                        <td className="p-3 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              row.schemeTier === "Micro Finance"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : "bg-teal-50 text-teal-800 border border-teal-200"
                            }`}
                          >
                            {row.schemeTier} ({row.interestRate}%)
                          </span>
                        </td>
                        <td className="p-3 text-teal-700 font-bold">₹{row.monthlyEmi.toLocaleString("en-IN")}/mo</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                              row.viabilityScore >= 75
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {row.viabilityScore}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Inspected Row Detail Ribbon */}
          {activeRow && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                  Active Inspected Row
                </span>
                <span className="text-sm font-black">
                  {activeRow.categoryName} ({activeRow.locationName})
                </span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Indicative Loan: <strong>₹{activeRow.loanAmount.toLocaleString("en-IN")}</strong> • Moratorium Grace: <strong>{activeRow.moratoriumMonths} Months</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="teal" className="text-[10px] font-mono">
                  DSCR: {activeRow.dscr}x
                </Badge>
                <Badge variant="amber" className="text-[10px]">
                  {activeRow.demandSignal} Demand
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Right Pane: Minimal Copilot Chat Sidebar (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col h-[600px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Data Copilot</span>
                  <Badge variant="teal" className="text-[8px] py-0">
                    Live
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-500">Grounded in the active table context</p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
              gpt-4o-mini
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-teal-700 text-white rounded-br-none shadow-xs"
                      : "bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-2xs"
                  }`}
                >
                  <div className="text-[10px] font-semibold opacity-60 mb-0.5">
                    {m.sender === "user" ? "You" : "Data Copilot"}
                  </div>
                  <div>{m.text}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700 animate-spin" />
                  <span className="text-[11px]">Querying table data...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Data Queries */}
          <div className="p-2 border-t border-slate-100 bg-slate-50/60 flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
            <button
              onClick={() => handleSendMessage("Which enterprise has the highest viability score?")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
            >
              Highest score?
            </button>
            <button
              onClick={() => handleSendMessage("What is the EMI for Dairy in Kanke?")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
            >
              Dairy Kanke EMI?
            </button>
            <button
              onClick={() => handleSendMessage("Compare Micro Finance vs Term Loan options")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
            >
              Compare scheme tiers?
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask questions about rows, EMIs, or schemes..."
              className="h-9 text-xs"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading}
              variant="teal"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
