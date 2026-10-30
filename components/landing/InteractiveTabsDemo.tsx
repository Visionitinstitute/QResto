"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  ChefHat,
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

export function InteractiveTabsDemo() {
  const [activeTab, setActiveTab] = useState<"guest" | "kitchen" | "analytics">(
    "guest"
  );

  return (
    <section id="live-demo" className="py-10 sm:py-16 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-7 sm:mb-9">
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-full">
            Complete Ecosystem
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight mt-2.5 sm:mt-3">
            One platform. Flawless synchronization.
          </h2>
          <p className="mt-2 text-xs sm:text-base text-zinc-600">
            Switch views below to see how guest orders flow instantaneously from table to kitchen to manager reports.
          </p>

          {/* Tab Switcher Buttons */}
          <div className="mt-5 sm:mt-6 inline-flex p-1 rounded-xl bg-zinc-200/80 border border-zinc-300/80 max-w-md w-full justify-between gap-1 shadow-inner">
            <button
              onClick={() => setActiveTab("guest")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "guest"
                  ? "bg-white text-zinc-950 shadow-2xs font-bold"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>Guest View</span>
            </button>
            <button
              onClick={() => setActiveTab("kitchen")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "kitchen"
                  ? "bg-white text-zinc-950 shadow-2xs font-bold"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>Kitchen View</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-white text-zinc-950 shadow-2xs font-bold"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display Container */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-lg overflow-hidden p-4 sm:p-7 max-w-5xl mx-auto">
          {/* TAB 1: Guest Menu View */}
          {activeTab === "guest" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
              <div className="md:col-span-5 space-y-4">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  Mobile First Experience
                </span>
                <h3 className="text-2xl font-bold text-zinc-950">
                  Crisp, appetising visuals that guests love scanning
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Guests scan the QR code and are greeted with a customized, responsive menu with instant search, dietary tags, and clear pricing in local currency.
                </p>
                <div className="space-y-2 pt-2 text-xs font-medium text-zinc-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>0.8 second loading time on any mobile device</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Dietary preference filters (Veg, Non-Veg, Vegan)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Direct table-mapped ordering with cooking notes</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/menu/demo-hotel?table=4"
                    className="inline-flex items-center gap-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    <span>Open Live Demo in Browser</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-7 bg-zinc-50 rounded-2xl p-5 border border-zinc-200">
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm">Table #04 Active Cart</h4>
                      <p className="text-[11px] text-zinc-500">Royal Spice Bistro</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Ready to Send
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        <span className="font-semibold text-zinc-800">1x Tandoori Paneer Tikka</span>
                      </div>
                      <span className="font-bold text-zinc-900">₹280</span>
                    </div>

                    <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        <span className="font-semibold text-zinc-800">1x Dal Makhani Deluxe</span>
                      </div>
                      <span className="font-bold text-zinc-900">₹290</span>
                    </div>

                    <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        <span className="font-semibold text-zinc-800">2x Butter Garlic Naan</span>
                      </div>
                      <span className="font-bold text-zinc-900">₹140</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-zinc-400">Total Bill</span>
                      <p className="text-base font-extrabold text-zinc-950">₹710.00</p>
                    </div>
                    <div className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs">
                      Confirmed by Table 4
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Kitchen Display View */}
          {activeTab === "kitchen" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
              <div className="md:col-span-5 space-y-4">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  Kitchen Display System (KDS)
                </span>
                <h3 className="text-2xl font-bold text-zinc-950">
                  Zero paper waste. Real-time chronological tickets.
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Kitchen tablets or monitors ring the moment an order is confirmed. Chefs see clear quantities, special chef notes, and elapsed prep timers.
                </p>
                <div className="space-y-2 pt-2 text-xs font-medium text-zinc-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Audible alerts for new incoming orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Elapsed time color coding (Green &rarr; Orange &rarr; Red)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1-click ticket status: Pending &rarr; Preparing &rarr; Served</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 bg-zinc-900 rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Live Kitchen Feed (2 Active Tickets)
                    </span>
                  </div>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Connected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Ticket 1 */}
                  <div className="bg-zinc-800/90 rounded-xl p-3 border border-orange-500/40 relative">
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-700">
                      <span className="font-extrabold text-orange-400 text-sm">Table #04</span>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-400" /> 2m ago
                      </span>
                    </div>
                    <ul className="space-y-1 text-zinc-200">
                      <li className="font-bold">• 1x Paneer Tikka (Extra mint chutney)</li>
                      <li className="font-bold">• 1x Dal Makhani</li>
                      <li>• 2x Butter Naan</li>
                    </ul>
                    <div className="mt-3 pt-2 border-t border-zinc-700 flex justify-between items-center">
                      <span className="text-[10px] bg-orange-900/60 text-orange-200 px-2 py-0.5 rounded-md font-bold">
                        Cooking...
                      </span>
                      <button className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-md">
                        Mark Served
                      </button>
                    </div>
                  </div>

                  {/* Ticket 2 */}
                  <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700">
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-700">
                      <span className="font-bold text-white text-sm">Table #07</span>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" /> 7m ago
                      </span>
                    </div>
                    <ul className="space-y-1 text-zinc-300">
                      <li>• 2x Virgin Mint Mojito</li>
                      <li>• 1x Crispy Corn</li>
                    </ul>
                    <div className="mt-3 pt-2 border-t border-zinc-700 flex justify-between items-center">
                      <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-md font-bold">
                        Ready to Serve
                      </span>
                      <button className="text-[10px] bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md">
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Manager Analytics View */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
              <div className="md:col-span-5 space-y-4">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  Manager & Owner Dashboard
                </span>
                <h3 className="text-2xl font-bold text-zinc-950">
                  Data-driven insights that maximize dining room revenue
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Understand your busiest dining hours, bestselling menu items, average check sizes per table, and total orders at a single glance.
                </p>
                <div className="space-y-2 pt-2 text-xs font-medium text-zinc-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Real-time daily gross revenue tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>High-margin menu item identification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Export reports in PDF/Excel for accountants</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 bg-zinc-50 rounded-2xl p-5 border border-zinc-200">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-zinc-400 block uppercase">
                      Today&apos;s Sales
                    </span>
                    <span className="text-lg font-black text-zinc-950 mt-1 block">
                      ₹48,250
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">+18.4% vs last week</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-zinc-400 block uppercase">
                      Total Orders
                    </span>
                    <span className="text-lg font-black text-zinc-950 mt-1 block">
                      142
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium">Avg ₹340 / table</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-zinc-400 block uppercase">
                      Table Turnover
                    </span>
                    <span className="text-lg font-black text-orange-600 mt-1 block">
                      24 min
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">8 min faster</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 p-3.5">
                  <span className="text-xs font-bold text-zinc-900 block mb-2">
                    Top 3 Bestselling Dishes Today
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-700 font-medium">1. Tandoori Paneer Tikka</span>
                      <span className="font-bold text-zinc-950">54 orders (₹15,120)</span>
                    </div>
                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full w-[85%]" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-700 font-medium">2. Dal Makhani Deluxe</span>
                      <span className="font-bold text-zinc-950">42 orders (₹12,180)</span>
                    </div>
                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[65%]" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-700 font-medium">3. Virgin Mint Mojito</span>
                      <span className="font-bold text-zinc-950">38 orders (₹5,700)</span>
                    </div>
                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[50%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
