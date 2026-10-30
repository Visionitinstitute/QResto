"use client";

import React, { useState } from "react";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
  RefreshCw,
  Flame,
  Check,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@meraresto/ui";

interface KitchenOrder {
  id: string;
  table: string;
  minutesAgo: number;
  status: "NEW" | "PREPARING" | "READY";
  notes?: string;
  items: { name: string; quantity: number; special?: string }[];
}

const INITIAL_ORDERS: KitchenOrder[] = [
  {
    id: "ORD-1093",
    table: "Table 4",
    minutesAgo: 2,
    status: "NEW",
    notes: "Serve without onions",
    items: [
      { name: "Paneer Butter Masala", quantity: 1, special: "Medium spicy" },
      { name: "Butter Garlic Naan", quantity: 3 },
    ],
  },
  {
    id: "ORD-1092",
    table: "Table 1",
    minutesAgo: 11,
    status: "PREPARING",
    items: [
      { name: "Murgh Tikka Masala", quantity: 1 },
      { name: "Tandoori Roti", quantity: 4 },
      { name: "Crispy Corn & Salt Pepper", quantity: 1 },
    ],
  },
  {
    id: "ORD-1091",
    table: "Table 6",
    minutesAgo: 17,
    status: "READY",
    items: [
      { name: "Veg Dum Biryani", quantity: 2 },
      { name: "Boondi Raita", quantity: 1 },
    ],
  },
];

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "NEW" | "PREPARING" | "READY">("ALL");

  const updateStatus = (orderId: string, nextStatus: "PREPARING" | "READY" | "SERVED") => {
    if (nextStatus === "SERVED") {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "ALL") return true;
    return o.status === filter;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* KDS Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0E8388] text-white">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white uppercase">
              MeraResto Kitchen Display (KDS)
            </h1>
            <span className="text-xs text-zinc-400">Balkumari Cafe — Main Kitchen</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-800/80 p-1 rounded-xl">
          {(["ALL", "NEW", "PREPARING", "READY"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === tab
                  ? "bg-[#0E8388] text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab} (
              {tab === "ALL"
                ? orders.length
                : orders.filter((o) => o.status === tab).length}
              )
            </button>
          ))}
        </div>

        {/* Sound toggle & refresh */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-4 w-4 text-emerald-400" /> Sound Alert ON
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-zinc-500" /> Muted
              </>
            )}
          </button>
        </div>
      </header>

      {/* Orders Grid */}
      <main className="flex-1 p-6 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-zinc-500">
            <CheckCircle2 className="h-12 w-12 text-[#0E8388] mb-3 opacity-60" />
            <p className="text-base font-semibold text-zinc-300">All Kitchen Orders Cleared</p>
            <p className="text-xs text-zinc-500 mt-1">Waiting for new guest table orders...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredOrders.map((ord) => {
              const isUrgent = ord.minutesAgo >= 15;
              return (
                <div
                  key={ord.id}
                  className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg transition-all ${
                    ord.status === "NEW"
                      ? "border-emerald-500/60 bg-zinc-900"
                      : ord.status === "PREPARING"
                      ? "border-amber-500/60 bg-zinc-900"
                      : "border-teal-500/60 bg-zinc-900"
                  }`}
                >
                  {/* Card Header */}
                  <div
                    className={`p-4 border-b flex items-center justify-between ${
                      ord.status === "NEW"
                        ? "bg-emerald-950/40 border-emerald-900/50"
                        : ord.status === "PREPARING"
                        ? "bg-amber-950/40 border-amber-900/50"
                        : "bg-teal-950/40 border-teal-900/50"
                    }`}
                  >
                    <div>
                      <span className="text-base font-extrabold text-white">
                        {ord.table}
                      </span>
                      <span className="text-xs text-zinc-400 block font-mono">
                        #{ord.id}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          isUrgent ? "text-rose-400 font-bold" : "text-zinc-300"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {ord.minutesAgo}m ago
                      </span>
                      <div className="mt-0.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                            ord.status === "NEW"
                              ? "bg-emerald-500 text-black"
                              : ord.status === "PREPARING"
                              ? "bg-amber-400 text-black"
                              : "bg-teal-400 text-black"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-4 flex-1 space-y-3">
                    {ord.notes && (
                      <div className="rounded-lg bg-rose-950/30 border border-rose-800/40 p-2 text-xs text-rose-300 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                        <span>Note: {ord.notes}</span>
                      </div>
                    )}

                    <div className="divide-y divide-zinc-800">
                      {ord.items.map((item, i) => (
                        <div key={i} className="py-2 flex items-start justify-between text-xs">
                          <div>
                            <span className="font-semibold text-zinc-100">
                              {item.name}
                            </span>
                            {item.special && (
                              <p className="text-[11px] text-amber-400 italic">
                                * {item.special}
                              </p>
                            )}
                          </div>
                          <span className="ml-2 font-mono font-bold text-sm bg-zinc-800 text-white px-2 py-0.5 rounded-md">
                            ×{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="p-3 bg-zinc-900/90 border-t border-zinc-800">
                    {ord.status === "NEW" && (
                      <button
                        onClick={() => updateStatus(ord.id, "PREPARING")}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 py-2.5 text-xs font-bold transition-colors"
                      >
                        <Flame className="h-4 w-4" />
                        Start Preparation
                      </button>
                    )}

                    {ord.status === "PREPARING" && (
                      <button
                        onClick={() => updateStatus(ord.id, "READY")}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 py-2.5 text-xs font-bold transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        Mark as Ready
                      </button>
                    )}

                    {ord.status === "READY" && (
                      <button
                        onClick={() => updateStatus(ord.id, "SERVED")}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Complete / Served
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
