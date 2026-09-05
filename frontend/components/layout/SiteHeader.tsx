"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Compass,
  Coins,
  CreditCard,
  Database,
  Menu,
  X,
  Key,
  Check,
  Building,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const SiteHeader: React.FC = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);

  // Core 5 Navigation Links centered around the SIH26091 MoSJE Problem Statement
  const NAV_ITEMS = [
    { href: "/advisor", label: "Advisor", icon: Sparkles },
    { href: "/dashboard", label: "Feasibility", icon: Compass },
    { href: "/dashboard/finance", label: "Financials", icon: Coins },
    { href: "/credit-score", label: "Credit Score", icon: CreditCard },
    { href: "/chat-data", label: "Chat Data", icon: Database },
  ];

  const handleSaveKey = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("saarthi_openai_key", tempKey.trim());
      setIsKeySaved(true);
      setTimeout(() => {
        setIsKeySaved(false);
        setShowKeyModal(false);
      }, 1000);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2f3336] bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand & Problem Statement Info */}
        <div className="flex items-center gap-3">
          <Link href="/advisor" className="flex items-center gap-2.5 group">
            {/* Minimalist modern X-style logo */}
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-sm group-hover:bg-[#d7dbdc] transition-colors">
              S
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white group-hover:text-[#1d9bf0] transition-colors">
                  SAARTHI
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#16181c] border border-[#2f3336] text-[#71767b]">
                  SIH26091
                </span>
              </div>
              <span className="hidden sm:inline text-[10px] text-[#71767b] font-medium leading-none">
                MoSJE • Rural Enterprise Advisory
              </span>
            </div>
          </Link>
        </div>

        {/* Decluttered Center Navigation (Pill tabs) */}
        <nav className="hidden md:flex items-center gap-1 bg-black">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            // Support matching both root / and /advisor for the advisor tab
            const isActive =
              pathname === item.href ||
              (item.href === "/advisor" && pathname === "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  isActive
                    ? "text-white bg-[#16181c] border border-[#2f3336]"
                    : "text-[#71767b] hover:text-[#e7e9ea] hover:bg-[#16181c]/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#1d9bf0]" : "text-[#71767b]"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#1d9bf0] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Clean Single Pill + API Settings */}
        <div className="flex items-center gap-2">
          {/* Quick Demo Pill */}
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-[#d7dbdc] text-xs font-bold transition-colors"
          >
            <span>Demo: Kanke Dairy</span>
          </Link>

          {/* Key / Settings Button */}
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                setTempKey(localStorage.getItem("saarthi_openai_key") || "");
              }
              setShowKeyModal(true);
            }}
            className="p-1.5 rounded-full border border-[#2f3336] text-[#71767b] hover:text-white hover:bg-[#16181c] transition-colors"
            title="OpenAI API Key Settings"
          >
            <Key className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-1.5 rounded-full text-[#71767b] hover:text-white hover:bg-[#16181c]"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileOpen && (
        <div className="md:hidden border-b border-[#2f3336] bg-black px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/advisor" && pathname === "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive
                    ? "bg-[#16181c] text-white border border-[#2f3336]"
                    : "text-[#71767b] hover:text-[#e7e9ea] hover:bg-[#16181c]/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#1d9bf0]" : "text-[#71767b]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#16181c] border border-[#2f3336] rounded-2xl p-5 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2f3336] pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#1d9bf0]" />
                <h3 className="text-sm font-bold">OpenAI API Configuration</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-[#71767b] hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#71767b]">
              Your key is saved only in browser localStorage for direct client-side requests.
            </p>
            <div className="space-y-2">
              <Input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="sk-proj-..."
                className="bg-black border-[#2f3336] text-white text-xs font-mono rounded-xl focus:border-[#1d9bf0]"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-1.5 rounded-full border border-[#2f3336] text-xs font-semibold text-[#e7e9ea] hover:bg-[#202327]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-[#d7dbdc] flex items-center gap-1.5"
              >
                {isKeySaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                <span>{isKeySaved ? "Saved" : "Save Key"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
