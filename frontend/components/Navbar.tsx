"use client";

import React from "react";
import { Sparkles, Globe, ShieldCheck, Cloud, PlayCircle } from "lucide-react";

interface NavbarProps {
  lang: "en" | "hi";
  setLang: (l: "en" | "hi") => void;
  onLoadDemo: () => void;
  onOpenVoiceAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  onLoadDemo,
  onOpenVoiceAssistant,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & MoSJE Tag */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center text-white font-bold text-xl shadow-md ring-2 ring-teal-600/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                SAARTHI
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                SIH26091
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
              <span>Evidence Before Enterprise</span>
              <span>•</span>
              <span className="text-teal-700">MoSJE</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Cloudflare Edge Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Cloud className="w-3.5 h-3.5 text-amber-600" />
            <span>CF Workers Ready</span>
          </div>

          {/* 1-Click SIH Judge Demo Button */}
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-300 transition-colors shadow-xs active:scale-95"
            title="Load Kanke, Ranchi ₹1 Lakh Dairy benchmark scenario for judges"
          >
            <PlayCircle className="w-4 h-4 text-teal-700" />
            <span className="hidden sm:inline">
              {lang === "en" ? "Demo: Kanke Dairy" : "डेमो: कांके डेयरी"}
            </span>
          </button>

          {/* AI Voice Assistant Trigger */}
          <button
            onClick={onOpenVoiceAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-700 text-white hover:bg-teal-800 shadow-sm transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{lang === "en" ? "Ask Saarthi" : "सारथी से पूछें"}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold">{lang === "en" ? "हिंदी" : "English"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
