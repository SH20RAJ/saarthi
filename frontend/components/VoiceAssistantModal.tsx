"use client";

import React, { useState } from "react";
import { X, Mic, Send, Bot, Sparkles, Volume2, ShieldCheck } from "lucide-react";
import { BusinessCategory, LocationContext, FinancialPlan } from "../lib/types";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: BusinessCategory;
  location: LocationContext;
  plan: FinancialPlan;
  margin: number;
  lang: "en" | "hi";
}

interface ChatMessage {
  sender: "user" | "saarthi";
  text: string;
  timestamp: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  category,
  location,
  plan,
  margin,
  lang,
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "saarthi",
      text:
        lang === "en"
          ? `Namaste! I am your Saarthi Advisor for ${location.name}. Based on your capital of ₹${margin.toLocaleString(
              "en-IN"
            )}, your project cost is structured at ₹${plan.total_project_cost.toLocaleString(
              "en-IN"
            )} under the ${plan.scheme_tier} scheme (${plan.annual_interest_rate}% p.a.). How can I assist you with your feasibility analysis?`
          : `नमस्ते! मैं आपका सारथी सलाहकार हूँ। ${location.name} में आपके ₹${margin.toLocaleString(
              "en-IN"
            )} के निवेश पर ₹${plan.total_project_cost.toLocaleString(
              "en-IN"
            )} की परियोजना ${plan.scheme_tier} योजना (${plan.annual_interest_rate}% ब्याज) के तहत स्वीकृत की जा सकती है। आप क्या जानना चाहते हैं?`,
      timestamp: "Just now",
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: q,
      timestamp: "Just now",
    };

    let reply = "";
    const lower = q.toLowerCase();

    if (lower.includes("moratorium") || lower.includes("मोराटोरियम") || lower.includes("छूट")) {
      reply =
        lang === "en"
          ? `Under SIH26091 norms for ${plan.scheme_tier}, you get a ${plan.moratorium_months}-month moratorium grace period. During these ${plan.moratorium_months} months, you only pay simple interest of ₹${plan.monthly_moratorium_interest.toLocaleString("en-IN")}/month. Zero principal repayment is required until month ${plan.moratorium_months + 1}.`
          : `${plan.scheme_tier} योजना के अंतर्गत आपको ${plan.moratorium_months} माह का मोराटोरियम (अनुग्रह अवधि) मिलेगा। इन ${plan.moratorium_months} महीनों में आपको केवल ₹${plan.monthly_moratorium_interest.toLocaleString("en-IN")}/माह का साधारण ब्याज देना होगा, मूलधन की किस्त माह ${plan.moratorium_months + 1} से शुरू होगी।`;
    } else if (lower.includes("dscr") || lower.includes("risk") || lower.includes("जोखिम")) {
      const exp = plan.stress_scenarios["Expected"];
      reply =
        lang === "en"
          ? `Your business is evaluated as "${exp?.risk_level || "Healthy"}" with a Debt Service Coverage Ratio of ${exp?.dscr || 1.6}x. Under expected operations, your net monthly surplus after paying EMI is ₹${exp?.monthly_surplus.toLocaleString("en-IN")}.`
          : `आपके व्यवसाय का जोखिम स्तर "${exp?.risk_level || "सुरक्षित"}" आंका गया है (DSCR: ${exp?.dscr || 1.6}x)। ईएमआई चुकाने के बाद आपका मासिक शुद्ध लाभ लगभग ₹${exp?.monthly_surplus.toLocaleString("en-IN")} रहेगा।`;
    } else {
      reply =
        lang === "en"
          ? `According to the empirical evidence for ${location.name}, there are 3 competing raw milk units within 5 km, but zero packaged processing units. The 10% equity ratio requirement is met. Your active EMI will be ₹${plan.monthly_active_emi.toLocaleString("en-IN")}/month.`
          : `${location.name} के स्थानिक डेटा के अनुसार, 5 किमी में 3 कच्चा दूध आपूर्तिकर्ता हैं लेकिन पैकेज्ड उत्पादक शून्य हैं। आपकी 10% पूंजी पर्याप्त है और सक्रिय ईएमआई ₹${plan.monthly_active_emi.toLocaleString("en-IN")}/माह होगी।`;
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        sender: "saarthi",
        text: reply,
        timestamp: "Just now",
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
        handleSend(
          lang === "en"
            ? "What is my monthly moratorium interest payment?"
            : "मोराटोरियम में मुझे कितना ब्याज देना होगा?"
        );
      }, 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <span>Saarthi Advisor</span>
                <span className="text-[10px] bg-teal-800 text-teal-200 px-2 py-0.5 rounded-full font-normal">
                  Bhashini Enabled
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Grounded in MoSJE Guidelines & Local Evidence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-teal-700 text-white rounded-br-none"
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isListening && (
            <div className="flex justify-center p-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs animate-pulse font-medium">
                <Mic className="w-3.5 h-3.5" />
                <span>Listening (Bhashini Speech-to-Text)...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="p-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
          <button
            onClick={() => handleSend(lang === "en" ? "How does moratorium work?" : "मोराटोरियम कैसे काम करता है?")}
            className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800"
          >
            {lang === "en" ? "Moratorium details?" : "मोराटोरियम की जानकारी?"}
          </button>
          <button
            onClick={() => handleSend(lang === "en" ? "Is my business low risk?" : "क्या मेरा व्यवसाय सुरक्षित है?")}
            className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800"
          >
            {lang === "en" ? "Risk & DSCR?" : "जोखिम एवं सुरक्षा?"}
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <button
            onClick={toggleMic}
            className={`p-2 rounded-xl transition-all ${
              isListening
                ? "bg-red-600 text-white animate-bounce"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            title="Speak in Hindi or English"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={lang === "en" ? "Ask about schemes, EMI, or risks..." : "योजना, ईएमआई या जोखिम के बारे में पूछें..."}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />

          <button
            onClick={() => handleSend()}
            className="p-2 rounded-xl bg-teal-700 text-white hover:bg-teal-800 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
