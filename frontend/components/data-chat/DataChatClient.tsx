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
import { MarkdownRenderer } from "../ui/MarkdownRenderer";
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

  // OpenAI Key from env or localStorage
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
      text: `### Namaste! I am your Data Copilot
Ask me anything about the enterprise dataset on the left:
- Compare interest rates and scheme routing (**Micro Finance 6.5%** vs **Term Loan 8%**).
- Inspect moratorium grace periods and active monthly EMIs.
- Evaluate localized viability scores and DSCR coverage.`,
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

RULES:
1. Ground your answers strictly in the numbers above. Format your response cleanly using Markdown headings, bullet points, and bold text.
2. If asked about a specific row, state its category, margin, loan, and moratorium period accurately.
3. Keep answers concise, clear, and professional.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-4).map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      })),
      { role: "user" as const, content: question },
    ];

    if (!apiKey.trim()) {
      throw new Error("No OpenAI key available");
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: apiMessages,
        temperature: 0.2,
        max_tokens: 350,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.choices[0]?.message?.content || "No data reply.";
  };

  const handleSendMessage = async (textOverride?: string) => {
    const query = textOverride || chatInput;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsLoading(true);

    try {
      const reply = await callDataAssistant(query);
      const lower = query.toLowerCase();
      let targetRowId: string | undefined = undefined;
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
          text: `### Dataset Inspection
Based on the active records:
- **${activeRow.categoryName}** (${activeRow.locationName}) requires minimum equity of **₹${activeRow.minCapital.toLocaleString("en-IN")}**.
- **Total Project Cost**: ₹${activeRow.projectCost.toLocaleString("en-IN")}
- **Indicative Loan (90%)**: ₹${activeRow.loanAmount.toLocaleString("en-IN")} routed to **${activeRow.schemeTier}** (${activeRow.interestRate}% interest).
- **Grace Period**: ${activeRow.moratoriumMonths} Months.`,
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header Bar - Minimal & Clean (X-Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#16181c] border border-[#2f3336] rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-xs shrink-0">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">
                Enterprise Dataset Copilot
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black border border-[#2f3336] text-[#1d9bf0]">
                Live Canvas
              </span>
            </div>
            <p className="text-[11px] text-[#71767b]">
              Real-time conversational queries over rural micro-enterprise records.
            </p>
          </div>
        </div>

        {/* Quick Stat Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-black border border-[#2f3336] text-neutral-300 font-mono text-[11px]">
            <strong className="text-white">{filteredData.length}</strong> Records
          </span>
          <span className="px-3 py-1 rounded-full bg-black border border-[#2f3336] text-neutral-300 font-mono text-[11px]">
            Avg Score: <strong className="text-[#1d9bf0]">74</strong>/100
          </span>
          <span className="px-3 py-1 rounded-full bg-black border border-[#2f3336] text-neutral-300 font-mono text-[11px]">
            Moratorium: <strong className="text-white">3-6 Mo</strong>
          </span>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Pane: Minimal Data Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Controls Bar: Search & Scheme Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-[#16181c] p-2.5 rounded-2xl border border-[#2f3336]">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#71767b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter sector or village..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-black border border-[#2f3336] rounded-full text-white placeholder:text-[#71767b] focus:outline-none focus:border-[#1d9bf0]"
              />
            </div>

            <div className="flex items-center gap-1 self-start sm:self-auto">
              <button
                onClick={() => setSelectedSchemeFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedSchemeFilter === "all"
                    ? "bg-white text-black font-bold"
                    : "bg-black text-[#71767b] border border-[#2f3336] hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedSchemeFilter("Micro Finance")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedSchemeFilter === "Micro Finance"
                    ? "bg-white text-black font-bold"
                    : "bg-black text-[#71767b] border border-[#2f3336] hover:text-white"
                }`}
              >
                Micro Finance (≤₹1.4L)
              </button>
              <button
                onClick={() => setSelectedSchemeFilter("Term Loan")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedSchemeFilter === "Term Loan"
                    ? "bg-white text-black font-bold"
                    : "bg-black text-[#71767b] border border-[#2f3336] hover:text-white"
                }`}
              >
                Term Loan (&gt;₹1.4L)
              </button>
            </div>
          </div>

          {/* Minimal Data Table (X-Style) */}
          <div className="bg-black rounded-2xl border border-[#2f3336] overflow-hidden">
            <div className="overflow-x-auto max-h-[440px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#16181c] text-[#71767b] uppercase text-[10px] font-bold sticky top-0 border-b border-[#2f3336]">
                  <tr>
                    <th className="p-3">Sector & Location</th>
                    <th className="p-3">Min Equity</th>
                    <th className="p-3">Total Cost</th>
                    <th className="p-3">Scheme Tier</th>
                    <th className="p-3">Active EMI</th>
                    <th className="p-3 text-center">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2f3336] font-mono text-[11px]">
                  {filteredData.map((row) => {
                    const isSelected = row.id === activeRowId;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setActiveRowId(row.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#16181c] text-white"
                            : "hover:bg-[#16181c]/50 text-neutral-300"
                        }`}
                      >
                        <td className="p-3 font-sans">
                          <div className="font-bold text-white text-xs">{row.categoryName}</div>
                          <div className="text-[10px] text-[#71767b] font-normal">
                            {row.locationName}, {row.district}
                          </div>
                        </td>
                        <td className="p-3 text-neutral-300">₹{row.minCapital.toLocaleString("en-IN")}</td>
                        <td className="p-3 text-white font-bold">₹{row.projectCost.toLocaleString("en-IN")}</td>
                        <td className="p-3 font-sans">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black border border-[#2f3336] text-[#1d9bf0]">
                            {row.schemeTier} ({row.interestRate}%)
                          </span>
                        </td>
                        <td className="p-3 text-white font-bold">₹{row.monthlyEmi.toLocaleString("en-IN")}/mo</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              row.viabilityScore >= 75
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
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
            <div className="p-3.5 rounded-2xl bg-[#16181c] border border-[#2f3336] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1d9bf0] block">
                  Active Inspected Row
                </span>
                <span className="text-xs sm:text-sm font-bold">
                  {activeRow.categoryName} ({activeRow.locationName})
                </span>
                <p className="text-[11px] text-[#71767b] mt-0.5">
                  Indicative Loan: <strong className="text-white">₹{activeRow.loanAmount.toLocaleString("en-IN")}</strong> • Grace: <strong className="text-white">{activeRow.moratoriumMonths} Months</strong>
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="px-2.5 py-0.5 rounded-full bg-black border border-[#2f3336] text-white">
                  DSCR: {activeRow.dscr}x
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black border border-[#2f3336] text-amber-400">
                  {activeRow.demandSignal} Demand
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Pane: Minimal Copilot Chat Sidebar (5 Cols) */}
        <div className="lg:col-span-5 bg-black rounded-2xl border border-[#2f3336] flex flex-col h-[570px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-[#2f3336] bg-[#16181c] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">
                S
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Data Copilot</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-[#71767b]">Grounded in active table context</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#71767b] bg-black px-2 py-0.5 rounded-full border border-[#2f3336]">
              gpt-4o-mini
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-2xl text-xs ${
                      isUser
                        ? "bg-[#1d9bf0] text-white rounded-br-xs"
                        : "bg-[#16181c] text-[#e7e9ea] border border-[#2f3336] rounded-tl-xs"
                    }`}
                  >
                    <div className="text-[10px] opacity-60 mb-1 flex items-center justify-between">
                      <span className="font-semibold">{isUser ? "You" : "Data Copilot"}</span>
                      <span className="text-[9px] text-[#71767b]">{m.timestamp}</span>
                    </div>
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{m.text}</div>
                    ) : (
                      <MarkdownRenderer content={m.text} />
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="p-2.5 rounded-2xl bg-[#16181c] border border-[#2f3336] text-xs text-[#71767b] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#1d9bf0] animate-spin" />
                  <span className="text-[11px]">Querying table dataset...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Data Queries (Pills) */}
          <div className="p-2 border-t border-[#2f3336] bg-black flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
            <button
              onClick={() => handleSendMessage("Which enterprise has the highest viability score?")}
              className="px-2.5 py-1 rounded-full bg-[#16181c] border border-[#2f3336] text-[#71767b] hover:text-white hover:border-[#71767b] transition-colors"
            >
              Highest score?
            </button>
            <button
              onClick={() => handleSendMessage("What is the EMI for Dairy in Kanke?")}
              className="px-2.5 py-1 rounded-full bg-[#16181c] border border-[#2f3336] text-[#71767b] hover:text-white hover:border-[#71767b] transition-colors"
            >
              Dairy Kanke EMI?
            </button>
            <button
              onClick={() => handleSendMessage("Compare Micro Finance vs Term Loan options")}
              className="px-2.5 py-1 rounded-full bg-[#16181c] border border-[#2f3336] text-[#71767b] hover:text-white hover:border-[#71767b] transition-colors"
            >
              Compare schemes
            </button>
          </div>

          {/* Input Box */}
          <div className="p-2.5 border-t border-[#2f3336] bg-black">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-[#16181c] border border-[#2f3336] rounded-full px-3 py-1.5 focus-within:border-[#1d9bf0] transition-colors"
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about records, EMIs, or schemes..."
                className="flex-1 bg-transparent text-white placeholder:text-[#71767b] text-xs focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !chatInput.trim()}
                className="px-3 py-1 rounded-full bg-white text-black hover:bg-[#d7dbdc] disabled:opacity-30 disabled:hover:bg-white text-xs font-bold transition-all flex items-center gap-1 shrink-0"
              >
                <span>Ask</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
