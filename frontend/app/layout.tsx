import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sovereign Docs — Private AI Document Assistant",
  description:
    "Ask questions about your PDFs. Apertus 8B answers locally on your machine. Your documents never leave your device.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
