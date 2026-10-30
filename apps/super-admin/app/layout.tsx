import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeraResto Platform Control — Super Admin",
  description: "Global tenant management, subscription billing, and platform analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafaf9] text-[#0B192C]">
        {children}
      </body>
    </html>
  );
}
