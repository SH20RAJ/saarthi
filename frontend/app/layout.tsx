import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "../components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "SAARTHI AI | Evidence Before Enterprise (SIH26091)",
  description:
    "AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs. Ministry of Social Justice & Empowerment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-[#e7e9ea] antialiased flex flex-col font-sans selection:bg-[#1d9bf0]/25 selection:text-white">
        <SiteHeader />
        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 max-w-7xl w-full mx-auto">{children}</main>
        <footer className="border-t border-[#2f3336] bg-black py-5 text-center text-xs text-[#71767b]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight">SAARTHI</span>
              <span>•</span>
              <span>SIH26091 MoSJE Rural Micro-Enterprise Intelligence</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#71767b]">
              <span>Deterministic Financial Math</span>
              <span>•</span>
              <span>OpenStreetMap POIs</span>
              <span>•</span>
              <span>OpenAI GPT-4o</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
