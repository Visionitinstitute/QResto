import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "MeraResto Digital Menu & Order",
  description: "Contactless digital QR menu and direct table ordering.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafaf9] text-[#0B192C] antialiased">
        <div className="mx-auto max-w-md min-h-screen bg-white shadow-xl relative pb-28">
          {children}
        </div>
      </body>
    </html>
  );
}

