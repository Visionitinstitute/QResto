"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  LayoutDashboard,
  QrCode,
  BookOpen,
  ChefHat,
  ShoppingBag,
  Settings,
  Users,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  ExternalLink,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@meraresto/ui";
import { formatCurrency } from "@meraresto/utils";

export default function DashboardOverviewPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const kitchenUrl =
    process.env.NEXT_PUBLIC_KITCHEN_URL || "http://localhost:3003";
  const customerMenuUrl =
    process.env.NEXT_PUBLIC_MENU_URL || "http://localhost:3002";

  // Mock initial dashboard state for scaffolding
  const metrics = [
    { label: "Today's Orders", value: "38", change: "+14%", icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "Today's Revenue", value: formatCurrency(14850), change: "+22%", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Tables", value: "8 / 16", change: "50% occ", icon: QrCode, color: "text-[#0E8388] bg-teal-50" },
    { label: "Kitchen Queue", value: "4 orders", change: "avg 12m", icon: ChefHat, color: "text-amber-600 bg-amber-50" },
  ];

  const recentOrders = [
    { id: "ORD-1092", table: "Table 4", items: "Paneer Tikka, Garlic Naan (2), Butter Chicken", total: 840, status: "PREPARING", time: "3m ago" },
    { id: "ORD-1091", table: "Table 1", items: "Veg Biryani, Boondi Raita", total: 390, status: "READY", time: "8m ago" },
    { id: "ORD-1090", table: "Table 7", items: "Cold Coffee (2), Brownie with Ice Cream", total: 420, status: "SERVED", time: "18m ago" },
  ];

  return (
    <div className="flex min-h-screen bg-[#fafaf9]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200/80 bg-white flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B192C] text-white">
              <UtensilsCrossed className="h-5 w-5 text-[#0E8388]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#0B192C] leading-none">
                Mera<span className="text-[#0E8388]">Resto</span>
              </h1>
              <span className="text-[11px] text-zinc-500 font-medium">Owner Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "overview"
                  ? "bg-[#0B192C] text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "orders"
                  ? "bg-[#0B192C] text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Live Orders
            </button>

            <button
              onClick={() => setActiveTab("menu")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "menu"
                  ? "bg-[#0B192C] text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Menu & Catalog
            </button>

            <button
              onClick={() => setActiveTab("tables")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "tables"
                  ? "bg-[#0B192C] text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <QrCode className="h-4 w-4" />
              Tables & QR Codes
            </button>

            <a
              href={kitchenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <span className="flex items-center gap-3">
                <ChefHat className="h-4 w-4 text-[#0E8388]" />
                Kitchen Display (KDS)
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
            </a>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "settings"
                  ? "bg-[#0B192C] text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <Settings className="h-4 w-4" />
              Restaurant Settings
            </button>
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-700">
              MR
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-zinc-900">Balkumari Cafe</p>
              <p className="text-[10px] text-zinc-500">Pro Plan</p>
            </div>
          </div>
          <Link href="/login" className="text-zinc-400 hover:text-zinc-700 p-1">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-200/80 mb-8">
          <div>
            <h2 className="text-xl font-bold text-[#0B192C]">Restaurant Overview</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Real-time status of orders, kitchen queue and tables.</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`${customerMenuUrl}/demo?table=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              <QrCode className="h-3.5 w-3.5 text-[#0E8388]" />
              Open Customer Menu
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </a>
            <Button size="sm" className="bg-[#0B192C] hover:bg-zinc-800">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Food Item
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((m, idx) => (
            <Card key={idx}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500">{m.label}</p>
                  <p className="text-2xl font-bold text-zinc-900 mt-1">{m.value}</p>
                  <span className="text-[11px] text-emerald-600 font-medium">{m.change}</span>
                </div>
                <div className={`p-3 rounded-xl ${m.color}`}>
                  <m.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders Table */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-zinc-900">
              Active Dining Orders
            </CardTitle>
            <Badge variant="outline" className="border-teal-300 text-[#0E8388] bg-teal-50/50">
              Live Realtime Feed
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-zinc-100 bg-zinc-50/50 text-zinc-500 font-medium">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Table</th>
                  <th className="py-3 px-6">Items</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-6 font-semibold text-zinc-900">{ord.id}</td>
                    <td className="py-3 px-6 font-medium text-zinc-800">{ord.table}</td>
                    <td className="py-3 px-6 text-zinc-600 max-w-xs truncate">{ord.items}</td>
                    <td className="py-3 px-6 font-semibold text-zinc-900">{formatCurrency(ord.total)}</td>
                    <td className="py-3 px-6">
                      <Badge
                        variant={
                          ord.status === "READY"
                            ? "success"
                            : ord.status === "PREPARING"
                            ? "warning"
                            : "default"
                        }
                      >
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-6 text-zinc-400">{ord.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

