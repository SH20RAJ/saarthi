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
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans">
        <SiteHeader />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              <strong>SAARTHI AI</strong> — Ministry of Social Justice and Empowerment (MoSJE) • Smart India Hackathon 2026 (SIH26091)
            </p>
            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>ODbL OpenStreetMap</span>
              <span>•</span>
              <span>NBCFDC / NSFDC Norms</span>
              <span>•</span>
              <span>Cloudflare Workers Edge</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
