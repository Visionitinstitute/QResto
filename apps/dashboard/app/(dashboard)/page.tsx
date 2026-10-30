"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  QrCode,
  ChefHat,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@meraresto/ui";
import { formatCurrency } from "@meraresto/utils";

export default function DashboardOverview() {
  const metrics = [
    { label: "Today's Orders", value: "42", change: "+16% vs yesterday", icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "Today's Revenue", value: formatCurrency(16450), change: "+24% vs yesterday", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
    { label: "Table Occupancy", value: "9 / 16", change: "56% seated", icon: QrCode, color: "text-[#0E8388] bg-teal-50" },
    { label: "Kitchen Queue", value: "3 orders", change: "Avg prep: 11 mins", icon: ChefHat, color: "text-amber-600 bg-amber-50" },
  ];

  const liveOrders = [
    { id: "ORD-1094", table: "Table 5", items: "Paneer Butter Masala, Butter Garlic Naan (3)", total: 515, status: "PREPARING", time: "2m ago" },
    { id: "ORD-1093", table: "Table 2", items: "Murgh Tikka Masala, Tandoori Roti (4)", total: 460, status: "READY", time: "7m ago" },
    { id: "ORD-1092", table: "Table 1", items: "Veg Dum Biryani (2), Boondi Raita", total: 490, status: "PREPARING", time: "12m ago" },
    { id: "ORD-1091", table: "Table 4", items: "Crispy Corn & Salt Pepper, Cold Coffee (2)", total: 360, status: "SERVED", time: "22m ago" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <h2 className="text-xl font-bold text-[#0B192C]">Live Restaurant Overview</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitor real-time guest orders, occupancy, and kitchen tickets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/tables">
            <Button size="sm" variant="outline" className="border-zinc-300">
              <QrCode className="h-3.5 w-3.5 mr-1 text-[#0E8388]" />
              Manage Tables
            </Button>
          </Link>
          <Link href="/menu">
            <Button size="sm" className="bg-[#0B192C] hover:bg-zinc-800 text-white">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Menu Item
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, idx) => (
          <Card key={idx}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500">{m.label}</p>
                <p className="text-2xl font-bold text-zinc-900 mt-1">{m.value}</p>
                <span className="text-[11px] text-emerald-600 font-medium">
                  {m.change}
                </span>
              </div>
              <div className={`p-3 rounded-xl ${m.color}`}>
                <m.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-zinc-900">
              Active Dining Orders
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live updates via Supabase Realtime
            </p>
          </div>
          <Link href="/orders">
            <Button size="sm" variant="outline" className="text-xs">
              View All Orders
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
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
                {liveOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-zinc-900">{ord.id}</td>
                    <td className="py-3.5 px-6 font-medium text-zinc-800">{ord.table}</td>
                    <td className="py-3.5 px-6 text-zinc-600 max-w-xs truncate">{ord.items}</td>
                    <td className="py-3.5 px-6 font-semibold text-zinc-900">{formatCurrency(ord.total)}</td>
                    <td className="py-3.5 px-6">
                      <Badge
                        variant={
                          ord.status === "READY"
                            ? "success"
                            : ord.status === "PREPARING"
                            ? "warning"
                            : "neutral"
                        }
                      >
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-zinc-400">{ord.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
