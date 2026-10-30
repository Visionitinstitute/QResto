import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeraResto — Your Restaurant, Your Digital World",
  description:
    "All-in-one digital operating system for modern restaurants. QR menu, contact-less ordering, kitchen display system, and real-time billing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafaf9] text-[#0B192C] selection:bg-[#0E8388]/20 selection:text-[#0E8388]">
        {children}
      </body>
    </html>
  );
}
