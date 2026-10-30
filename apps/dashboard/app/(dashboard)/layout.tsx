"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed,
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  QrCode,
  ChefHat,
  Settings,
  ExternalLink,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const kitchenUrl =
    process.env.NEXT_PUBLIC_KITCHEN_URL || "http://localhost:3003";
  const customerMenuUrl =
    process.env.NEXT_PUBLIC_MENU_URL || "http://localhost:3002";

  const navItems = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "Live Orders", href: "/orders", icon: ShoppingBag },
    { label: "Menu & Catalog", href: "/menu", icon: BookOpen },
    { label: "Tables & QR", href: "/tables", icon: QrCode },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#fafaf9]">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-200/80 bg-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B192C] text-white shadow-2xs">
                <UtensilsCrossed className="h-5 w-5 text-[#0E8388]" />
              </div>
              <div>
                <h1 className="text-base font-bold text-[#0B192C] leading-none">
                  Mera<span className="text-[#0E8388]">Resto</span>
                </h1>
                <span className="text-[10px] text-zinc-400 font-medium">Dashboard</span>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#0B192C] text-white shadow-2xs"
                      : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-3 pb-1">
              <span className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                External Displays
              </span>
            </div>

            <a
              href={kitchenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 transition-colors"
            >
              <span className="flex items-center gap-3">
                <ChefHat className="h-4 w-4 text-[#0E8388]" />
                Kitchen Display (KDS)
              </span>
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </a>

            <a
              href={`${customerMenuUrl}/demo?table=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 transition-colors"
            >
              <span className="flex items-center gap-3">
                <QrCode className="h-4 w-4 text-[#0E8388]" />
                Customer Menu Demo
              </span>
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </a>
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-[#0E8388]/10 text-[#0E8388] font-bold text-xs flex items-center justify-center shrink-0">
              BR
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-xs font-semibold text-zinc-900 truncate">
                Balkumari Cafe
              </p>
              <p className="text-[10px] text-zinc-400">Pro Plan</p>
            </div>
          </div>
          <Link
            href="/login"
            className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <span className="text-xs font-bold text-zinc-800">
                Balkumari Restaurant & Cafe
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Online & Serving
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`${customerMenuUrl}/demo?table=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <QrCode className="h-3.5 w-3.5 text-[#0E8388]" />
              Scan Menu
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

