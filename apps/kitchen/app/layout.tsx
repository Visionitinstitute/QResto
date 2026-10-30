import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeraResto KDS — Kitchen Display System",
  description: "Live kitchen order management and prep workflow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-[#0E8388]/30">
        {children}
      </body>
    </html>
  );
}
