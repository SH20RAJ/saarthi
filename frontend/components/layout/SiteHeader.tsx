"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Coins,
  ShieldCheck,
  Globe,
  Bot,
  PlayCircle,
  FileCheck2,
  GitCompare,
  Building,
  Menu,
  X,
  CreditCard,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export const SiteHeader: React.FC = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const NAV_LINKS = [
    { href: "/dashboard", label: "Feasibility", icon: Compass },
    { href: "/dashboard/finance", label: "Financials", icon: Coins },
    { href: "/dashboard/map", label: "Geo-Map", icon: Building },
    { href: "/credit-score", label: "Credit Score", icon: CreditCard, highlight: true },
    { href: "/schemes", label: "Schemes", icon: FileCheck2 },
    { href: "/compare", label: "Compare", icon: GitCompare },
    { href: "/advisor", label: "AI Advisor", icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & MoSJE Tag */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center text-white font-extrabold text-xl shadow-md ring-2 ring-teal-600/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  SAARTHI
                </span>
                <Badge variant="teal" className="text-[9px]">
                  SIH26091
                </Badge>
              </div>
              <p className="text-[10px] font-medium text-slate-500">
                Evidence Before Enterprise • MoSJE
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : link.highlight
                    ? "text-teal-800 bg-teal-50/80 hover:bg-teal-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : link.highlight ? "text-teal-700" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Area */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hidden sm:inline-flex">
            <Button variant="teal" size="sm" className="gap-1.5">
              <PlayCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch Demo</span>
            </Button>
          </Link>

          <Link href="/credit-score" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm" className="gap-1.5 text-teal-800 border-teal-200 bg-teal-50/50 hover:bg-teal-100">
              <CreditCard className="w-3.5 h-3.5 text-teal-700" />
              <span>Check Score</span>
            </Button>
          </Link>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
