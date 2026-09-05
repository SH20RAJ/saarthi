import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
