import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeraResto Dashboard — Restaurant Operations Hub",
  description: "Live order monitoring, table QR generation, and digital menu controls.",
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
